export { analyzeOpportunity, deduplicate, extractReward, isApparentBounty, normalizeIssue } from "./intelligence.js";

import { analyzeOpportunity, extractReward } from "./intelligence.js";

export function moneySignal(issue) { return extractReward(issue).rewardAmount !== null; }
export function qualify(issue, now = new Date()) { return analyzeOpportunity(issue, {}, now); }
