import { searchLiveIssues } from './github.js';
import { normalizeIssue } from '../core/intelligence.js';
import { preliminaryPriority, sourceTarget, basicRejections, finishEnrichment, STEPS } from '../core/enrichment.js';
import { opireListingUrl, parseOpireListing, parseOpireCatalogue } from '../providers/opire.js';

export { createBudget } from './request-budget.js';
import { createBudget } from './request-budget.js';
const gh = path => `https://api.github.com${path}`;
function record(step, ok, responses = [], reason = null) {
  return { step, status: ok ? 'COMPLETE' : 'INCOMPLETE', checkedAt: new Date().toISOString(), retryable: responses.some(x => x.retryable), failureReason: reason ?? responses.filter(x => !x.ok).map(x => x.reason).join(', '), evidenceUrls: responses.map(x => x.url) };
}
export async function resolveSource(discovery, budget) {
  let issue = discovery, target = sourceTarget(issue); const evidence = [], visited = new Set();
  for (let hop = 0; hop < 3; hop++) {
    if (visited.has(target)) break; visited.add(target);
    const path = target.match(/^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/issues\/(\d+)$/);
    if (!path) break;
    if (target !== discovery.url) {
      const visibility = await budget.request(gh(`/repos/${path[1]}`)); evidence.push(visibility);
      if (!visibility.ok || visibility.data.private !== false) return { issue, ok: false, responses: evidence, discoveryUrl: discovery.url, canonicalIssueUrl: target, sourceResolutionConfidence: 0, unavailable: visibility.status === 404, failureReason: 'Original public repository could not be established' };
    }
    const r = await budget.request(gh(`/repos/${path[1]}/issues/${path[2]}`)); evidence.push(r);
    if (!r.ok) return { issue, ok: false, responses: evidence, discoveryUrl: discovery.url, canonicalIssueUrl: target, canonicalRepositoryUrl: `https://github.com/${path[1]}`, unavailable: r.status === 404 };
    issue = normalizeIssue(r.data); const next = sourceTarget(issue);
    if (next === issue.url) return { issue, ok: true, responses: evidence, discoveryUrl: discovery.url, canonicalIssueUrl: issue.url, canonicalRepositoryUrl: issue.repositoryUrl, sourceResolutionConfidence: 100, sourceResolutionEvidence: evidence.map(x => ({ url: x.url, detail: 'Original GitHub API issue retrieved' })) };
    target = next;
  }
  return { issue, ok: false, responses: evidence, discoveryUrl: discovery.url, canonicalIssueUrl: target, sourceResolutionConfidence: 0, failureReason: 'Source cycle or hop limit' };
}
async function pages(budget, path, expected = 0, limit = 1) {
  const items = [], responses = []; let complete = false;
  for (let page = 1; page <= limit; page++) {
    const r = await budget.request(gh(`${path}?per_page=100&page=${page}`)); responses.push(r);
    if (!r.ok || !Array.isArray(r.data)) break;
    items.push(...r.data);
    if (r.data.length < 100) { complete = items.length >= expected; break; }
  }
  return { items, responses, complete };
}
async function repositoryEvidence(issue, budget) {
  const base = `/repos/${issue.repository}`;
  const repo = await budget.request(gh(base));
  if (!repo.ok) return { ok: false, responses: [repo], context: {} };
  const tree = await budget.request(gh(`${base}/git/trees/${encodeURIComponent(repo.data.default_branch)}?recursive=1`));
  const responses = [repo, tree];
  if (!tree.ok || !Array.isArray(tree.data.tree) || tree.data.truncated) return { ok: false, responses, context: { repo: repo.data }, reason: 'Repository tree unavailable or truncated' };
  const paths = tree.data.tree.filter(x => x.type === 'blob').map(x => x.path);
  const wanted = [...new Set([
    paths.find(x => /^readme(?:\.md|\.rst|\.txt)?$/i.test(x)),
    paths.find(x => /^(?:\.github\/)?contributing(?:\.md|\.rst)?$/i.test(x)),
    ...['package.json', 'pyproject.toml', 'requirements.txt', 'Cargo.toml', 'go.mod', 'Makefile', 'CMakeLists.txt'].filter(x => paths.includes(x)),
    ...paths.filter(x => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(x)).slice(0, 2)
  ].filter(Boolean))];
  const details = { sourceFiles: [], workflows: paths.filter(x => /^\.github\/workflows\/[^/]+\.ya?ml$/.test(x)).map(name => ({ name })) };
  async function read(path) {
    // Public raw files avoid spending REST quota on every README/workflow.
    // Branch/path originate in this repository's verified metadata/tree.
    const publicRaw = repo.data.private === false;
    const rawUrl = `https://raw.githubusercontent.com/${issue.repository}/${encodeURIComponent(repo.data.default_branch)}/${path.split('/').map(encodeURIComponent).join('/')}`;
    const r = await budget.request(publicRaw ? rawUrl : gh(`${base}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(repo.data.default_branch)}`), publicRaw ? 'text' : 'json'); responses.push(r);
    if (!r.ok || !publicRaw && r.data.encoding !== 'base64') return null;
    const text = publicRaw ? r.data : Buffer.from(r.data.content, 'base64').toString('utf8');
    if (text.length > 100000) return null;
    const entry = { path, url: publicRaw ? `https://github.com/${issue.repository}/blob/${encodeURIComponent(repo.data.default_branch)}/${path}` : r.data.html_url, retrievalUrl: r.url, text }; details.sourceFiles.push(entry); return entry;
  }
  const files = await Promise.all(wanted.map(read));
  for (const f of files.filter(Boolean)) {
    if (/^readme/i.test(f.path)) { details.readme = f.text; details.readmeUrl = f.url; }
    if (/contributing/i.test(f.path)) { details.contributing = f.text; details.contributingUrl = f.url; }
    if (f.path === 'package.json') { try { details.packageJson = JSON.parse(f.text); } catch { return { ok: false, responses, context: { repo: repo.data }, reason: 'Invalid package manifest' }; } }
  }
  const testPath = details.packageJson?.scripts?.test?.match(/^node\s+((?:test|tests)\/[\w./-]+\.m?js)$/)?.[1];
  if (testPath && paths.includes(testPath)) { const f = await read(testPath); if (f) { details.testSource = f.text; details.testSourceUrl = f.url; } }
  const rootEntries = [...new Set(tree.data.tree.map(x => x.path.split('/')[0]))].map(name => ({ name }));
  const ok = files.every(Boolean) && (!testPath || Boolean(details.testSource));
  return { ok, responses, context: { repo: repo.data, rootEntries, repoDetails: details }, reason: ok ? null : 'Required repository file could not be inspected' };
}
export async function enrichCandidate(discovery, budget, repoCache = new Map(), providerHint = null) {
  const steps = [record('BASIC_SCREENED', true)]; const source = await resolveSource(discovery, budget);
  steps.push(record('SOURCE_RESOLVED', source.ok, source.responses, source.failureReason));
  const issue = source.issue, context = { retrievalTimestamp: new Date().toISOString() };
  let provider = null;
  if (source.ok) {
    const base = `/repos/${issue.repository}`;
    const comments = issue.comments === 0 ? { items: [], responses: [], complete: true } : await pages(budget, `${base}/issues/${issue.number}/comments`, issue.comments);
    context.comments = comments.items;
    const urls = [providerHint, ...(String(issue.body) + '\n' + comments.items.map(x => x.body).join('\n')).match(/https:\/\/app\.opire\.dev\/issues\/[A-Za-z0-9]+/g) ?? []].filter(Boolean);
    const url = urls.map(opireListingUrl).find(Boolean);
    if (url) {
      const r = await budget.request(url, 'text');
      provider = parseOpireListing(r.ok ? r.data : '', url, issue.url, new Date().toISOString());
      steps.push(record('PAYMENT_CHECKED', r.ok && provider.listingVerified, [r], provider.listingVerified ? null : 'Provider listing linkage not verified'));
    } else steps.push(record('PAYMENT_CHECKED', comments.complete, comments.responses, comments.complete ? null : 'Potential provider links may be in missing comments'));
    const search = await budget.request(gh(`/search/issues?q=${encodeURIComponent(`repo:${issue.repository} is:pr "#${issue.number}"`)}&per_page=100`));
    // Only modest threads/search sets can still earn a confident WATCH/HUNT
    // inside this scan. Defer expensive timelines for already crowded threads.
    const worthwhileTimeline = issue.comments <= 100 && (!search.ok || search.data.total_count <= 10);
    const timeline = worthwhileTimeline ? await pages(budget, `${base}/issues/${issue.number}/timeline`, 0, 1) : { items: [], responses: [], complete: false };
    const references = [...(search.data?.items ?? []), ...timeline.items.filter(x => x.source?.issue?.pull_request).map(x => ({ ...x.source.issue, linkedFromIssue: true }))];
    for (const c of comments.items) for (const m of String(c.body).matchAll(/https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/pull\/(\d+)/g)) if (m[1] === issue.repository) references.push({ html_url: m[0], linkedFromIssue: true });
    const unique = [...new Map(references.map(x => [x.html_url, x])).values()];
    const prs = await Promise.all(unique.slice(0, 10).map(async x => {
      const m = x.html_url?.match(/^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/pull\/(\d+)$/);
      if (!m) return { ok: false, reason: 'Invalid PR reference' };
      const r = await budget.request(gh(`/repos/${m[1]}/pulls/${m[2]}`));
      return { ...r, data: r.ok ? { ...r.data, linkedFromIssue: x.linkedFromIssue } : null };
    }));
    context.solutionPRs = prs.filter(x => x.ok).map(x => x.data);
    const competitionComplete = comments.complete && timeline.complete && search.ok && !search.data.incomplete_results && search.data.total_count <= search.data.items.length && unique.length <= 10 && prs.every(x => x.ok) && (!url || provider?.listingVerified);
    context.solutionSearchCompleteness = competitionComplete ? 'BOUNDED_COMPLETE' : 'PARTIAL';
    steps.push(record('COMPETITION_CHECKED', competitionComplete, [...comments.responses, ...timeline.responses, search, ...prs], competitionComplete ? null : 'Comments, PR search, timeline, provider or PR details incomplete'));
    if (!repoCache.has(issue.repository)) repoCache.set(issue.repository, repositoryEvidence(issue, budget));
    const repository = await repoCache.get(issue.repository); Object.assign(context, repository.context);
    steps.push(record('REPO_CHECKED', repository.ok, repository.responses, repository.reason));
    steps.push(record('SCOPE_CHECKED', true, source.responses));
    steps.push(record('DEPENDENCY_CHECKED', repository.ok, repository.responses, repository.ok ? null : 'Repository dependencies not completely inspected'));
  }
  for (const step of STEPS) if (!steps.some(x => x.step === step)) steps.push({ step, status: 'DEFERRED', failureReason: 'Original source not resolved', retryable: true });
  const { issue: ignored, responses, ...provenance } = source;
  const result = finishEnrichment(issue, context, steps, provenance, provider);
  result.discoverySources = discovery.discoverySources ?? ['GitHub'];
  result.providerDiscovery = discovery.providerDiscovery ?? null;
  if (discovery.providerDiscovery && source.canonicalIssueUrl !== discovery.providerDiscovery.canonicalIssueUrl) result.providerLinkageLimitation = 'Provider listing refers to discovery mirror, not resolved original';
  result.auditInput = { issue, context, source: provenance, provider, steps };
  return result;
}
export function selectDiverse(issues, limit = 5) {
  const ranked = [...issues].sort((a,b) => investigationPriority(b) - investigationPriority(a) || a.url.localeCompare(b.url));
  const selected = [], counts = new Map(), canonicals = new Set();
  // Prefer one per repository first, then allow a second. Never exceed two.
  for (const cap of [1, 2]) for (const issue of ranked) {
    if (selected.length >= limit) return selected;
    const canonical = sourceTarget(issue).toLowerCase(), repository = canonical.split('/').slice(3,5).join('/');
    if (canonicals.has(canonical) || (counts.get(repository) ?? 0) >= cap) continue;
    selected.push(issue); canonicals.add(canonical); counts.set(repository, (counts.get(repository) ?? 0) + 1);
  }
  return selected;
}
export function investigationPriority(issue) {
  const p = issue.providerDiscovery;
  return preliminaryPriority(issue) + (p ? (p.botInstalled ? 8 : 0) + (p.advertisedRewardUsd >= 50 && p.advertisedRewardUsd <= 300 ? 8 : 0) + (p.programmingLanguages.some(x => /TypeScript|JavaScript|Python/i.test(x)) ? 8 : 0) - (p.advertisedRewardUsd > 1000 ? 20 : 0) - (p.tryingSolvers > 5 ? 8 : 0) : 0)
    + (/\b(?:bug|fix|test|testing|ci\/cd|SDK|API|regression)\b/i.test(issue.title) ? 8 : 0)
    - (/confused|\(help\)|captcha|hcapcha|donation|entire|architecture|Ethernet peripheral|HPC clusters|RCS Support|web platform exports/i.test(issue.title) ? 20 : 0)
    - (issue.sourceRepository?.fork ? 25 : 0);
}
export async function discoverOpire(budget) {
  const response = await budget.request('https://app.opire.dev', 'text');
  const listings = response.ok ? parseOpireCatalogue(response.data) : [];
  return { listings, status: listings.length ? 'FETCHED' : response.ok ? 'FORMAT_UNRECOGNIZED' : response.reason, url: response.url, completeness: 'PARTIAL', detail: 'Bounded current public catalogue page; not all platform listings' };
}
export function mergeDiscovery(githubIssues, listings) {
  const byUrl = new Map(githubIssues.map(x => [x.url.toLowerCase(), { ...x, discoverySources: ['GitHub'] }]));
  for (const p of listings) {
    const key = p.canonicalIssueUrl.toLowerCase(), existing = byUrl.get(key);
    const issue = existing ?? normalizeIssue({ id: p.canonicalIssueUrl, number: p.canonicalIssueUrl.split('/').at(-1), html_url: p.canonicalIssueUrl, repository: p.repository, title: p.title, body: '', state: 'unknown' });
    byUrl.set(key, { ...issue, providerSeed: !existing, providerDiscovery: p, discoverySources: existing ? ['GitHub','Opire'] : ['Opire'] });
  }
  return [...byUrl.values()];
}
export async function buildStagedScan({ discovery, budget = createBudget(), deepLimit = 5, providerDiscovery } = {}) {
  const fetchedAt = new Date().toISOString(), liveDiscovery = !discovery;
  providerDiscovery ??= liveDiscovery ? await discoverOpire(budget) : { listings: [], status: 'NOT_REQUESTED' };
  discovery ??= await searchLiveIssues(budget);
  let issues = mergeDiscovery(discovery.issues, providerDiscovery.listings);
  // Medium source checks use at most ten provider candidates from distinct repos.
  // This establishes real state/assignees/comment cost before the five-slot audit.
  const medium = selectDiverse(issues.filter(x => x.providerSeed), 10);
  for (const seed of medium) {
    const r = await budget.request(gh('/repos/' + seed.repository + '/issues/' + seed.number));
    if (r.ok) {
      const original = normalizeIssue(r.data);
      const repo = await budget.request(gh('/repos/' + seed.repository));
      issues = issues.map(x => x.url === seed.url ? { ...original, sourceRepository: repo.ok ? { fork: repo.data.fork, parent: repo.data.parent?.html_url ?? null } : null, providerSeed: false, providerDiscovery: seed.providerDiscovery, discoverySources: seed.discoverySources } : x);
    }
  }
  const ranked = [...issues].sort((a,b) => investigationPriority(b) - investigationPriority(a) || a.url.localeCompare(b.url));
  const selected = selectDiverse(ranked.filter(x => x.providerSeed || !basicRejections(x).length), deepLimit);
  const selectedUrls = new Set(selected.map(x => x.url)), repoCache = new Map(), results = [];
  // API requests are serialized by the shared transport; file reads can overlap.
  let cursor = 0;
  await Promise.all([0,1].map(async () => { while (cursor < selected.length) {
    const issue = selected[cursor++];
    results.push(await enrichCandidate(issue, budget, repoCache, issue.providerDiscovery?.listingUrl));
  } }));
  for (const issue of ranked.filter(x => !selectedUrls.has(x.url))) {
    const result = finishEnrichment(issue, {}, [{ step: 'BASIC_SCREENED', status: issue.providerSeed ? 'DEFERRED' : 'COMPLETE', checkedAt: fetchedAt }, ...STEPS.slice(1).map(step => ({ step, status: 'DEFERRED', retryable: true, failureReason: 'Outside this scan enrichment budget' }))], { discoveryUrl: issue.url, canonicalIssueUrl: sourceTarget(issue), sourceResolutionConfidence: 0 });
    // Provider catalogue state is unknown until the original issue is fetched.
    if (issue.providerSeed) { result.decision = 'INCOMPLETE'; result.enrichmentState = 'INCOMPLETE'; result.rejectionReasons = []; result.reason = 'Provider-discovered original awaiting verification'; }
    result.discoverySources = issue.discoverySources; result.providerDiscovery = issue.providerDiscovery ?? null;
    results.push(result);
  }
  const canonical = new Map();
  for (const result of results) {
    const key = result.canonicalIssueUrl.toLowerCase(), previous = canonical.get(key);
    if (!previous || result.enrichment.completed > previous.enrichment.completed) canonical.set(key, result);
  }
  const candidates = [...canonical.values()].sort((a,b) => Number(selectedUrls.has(b.url)) - Number(selectedUrls.has(a.url)) || b.preliminaryPriority - a.preliminaryPriority);
  const counts = candidates.reduce((acc,x) => { acc[x.decision]++; return acc; }, { HUNT:0, WATCH:0, SKIP:0, REJECT:0, INCOMPLETE:0 });
  const funnel = { raw: discovery.rawCount + providerDiscovery.listings.length, githubRaw: discovery.rawCount, providerDiscovered: providerDiscovery.listings.length, unique: issues.length, basicScreened: issues.filter(x => !x.providerSeed).length, canonicalResolved: candidates.filter(x => x.enrichment.steps.some(s => s.step === 'SOURCE_RESOLVED' && s.status === 'COMPLETE')).length, providerVerified: candidates.filter(x => x.paymentTrust.listingVerified).length, fullyEnriched: candidates.filter(x => x.enrichment.complete).length, selectedRepositories: new Set(selected.map(x => x.repository.toLowerCase())).size };
  return { mode:'LIVE', phase:'2.2', source:'GitHub Search API + Opire public catalogue', fetchedAt, rawCount:funnel.raw, uniqueCount:funnel.unique, apparentBountyCount:candidates.length, legitimacyPassedCount:candidates.filter(x => ['STRONG','VERIFIED'].includes(x.paymentConfidence)).length, deepCheckedCount:funnel.fullyEnriched, funnel, counts, candidates, auditSelection:selected.map(x => x.url), requests:budget.requests, searchCoverage:discovery.searchCoverage, providerDiscovery };
}
