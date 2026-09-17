// Descriptive, evidence-backed observations only. This does not alter ranking.
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const reference = value => nonempty(value) &&
  !/^(UNKNOWN|PENDING|NOT_[A-Z_]+|N\/A)$/i.test(value.trim());
const list = value => Array.isArray(value) ? value : [];
const minutes = value => Number.isFinite(value) && value >= 0;
const nonLive = value => {
  if (!value || typeof value !== 'object') return false;
  if (['simulation', 'isSimulation', 'benchmark', 'isBenchmark', 'historicalReplay', 'synthetic', 'isSynthetic'].some(key => value[key] === true)) return true;
  const markedMode = ['mode', 'runType', 'kind', 'label', 'provenance'].some(key => typeof value[key] === 'string' &&
    /^(?:SIMULATION|HISTORICAL(?:[ _/-]+REPLAY)?|BENCHMARK)(?:$|[ /—:-])/i.test(value[key].trim()));
  const replayId = ['opportunityId', 'id', 'jobId'].some(key => typeof value[key] === 'string' &&
    /^(?:SIMULATION[/:_-]|ABH[-_:]BENCH(?:MARK)?[/:_-]|bench(?:mark)?[:/_-]\d|job-\d+(?:$|[/:]))/i.test(value[key]));
  const replayArtifact = ['sourceUrl', 'reference'].some(key => typeof value[key] === 'string' &&
    /(?:^|\/)(?:docs\/operations\/benchmarks|abh-benchmark-(?:jobs|audit))(?:\/|$)/i.test(value[key]));
  return markedMode || replayId || replayArtifact;
};
function simulated(operation) {
  return nonLive(operation) || nonLive(operation?.evidence) ||
    Object.values(operation?.evidence || {}).some(nonLive) ||
    list(operation?.transitions).some(event => nonLive(event) || nonLive(event.evidence) || Object.values(event.evidence || {}).some(nonLive));
}
const providerName = value => String(value?.provider || value?.paymentTrust?.provider || 'UNKNOWN').trim() || 'UNKNOWN';
const hasProof = proof => proof?.verified !== false && reference(proof?.reference) && ['setup', 'reproduction', 'focusedTests'].every(key => proof[key] === 'PASS');
const hasReservation = reservation => reservation?.verified !== false && reservation?.confirmed === true && reservation.bountyActive === true &&
  reservation.scopeConfirmed === true && reference(reservation.reference);
const hasSubmission = evidence => evidence.submission?.verified !== false && reference(evidence.submission?.url) && reference(evidence.submission?.revision) &&
  evidence.submission.revision === evidence.solution?.revision;
const hasMerge = merge => merge?.verified !== false && reference(merge?.reference) && reference(merge?.commit);
const hasPayment = payment => payment?.verified !== false && payment?.confirmed === true && Number.isFinite(payment.amount) && payment.amount > 0 &&
  reference(payment.reference) && reference(payment.currency) && /^[A-Z][A-Z0-9]{1,11}$/i.test(payment.currency.trim());
const sampleSummary = () => ({ sampleCount: 0, averageMinutes: null, samples: [] });
function sourceStats() {
  return {
    observedOpportunities: 0, proofs: 0, reservationsOrAssignments: 0, submissions: 0, accepted: 0, paid: 0,
    realizedRewardsByCurrency: Object.create(null), actualEffort: sampleSummary(), maintainerResponses: sampleSummary(),
    disputes: { status: 'UNKNOWN', observedOperations: 0, disputedOperations: 0, samples: [] },
    reliability: { status: 'UNKNOWN', completedOutcomes: 0, completedFailures: 0, samples: [] },
    discovery: { status: 'UNKNOWN', bounded: true, observedListings: 0, observations: [] }
  };
}
function addMinutes(summary, sample) {
  summary.samples.push(sample);
  summary.sampleCount = summary.samples.length;
  summary.averageMinutes = summary.samples.reduce((total, item) => total + item.minutes, 0) / summary.sampleCount;
}

