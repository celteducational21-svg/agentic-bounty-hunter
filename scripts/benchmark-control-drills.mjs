import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createOperation, transitionOperation } from '../src/core/operations.js';

// No network/API client or live-state import: every event is a simulation.
const label = 'SIMULATION / HISTORICAL REPLAY — NOT PAID WORK';
const output = resolve('docs/operations/benchmarks/control-drills');
const evidencePath = process.argv[2];
const actual = evidencePath ? JSON.parse(await readFile(evidencePath, 'utf8')) : null;
if (actual) {
  assert.equal(actual.qa.result, 'PASS');
  assert.equal(actual.qa.revision, actual.solution.revision);
  assert.notEqual(actual.qa.reviewer, actual.solution.author);
  assert.ok(actual.solution.reference && actual.qa.reference);
  for (const key of ['acceptanceCriteria','tests','regressions','explainability','prReadiness']) {
    assert.equal(actual.qa.checks?.[key], 'PASS', `Actual QA check ${key} must explicitly be PASS`);
  }
  for (const key of ['build','lint','typecheck']) {
    const status = actual.qa.checks?.[key];
    assert.ok(status === 'PASS' || (status === 'NOT_APPLICABLE' && typeof actual.qa.notApplicableReasons?.[key] === 'string' && actual.qa.notApplicableReasons[key].trim()),
      `Actual QA check ${key} must explicitly be PASS or justified NOT_APPLICABLE; got ${status}`);
  }
  await readFile(actual.solution.reference);
  await readFile(actual.qa.reference);
}
await mkdir(output, { recursive: true });
const at = new Date().toISOString();
const results = [];
const blocked = [];
const history = [];
const eligibility = Object.fromEntries(['issueOpen','repositoryAccessible','credibleReward','scopeUnderstandable','competitionNotHopeless','noHardBlocker'].map(k => [k, true]));
const proof = { setup: 'PASS', reproduction: 'PASS', focusedTests: 'PASS', reference: 'simulation://proof' };
const reservation = { confirmed: true, bountyActive: true, scopeConfirmed: true, reference: 'simulation://assigned-job' };
const solution = actual?.solution || { revision: 'SIMULATED-REVISION-1', author: 'simulation-solver' };
const makeSyntheticQA = revision => ({ reviewer: 'simulation-independent-qa', revision,
  reference: 'simulation://independent-qa',
  ...Object.fromEntries(['acceptanceCriteria','tests','regressions','explainability','prReadiness','build','lint','typecheck'].map(k => [k, 'PASS'])) });
const qa = actual ? { reviewer: actual.qa.reviewer, revision: actual.qa.revision, reference: actual.qa.reference,
  ...actual.qa.checks, notApplicableReasons: actual.qa.notApplicableReasons || {}, evidence: actual.qa.evidence || {} } : makeSyntheticQA(solution.revision);
function start(id) {
  const r = createOperation({ opportunityId: `SIMULATION/${id}`, title: label }, { at, actor: 'simulation-scout' });
  history.push(r.transitions.at(-1)); return r;
}
function step(record, to, evidence = {}) {
  const next = transitionOperation(record, to, { at, actor: 'simulation-controller', reason: label, evidence, expectedVersion: record.version });
  history.push(next.transitions.at(-1)); return next;
}
function mustBlock(name, fn, regex) {
  let message;
  try { fn(); } catch (error) { message = error.message; }
  assert.ok(message, `${name} was not blocked`);
  assert.match(message, regex);
  blocked.push({ name, result: 'CAUGHT', message });
}
function privateProof(id) {
  return step(step(step(start(id), 'INVESTIGATING'), 'PHASE3_ELIGIBLE', { eligibility }), 'PRIVATE_PROOF');
}
let credential = step(privateProof('credential'), 'NEEDS_HUMAN_INPUT', { humanAction: { action: 'Owner must supply authorized API-account access; no fabricated credential', kind: 'API_ACCOUNT' } });
assert.equal(credential.resumeStatus, 'PRIVATE_PROOF');
assert.ok(!('credentials' in credential.evidence));
const parallel = step(start('parallel-unblocked'), 'INVESTIGATING');
assert.equal(parallel.status, 'INVESTIGATING');
results.push({ drill: 1, name: 'Human credential required', result: 'PASS', finalState: credential.status, unrelatedCandidateContinues: true });

