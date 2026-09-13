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
