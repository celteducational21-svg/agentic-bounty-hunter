import { buildStagedScan } from "../src/live/pipeline.js";
import { MemorySnapshotStore } from "../src/core/history.js";
import { SupabaseSnapshotStore } from "../src/core/durable-history.js";
import { checkOpireDiscovery } from "../src/live/provider-check.js";

import { outcomeLearning } from "../src/core/learning.js";
import { operatingView, dailyCycle, committedOperations } from "../src/core/operating-store.js";
import { discoverSuperteam } from '../src/providers/superteam.js';
import { summarizeSourceEconomics } from '../src/core/source-economics.js';

const history = new MemorySnapshotStore();

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });
  try {
    if (request.query?.providerCheck === 'opire') {
      response.setHeader('Cache-Control', 'no-store');
      return response.status(200).json(await checkOpireDiscovery());
    }
    const durable = process.env.ABH_SUPABASE_SECRET_KEY ? new SupabaseSnapshotStore({
      url: process.env.ABH_SUPABASE_URL, secretKey: process.env.ABH_SUPABASE_SECRET_KEY
    }) : null;
    if (request.query?.latest) {
      response.setHeader('Cache-Control', 'no-store');
      if (!durable) return response.status(503).json({error:'Durable history is not configured'});
      const snapshot = await durable.latestScan();
      if (!snapshot) return response.status(404).json({error:'No persisted scan yet'});
      return response.status(200).json({...snapshot, snapshotReadOnly:true, persistence:{durable:true,backend:'supabase-postgres'}});
    }
    if (request.query?.history) {
      if (!durable) return response.status(503).json({ error: 'Durable history is not configured' });
      return response.status(200).json({ opportunityId: request.query.history, history: await durable.history(request.query.history) });
    }
    if (request.query?.snapshot) {
      if (!durable) return response.status(503).json({ error: 'Durable history is not configured' });
      return response.status(200).json({ ...await durable.scanSnapshot(request.query.snapshot), snapshotReadOnly: true, persistence: { durable: true, backend: 'supabase-postgres' } });
    }
    const previous = durable ? await durable.latestScan() : null;
    const committed = committedOperations();
    const learning = outcomeLearning([...(previous?.operations || []),...committed.operations]);
    const [payload, superteam] = await Promise.all([
      buildStagedScan({ deepLimit: 10, learnedProviders:learning.providers }),
      discoverSuperteam()
    ]);
    const knownUrls = new Set(payload.candidates.map(x => x.canonicalIssueUrl || x.originalIssueUrl).filter(Boolean));
    const additional = [...new Map(superteam.listings.filter(x => !knownUrls.has(x.url)).map(x => [x.url,x])).values()];
    payload.sourceExpansion = {sources:[superteam],opportunities:additional,
      additionalUniqueCount:additional.length,deduplicatedCount:payload.uniqueCount+additional.length,
      privateProofPromotions:0,policy:'Discovery is not eligibility; only explicit AGENT_ALLOWED/AGENT_ONLY listings; owner approval before public work'};
    payload.outcomeLearning = learning;
    const view = operatingView(payload, undefined, previous?.operations || []);
    payload.operations = view.operations;
    payload.sourceEconomics = summarizeSourceEconomics(view.operations,[
      {provider:'GitHub maintainer',checkedAt:payload.fetchedAt,sourceUrl:'https://api.github.com/search/issues',status:'AVAILABLE',coverage:{bounded:true},listings:payload.frozenDiscovery?.github?.issues ?? []},
      {provider:'Opire',checkedAt:payload.fetchedAt,sourceUrl:'https://app.opire.dev/home',status:payload.providerDiscovery?.status ?? 'UNKNOWN',coverage:{bounded:true},listings:(payload.providerDiscovery?.listings ?? []).map(x=>({url:x.listingUrl}))},
      superteam
    ]);
    payload.dailyLog = dailyCycle(payload, view);
    const persisted = durable ? await durable.persistScan(payload) : null;
    const snapshots = durable ? [] : payload.candidates.map((item) => history.upsert(item, payload.fetchedAt));
    response.setHeader("Cache-Control", "no-store");
    response.setHeader("X-ABH-Policy", "analysis-only");
    return response.status(200).json({ ...payload, snapshotCount: durable ? payload.candidates.length : snapshots.length,
      engineRevision: 'operations-v1-delivery-certified-sources', phase2ExitGate: 'NOT_PASSED',
      persistence: { durable: persisted?.persisted === true, backend: durable ? 'supabase-postgres' : 'warm-instance-memory', changes: persisted?.changes ?? null },
      humanApprovalRequired: true });
  } catch (error) {
    return response.status(502).json({ mode: "ERROR", phase: 2, error: 'ABH discovery or history is temporarily unavailable; retry or use the last saved snapshot.' });
  }
}