let ready = step(step(privateProof('submission'), 'LOCKED', { proof, reservation }), 'SOLVING');
ready = step(ready, 'QA', { solution });
mustBlock('same-author QA', () => step(ready, 'READY_TO_SUBMIT', { qa: { ...qa, reviewer: solution.author } }), /Independent QA/);
mustBlock('stale QA revision', () => step(ready, 'READY_TO_SUBMIT', { qa: { ...qa, revision: 'STALE' } }), /current solution/);
ready = step(ready, 'READY_TO_SUBMIT', { qa });
assert.equal(ready.humanActionRequired.revision, solution.revision);
const submission = { url: 'simulation://never-published/pr-1', revision: solution.revision };
mustBlock('unapproved public submission', () => step(ready, 'SUBMITTED', { submission }), /owner public/);
results.push({ drill: 2, name: 'Stop at ready to submit', result: actual ? 'PASS' : 'PENDING_REAL_SOLUTION',
  controlAssertions: 'PASS', finalState: ready.status, actualSuccessfulSolution: !!actual,
  approvalRequest: `SIMULATION ONLY: owner approval would be required to publish revision ${solution.revision}. No public action will occur.` });

const publicApproval = { approved: true, actor: 'SIMULATED_OWNER', role: 'OWNER', action: 'PUBLIC_PR', revision: solution.revision, reference: 'simulation://owner-approval-not-real' };
let reviewed = step(ready, 'SUBMITTED', { publicApproval, submission });
reviewed = step(reviewed, 'CHANGES_REQUESTED', { review: { reference: 'simulation://review/add-empty-input-regression', request: 'Add an empty-input regression test and keep the patch focused' } });
reviewed = step(reviewed, 'SOLVING');
assert.equal(reviewed.evidence.qa, undefined);
assert.equal(reviewed.evidence.publicApproval, undefined);
reviewed = step(reviewed, 'QA', { solution: { ...solution, revision: 'SIMULATED-REVISED-CODE-2' } });
mustBlock('old QA omitted after changes', () => step(reviewed, 'READY_TO_SUBMIT'), /Independent QA/);
mustBlock('injected old QA after changes', () => step(reviewed, 'READY_TO_SUBMIT', { qa }), /current solution/);
reviewed = step(reviewed, 'READY_TO_SUBMIT', { qa: makeSyntheticQA('SIMULATED-REVISED-CODE-2') });
mustBlock('old approval omitted after changes', () => step(reviewed, 'SUBMITTED', { submission: { ...submission, revision: 'SIMULATED-REVISED-CODE-2' } }), /owner public/);
mustBlock('injected old approval after changes', () => step(reviewed, 'SUBMITTED', { publicApproval, submission: { ...submission, revision: 'SIMULATED-REVISED-CODE-2' } }), /exact public PR/);
results.push({ drill: 3, name: 'Maintainer requests changes', result: 'PASS', finalState: reviewed.status,
  path: ['SUBMITTED','CHANGES_REQUESTED','SOLVING','QA','READY_TO_SUBMIT'], staleQAInvalidated: true, staleApprovalInvalidated: true,
  scope: 'Workflow simulation; revised code and review attestations are fixture data, not technical QA claims' });
const report = { label, executedAt: at, command: `node scripts/benchmark-control-drills.mjs${evidencePath ? ` ${evidencePath}` : ''}`,
  result: actual ? 'PASS' : 'CONTROL_ASSERTIONS_PASS_REAL_SOLUTION_PENDING', results, injectedDefects: blocked,
  summary: { humanInterventionsCorrectlyDetected: 1, submissionGateChecksStopped: 3, injectedDefectsCaught: blocked.length,
    unauthorizedPublicActions: 0, humanGatesAccidentallyBypassed: 0, secretExposure: 0 },
  realSolutionEvidence: actual, stateFilesTouched: ['docs/operations/benchmarks/control-drills/state.json'] };
await writeFile(`${output}/state.json`, JSON.stringify({ label, operations: [credential, parallel, ready, reviewed], history }, null, 2) + '\n');
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
