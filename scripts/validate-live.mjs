import assert from "node:assert/strict";

const baseUrl = process.env.BASE_URL;
assert(baseUrl, "BASE_URL is required");
const startedAt = new Date().toISOString();
const home = await fetch(baseUrl);
assert.equal(home.status, 200, "Home page must return 200");
assert.match(await home.text(), /Opportunity Intelligence|Prove it is worth hunting/);
const api = await fetch(new URL("/api/opportunities", baseUrl));
assert.equal(api.status, 200, "Opportunity API must return 200");
const payload = await api.json();
assert.equal(payload.mode, "LIVE");
assert.equal(payload.phase, 2);
assert.equal(payload.source, "GitHub Search API");
assert.equal(payload.humanApprovalRequired, true);
assert.ok(Date.parse(payload.fetchedAt));
assert.ok(payload.rawCount > 0 && payload.uniqueCount > 0);
assert.ok(payload.apparentBountyCount <= payload.uniqueCount);
assert.ok(payload.deepCheckedCount >= 5, "At least five candidates must be deeply checked");
assert.equal(new Set(payload.candidates.map((x) => x.opportunityId)).size, payload.candidates.length);
assert.ok(payload.candidates.every((x) => ["HUNT", "WATCH", "SKIP", "REJECT"].includes(x.decision)));
assert.ok(payload.candidates.every((x) => Number.isInteger(x.winScore) && x.winScore >= 0 && x.winScore <= 100));
assert.ok(payload.candidates.every((x) => x.originalIssueUrl.startsWith("https://github.com/")));
assert.ok(payload.candidates.every((x) => x.analysisDepth === "deep" || x.decision !== "HUNT"), "Shallow results must not be HUNT");
assert.ok(payload.candidates.filter((x) => x.analysisDepth === "deep").every((x) => x.scoreBreakdown && x.acceptanceCriteria && x.promptInjection));
assert.ok(payload.rejectionExamples.length > 0, "False-positive rejection evidence is required");
console.log(JSON.stringify({
  runtimeValidation: "PASS", phase2Verdict: "NOT_ASSESSED_BY_THIS_SCRIPT", startedAt, completedAt: new Date().toISOString(), deployment: baseUrl,
  evidence: { fetchedAt: payload.fetchedAt, rawCount: payload.rawCount, uniqueCount: payload.uniqueCount, apparentBountyCount: payload.apparentBountyCount, legitimacyPassedCount: payload.legitimacyPassedCount, deepCheckedCount: payload.deepCheckedCount, decisions: payload.counts },
  topFive: payload.candidates.filter((x) => x.analysisDepth === "deep").slice(0, 5).map((x) => ({ opportunityId: x.opportunityId, title: x.title, decision: x.decision, winScore: x.winScore, reward: x.rewardUsdEstimate ?? `${x.rewardAmount ?? "UNKNOWN"} ${x.rewardCurrency ?? "UNKNOWN"}`, url: x.originalIssueUrl }))
}, null, 2));
