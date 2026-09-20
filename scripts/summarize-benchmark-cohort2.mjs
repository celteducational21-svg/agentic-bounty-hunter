import {readFile, readdir, writeFile} from 'node:fs/promises';
import {relative, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// Offline benchmark reporting only. This module never imports or changes live state.
export const REQUIRED_QA_CHECKS = [
	'acceptanceCriteria',
	'tests',
	'regressions',
	'explainability',
	'prReadiness',
	'build',
	'lint',
	'typecheck',
];

const passLike = value => typeof value === 'string' && /^PASS(?:_|$)/.test(value);

async function readJson(path) {
	try {
		return JSON.parse(await readFile(path, 'utf8'));
	} catch (error) {
		if (error.code === 'ENOENT') {
			return null;
		}

		throw error;
	}
}

async function readFirstJson(paths) {
	for (const path of paths) {
		const value = await readJson(path);
		if (value !== null) {
			return {value, path};
		}
	}

	return {value: null, path: null};
}

async function readFirstText(paths) {
	for (const path of paths) {
		try {
			return {value: await readFile(path, 'utf8'), path};
		} catch (error) {
			if (error.code !== 'ENOENT') {
				throw error;
			}
		}
	}

	return {value: '', path: null};
}

function checkStatus(check) {
	return typeof check === 'string' ? check : check?.status;
}

function checkExplanation(qa, key, check) {
	if (typeof check === 'object' && typeof check?.details === 'string' && check.details.trim()) {
		return check.details.trim();
	}

	const reason = qa?.notApplicableReasons?.[key];
	return typeof reason === 'string' ? reason.trim() : '';
}

export function evaluateQaChecks(qa) {
	const statuses = {};
	const failures = [];

	for (const key of REQUIRED_QA_CHECKS) {
		const check = qa?.checks?.[key];
		const status = checkStatus(check) ?? 'MISSING';
		statuses[key] = status;

		if (passLike(status)) {
			continue;
		}

		if (status === 'NOT_APPLICABLE' && checkExplanation(qa, key, check)) {
			continue;
		}

		failures.push(key);
	}

	return {pass: failures.length === 0, statuses, failures};
}

function numberFrom(...values) {
	return values.find(value => typeof value === 'number' && Number.isFinite(value)) ?? null;
}

function naturalJobSort(left, right) {
	return Number(left.slice(4)) - Number(right.slice(4));
}

async function readJob(jobsRoot, id) {
	const directory = resolve(jobsRoot, id);
	const intakeSource = await readFirstJson([resolve(directory, 'intake.json')]);
	const resultSource = await readFirstJson([
		resolve(directory, 'evidence/result.json'),
		resolve(directory, 'result.json'),
	]);
	const qaSource = await readFirstJson([
		resolve(directory, 'evidence/qa.json'),
		resolve(directory, 'qa.json'),
	]);
	const auditSource = await readFirstJson([
		resolve(directory, 'evidence/audit.json'),
		resolve(directory, 'audit.json'),
	]);
	const attemptOneAuditSource = await readFirstJson([
		resolve(directory, 'evidence/attempt-1/audit.json'),
	]);
	const submissionSource = await readFirstText([
		resolve(directory, 'evidence/submission.md'),
		resolve(directory, 'submission.md'),
	]);

	const intake = intakeSource.value;
	const result = resultSource.value;
	const qa = qaSource.value;
	const audit = auditSource.value;
	const attemptOneAudit = attemptOneAuditSource.value;
	const attempted = result !== null;
	const revision = result?.revision ?? null;
	const worker = result?.worker ?? result?.author ?? 'NOT_RUN';
	const qaChecks = evaluateQaChecks(qa);
	const qaRevisionMatches = Boolean(revision && qa?.revision === revision);
	const qaIndependent = Boolean(qa?.reviewer && qa.reviewer !== result?.author && qa.reviewer !== worker);
	const currentQaPass = qa?.verdict === 'PASS' && qaRevisionMatches && qaIndependent;
	const auditRevisionMatches = Boolean(revision && audit?.comparedRevision === revision);
	const currentAuditPass = audit?.verdict === 'PASS' && auditRevisionMatches;
	const currentAuditFail = audit?.verdict === 'FAIL' && auditRevisionMatches;
	const auditFalsePositive = audit?.qaFalsePositive === true || attemptOneAudit?.qaFalsePositive === true;
	const resultMarksRepair = result?.firstPass === false;
	const solutionStatusPass = passLike(result?.solution);
	const rootCauseCorrect = passLike(result?.rootCause) && currentAuditPass;
	const solutionCorrect = solutionStatusPass && currentQaPass && currentAuditPass;
	const submission = submissionSource.value.trim().length > 0;
	const validatedFirstPassQa = currentQaPass
		&& qaChecks.pass
		&& qa?.firstPass === true
		&& result?.firstPass !== false
		&& !auditFalsePositive;
	const repairSuccess = resultMarksRepair && currentQaPass && solutionStatusPass;
	const correctDraft = solutionStatusPass && currentQaPass && !currentAuditFail && submission;
	const ready = solutionCorrect && qaChecks.pass && submission;

	const failureReasons = [];
	if (attempted && !passLike(result?.setup)) failureReasons.push('setup');
	if (attempted && !passLike(result?.reproduction)) failureReasons.push('reproduction');
	if (attempted && !passLike(result?.rootCause)) failureReasons.push('rootCause');
	if (attempted && !solutionStatusPass) failureReasons.push('solution');
	if (attempted && !currentQaPass) failureReasons.push('currentQa');
	if (currentAuditFail) failureReasons.push('currentAudit');

	return {
		id,
		issue: intake?.issue ?? null,
		category: intake?.category ?? 'UNSPECIFIED',
		difficulty: intake?.difficulty ?? null,
		worker,
		attempted,
		setup: result?.setup ?? 'NOT_RUN',
		reproduction: result?.reproduction ?? 'NOT_RUN',
		rootCause: result?.rootCause ?? 'NOT_RUN',
		rootCauseCorrect,
		solution: result?.solution ?? 'NOT_RUN',
		solutionStatusPass,
		solutionCorrect,
		revision,
		qa: qa?.verdict ?? 'NOT_RUN',
		qaRevision: qa?.revision ?? null,
		qaRevisionMatches,
		qaIndependent,
		currentQaPass,
		qaChecks: qaChecks.statuses,
		qaChecksPass: qaChecks.pass,
		qaCheckFailures: qaChecks.failures,
		validatedFirstPassQa,
		repairSuccess,
		audit: audit?.verdict ?? 'NOT_RUN',
		auditRevision: audit?.comparedRevision ?? null,
		auditRevisionMatches,
		auditFalsePositive,
		submission,
		correctDraft,
		ready,
		failed: failureReasons.length > 0,
		failureReasons,
		proofSeconds: numberFrom(result?.proofSeconds, result?.effort?.proofSeconds, result?.effort?.proof?.seconds),
		solveSeconds: numberFrom(result?.solveSeconds, result?.effort?.solveSeconds, result?.effort?.solve?.seconds),
		regressionFailures: numberFrom(result?.regressionFailures),
		artifactSources: {
			intake: intakeSource.path ? relative(directory, intakeSource.path) : null,
			result: resultSource.path ? relative(directory, resultSource.path) : null,
			qa: qaSource.path ? relative(directory, qaSource.path) : null,
			audit: auditSource.path ? relative(directory, auditSource.path) : null,
			attemptOneAudit: attemptOneAuditSource.path ? relative(directory, attemptOneAuditSource.path) : null,
			submission: submissionSource.path ? relative(directory, submissionSource.path) : null,
		},
	};
}

function effort(items, key) {
	const values = items.map(item => item[key]).filter(value => typeof value === 'number');
	return {
		measuredJobs: values.length,
		totalSeconds: values.reduce((sum, value) => sum + value, 0),
		averageSeconds: values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : null,
	};
}

export function summarizeRows(items) {
	const count = predicate => items.filter(predicate).length;
	return {
		jobs: items.length,
		attempted: count(item => item.attempted),
		setupSuccess: count(item => passLike(item.setup)),
		reproductionSuccess: count(item => passLike(item.reproduction)),
		rootCauseCorrect: count(item => item.rootCauseCorrect),
		solutionStatusSuccess: count(item => item.solutionStatusPass),
		solutionCorrect: count(item => item.solutionCorrect),
		validatedFirstPassQaSuccess: count(item => item.validatedFirstPassQa),
		repairSuccess: count(item => item.repairSuccess),
		auditQaFalsePositives: count(item => item.auditFalsePositive),
		strictReady: count(item => item.ready),
		correctDrafts: count(item => item.correctDraft),
		failures: count(item => item.failed),
		proofEffort: effort(items, 'proofSeconds'),
		solveEffort: effort(items, 'solveSeconds'),
		regressionFailuresObserved: items.reduce((sum, item) => sum + (item.regressionFailures ?? 0), 0),
		jobsWithoutRegressionFailureMeasurement: count(item => item.regressionFailures === null),
	};
}

function groupRows(rows, key) {
	const values = [...new Set(rows.map(row => row[key]))].sort((left, right) => left.localeCompare(right));
	return Object.fromEntries(values.map(value => [value, summarizeRows(rows.filter(row => row[key] === value))]));
}

export async function summarizeCohort(jobsRoot) {
	const entries = await readdir(jobsRoot, {withFileTypes: true});
	const names = entries
		.filter(entry => entry.isDirectory() && /^job-\d+$/.test(entry.name))
		.map(entry => entry.name)
		.sort(naturalJobSort);
	const jobs = [];
	for (const name of names) {
		jobs.push(await readJob(jobsRoot, name));
	}

	return {
		label: 'SIMULATION / HISTORICAL REPLAY — NOT PAID WORK',
		schemaVersion: 1,
		measurement: 'Offline artifact summary. Effort fields are reported only when present and are not inferred.',
		overall: summarizeRows(jobs),
		byWorker: groupRows(jobs, 'worker'),
		byCategory: groupRows(jobs, 'category'),
		jobs,
	};
}

export async function writeCohortScorecard(jobsRoot) {
	const scorecard = await summarizeCohort(jobsRoot);
	const output = resolve(jobsRoot, '../scorecard.json');
	await writeFile(output, `${JSON.stringify(scorecard, null, 2)}\n`);
	return {scorecard, output};
}

const isMain = process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url;
if (isMain) {
	const jobsRoot = resolve(process.argv[2] || 'docs/operations/benchmarks-cohort2/jobs');
	const {scorecard} = await writeCohortScorecard(jobsRoot);
	console.log(JSON.stringify(scorecard.overall, null, 2));
}
