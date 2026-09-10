import { analyzeOpportunity, deduplicate, isApparentBounty, normalizeIssue } from "../core/intelligence.js";
import { assessCoverage } from "../core/coverage.js";

export const SEARCH_QUERIES = [
  "is:issue is:open label:bounty archived:false",
  "is:issue is:open bounty in:title archived:false",
  "is:issue is:open (USDC OR USD OR USDT OR DAI) bounty in:title,body archived:false"
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
  return String(issue.body ?? "").match(/https?:\/\/(?:www\.)?(?:gitcoin|algora|openq|dework|bountysource|issuehunt|polar)[^\s)>\]]+/i)?.[0] ?? null;
}

async function enrichOne(issue, repoCache, retrievalTimestamp) {
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
    ]).then(([repo, rootEntries, workflows, manifest]) => {
      let packageJson = null;
      try { if (manifest?.encoding === "base64") packageJson = JSON.parse(Buffer.from(manifest.content, "base64").toString("utf8")); } catch { /* Untrusted or non-JSON manifest remains unknown. */ }
      return { repo, rootEntries, repoDetails: { workflows, packageJson } };
    });
    repoCache.set(issue.repository, repoBundlePromise);
  }
  const repoBundle = await repoBundlePromise;
  const [comments, prSearch] = await Promise.all([
    issue.comments ? fetchComments(issue) : [],
    githubFetch("/search/issues", { q: `repo:${issue.repository} is:pr \"#${issue.number}\"`, per_page: 20 }, { optional: true })
  ]);
  const issueReference = new RegExp(`(?:#|issues/)${issue.number}\\b`, "i");
  const solutionPRs = (prSearch?.items ?? [])
    .filter((x) => issueReference.test(`${x.title ?? ""}\n${x.body ?? ""}`))
    .map((x) => ({ title: x.title, body: x.body, html_url: x.html_url, user: x.user, state: x.state, merged_at: x.pull_request?.merged_at ?? null, closesIssue: null }));
  const bountyProviderUrl = providerUrl(issue);
  const coverage = assessCoverage({ ...repoBundle, comments, prSearch, expectedComments: issue.comments });
  return analyzeOpportunity(issue, {
    repo: repoBundle.repo ?? {}, rootEntries: repoBundle.rootEntries ?? [], repoDetails: repoBundle.repoDetails,
    comments: comments ?? [], solutionPRs, coverage,
    analysisDepth: coverage.complete ? "deep" : "partial", retrievalTimestamp,
    bountyProviderUrl, evidenceUrls: [bountyProviderUrl, ...(comments ?? []).slice(0, 3).map((x) => x.html_url), ...solutionPRs.map((x) => x.html_url)].filter(Boolean)
  });
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

export async function buildLiveIntelligence({ deepLimit = 10 } = {}) {
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
    try { return await enrichOne(issue, repoCache, retrievalTimestamp); }
    catch (error) { return { ...analyzeOpportunity(issue, { analysisDepth: "shallow", retrievalTimestamp }), enrichmentError: error.message }; }
  }));
  const deepById = new Map(deepResults.map((x) => [x.id, x]));
  const decisionOrder = { HUNT: 0, WATCH: 1, SKIP: 2, REJECT: 3 };
  const candidates = shallow.map((x) => deepById.get(x.id) ?? x).sort((a, b) => decisionOrder[a.decision] - decisionOrder[b.decision] || b.winScore - a.winScore);
  const counts = candidates.reduce((acc, item) => { acc[item.decision] = (acc[item.decision] ?? 0) + 1; return acc; }, { HUNT: 0, WATCH: 0, SKIP: 0, REJECT: 0 });
  return {
    mode: "LIVE", phase: 2, source: "GitHub Search API", fetchedAt: retrievalTimestamp,
    queryCount: SEARCH_QUERIES.length, searchCoverage, rawCount, uniqueCount: issues.length, apparentBountyCount: apparent.length,
    legitimacyPassedCount: candidates.filter((x) => !x.rejectionReasons.length && x.legitimacyConfidence >= 60).length,
    deepCheckedCount: candidates.filter((x) => x.analysisDepth === "deep").length,
    counts, candidates,
    rejectionExamples: candidates.filter((x) => x.decision === "REJECT").slice(0, 8).map((x) => ({ opportunityId: x.opportunityId, title: x.title, reason: x.rejectionReasons[0] ?? x.reason, url: x.url }))
  };
}
