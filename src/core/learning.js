// Append-only observations, not automatic rejection rules or invented outcomes.
export function learningRecord(candidate, checkedAt) {
  return {
    checkedAt, candidate: candidate.opportunityId, issue: candidate.canonicalIssueUrl,
    provider: candidate.paymentTrust?.provider ?? 'UNKNOWN', repository: candidate.repository,
    taskCategory: candidate.stack ?? 'UNKNOWN', reward: candidate.currentlyAvailableReward ?? null,
    competition: { observed: candidate.githubObservedCompetitors ?? null, providerTrying: candidate.observedSolvers ?? null, completeness: candidate.searchCompleteness ?? 'UNKNOWN' },
    estimatedDifficulty: candidate.effortEstimate ?? 'UNKNOWN', estimatedAISolvability: candidate.aiSolvabilityScore ?? null,
    candidatePhase3Status: candidate.candidatePhase3Status, decision: candidate.decision,
    reasons: candidate.rejectionReasons ?? [],
    actualSetupDifficulty: 'NOT_ATTEMPTED', reproduction: 'NOT_RUN', solver: 'NOT_RUN', tests: [],
    maintainerResponse: 'NOT_CONTACTED', claimResult: 'NOT_CLAIMED', acceptance: 'NOT_SUBMITTED', payment: 'NOT_REQUESTED',
    effortMinutes: null, whyWon: null, whyLost: null,
    nextAction: candidate.candidatePhase3Status === 'PHASE3_ELIGIBLE' ? 'PRIVATE_PROOF' : candidate.decision === 'REJECT' ? 'RETAIN_EVIDENCE' : 'INVESTIGATE_MISSING_EVIDENCE'
  };
}
export function operationalMemory(payload) {
  const attempted = new Set(payload.admissionAttempts.map(x => x.canonicalIssueUrl));
  const entries = payload.candidates.filter(x => attempted.has(x.canonicalIssueUrl)).map(x => learningRecord(x, payload.fetchedAt));
  return {
    date: payload.fetchedAt.slice(0,10), checkedAt: payload.fetchedAt, phase2MarketCertification: 'INCOMPLETE',
    today: { opportunitiesDiscovered: payload.funnel.unique, candidatesInvestigated: payload.admissionAttempts.length, candidatesRejected: entries.filter(x => x.decision === 'REJECT').length, deepAttempts: payload.deepAdmissionAttempts, phase3Eligible: payload.phase3EligibleCount, privateProofsAttempted: 0, humanInputRequests: 0, successfulReproductions: 0 },
    entries, lessons: [],
    next: entries.some(x => x.candidatePhase3Status === 'PHASE3_ELIGIBLE') ? ['Privately reproduce eligible candidate; stop before public action.'] : ['Investigate unresolved evidence within frozen discovery; preserve failed audits.'],
    learningPolicy: 'Use repeated observed setup, solver, maintainer and payment outcomes to inform future ranking. One failure does not create a hard rule. No payment trust uplift without observed payment.'
  };
}

// Completed execution outcomes can modestly inform ranking. Qualification
// rejections, pending work, and promised payments never count as failures/wins.
export function outcomeLearning(operations = []) {
  const latest = new Map();
  for (const operation of operations) {
    if (!operation?.opportunityId) continue;
    const previous = latest.get(operation.opportunityId);
    if (!previous || (operation.version ?? 0) > (previous.version ?? 0) ||
      ((operation.version ?? 0) === (previous.version ?? 0) &&
       (Date.parse(operation.updatedAt) || 0) > (Date.parse(previous.updatedAt) || 0))) {
      latest.set(operation.opportunityId, operation);
    }
  }
  const providers = Object.create(null);
  const reference = value => typeof value === 'string' && value.trim().length > 0;
  for (const operation of latest.values()) {
    const provider = String(operation.provider || operation.paymentTrust?.provider || 'UNKNOWN');
    const stats = providers[provider] ||= {
      observed: 0, accepted: 0, paid: 0, completedFailures: 0, completedOutcomes: 0,
      actualEffortMinutes: 0, effortSamples: 0, rankingAdjustment: 0, confidence: 'INSUFFICIENT_OUTCOMES'
    };
    stats.observed++;
    const evidence = operation.evidence || {};
    const outcome = evidence.outcome || {};
    const payment = evidence.payment || {};
    const paid = operation.status === 'PAID' && payment.confirmed === true &&
      Number.isFinite(payment.amount) && payment.amount > 0 && reference(payment.currency) && reference(payment.reference);
    const merged = ['MERGED', 'PAID'].includes(operation.status) &&
      reference(evidence.merge?.reference) && reference(evidence.merge?.commit);
    const accepted = paid || merged;
    const failed = !accepted && ['ABANDONED', 'DO_NOT_HUNT', 'REJECTED'].includes(operation.status) &&
      outcome.completed === true && outcome.result === 'FAILED' && reference(outcome.reference);
    if (accepted) stats.accepted++;
    if (paid) stats.paid++;
    if (failed) stats.completedFailures++;
    if (accepted || failed) stats.completedOutcomes++;
    const effort = reference(outcome.reference) && Number.isFinite(outcome.effortMinutes) ? outcome.effortMinutes :
      reference(evidence.effort?.reference) && Number.isFinite(evidence.effort?.minutes) ? evidence.effort.minutes : null;
    if (effort !== null && effort >= 0) { stats.actualEffortMinutes += effort; stats.effortSamples++; }
  }
  for (const stats of Object.values(providers)) {
    if (stats.completedOutcomes >= 3) {
      // Symmetric small preference; never modifies reward/payment confidence or
      // admission, and never creates a hard provider rejection.
      stats.rankingAdjustment = Math.max(-5, Math.min(5,
        Math.round(5 * (stats.accepted - stats.completedFailures) / stats.completedOutcomes)));
      stats.confidence = 'OBSERVED_OUTCOMES';
    }
  }
  return { sampleSize: latest.size, providers };
}
