export function snapshotOpportunity(opportunity, previous = null, checkedAt = new Date().toISOString()) {
  const point = {
    checkedAt, decision: opportunity.decision, winScore: opportunity.winScore,
    rewardAmount: opportunity.rewardAmount, rewardCurrency: opportunity.rewardCurrency,
    rewardUsdEstimate: opportunity.rewardUsdEstimate, assignees: opportunity.assignees,
    activeCompetitors: opportunity.activeCompetitors, claimStatus: opportunity.claimStatus,
    existingSolutionPRs: (opportunity.existingSolutionPRs ?? []).map((pr) => ({ url: pr.url, state: pr.state, mergedAt: pr.mergedAt ?? null })).sort((a, b) => String(a.url).localeCompare(String(b.url))),
    issueState: opportunity.state
  };
  const history = previous?.history ? [...previous.history] : [];
  const last = history.at(-1);
  const comparable = ({ checkedAt: _ignored, ...rest }) => JSON.stringify(rest);
  if (!last || comparable(last) !== comparable(point)) history.push(point);
  return {
    opportunityId: opportunity.opportunityId,
    firstSeen: previous?.firstSeen ?? checkedAt,
    lastChecked: checkedAt,
    history: history.slice(-50)
  };
}

export class MemorySnapshotStore {
  constructor(seed = []) { this.records = new Map(seed.map((x) => [x.opportunityId, x])); }
  upsert(opportunity, checkedAt) {
    const record = snapshotOpportunity(opportunity, this.records.get(opportunity.opportunityId), checkedAt);
    this.records.set(record.opportunityId, record); return record;
  }
  all() { return [...this.records.values()]; }
}
