import { analyzeOpportunity, deduplicate, isApparentBounty, normalizeIssue } from "../core/intelligence.js";
import { assessCoverage } from "../core/coverage.js";
import { providerLinks } from '../core/payment.js';
import { classifyPR } from '../core/quality.js';

export const SEARCH_QUERIES = [
  "is:issue is:public is:open label:bounty archived:false",
  "is:issue is:public is:open bounty in:title archived:false",
  "is:issue is:public is:open opire in:body archived:false"
];

function headers() {
  const value = { Accept: "application/vnd.github+json", "User-Agent": "agentic-bounty-hunter/0.2" };
  if (process.env.GITHUB_TOKEN) value.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return value;
}

export async function githubFetch(path, params = {}, { optional = false } = {}) {
  const url = new URL(path, "https://api.github.com");
  for (const [key, value] of Object.entries(params)) if (value !== undefined) url.searchParams.set(key, String(value));
  let response;
  try { response = await fetch(url, { headers: headers(), signal: AbortSignal.timeout(20_000) }); }
  catch (error) { if (optional) return null; throw error; }
  if (!response.ok) {
    if (optional && [403, 404, 422].includes(response.status)) return null;
    throw new Error(`GitHub request failed (${response.status}) for ${url.pathname}`);
  }
  return response.json();
}

export async function searchLiveIssues() {
  const settled = await Promise.allSettled(SEARCH_QUERIES.map((q) => githubFetch("/search/issues", { q, sort: "updated", order: "desc", per_page: 20 })));
  const batches = settled.filter((x) => x.status === "fulfilled").map((x) => x.value);
  if (!batches.length) throw settled[0].reason;
  return {
    searchCoverage: settled.map((result, index) => ({ query: SEARCH_QUERIES[index], status: result.status === "fulfilled" ? "FETCHED" : "FAILED", incompleteResults: result.status === "fulfilled" ? Boolean(result.value.incomplete_results) : null })),
    rawCount: batches.reduce((sum, batch) => sum + batch.items.length, 0),
    issues: deduplicate(batches.flatMap((batch) => batch.items).map(normalizeIssue))
  };
}

function providerUrl(issue) {
  return providerLinks(issue.body)[0]?.url ?? null;
}

async function enrichOne(issue, repoCache, retrievalTimestamp, frozenInputs) {
  const original = await githubFetch(`/repos/${issue.repository}/issues/${issue.number}`, {}, { optional: true });
  if (!original) return analyzeOpportunity(issue, { analysisDepth: "partial", retrievalTimestamp, coverage: { complete: false, missing: ["fresh original issue"] } });
  issue = normalizeIssue(original);
  let repoBundlePromise = repoCache.get(issue.repository);
  if (!repoBundlePromise) {
    repoBundlePromise = Promise.all([
      githubFetch(`/repos/${issue.repository}`, {}, { optional: true }),
      githubFetch(`/repos/${issue.repository}/contents`, { per_page: 100 }, { optional: true }),
      githubFetch(`/repos/${issue.repository}/contents/.github/workflows`, {}, { optional: true }),
      githubFetch(`/repos/${issue.repository}/contents/package.json`, {}, { optional: true })
    ]).then(async ([repo, rootEntries, workflows, manifest]) => {
      let packageJson = null;
      try { if (manifest?.encoding === "base64") packageJson = JSON.parse(Buffer.from(manifest.content, "base64").toString("utf8")); } catch { /* Untrusted or non-JSON manifest remains unknown. */ }
      const docNames = (Array.isArray(rootEntries) ? rootEntries : []).filter(x => /^(?:readme|contributing)(?:\.md|\.rst|\.txt)?$/i.test(x.name)).slice(0, 2);
      const docs = await Promise.all(docNames.map(x => githubFetch(`/repos/${issue.repository}/contents/${encodeURIComponent(x.name)}`, {}, { optional: true })));
      const decoded = docs.map(x => x?.encoding === 'base64' ? Buffer.from(x.content, 'base64').toString('utf8').slice(0, 60000) : null);
      const testPath = packageJson?.scripts?.test?.match(/^node\s+((?:test|tests)\/[\w./-]+\.m?js)$/)?.[1];
      const testFile = testPath && !testPath.includes('..') ? await githubFetch(`/repos/${issue.repository}/contents/${testPath}`, {}, { optional: true }) : null;
      const testSource = testFile?.encoding === 'base64' ? Buffer.from(testFile.content, 'base64').toString('utf8').slice(0, 60000) : null;
      return { repo, rootEntries, repoDetails: { workflows, packageJson, testSource, testSourceUrl: testFile?.html_url ?? null, readme: decoded[docNames.findIndex(x => /^readme/i.test(x.name))] ?? null, contributing: decoded[docNames.findIndex(x => /^contributing/i.test(x.name))] ?? null } };
    });
    repoCache.set(issue.repository, repoBundlePromise);
  }
  const repoBundle = await repoBundlePromise;
  const [comments, prSearch, timeline] = await Promise.all([
    issue.comments ? fetchComments(issue) : [],
    githubFetch("/search/issues", { q: `repo:${issue.repository} is:pr \"#${issue.number}\"`, per_page: 20 }, { optional: true }),
    githubFetch(`/repos/${issue.repository}/issues/${issue.number}/timeline`, { per_page: 100 }, { optional: true })
  ]);
  const linked = (Array.isArray(timeline) ? timeline : []).filter(x => x.event === 'cross-referenced' && x.source?.issue?.pull_request).map(x => ({ ...x.source.issue, linkedFromIssue: true }));
  const refs = [...(prSearch?.items ?? []), ...linked];
  for (const c of comments ?? []) for (const match of String(c.body).matchAll(/https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/pull\/(\d+)/g)) {
    if (match[1].toLowerCase() === issue.repository.toLowerCase()) refs.push({ html_url: match[0], linkedFromIssue: true });
  }
  const uniqueRefs = [...new Map(refs.map(x => [x.html_url, x])).values()];
  const prDetails = await Promise.all(uniqueRefs.slice(0, 20).map(async x => {
    const match = x.html_url?.match(/^https:\/\/github\.com\/([\w.-]+\/[\w.-]+)\/pull\/(\d+)$/);
    if (!match) return null;
    const pr = await githubFetch(`/repos/${match[1]}/pulls/${match[2]}`, {}, { optional: true });
    return pr ? classifyPR(issue, { ...pr, linkedFromIssue: x.linkedFromIssue === true }) : null;
  }));
  const solutionPRs = prDetails.filter(Boolean);
  const bountyProviderUrl = providerUrl(issue);
  const coverage = assessCoverage({ ...repoBundle, comments, prSearch, expectedComments: issue.comments });
  if (!Array.isArray(timeline) || timeline.length >= 100 || uniqueRefs.length > 20 || prDetails.some(x => !x)) { coverage.complete = false; coverage.missing.push('bounded timeline/PR details'); }
  const context = {
    repo: repoBundle.repo ?? {}, rootEntries: repoBundle.rootEntries ?? [], repoDetails: repoBundle.repoDetails,
    comments: comments ?? [], solutionPRs, coverage, solutionSearchCompleteness: coverage.complete ? 'BOUNDED_COMPLETE' : 'PARTIAL',
    analysisDepth: coverage.complete ? "deep" : "partial", retrievalTimestamp,
    bountyProviderUrl, evidenceUrls: [bountyProviderUrl, ...(comments ?? []).slice(0, 3).map((x) => x.html_url), ...solutionPRs.map((x) => x.html_url)].filter(Boolean)
  };
  frozenInputs?.push({ issue, context });
  return analyzeOpportunity(issue, context, new Date(retrievalTimestamp));
}

