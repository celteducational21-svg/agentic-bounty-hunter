import { deduplicate, normalizeIssue, qualify } from "../src/core/scoring.js";

const QUERIES = [
  "is:issue is:open label:bounty archived:false",
  "is:issue is:open bounty in:title archived:false",
  "is:issue is:open reward in:title archived:false"
];

async function searchGitHub(query) {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "agentic-bounty-hunter/0.1"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const url = new URL("https://api.github.com/search/issues");
  url.searchParams.set("q", query);
  url.searchParams.set("sort", "updated");
  url.searchParams.set("order", "desc");
  url.searchParams.set("per_page", "20");
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub search failed with ${response.status}`);
  return response.json();
}

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });
  try {
    const batches = await Promise.all(QUERIES.map(searchGitHub));
    const normalized = deduplicate(
      batches.flatMap((batch) => batch.items).map(normalizeIssue)
    );
    const candidates = normalized
      .map((item) => qualify(item))
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
    const counts = candidates.reduce((acc, item) => {
      acc[item.decision] = (acc[item.decision] ?? 0) + 1;
      return acc;
    }, {});
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).json({
      mode: "LIVE",
      source: "GitHub Search API",
      fetchedAt: new Date().toISOString(),
      queryCount: QUERIES.length,
      rawCount: batches.reduce((sum, batch) => sum + batch.items.length, 0),
      uniqueCount: normalized.length,
      counts,
      candidates
    });
  } catch (error) {
    return response.status(502).json({ mode: "ERROR", error: error.message });
  }
}
