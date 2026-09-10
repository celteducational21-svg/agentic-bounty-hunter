import { analyzeOpportunity, deduplicate, isApparentBounty, normalizeIssue } from "../core/intelligence.js";

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
    rawCount: batches.reduce((sum, batch) => sum + batch.items.length, 0),
    issues: deduplicate(batches.flatMap((batch) => batch.items).map(normalizeIssue))
  };
}

function providerUrl(issue) {
  return String(issue.body ?? "").match(/https?:\/\/(?:www\.)?(?:gitcoin|algora|openq|dework|bountysource|issuehunt|polar)[^\s)>\]]+/i)?.[0] ?? null;
}

async function enrichOne(issue, repoCache, retrievalTimestamp) {
  let repoBundlePromise = repoCache.get(issue.repository);
  if (!repoBundlePromise) {
    repoBundlePromise = Promise.all([
      githubFetch(`/repos/${issue.repository}`, {}, { optional: true }),
      githubFetch(`/repos/${issue.repository}/contents`, { per_page: 100 }, { optional: true })
    ]).then(([repo, rootEntries]) => ({ repo: repo ?? {}, rootEntries: Array.isArray(rootEntries) ? rootEntries : [] }));
    repoCache.set(issue.repository, repoBundlePromise);
  }
  const repoBundle = await repoBundlePromise;
  const [comments, prSearch] = await Promise.all([
    issue.comments ? githubFetch(`/repos/${issue.repository}/issues/${issue.number}/comments`, { per_page: 50 }, { optional: true }) : [],
    githubFetch("/search/issues", { q: `repo:${issue.repository} is:pr \"#${issue.number}\"`, per_page: 20 }, { optional: true })
  ]);
  const issueReference = new RegExp(`(?:#|issues/)${issue.number}\\b`, "i");
  const solutionPRs = (prSearch?.items ?? [])
    .filter((x) => issueReference.test(`${x.title ?? ""}\n${x.body ?? ""}`))
    .map((x) => ({ title: x.title, body: x.body, html_url: x.html_url, state: x.state, merged_at: x.pull_request?.merged_at ?? null }));
  const bountyProviderUrl = providerUrl(issue);
  return analyzeOpportunity(issue, {
    ...repoBundle, comments: comments ?? [], solutionPRs, analysisDepth: "deep", retrievalTimestamp,
    bountyProviderUrl, evidenceUrls: [bountyProviderUrl, ...(comments ?? []).slice(0, 3).map((x) => x.html_url), ...solutionPRs.map((x) => x.html_url)].filter(Boolean)
  });
}

export async function buildLiveIntelligence({ deepLimit = 10 } = {}) {
  const retrievalTimestamp = new Date().toISOString();
  const { rawCount, issues } = await searchLiveIssues();
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
  const candidates = shallow.map((x) => deepById.get(x.id) ?? x).sort((a, b) => b.winScore - a.winScore);
  const counts = candidates.reduce((acc, item) => { acc[item.decision] = (acc[item.decision] ?? 0) + 1; return acc; }, { HUNT: 0, WATCH: 0, SKIP: 0, REJECT: 0 });
  return {
    mode: "LIVE", phase: 2, source: "GitHub Search API", fetchedAt: retrievalTimestamp,
    queryCount: SEARCH_QUERIES.length, rawCount, uniqueCount: issues.length, apparentBountyCount: apparent.length,
    legitimacyPassedCount: candidates.filter((x) => !x.rejectionReasons.length && x.legitimacyConfidence >= 60).length,
    deepCheckedCount: candidates.filter((x) => x.analysisDepth === "deep").length,
    counts, candidates: candidates.slice(0, 30),
    rejectionExamples: candidates.filter((x) => x.decision === "REJECT").slice(0, 8).map((x) => ({ opportunityId: x.opportunityId, title: x.title, reason: x.rejectionReasons[0] ?? x.reason, url: x.url }))
  };
}
