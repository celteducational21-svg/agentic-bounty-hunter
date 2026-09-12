import { searchLiveIssues } from './github.js';
import { normalizeIssue } from '../core/intelligence.js';
import { preliminaryPriority, sourceTarget, basicRejections, finishEnrichment, STEPS } from '../core/enrichment.js';
import { opireListingUrl, parseOpireListing } from '../providers/opire.js';

export function createBudget({ fetchImpl = fetch, maxRequests = 120, deadlineMs = 45000, timeoutMs = 8000 } = {}) {
  const started = Date.now(), cache = new Map(), requests = [];
  async function request(url, type = 'json') {
    if (cache.has(url)) return cache.get(url);
    const job = (async () => {
      const remaining = deadlineMs - (Date.now() - started);
      if (requests.length >= maxRequests || remaining <= 0) return { ok: false, retryable: true, reason: 'ENRICHMENT_BUDGET_EXHAUSTED', url };
      const record = { url, attemptedAt: new Date().toISOString() }; requests.push(record);
      const headers = { Accept: type === 'json' ? 'application/vnd.github+json' : 'text/html', 'User-Agent': 'ABH/2.2' };
      if (url.startsWith('https://api.github.com/') && process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
      try {
        const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(Math.max(1, Math.min(timeoutMs, remaining))), redirect: 'error' });
        record.status = response.status;
        if (!response.ok) return { ok: false, status: response.status, reason: `HTTP_${response.status}`, retryable: response.status !== 404, url };
        const data = type === 'json' ? await response.json() : await response.text();
        return { ok: true, data, url };
      } catch (error) { record.error = error.name; return { ok: false, reason: error.name, retryable: true, url }; }
    })();
    cache.set(url, job); return job;
  }
  return { request, requests, cache, started };
}
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
async function pages(budget, path, expected = 0, limit = 3) {
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
    const r = await budget.request(gh(`${base}/contents/${path.split('/').map(encodeURIComponent).join('/')}?ref=${encodeURIComponent(repo.data.default_branch)}`)); responses.push(r);
    if (!r.ok || r.data.encoding !== 'base64') return null;
    const text = Buffer.from(r.data.content, 'base64').toString('utf8');
    if (text.length > 100000) return null;
    const entry = { path, url: r.data.html_url, text }; details.sourceFiles.push(entry); return entry;
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
    const comments = await pages(budget, `${base}/issues/${issue.number}/comments`, issue.comments);
    context.comments = comments.items;
    const urls = [providerHint, ...(String(issue.body) + '\n' + comments.items.map(x => x.body).join('\n')).match(/https:\/\/app\.opire\.dev\/issues\/[A-Za-z0-9]+/g) ?? []].filter(Boolean);
    const url = urls.map(opireListingUrl).find(Boolean);
    if (url) {
      const r = await budget.request(url, 'text');
      provider = parseOpireListing(r.ok ? r.data : '', url, issue.url, new Date().toISOString());
      steps.push(record('PAYMENT_CHECKED', r.ok && provider.listingVerified, [r], provider.listingVerified ? null : 'Provider listing linkage not verified'));
    } else steps.push(record('PAYMENT_CHECKED', comments.complete, comments.responses, comments.complete ? null : 'Potential provider links may be in missing comments'));
    const [timeline, search] = await Promise.all([
      pages(budget, `${base}/issues/${issue.number}/timeline`, 0, 2),
      budget.request(gh(`/search/issues?q=${encodeURIComponent(`repo:${issue.repository} is:pr "#${issue.number}"`)}&per_page=100`))
    ]);
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
  }
  for (const step of STEPS) if (!steps.some(x => x.step === step)) steps.push({ step, status: 'DEFERRED', failureReason: 'Original source not resolved', retryable: true });
  const { issue: ignored, responses, ...provenance } = source;
  const result = finishEnrichment(issue, context, steps, provenance, provider);
  result.auditInput = { issue, context, source: provenance, provider, steps };
  return result;
}
export async function buildStagedScan({ discovery, budget = createBudget(), deepLimit = 5 } = {}) {
  const fetchedAt = new Date().toISOString(); discovery ??= await searchLiveIssues();
  const ranked = [...discovery.issues].sort((a, b) => preliminaryPriority(b) - preliminaryPriority(a));
  const selected = ranked.filter(x => !basicRejections(x).length).slice(0, deepLimit);
  const selectedUrls = new Set(selected.map(x => x.url)); const repoCache = new Map();
  const results = [];
  // Two workers bound peak request pressure while reusing repository promises.
  let cursor = 0;
  await Promise.all([0, 1].map(async () => { while (cursor < selected.length) { const issue = selected[cursor++]; results.push(await enrichCandidate(issue, budget, repoCache)); } }));
  for (const issue of ranked.filter(x => !selectedUrls.has(x.url))) results.push(finishEnrichment(issue, {}, [{ step: 'BASIC_SCREENED', status: 'COMPLETE', checkedAt: fetchedAt }, ...STEPS.slice(1).map(step => ({ step, status: 'DEFERRED', retryable: true, failureReason: 'Outside this scan enrichment budget' }))], { discoveryUrl: issue.url, canonicalIssueUrl: sourceTarget(issue), sourceResolutionConfidence: 0 }));
  const canonical = new Map();
  for (const result of results) { const key = result.canonicalIssueUrl; const previous = canonical.get(key); if (!previous || result.enrichment.completed > previous.enrichment.completed) canonical.set(key, result); }
  const candidates = [...canonical.values()].sort((a, b) => b.preliminaryPriority - a.preliminaryPriority);
  const counts = candidates.reduce((acc, x) => { acc[x.decision]++; return acc; }, { HUNT: 0, WATCH: 0, SKIP: 0, REJECT: 0, INCOMPLETE: 0 });
  const funnel = { raw: discovery.rawCount, unique: discovery.issues.length, basicScreened: ranked.length, canonicalResolved: candidates.filter(x => x.enrichment.steps.some(s => s.step === 'SOURCE_RESOLVED' && s.status === 'COMPLETE')).length, providerVerified: candidates.filter(x => x.paymentTrust.listingVerified).length, fullyEnriched: candidates.filter(x => x.enrichment.complete).length };
  return { mode: 'LIVE', phase: '2.2', source: 'GitHub Search API', fetchedAt, rawCount: discovery.rawCount, uniqueCount: discovery.issues.length, apparentBountyCount: candidates.length, legitimacyPassedCount: candidates.filter(x => ['STRONG', 'VERIFIED'].includes(x.paymentConfidence)).length, deepCheckedCount: funnel.fullyEnriched, funnel, counts, candidates, auditSelection: selected.map(x => x.url), requests: budget.requests, searchCoverage: discovery.searchCoverage };
}
