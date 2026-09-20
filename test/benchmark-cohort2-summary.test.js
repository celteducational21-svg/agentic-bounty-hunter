import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {
	REQUIRED_QA_CHECKS,
	summarizeCohort,
	writeCohortScorecard,
} from '../scripts/summarize-benchmark-cohort2.mjs';

const passingChecks = Object.fromEntries(REQUIRED_QA_CHECKS.map(key => [key, {status: 'PASS', details: `${key} passed`}]));

function json(path, value) {
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function fixture(root, id, {result, qa, audit, attemptOneAudit, submission = true, evidenceResult = false}) {
	const directory = join(root, id);
	const evidence = join(directory, 'evidence');
	mkdirSync(evidence, {recursive: true});
	json(join(directory, 'intake.json'), {
		id,
		issue: `https://example.test/${id}`,
		category: id === 'job-03' ? 'types' : 'parser',
		difficulty: 'medium',
	});
	json(join(evidenceResult ? evidence : directory, 'result.json'), result);
	json(join(evidence, 'qa.json'), qa);
	json(join(evidence, 'audit.json'), audit);
	if (attemptOneAudit) {
		mkdirSync(join(evidence, 'attempt-1'));
		json(join(evidence, 'attempt-1', 'audit.json'), attemptOneAudit);
	}
	if (submission) {
		writeFileSync(join(evidenceResult ? evidence : directory, 'submission.md'), '# Draft\n');
	}
}

test('cohort 2 summary enforces current-revision QA, audit, justified checks, repairs, and false positives', async () => {
	const temporary = mkdtempSync(join(tmpdir(), 'abh-cohort2-summary-'));
	const jobsRoot = join(temporary, 'jobs');
	mkdirSync(jobsRoot);

	try {
		fixture(jobsRoot, 'job-01', {
			evidenceResult: true,
			result: {worker: 'solver-a', author: 'solver-a', revision: 'ready', firstPass: true, setup: 'PASS', reproduction: 'PASS', rootCause: 'PASS', solution: 'PASS', proofSeconds: 2, solveSeconds: 6, regressionFailures: 0},
			qa: {reviewer: 'qa-a', revision: 'ready', verdict: 'PASS', firstPass: true, checks: passingChecks},
			audit: {comparedRevision: 'ready', verdict: 'PASS', qaFalsePositive: false},
		});

		fixture(jobsRoot, 'job-02', {
			result: {worker: 'solver-a', author: 'solver-a', revision: 'bad', setup: 'PASS', reproduction: 'PASS', rootCause: 'PASS', solution: 'PASS'},
			qa: {reviewer: 'qa-b', revision: 'bad', verdict: 'PASS', firstPass: true, checks: passingChecks},
			audit: {comparedRevision: 'bad', verdict: 'FAIL', qaFalsePositive: true, requiresRepair: true},
		});

		const repairChecks = {
			...passingChecks,
			build: {status: 'NOT_APPLICABLE', details: 'The package ships source directly and has no build step.'},
			lint: 'PASS_WITH_WARNING',
		};
		fixture(jobsRoot, 'job-03', {
			result: {worker: 'solver-b', author: 'solver-b', revision: 'repair', firstPass: false, setup: 'PASS', reproduction: 'PASS', rootCause: 'PASS_AFTER_REPAIR', solution: 'PASS_PENDING_FRESH_AUDIT', solveSeconds: 9, regressionFailures: 1},
			qa: {reviewer: 'qa-c', revision: 'repair', verdict: 'PASS', firstPass: false, checks: repairChecks},
			audit: {comparedRevision: 'old', verdict: 'FAIL', qaFalsePositive: true, requiresRepair: true},
		});

		fixture(jobsRoot, 'job-05', {
			result: {worker: 'solver-c', author: 'solver-c', revision: 'repaired', firstPass: false, setup: 'PASS', reproduction: 'PASS', rootCause: 'PASS', solution: 'PASS'},
			qa: {reviewer: 'qa-e', revision: 'repaired', verdict: 'PASS', firstPass: false, checks: passingChecks},
			audit: {comparedRevision: 'repaired', verdict: 'PASS', qaFalsePositive: false, repaired: true},
			attemptOneAudit: {comparedRevision: 'first', verdict: 'FAIL', qaFalsePositive: true, requiresRepair: true},
		});

		const unjustifiedChecks = {...passingChecks, lint: 'NOT_APPLICABLE'};
		fixture(jobsRoot, 'job-04', {
			result: {worker: 'solver-b', author: 'solver-b', revision: 'unchecked', firstPass: true, setup: 'PASS', reproduction: 'PASS', rootCause: 'PASS', solution: 'PASS'},
			qa: {reviewer: 'qa-d', revision: 'unchecked', verdict: 'PASS', firstPass: true, checks: unjustifiedChecks},
			audit: {comparedRevision: 'unchecked', verdict: 'PASS', qaFalsePositive: false},
		});

		const first = await summarizeCohort(jobsRoot);
		const second = await summarizeCohort(jobsRoot);
		assert.deepEqual(first, second, 'same artifacts must produce byte-stable data');

		assert.deepEqual(first.jobs.map(job => job.id), ['job-01', 'job-02', 'job-03', 'job-04', 'job-05']);
		assert.equal(first.jobs[0].ready, true);
		assert.equal(first.jobs[0].validatedFirstPassQa, true);
		assert.equal(first.jobs[1].validatedFirstPassQa, false, 'audit false-positive invalidates first-pass QA');
		assert.equal(first.jobs[1].failed, true);
		assert.deepEqual(first.jobs[1].failureReasons, ['currentAudit']);
		assert.equal(first.jobs[2].repairSuccess, true);
		assert.equal(first.jobs[2].correctDraft, true);
		assert.equal(first.jobs[2].ready, false, 'stale failed audit cannot make repaired revision READY');
		assert.equal(first.jobs[2].failed, false, 'fresh QA validates the repaired draft pending re-audit');
		assert.equal(first.jobs[3].qaChecksPass, false);
		assert.deepEqual(first.jobs[3].qaCheckFailures, ['lint']);
		assert.equal(first.jobs[3].ready, false);
		assert.deepEqual(first.jobs[3].failureReasons, []);
		assert.equal(first.jobs[4].auditFalsePositive, true, 'preserved attempt-1 audit remains part of cohort history');
		assert.equal(first.jobs[4].ready, true);

		assert.deepEqual(first.overall, {
			jobs: 5,
			attempted: 5,
			setupSuccess: 5,
			reproductionSuccess: 5,
			rootCauseCorrect: 3,
			solutionStatusSuccess: 5,
			solutionCorrect: 3,
			validatedFirstPassQaSuccess: 1,
			repairSuccess: 2,
			auditQaFalsePositives: 3,
			strictReady: 2,
			correctDrafts: 4,
			failures: 1,
			proofEffort: {measuredJobs: 1, totalSeconds: 2, averageSeconds: 2},
			solveEffort: {measuredJobs: 2, totalSeconds: 15, averageSeconds: 7.5},
			regressionFailuresObserved: 1,
			jobsWithoutRegressionFailureMeasurement: 3,
		});
		assert.equal(first.byWorker['solver-a'].strictReady, 1);
		assert.equal(first.byWorker['solver-b'].repairSuccess, 1);
		assert.equal(first.byCategory.types.correctDrafts, 1);

		const {output} = await writeCohortScorecard(jobsRoot);
		assert.equal(output, join(temporary, 'scorecard.json'));
		assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), first);
	} finally {
		rmSync(temporary, {recursive: true, force: true});
	}
});
