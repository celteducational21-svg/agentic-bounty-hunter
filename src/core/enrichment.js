import { analyzeOpportunity, extractReward } from './intelligence.js';
import { providerLinks } from './payment.js';
export const STEPS = ['BASIC_SCREENED', 'SOURCE_RESOLVED', 'PAYMENT_CHECKED', 'COMPETITION_CHECKED', 'REPO_CHECKED'];
export function sourceTarget(issue) {
  const text = `${issue.title}\n${issue.body}`;
  if (!/mirror|repost|Originally posted|Source URL|original (?:issue|bounty)|bounty-plaza|bounty-radar/i.test(`${issue.repository}\n${text}`)) return issue.url;
  return String(issue.body).match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+/)?.[0] ?? issue.url;
}
export function preliminaryPriority(issue) {
  const reward = extractReward(issue);
  return 20 + (/bounty|reward/i.test(issue.title) ? 20 : 0) + (reward.isDirectTaskReward ? 20 : 0) + (providerLinks(issue.body).length ? 25 : 0) + (/acceptance|expected behavior|regression test/i.test(issue.body) ? 10 : 0) - ((issue.assignees ?? []).length ? 100 : 0) - (sourceTarget(issue) !== issue.url ? 15 : 0);
}
export function basicRejections(issue) {
  // Defer unknown payment and copied-source decisions until canonical/provider checks.
  return analyzeOpportunity(issue).rejectionReasons.filter(x => !/Payout|market value|mirror|repost|Stale/i.test(x));
}
export function unifiedBlockers(issue, context) {
  const sources = [{ source: issue.url, text: issue.body }, ...['readme', 'contributing', 'testSource'].map(k => ({ source: context.repoDetails?.[k + 'Url'] ?? `${issue.repositoryUrl} (${k})`, text: context.repoDetails?.[k] ?? '' })), ...(context.repoDetails?.sourceFiles ?? []).map(x => ({ source: x.url, text: x.text }))];
  const rules = [
    ['EXTERNAL_CREDENTIAL', /HUMAN_VERIFIED_SIGNATURE|register credentials|unlock test|maintainer.only credentials|private API (?:key|credentials)/i],
    ['PHYSICAL_HARDWARE', /physical (?:device|hardware)|WearOS|Wormhole B0|Blackhole|requires? hardware/i],
    ['PRIVATE_INFRASTRUCTURE', /internal staging|private infrastructure|private API required/i],
    ['MAINNET_FUNDS', /requires? mainnet funds|must.*mainnet funds/i],
    ['PAID_SERVICE', /paid (?:service|account) required/i]
  ];
  return sources.flatMap(s => rules.filter(([, re]) => re.test(s.text)).map(([type, re]) => ({ type, severity: 'HARD', source: s.source, description: String(s.text).split('\n').find(x => re.test(x))?.slice(0, 300) ?? type })));
}
export function finishEnrichment(issue, context, steps, source, provider, now = new Date()) {
  const complete = STEPS.every(step => steps.some(x => x.step === step && x.status === 'COMPLETE'));
  const blockers = unifiedBlockers(issue, context);
  const analyzedIssue = provider?.listingVerified && provider.rewardAmount > 0 ? { ...issue, title: `Reward: $${provider.rewardAmount} USD`, body: issue.body } : issue;
  const result = analyzeOpportunity(analyzedIssue, { ...context, analysisDepth: complete ? 'deep' : 'partial', coverage: { complete, missing: steps.filter(x => x.status !== 'COMPLETE').map(x => x.step) } }, now);
  result.title = issue.title;
  // Transport or provider uncertainty is not evidence of invalidity.
  const hard = result.rejectionReasons.filter(x => !/Payout cannot|Payout mechanism|market value/i.test(x));
  if (source.unavailable) hard.push('Original bounty source unavailable');
  if (complete && !result.isDirectTaskReward && !provider?.listingVerified) hard.push('No direct task reward established after source/payment inspection');
  if (provider?.listingVerified && (provider.availability === 'CLOSED' || provider.availableRewards === 0)) hard.push('Provider listing has no available reward');
  hard.push(...blockers.map(x => `${x.type}: ${x.description}`));
  const paymentTrust = provider ?? { provider: 'GitHub-native/UNKNOWN', platformVerified: true, listingVerified: false, issuerAuthority: result.payerRole, fundingStatus: 'UNKNOWN', paymentProvider: result.paymentProvider, paymentTrigger: result.paymentTrigger, paymentConfidence: result.paymentConfidence, evidence: result.paymentEvidence };
  if (provider?.listingVerified) {
    result.rewardAmount = provider.rewardAmount; result.rewardCurrency = 'USD'; result.rewardUsdEstimate = provider.rewardAmount;
    result.reward = { amount: provider.rewardAmount, currency: 'USD', usdEstimate: provider.rewardAmount, rewardType: 'fixed', evidenceText: provider.evidence[0].detail, evidenceSourceUrl: provider.url, evidenceLocation: 'provider listing', confidence: 95, isDirectTaskReward: true };
    result.paymentConfidence = provider.paymentConfidence;
    if (provider.tryingSolvers > (result.activeCompetitors ?? 0) || provider.claimingSolvers > 0) {
      result.observedActiveCompetitors = Math.max(result.observedActiveCompetitors ?? 0, provider.tryingSolvers, provider.claimingSolvers);
      result.activeCompetitors = null; result.activeCompetitorCount = null; result.competitionConfidence = 'UNKNOWN';
    }
  }
  const credible = ['STRONG', 'VERIFIED'].includes(result.paymentConfidence) && result.rewardUsdEstimate > 0;
  let decision = hard.length ? 'REJECT' : !complete ? 'INCOMPLETE' : !credible ? 'WATCH' : result.winScore >= 85 && Object.values(result.huntGates).every(Boolean) && !blockers.length ? 'HUNT' : 'SKIP';
  const finalOpportunityScore = complete ? result.winScore : null;
  return { ...result, ...source, paymentTrust, providerUrl: provider?.url ?? null, blockers, hiddenBlockerRisk: blockers.length ? 'HIGH' : result.hiddenBlockerRisk,
    preliminaryPriority: preliminaryPriority(issue), finalOpportunityScore, winScore: finalOpportunityScore,
    enrichmentState: hard.length ? 'REJECTED' : complete ? 'FULLY_ENRICHED' : 'INCOMPLETE', enrichment: { steps, completed: steps.filter(x => x.status === 'COMPLETE').length, total: STEPS.length, complete, checkedAt: now.toISOString() },
    decision, rejectionReasons: [...new Set(hard)], reason: hard[0] ?? (!complete ? 'Evidence collection incomplete; see failed or deferred enrichment steps' : !credible ? 'Payment credibility needs verification' : result.reason),
    searchCompleteness: context.solutionSearchCompleteness ?? 'UNKNOWN', competitionState: result.claimStatus };
}