export function summarizeSourceEconomics(operations = [], sourceDiscoveryResults = []) {
  const latest = new Map();
  const excludedIds = new Set();
  // Quarantine an identity if any supplied version identifies it as a replay.
  for (const operation of list(operations)) {
    if (nonempty(operation?.opportunityId) && simulated(operation)) excludedIds.add(operation.opportunityId);
  }
  for (const operation of list(operations)) {
    if (!nonempty(operation?.opportunityId) || excludedIds.has(operation.opportunityId)) continue;
    const previous = latest.get(operation.opportunityId);
    if (!previous || (operation.version ?? 0) > (previous.version ?? 0) ||
      ((operation.version ?? 0) === (previous.version ?? 0) && (Date.parse(operation.updatedAt) || 0) > (Date.parse(previous.updatedAt) || 0))) {
      latest.set(operation.opportunityId, operation);
    }
  }
  const providers = Object.create(null);
  const get = provider => providers[provider] ||= sourceStats();
  for (const operation of latest.values()) {
    const stats = get(providerName(operation));
    const opportunityId = operation.opportunityId;
    stats.observedOpportunities++;
    let evidence = {};
    let submitted = false;
    let mergeReference = null;
    let payment = null;
    // Events contain evidence deltas. Replay in version order so later merges or
    // new review cycles do not erase a verified historical submission.
    const events = [...list(operation.transitions)].sort((a, b) => (a.version ?? 0) - (b.version ?? 0));
    for (const event of [...events, { to: operation.status, evidence: operation.evidence }]) {
      evidence = { ...evidence, ...event.evidence };
      if (event.to === 'SUBMITTED' && hasSubmission(evidence)) submitted = true;
      if (['MERGED', 'PAID'].includes(event.to) && hasMerge(evidence.merge)) mergeReference = evidence.merge.reference;
      if (event.to === 'PAID' && hasPayment(evidence.payment)) payment = evidence.payment;
    }
    // Merged/paid projections may retain submission evidence without the log.
    if (['SUBMITTED', 'CHANGES_REQUESTED', 'MERGED', 'PAID'].includes(operation.status) && hasSubmission(evidence)) submitted = true;
    if (hasProof(evidence.proof)) stats.proofs++;
    if (hasReservation(evidence.reservation)) stats.reservationsOrAssignments++;
    if (submitted) stats.submissions++;
    const accepted = mergeReference !== null || payment !== null;
    if (accepted) stats.accepted++;
    if (payment) {
      stats.paid++;
      const currency = payment.currency.trim().toUpperCase();
      const reward = stats.realizedRewardsByCurrency[currency] ||= { sampleCount: 0, total: 0, average: null, samples: [] };
      reward.samples.push({ opportunityId, amount: payment.amount, reference: payment.reference });
      reward.sampleCount++;
      reward.total += payment.amount;
      reward.average = reward.total / reward.sampleCount;
    }
    const outcome = evidence.outcome || {};
    const effort = outcome.verified !== false && reference(outcome.reference) && minutes(outcome.effortMinutes) ? { minutes: outcome.effortMinutes, reference: outcome.reference } :
      evidence.effort?.verified !== false && reference(evidence.effort?.reference) && minutes(evidence.effort.minutes) ? evidence.effort : null;
    if (effort) addMinutes(stats.actualEffort, { opportunityId, minutes: effort.minutes, reference: effort.reference });
    const responseKeys = new Set();
    for (const response of [...list(evidence.maintainerResponses), evidence.maintainerResponse]) {
      if (response?.verified !== true || !reference(response.reference) || !reference(response.requestReference)) continue;
      const start = Date.parse(response.requestedAt);
      const end = Date.parse(response.respondedAt);
      if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) continue;
      const key = JSON.stringify([response.requestReference, response.reference]);
      if (responseKeys.has(key)) continue;
      responseKeys.add(key);
      addMinutes(stats.maintainerResponses, { opportunityId, minutes: (end - start) / 60000,
        requestedAt: response.requestedAt, respondedAt: response.respondedAt,
        requestReference: response.requestReference, reference: response.reference });
    }
    const dispute = evidence.dispute;
    if (dispute?.verified === true && reference(dispute.reference) && ['NONE', 'OPEN', 'RESOLVED', 'DISMISSED'].includes(dispute.status)) {
      stats.disputes.status = 'OBSERVED';
      stats.disputes.observedOperations++;
      if (dispute.status !== 'NONE') stats.disputes.disputedOperations++;
      stats.disputes.samples.push({ opportunityId, status: dispute.status, reference: dispute.reference });
    }
    const failed = !accepted && ['ABANDONED', 'DO_NOT_HUNT', 'REJECTED'].includes(operation.status) &&
      outcome.verified !== false && outcome.completed === true && outcome.result === 'FAILED' && reference(outcome.reference);
    if (accepted || failed) {
      stats.reliability.status = 'OBSERVED_OUTCOMES';
      stats.reliability.completedOutcomes++;
      if (failed) stats.reliability.completedFailures++;
      stats.reliability.samples.push({ opportunityId, result: failed ? 'FAILED' : payment ? 'PAID' : 'ACCEPTED',
        reference: failed ? outcome.reference : payment?.reference || mergeReference });
    }
  }
  // Catalogue sightings are bounded source observations, not attempted work.
  const seenListings = new Map();
  const seenObservations = new Set();
  for (const discovery of list(sourceDiscoveryResults)) {
    if (simulated(discovery) || !reference(discovery?.provider) || !reference(discovery.sourceUrl || discovery.reference) ||
      !Number.isFinite(Date.parse(discovery.checkedAt)) || discovery.coverage?.bounded !== true) continue;
    const provider = providerName(discovery);
    const stats = get(provider);
    const sourceUrl = discovery.sourceUrl || discovery.reference;
    const observationKey = JSON.stringify([provider, sourceUrl, discovery.checkedAt]);
    if (seenObservations.has(observationKey)) continue;
    seenObservations.add(observationKey);
    const seen = seenListings.get(provider) || new Set();
    for (const listing of list(discovery.listings || discovery.opportunities)) {
      if (simulated(listing)) continue;
      const identity = listing?.opportunityId || listing?.url;
      if (nonempty(identity) && reference(listing?.url) && !excludedIds.has(identity)) seen.add(identity);
    }
    seenListings.set(provider, seen);
    stats.discovery.status = 'OBSERVED';
    stats.discovery.observedListings = seen.size;
    stats.discovery.observations.push({ checkedAt: discovery.checkedAt, sourceUrl, status: discovery.status || 'UNKNOWN', bounded: true });
  }
  return { sampleSize: latest.size, excludedOperations: excludedIds.size, providers };
}
