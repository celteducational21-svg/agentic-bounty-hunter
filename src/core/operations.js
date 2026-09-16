// Operational records are immutable values. The caller must durably append each
// returned event before replacing the current projection (use expectedVersion).
export const OPERATION_STATES = Object.freeze([
  'DISCOVERED', 'INVESTIGATING', 'PHASE3_ELIGIBLE', 'PRIVATE_PROOF',
  'WAITING_FOR_MAINTAINER', 'LOCKED', 'CLAIMED', 'SOLVING', 'QA',
  'READY_TO_SUBMIT', 'SUBMITTED', 'CHANGES_REQUESTED', 'MERGED', 'PAID',
  'REJECTED', 'ABANDONED', 'DO_NOT_HUNT', 'NEEDS_HUMAN_INPUT'
]);
const edges = {
  DISCOVERED: ['INVESTIGATING'], INVESTIGATING: ['PHASE3_ELIGIBLE'],
  PHASE3_ELIGIBLE: ['PRIVATE_PROOF', 'INVESTIGATING'],
  PRIVATE_PROOF: ['WAITING_FOR_MAINTAINER', 'LOCKED', 'CLAIMED', 'INVESTIGATING'],
  WAITING_FOR_MAINTAINER: ['LOCKED', 'CLAIMED', 'INVESTIGATING'],
  LOCKED: ['SOLVING'], CLAIMED: ['SOLVING'], SOLVING: ['QA'],
  QA: ['SOLVING', 'READY_TO_SUBMIT'], READY_TO_SUBMIT: ['SOLVING', 'SUBMITTED'],
  SUBMITTED: ['CHANGES_REQUESTED', 'MERGED'], CHANGES_REQUESTED: ['SOLVING'],
  MERGED: ['PAID'], PAID: [], REJECTED: [], ABANDONED: [], DO_NOT_HUNT: []
};
const terminal = new Set(['PAID', 'REJECTED', 'ABANDONED', 'DO_NOT_HUNT']);
const hardReasons = new Set(['FAKE_SCAM', 'CLOSED_COMPLETED', 'DELETED_SOURCE', 'NO_REAL_TASK_OR_BOUNTY', 'ALREADY_SOLVED', 'INACCESSIBLE_REQUIREMENT', 'IRRELEVANT']);
const actions = {
  DISCOVERED: 'Investigate task and reward evidence', INVESTIGATING: 'Resolve missing practical evidence',
  PHASE3_ELIGIBLE: 'Run private reproduction and feasibility proof', PRIVATE_PROOF: 'Record setup, reproduction and focused tests',
  WAITING_FOR_MAINTAINER: 'Monitor existing reservation thread; do not duplicate comments',
  LOCKED: 'Start private implementation', CLAIMED: 'Start private implementation', SOLVING: 'Implement and test acceptance criteria',
  QA: 'Obtain independent verification of the current revision', READY_TO_SUBMIT: 'Request owner approval for exact public submission',
  SUBMITTED: 'Monitor maintainer review', CHANGES_REQUESTED: 'Address review and repeat independent QA',
  MERGED: 'Track payment evidence', PAID: 'Record outcome and lessons', REJECTED: 'Retain rejection evidence',
  ABANDONED: 'Retain outcome and lessons', DO_NOT_HUNT: 'Retain exclusion reason', NEEDS_HUMAN_INPUT: 'Resolve recorded human action'
};
const requireThat = (condition, message) => { if (!condition) throw new Error(message); };
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const clone = value => structuredClone(value);
function stamp(at, actor) {
  requireThat(nonempty(at) && Number.isFinite(Date.parse(at)), 'Valid at timestamp required');
  requireThat(nonempty(actor), 'Actor identity required');
}
export function createOperation(candidate, { at, actor = 'scout' } = {}) {
  stamp(at, actor);
  const opportunityId = candidate.opportunityId || candidate.url || candidate.id;
  requireThat(nonempty(opportunityId), 'Opportunity identity required');
  const record = { ...clone(candidate), opportunityId, status: 'DISCOVERED', version: 1,
    evidence: {}, humanActionRequired: null, nextAction: actions.DISCOVERED, createdAt: at, updatedAt: at,
    transitions: [{ id: `${opportunityId}:1`, version: 1, from: null, to: 'DISCOVERED', at, actor,
      reason: 'Opportunity discovered', evidence: {} }] };
  return record;
}
function gates(to, evidence, actor) {
  if (to === 'PHASE3_ELIGIBLE') {
    const eligibility = evidence.eligibility || {};
    for (const key of ['issueOpen', 'repositoryAccessible', 'credibleReward', 'scopeUnderstandable', 'competitionNotHopeless', 'noHardBlocker'])
      requireThat(eligibility[key] === true, `Eligibility evidence missing: ${key}`);
  }
  if (['WAITING_FOR_MAINTAINER', 'LOCKED', 'CLAIMED', 'SOLVING'].includes(to)) {
    const proof = evidence.proof || {};
    requireThat(['setup', 'reproduction', 'focusedTests'].every(key => proof[key] === 'PASS') && nonempty(proof.reference), 'Successful private proof evidence required');
  }
  if (['LOCKED', 'CLAIMED', 'SOLVING'].includes(to)) {
    const reservation = evidence.reservation || {};
    requireThat(reservation.confirmed === true && reservation.bountyActive === true && reservation.scopeConfirmed === true && nonempty(reservation.reference), 'Confirmed reservation and scope evidence required');
  }
  if (to === 'QA' || to === 'READY_TO_SUBMIT' || to === 'SUBMITTED') {
    requireThat(nonempty(evidence.solution?.revision) && nonempty(evidence.solution?.author), 'Solution revision and author required');
  }
  if (to === 'READY_TO_SUBMIT' || to === 'SUBMITTED') {
    const qa = evidence.qa || {};
    requireThat(nonempty(qa.reviewer) && qa.reviewer !== evidence.solution.author, 'Independent QA reviewer required');
    requireThat(qa.revision === evidence.solution.revision && nonempty(qa.reference), 'QA must verify the current solution revision');
    for (const key of ['acceptanceCriteria', 'tests', 'regressions', 'explainability', 'prReadiness'])
      requireThat(qa[key] === 'PASS', `QA check missing: ${key}`);
    for (const key of ['build', 'lint', 'typecheck'])
      requireThat(qa[key] === 'PASS' || (qa[key] === 'NOT_APPLICABLE' && nonempty(qa.notApplicableReasons?.[key])), `QA check missing: ${key}`);
  }
  if (to === 'SUBMITTED') {
    const approval = evidence.publicApproval || {};
    requireThat(approval.approved === true && approval.role === 'OWNER' && nonempty(approval.actor) && nonempty(approval.reference), 'Explicit owner public submission approval required');
    requireThat(approval.action === 'PUBLIC_PR' && approval.revision === evidence.solution.revision, 'Approval must cover exact public PR revision');
    requireThat(nonempty(evidence.submission?.url) && evidence.submission.revision === evidence.solution.revision, 'Actual submission URL and matching revision required');
  }
  if (to === 'CHANGES_REQUESTED') requireThat(nonempty(evidence.review?.reference), 'Maintainer review evidence required');
  if (to === 'MERGED') requireThat(nonempty(evidence.merge?.reference) && nonempty(evidence.merge?.commit), 'Merge evidence required');
  if (to === 'PAID') requireThat(evidence.payment?.confirmed === true && evidence.payment.amount > 0 && nonempty(evidence.payment.currency) && nonempty(evidence.payment.reference), 'Confirmed payment evidence required');
  if (to === 'REJECTED') requireThat(hardReasons.has(evidence.rejection?.code) && nonempty(evidence.rejection?.reference), 'Hard rejection evidence required; unknown means investigate');
  if (to === 'NEEDS_HUMAN_INPUT') requireThat(nonempty(evidence.humanAction?.action), 'Specific human action required');
}
export function transitionOperation(record, to, { at, actor, reason, evidence = {}, eventId, expectedVersion } = {}) {
  stamp(at, actor);
  requireThat(OPERATION_STATES.includes(to), 'Unknown operational state');
  requireThat(nonempty(reason), 'Transition reason required');
  requireThat(expectedVersion === record.version, 'Operation version conflict');
  requireThat(Date.parse(at) >= Date.parse(record.updatedAt), 'Transition timestamp cannot precede latest activity');
  requireThat(!terminal.has(record.status), 'Terminal operation cannot advance');
  const from = record.status === 'NEEDS_HUMAN_INPUT' ? record.resumeStatus : record.status;
  const resume = record.status === 'NEEDS_HUMAN_INPUT' && to === from;
  const exception = ['NEEDS_HUMAN_INPUT', 'REJECTED', 'ABANDONED', 'DO_NOT_HUNT'].includes(to);
  requireThat(record.status !== to && (resume || exception || edges[from]?.includes(to)), `Invalid transition: ${record.status} -> ${to}`);
  const mergedEvidence = { ...clone(record.evidence), ...clone(evidence) };
  gates(to, mergedEvidence, actor);
  const version = record.version + 1;
  const id = eventId || `${record.opportunityId}:${version}`;
  requireThat(!record.transitions.some(event => event.id === id), 'Duplicate transition event');
  const event = { id, version, from: record.status, to, at, actor, reason, evidence: clone(evidence) };
  return { ...clone(record), status: to, version, evidence: mergedEvidence, updatedAt: at,
    resumeStatus: to === 'NEEDS_HUMAN_INPUT' ? from : null,
    humanActionRequired: to === 'NEEDS_HUMAN_INPUT' ? clone(mergedEvidence.humanAction) : to === 'READY_TO_SUBMIT' ? { action: 'Approve exact public PR submission', revision: mergedEvidence.solution.revision } : null,
    nextAction: actions[to], transitions: [...clone(record.transitions), event] };
}
export function summarizeOperations(records) {
  const counts = Object.fromEntries(OPERATION_STATES.map(state => [state, 0]));
  for (const record of records) if (record.status in counts) counts[record.status]++;
  return { total: records.length, counts, humanActions: records.filter(record => record.humanActionRequired).map(record => ({ opportunityId: record.opportunityId, ...clone(record.humanActionRequired) })) };
}
