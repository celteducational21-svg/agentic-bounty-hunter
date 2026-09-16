import test from 'node:test';
import assert from 'node:assert/strict';
import { createOperation, transitionOperation, summarizeOperations, OPERATION_STATES } from '../src/core/operations.js';
const at = '2026-09-16T12:00:00.000Z';
const initial = () => createOperation({ opportunityId: 'acme/repo#1', title: 'Fix SDK' }, { at });
const advance = (r, to, evidence = {}, extra = {}) => transitionOperation(r, to, { at, actor: 'worker', reason: 'Verified evidence', expectedVersion: r.version, evidence, ...extra });
const eligibility = Object.fromEntries(['issueOpen','repositoryAccessible','credibleReward','scopeUnderstandable','competitionNotHopeless','noHardBlocker'].map(k => [k,true]));
const proof = { setup: 'PASS', reproduction: 'PASS', focusedTests: 'PASS', reference: 'docs/proof.md' };
const reservation = { confirmed: true, bountyActive: true, scopeConfirmed: true, reference: 'https://github.com/acme/repo/issues/1#issuecomment-123' };
const solution = { revision: 'abc123', author: 'solver' };
const qa = { reviewer: 'independent-qa', revision: 'abc123', reference: 'docs/qa.md', ...Object.fromEntries(['acceptanceCriteria','tests','regressions','explainability','prReadiness','build','lint','typecheck'].map(k => [k,'PASS'])) };
function privateProof() { return advance(advance(advance(initial(), 'INVESTIGATING'), 'PHASE3_ELIGIBLE', { eligibility }), 'PRIVATE_PROOF'); }
function solving() { return advance(advance(privateProof(), 'LOCKED', { proof, reservation }), 'SOLVING'); }
function ready() { return advance(advance(solving(), 'QA', { solution }), 'READY_TO_SUBMIT', { qa }); }
test('all required states are explicit and unknown does not reject', () => {
 assert.equal(OPERATION_STATES.length, 18);
 const r = advance(initial(), 'INVESTIGATING');
 assert.throws(() => advance(r, 'PHASE3_ELIGIBLE', { eligibility: { ...eligibility, credibleReward: 'UNKNOWN' } }), /credibleReward/);
 assert.throws(() => advance(r, 'REJECTED', { rejection: { code: 'UNKNOWN_COMPETITION', reference: 'scan' } }), /unknown means investigate/);
});
test('private eligibility does not require escrow, full market certification or known effort', () => {
 assert.equal(privateProof().status, 'PRIVATE_PROOF');
});
test('events append without mutating input or retaining caller-owned mutable evidence', () => {
 const start = initial(); const evidence = { note: { text: 'checked' } }; const r = advance(start, 'INVESTIGATING', evidence);
 evidence.note.text = 'changed';
 assert.equal(start.transitions.length, 1); assert.equal(r.transitions.length, 2); assert.equal(r.transitions[1].evidence.note.text, 'checked');
 r.transitions[0].reason = 'changed'; assert.equal(start.transitions[0].reason, 'Opportunity discovered');
});
test('concurrent stale versions, duplicate event IDs and backdated transitions fail', () => {
 assert.throws(() => advance(initial(), 'INVESTIGATING', {}, { expectedVersion: 0 }), /version conflict/);
 assert.throws(() => advance(initial(), 'INVESTIGATING', {}, { eventId: 'acme/repo#1:1' }), /Duplicate/);
 assert.throws(() => advance(initial(), 'INVESTIGATING', {}, { at: '2026-09-15T12:00:00Z' }), /precede/);
});
test('proof and reservation are required before solving', () => {
 assert.throws(() => advance(privateProof(), 'WAITING_FOR_MAINTAINER'), /proof evidence/);
 const r = advance(privateProof(), 'WAITING_FOR_MAINTAINER', { proof });
 assert.throws(() => advance(r, 'LOCKED'), /reservation/);
 assert.equal(advance(advance(r, 'LOCKED', { reservation }), 'SOLVING').status, 'SOLVING');
});
test('human gate preserves resume point without blocking another opportunity', () => {
 const r = advance(privateProof(), 'NEEDS_HUMAN_INPUT', { humanAction: { action: 'Owner to connect API account' } });
 assert.equal(r.resumeStatus, 'PRIVATE_PROOF'); assert.equal(advance(r, 'PRIVATE_PROOF').humanActionRequired, null);
 assert.throws(() => advance(r, 'SOLVING', { proof, reservation }), /Invalid transition/);
 assert.equal(advance(initial(), 'INVESTIGATING').status, 'INVESTIGATING');
});
test('independent QA cannot be performed by solver or on stale revision', () => {
 const r = advance(solving(), 'QA', { solution });
 assert.throws(() => advance(r, 'READY_TO_SUBMIT', { qa: { ...qa, reviewer: 'solver' } }), /Independent/);
 assert.throws(() => advance(r, 'READY_TO_SUBMIT', { qa: { ...qa, revision: 'old' } }), /current solution/);
 assert.throws(() => advance(r, 'READY_TO_SUBMIT', { qa: { ...qa, tests: 'FAIL' } }), /QA check/);
 assert.equal(advance(r, 'READY_TO_SUBMIT', { qa }).humanActionRequired.revision, 'abc123');
});
test('nonapplicable QA tooling needs an explanation', () => {
 const r = advance(solving(), 'QA', { solution });
 assert.throws(() => advance(r, 'READY_TO_SUBMIT', { qa: { ...qa, typecheck: 'NOT_APPLICABLE' } }), /typecheck/);
 assert.equal(advance(r, 'READY_TO_SUBMIT', { qa: { ...qa, typecheck: 'NOT_APPLICABLE', notApplicableReasons: { typecheck: 'Pure Python repository without configured type checker' } } }).status, 'READY_TO_SUBMIT');
});
test('public submission requires explicit owner approval matching reviewed revision', () => {
 const r = ready(); const submission = { url: 'https://github.com/acme/repo/pull/2', revision: 'abc123' };
 assert.throws(() => advance(r, 'SUBMITTED', { submission }), /owner public/);
 const publicApproval = { approved: true, role: 'OWNER', actor: 'owner', reference: 'owner approval record', action: 'PUBLIC_PR', revision: 'old' };
 assert.throws(() => advance(r, 'SUBMITTED', { submission, publicApproval }), /exact public PR/);
 const submitted = advance(r, 'SUBMITTED', { submission, publicApproval: { ...publicApproval, revision: 'abc123' } });
 const changes = advance(submitted, 'CHANGES_REQUESTED', { review: { reference: 'review URL' } });
 const repeat = advance(advance(changes, 'SOLVING'), 'QA', { solution: { ...solution, revision: 'new' } });
 assert.throws(() => advance(repeat, 'READY_TO_SUBMIT'), /current solution/);
});
test('payment requires positive received payment evidence after merge', () => {
 const r = advance(ready(), 'SUBMITTED', { publicApproval: { approved: true, role: 'OWNER', actor: 'owner', reference: 'approval', action: 'PUBLIC_PR', revision: 'abc123' }, submission: { url: 'pr URL', revision: 'abc123' } });
 const merged = advance(r, 'MERGED', { merge: { reference: 'merge URL', commit: 'def456' } });
 assert.throws(() => advance(merged, 'PAID', { payment: { confirmed: false, amount: 100, currency: 'USD', reference: 'promise' } }), /payment evidence/);
 const paid = advance(merged, 'PAID', { payment: { confirmed: true, amount: 100, currency: 'USD', reference: 'receipt' } });
 assert.throws(() => advance(paid, 'SOLVING'), /Terminal/);
});
test('hard reject retains evidence and dashboard summarizes all states including human gates', () => {
 const rejected = advance(initial(), 'REJECTED', { rejection: { code: 'CLOSED_COMPLETED', reference: 'issue URL' } });
 const report = summarizeOperations([rejected, ready()]);
 assert.equal(report.counts.REJECTED, 1); assert.equal(report.counts.READY_TO_SUBMIT, 1); assert.equal(report.counts.PAID, 0); assert.equal(report.humanActions.length, 1);
});
test('trusted CLI writes one atomic local transition and refuses stale replay', async () => {
 const { mkdtemp, writeFile, readFile, rm } = await import('node:fs/promises');
 const { tmpdir } = await import('node:os');
 const { join } = await import('node:path');
 const { execFileSync } = await import('node:child_process');
 const directory = await mkdtemp(join(tmpdir(), 'abh-operations-'));
 try {
  const stateFile = join(directory, 'state.json');
  await writeFile(stateFile, JSON.stringify({ schemaVersion: 1, operations: [initial()] }));
  const args = ['scripts/transition-operation.mjs', '--state-file', stateFile, '--id', 'acme/repo#1', '--to', 'INVESTIGATING', '--actor', 'trusted-session', '--reason', 'Inspect live task', '--expected-version', '1', '--at', at];
  const response = JSON.parse(execFileSync(process.execPath, args, { encoding: 'utf8' }));
  assert.equal(response.persistence, 'LOCAL_ONLY');
  const persisted = JSON.parse(await readFile(stateFile, 'utf8'));
  assert.equal(persisted.operations[0].status, 'INVESTIGATING'); assert.equal(persisted.operations[0].transitions.length, 2);
  assert.throws(() => execFileSync(process.execPath, args, { stdio: 'pipe' }), /Command failed/);
  assert.deepEqual(JSON.parse(await readFile(stateFile, 'utf8')), persisted);
 } finally { await rm(directory, { recursive: true, force: true }); }
});
