import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL;
assert(baseUrl, "BASE_URL is required");
const startedAt = new Date().toISOString();
const home = await fetch(baseUrl);
assert.equal(home.status, 200, "Home page must return 200");
assert.match(await home.text(), /Agentic Bounty Hunter/);
const api = await fetch(new URL("/api/opportunities", baseUrl));
assert.equal(api.status, 200, "Discovery API must return 200");
const payload = await api.json();
assert.equal(payload.mode, "LIVE");
assert.equal(payload.source, "GitHub Search API");
assert.ok(Date.parse(payload.fetchedAt), "fetchedAt must be valid");
assert.ok(payload.rawCount > 0, "Live source must return results");
assert.ok(payload.uniqueCount > 0, "Normalized set must not be empty");
assert.equal(new Set(payload.candidates.map((x) => `${x.source}:${x.id}`)).size, payload.candidates.length);
assert.ok(payload.candidates.every((x) => ["SHORTLIST", "REVIEW", "REJECT"].includes(x.decision)));
assert.ok(payload.candidates.every((x) => Number.isInteger(x.score) && x.score >= 0 && x.score <= 100));
assert.ok(payload.candidates.every((x) => x.url.startsWith("https://github.com/")));
console.log(JSON.stringify({
  verdict: "PASS",
  startedAt,
  completedAt: new Date().toISOString(),
  deployment: baseUrl,
  evidence: {
    source: payload.source,
    fetchedAt: payload.fetchedAt,
    rawCount: payload.rawCount,
    uniqueCount: payload.uniqueCount,
    decisions: payload.counts
  }
}, null, 2));