async function fetchComments(issue) {
  const comments = [];
  // Bounded pagination: larger threads remain explicitly incomplete.
  for (let page = 1; page <= 3; page++) {
    const batch = await githubFetch(`/repos/${issue.repository}/issues/${issue.number}/comments`, { per_page: 100, page }, { optional: true });
    if (!Array.isArray(batch)) return null;
    comments.push(...batch);
    if (batch.length < 100 || comments.length >= issue.comments) break;
  }
  return comments;
}

export async function buildLiveIntelligence({ deepLimit = 10, captureEvidence = false } = {}) {
  const frozenInputs = captureEvidence ? [] : null;
  const retrievalTimestamp = new Date().toISOString();
  const { rawCount, issues, searchCoverage } = await searchLiveIssues();
  const apparent = issues.filter(isApparentBounty);
  const shallow = apparent.map((issue) => analyzeOpportunity(issue, { analysisDepth: "shallow", retrievalTimestamp }));
  const ranked = shallow.sort((a, b) => Number(Boolean(b.rewardAmount)) - Number(Boolean(a.rewardAmount)) || b.winScore - a.winScore || a.comments - b.comments);
  const selectedIds = new Set();
  const perRepository = new Map();
  for (const candidate of ranked) {
    if ((perRepository.get(candidate.repository) ?? 0) >= 3) continue;
    selectedIds.add(candidate.id);
    perRepository.set(candidate.repository, (perRepository.get(candidate.repository) ?? 0) + 1);
    if (selectedIds.size >= deepLimit) break;
  }
  const repoCache = new Map();
  const deepResults = await Promise.all(apparent.filter((x) => selectedIds.has(x.id)).map(async (issue) => {
    try { return await enrichOne(issue, repoCache, retrievalTimestamp, frozenInputs); }
    catch (error) { return { ...analyzeOpportunity(issue, { analysisDepth: "shallow", retrievalTimestamp }), enrichmentError: error.message }; }
  }));
  const deepById = new Map(deepResults.map((x) => [x.id, x]));
  const decisionOrder = { HUNT: 0, WATCH: 1, SKIP: 2, REJECT: 3 };
  const candidates = shallow.map((x) => deepById.get(x.id) ?? x).sort((a, b) => decisionOrder[a.decision] - decisionOrder[b.decision] || b.winScore - a.winScore);
  const counts = candidates.reduce((acc, item) => { acc[item.decision] = (acc[item.decision] ?? 0) + 1; return acc; }, { HUNT: 0, WATCH: 0, SKIP: 0, REJECT: 0 });
  return {
    mode: "LIVE", phase: 2, source: "GitHub Search API", fetchedAt: retrievalTimestamp,
    queryCount: SEARCH_QUERIES.length, searchCoverage, rawCount, uniqueCount: issues.length, apparentBountyCount: apparent.length,
    legitimacyPassedCount: candidates.filter((x) => !x.rejectionReasons.length && x.isDirectTaskReward && ['VERIFIED', 'STRONG'].includes(x.paymentConfidence)).length,
    deepCheckedCount: candidates.filter((x) => x.analysisDepth === "deep").length,
    counts, candidates, ...(captureEvidence ? { frozenInputs, discoverySnapshot: issues } : {}),
    rejectionExamples: candidates.filter((x) => x.decision === "REJECT").slice(0, 8).map((x) => ({ opportunityId: x.opportunityId, title: x.title, reason: x.rejectionReasons[0] ?? x.reason, url: x.url }))
  };
}
