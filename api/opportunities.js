import { buildStagedScan } from "../src/live/pipeline.js";
import { MemorySnapshotStore } from "../src/core/history.js";
import { SupabaseSnapshotStore } from "../src/core/durable-history.js";

const history = new MemorySnapshotStore();

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });
  try {
    const durable = process.env.ABH_SUPABASE_SECRET_KEY ? new SupabaseSnapshotStore({
      url: process.env.ABH_SUPABASE_URL, secretKey: process.env.ABH_SUPABASE_SECRET_KEY
    }) : null;
    if (request.query?.history) {
      if (!durable) return response.status(503).json({ error: 'Durable history is not configured' });
      return response.status(200).json({ opportunityId: request.query.history, history: await durable.history(request.query.history) });
    }
    if (request.query?.snapshot) {
      if (!durable) return response.status(503).json({ error: 'Durable history is not configured' });
      return response.status(200).json({ ...await durable.scanSnapshot(request.query.snapshot), snapshotReadOnly: true, persistence: { durable: true, backend: 'supabase-postgres' } });
    }
    const payload = await buildStagedScan({ deepLimit: 5 });
    const persisted = durable ? await durable.persistScan(payload) : null;
    const snapshots = durable ? [] : payload.candidates.map((item) => history.upsert(item, payload.fetchedAt));
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.setHeader("X-ABH-Policy", "analysis-only");
    return response.status(200).json({ ...payload, snapshotCount: durable ? payload.candidates.length : snapshots.length,
      engineRevision: 'phase2.2-staged-v1', phase2ExitGate: 'NOT_PASSED',
      persistence: { durable: persisted?.persisted === true, backend: durable ? 'supabase-postgres' : 'warm-instance-memory', changes: persisted?.changes ?? null },
      humanApprovalRequired: true });
  } catch (error) {
    return response.status(502).json({ mode: "ERROR", phase: 2, error: error.message });
  }
}
