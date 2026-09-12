import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { analyzeOpportunity, normalizeIssue } from '../src/core/intelligence.js';
const path = 'docs/audits/phase2_1-2026-09-12T08-31-46.692Z.json';
let raw;
try { raw = await readFile(path); } catch { raw = gunzipSync(await readFile(path + '.gz')); }
const frozen = JSON.parse(raw);
const review = JSON.parse(await readFile('docs/audits/phase2_1-top5-source-review.json', 'utf8'));
const inputs = new Map(frozen.frozenInputs.map(x => [x.issue.url, x]));
const top5 = frozen.candidates.slice(0, 5).map(original => {
  const source = review.frozenTop5.find(x => x.html_url === original.url);
  const issue = normalizeIssue(source);
  const context = structuredClone(inputs.get(issue.url)?.context ?? { analysisDepth: 'partial', coverage: { complete: false, missing: ['Live enrichment incomplete'] } });
  if (issue.repository === 'Senthemodder/aquarium-of-gullibles') {
    context.repo = review.originalEvidence.aquariumRepository;
    context.comments = review.originalEvidence[issue.number === 1 ? 'aquariumIssue1Comments' : 'aquariumIssue2Comments'];
    context.repoDetails = { packageJson: JSON.parse(review.originalEvidence.manifest.content), readme: review.originalEvidence.readme.content, testSource: review.originalEvidence.testHarness.content };
  }
  if (issue.repository === 'tenstorrent/tt-metal') {
    context.comments = review.originalEvidence.tenstorrentComments;
    context.repoDetails = { ...context.repoDetails, readme: review.originalEvidence.tenstorrentReadme.content };
  }
  context.retrievalTimestamp = frozen.fetchedAt;
  return { originalRank: frozen.candidates.indexOf(original) + 1, originalScore: original.winScore, originalDecision: original.decision, reviewed: analyzeOpportunity(issue, context, new Date(frozen.fetchedAt)) };
});
const output = { frozenAt: frozen.fetchedAt, note: 'Same five frozen identities. Supplementary source review; this is not a new live scan or exhaustive enrichment.', top5 };
await writeFile('docs/audits/phase2_1-top5-remediated.json', JSON.stringify(output, null, 2) + '\n');
console.log(JSON.stringify(top5.map(x => ({ id: x.reviewed.opportunityId, score: x.reviewed.winScore, decision: x.reviewed.decision, reward: x.reviewed.rewardAmount, payment: x.reviewed.paymentConfidence, scope: x.reviewed.scopeClarityScore, ai: x.reviewed.aiSolvabilityScore, readiness: x.reviewed.executionReadinessScore, reasons: x.reviewed.rejectionReasons })), null, 2));
