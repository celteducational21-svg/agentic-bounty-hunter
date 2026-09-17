import test from 'node:test';
import assert from 'node:assert/strict';
import { createOperation, transitionOperation } from '../src/core/operations.js';

test('return to solving invalidates previous QA and public approval, preserving history', () => {
  const at = '2026-09-17T08:00:00.000Z';
  const solution = { revision: 'frozen-revision', author: 'solver' };
  const qa = { reviewer: 'independent-reviewer', revision: solution.revision, reference: 'prior-qa',
    ...Object.fromEntries(['acceptanceCriteria','tests','regressions','explainability','prReadiness','build','lint','typecheck'].map(k => [k, 'PASS'])) };
  const publicApproval = { approved: true, role: 'OWNER', actor: 'owner', reference: 'prior-approval', action: 'PUBLIC_PR', revision: solution.revision };
  const record = { ...createOperation({ id: 'SIMULATION/review-cycle' }, { at }), status: 'CHANGES_REQUESTED',
    evidence: { solution, qa, publicApproval, proof: { setup: 'PASS', reproduction: 'PASS', focusedTests: 'PASS', reference: 'proof' },
      reservation: { confirmed: true, bountyActive: true, scopeConfirmed: true, reference: 'reservation' } } };
  const advance = (r, to, evidence = {}) => transitionOperation(r, to, { at, actor: 'worker', reason: 'SIMULATION', expectedVersion: r.version, evidence });
  const solving = advance(record, 'SOLVING');
  assert.equal(solving.evidence.qa, undefined);
  assert.equal(solving.evidence.publicApproval, undefined);
  assert.deepEqual(record.evidence.qa, qa);
  const inQA = advance(solving, 'QA');
  assert.throws(() => advance(inQA, 'READY_TO_SUBMIT'), /Independent QA/);
  const ready = advance(inQA, 'READY_TO_SUBMIT', { qa });
  assert.throws(() => advance(ready, 'SUBMITTED', { submission: { url: 'simulation://pr', revision: solution.revision } }), /owner public/);
});
