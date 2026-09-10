import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const baseUrl = process.env.BASE_URL;
assert(baseUrl, "BASE_URL is required");
const target = process.env.HISTORY_FILE ?? "data/opportunity-history.json";
const response = await fetch(new URL("/api/opportunities", baseUrl));
assert.equal(response.status, 200);
const payload = await response.json();
let stored = {};
try { stored = JSON.parse(await readFile(target, "utf8")); } catch (error) { if (error.code !== "ENOENT") throw error; }
for (const item of payload.candidates) {
  const previous = stored[item.opportunityId] ?? { firstSeen: payload.fetchedAt, history: [] };
  const point = { checkedAt: payload.fetchedAt, decision: item.decision, winScore: item.winScore, rewardUsdEstimate: item.rewardUsdEstimate, assignees: item.assignees, activeCompetitors: item.activeCompetitors, issueState: item.state };
  if (JSON.stringify(previous.history.at(-1) ?? null) !== JSON.stringify(point)) previous.history.push(point);
  stored[item.opportunityId] = { ...previous, lastChecked: payload.fetchedAt, history: previous.history.slice(-50) };
}
await mkdir(target.split("/").slice(0, -1).join("/") || ".", { recursive: true });
await writeFile(target, `${JSON.stringify(stored, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ target, opportunities: Object.keys(stored).length, fetchedAt: payload.fetchedAt }, null, 2));
