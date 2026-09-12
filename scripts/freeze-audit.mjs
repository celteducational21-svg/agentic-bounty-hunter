import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildLiveIntelligence } from '../src/live/github.js';

const payload = await buildLiveIntelligence({ deepLimit: 10, captureEvidence: true });
const data = JSON.stringify(payload, null, 2) + '\n';
const path = `docs/audits/phase2_1-${payload.fetchedAt.replaceAll(':', '-')}.json`;
await mkdir('docs/audits', { recursive: true });
await writeFile(path, data, { flag: 'wx' });
console.log(JSON.stringify({ path, sha256: createHash('sha256').update(data).digest('hex'), scanned: payload.rawCount, candidates: payload.apparentBountyCount, counts: payload.counts, deep: payload.deepCheckedCount, top5: payload.candidates.slice(0, 5).map(x => ({ id: x.opportunityId, title: x.title, url: x.url, score: x.winScore, reward: x.reward, payment: x.paymentConfidence, competition: x.activeCompetitors, depth: x.analysisDepth, decision: x.decision, reason: x.reason })) }, null, 2));
