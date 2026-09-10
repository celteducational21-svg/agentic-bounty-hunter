import { buildLiveIntelligence } from "../src/live/github.js";
import { MemorySnapshotStore } from "../src/core/history.js";

const history = new MemorySnapshotStore();

export default async function handler(request, response) {
  if (request.method !== "GET") return response.status(405).json({ error: "Method not allowed" });
  try {
    const payload = await buildLiveIntelligence({ deepLimit: 10 });
    const snapshots = payload.candidates.map((item) => history.upsert(item, payload.fetchedAt));
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.setHeader("X-ABH-Policy", "analysis-only");
    return response.status(200).json({ ...payload, snapshotCount: snapshots.length,
      engineRevision: 'phase2-evidence-v3', phase2ExitGate: 'NOT_PASSED',
      persistence: { durable: false, backend: 'warm-instance-memory' },
      humanApprovalRequired: true });
  } catch (error) {
    return response.status(502).json({ mode: "ERROR", phase: 2, error: error.message });
  }
}
