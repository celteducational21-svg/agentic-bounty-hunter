import { snapshotOpportunity } from './history.js';

export const ABH_PROJECT_REF = 'xyuxxunpmzlyqocberia';

export function materialState(opportunity) {
  const { checkedAt, ...state } = snapshotOpportunity(opportunity, null, '2000-01-01T00:00:00Z').history[0];
  return {
    ...state,
    assignees: [...(state.assignees ?? [])].sort(),
    rewardConfidence: opportunity.rewardConfidence ?? null,
    paymentMethod: opportunity.paymentMethod ?? null,
    paymentRisk: opportunity.paymentRisk ?? null,
    rejectionReasons: [...(opportunity.rejectionReasons ?? [])].sort(),
    scopeClarityScore: opportunity.scopeClarityScore ?? null,
    repoHealthScore: opportunity.repoHealthScore ?? null,
    aiSolvabilityScore: opportunity.aiSolvabilityScore ?? null,
    effortEstimate: opportunity.effortEstimate ?? null
  };
}

export class SupabaseSnapshotStore {
  constructor({ url, secretKey, fetchImpl = fetch }) {
    const expected = `https://${ABH_PROJECT_REF}.supabase.co`;
    if (url !== expected) throw new Error('ABH storage must use its dedicated Supabase project');
    if (!secretKey?.startsWith('sb_secret_')) throw new Error('ABH Supabase server secret is missing');
    this.url = url;
    this.secretKey = secretKey;
    this.fetchImpl = fetchImpl;
  }
  async request(path, options = {}) {
    const response = await this.fetchImpl(`${this.url}/rest/v1/${path}`, {
      ...options,
      headers: { apikey: this.secretKey, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(15000)
    });
    // Never include provider response bodies or credentials in API errors.
    if (!response.ok) throw new Error(`ABH history storage failed (${response.status})`);
    return response.json();
  }
  async persistScan(payload) {
    const { candidates, ...summary } = payload;
    const unique = [...new Map(candidates.map(item => [item.opportunityId, item])).values()];
    return this.request('rpc/abh_record_scan', {
      method: 'POST',
      body: JSON.stringify({ p_checked_at: payload.fetchedAt, p_summary: summary,
        p_items: unique.map(opportunity => ({ opportunity, state: materialState(opportunity) })) })
    });
  }
  async history(opportunityId) {
    if (!/^ABH-GH-[A-Za-z0-9-]+$/.test(opportunityId)) throw new Error('Invalid opportunity ID');
    const params = new URLSearchParams({ opportunity_id: `eq.${opportunityId}`, select: 'checked_at,state', order: 'checked_at.desc', limit: '50' });
    return this.request(`abh_history?${params}`);
  }
}
