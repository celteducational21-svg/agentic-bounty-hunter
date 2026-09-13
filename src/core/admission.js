// Private investigation is distinct from market certification and public HUNT.
export function phase3Admission(issue, context, source, provider, result) {
  const checked = step => result.enrichment.steps.some(x => x.step === step && x.status === 'COMPLETE');
  const gates = {
    canonicalReachable: source.ok === true,
    issueOpen: issue.state === 'open',
    repositoryAccessible: context.repo?.private === false,
    repositoryActive: context.repo?.archived === false,
    exactReward: result.currentlyAvailableReward?.amount > 0 && (provider ? provider.listingVerified && provider.canonicalIssueUrl === issue.url : result.canonicalIssueReward?.amount > 0),
    paymentUnderstood: provider ? provider.listingVerified && provider.fundingStatus === 'PAY_ON_ACCEPTANCE' : result.paymentTrigger !== 'UNKNOWN' && ['PARTIAL','STRONG','VERIFIED'].includes(result.paymentConfidence),
    noCompletedSolution: checked('COMPETITION_CHECKED') && result.claimStatus !== 'COMPLETED_SOLUTION',
    competitionNotHopeless: (result.existingSolutionPRs?.filter(x => x.relation === 'OPEN_SUBMISSION').length ?? 0) < 10 && (provider?.claimingSolvers ?? 0) < 10 && (provider?.tryingSolvers ?? 0) < 20,
    softwareScope: result.acceptanceCriteria.criteria.length > 0 && !/social|promotion|security research|penetration test/i.test(issue.title),
    repositoryInvestigated: checked('REPO_CHECKED'),
    noHardBlocker: !result.dependencyEvidence.some(x => x.provisioning === 'HARD_BLOCKER' && !x.resolved),
    noRejection: result.rejectionReasons.length === 0
  };
  return { state: result.rejectionReasons.length ? 'REJECTED' : Object.values(gates).every(Boolean) ? 'PHASE3_ELIGIBLE' : 'INVESTIGATE', gates, missingEvidence: Object.entries(gates).filter(([,v]) => !v).map(([k]) => k), publicActionAuthorized: false,
    operationalSetup: provider?.provider === 'Opire' ? { status: 'HUMAN_SETUP_REQUIRED', verified: false, requiredBefore: 'CLAIM_OR_PAYMENT', detail: 'Confirm owner Opire login/profile and Stripe payout setup before claiming or payment; does not block private proof.' } : null };
}
