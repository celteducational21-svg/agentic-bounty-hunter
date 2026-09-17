import { readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Offline reporting only. Never imports or changes live opportunity state.
const root = resolve(process.argv[2] || 'docs/operations/benchmarks/jobs');
async function json(path) { try { return JSON.parse(await readFile(path, 'utf8')); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
const names = (await readdir(root)).filter(x => /^job-\d+$/.test(x)).sort();
const rows = [];
for (const id of names) {
  const intake = await json(`${root}/${id}/intake.json`);
  const result = await json(`${root}/${id}/evidence/result.json`);
  const qa = await json(`${root}/${id}/evidence/qa.json`);
  const audit = await json(`${root}/${id}/evidence/audit.json`);
  let submission = false;
  try { submission = (await readFile(`${root}/${id}/evidence/submission.md`, 'utf8')).trim().length > 0; } catch(e) { if(e.code !== 'ENOENT') throw e; }
  const qaPass = qa?.verdict === 'PASS' && qa.revision === result?.revision && qa.reviewer !== result?.author;
  const auditPass = audit?.verdict === 'PASS' && audit.comparedRevision === result?.revision;
  const correct = result?.solution === 'PASS' && qaPass && auditPass;
  const cleanChecks = qaPass && Object.entries(qa.checks || {}).length >= 8 && Object.entries(qa.checks).every(([key,value])=>value==='PASS' || (value==='NOT_APPLICABLE' && typeof qa.notApplicableReasons?.[key]==='string' && qa.notApplicableReasons[key].length>0));
  rows.push({ id, issue:intake?.issue, category:intake?.category, difficulty:intake?.difficulty,
    worker:result?.worker ?? 'NOT_RUN', attempted:!!result, setup:result?.setup ?? 'NOT_RUN',
    reproduction:result?.reproduction ?? 'NOT_RUN', rootCause:result?.rootCause ?? 'NOT_RUN',
    solution:result?.solution ?? 'NOT_RUN', qa:qa?.verdict ?? 'NOT_RUN', audit:audit?.verdict ?? 'NOT_RUN',
    firstPassQA:qaPass && qa.firstPass === true, repairedQA:qaPass && qa.firstPass === false,
    auditDetectedQAFalsePositive:qa?.auditDetectedFalsePositive === true || result?.initialSolution === 'FAIL',
    technicallyCorrect:correct, draftReady:correct && submission, submissionReady:correct && submission && cleanChecks,
    cleanApplicableProjectChecks:cleanChecks,
    qaChecks:qa?.checks ?? {},
    abandoned:result?.abandoned === true || audit?.defensibleAbandonment === true, defensibleAbandonment:audit?.defensibleAbandonment === true,
    proofSeconds:result?.proofSeconds ?? null, solveSeconds:result?.solveSeconds ?? null,
    regressionFailures:result?.regressionFailures ?? null, revision:result?.revision ?? null,
    limitations:result?.limitations ?? [] });
}
function summarize(items) {
  const count = fn => items.filter(fn).length;
  const avg = key => { const values=items.map(x=>x[key]).filter(x=>typeof x==='number'); return { measuredJobs:values.length, seconds:values.length ? values.reduce((a,b)=>a+b,0)/values.length : null }; };
  return { jobs:items.length, attempted:count(x=>x.attempted), setupSuccess:count(x=>x.setup==='PASS'),
    reproductionSuccess:count(x=>x.reproduction==='PASS'), rootCauseSuccess:count(x=>x.rootCause==='PASS' && x.audit==='PASS'),
    solutionSuccess:count(x=>x.technicallyCorrect), firstPassQASuccess:count(x=>x.firstPassQA && x.technicallyCorrect), qaRepairSuccess:count(x=>x.repairedQA && x.technicallyCorrect),
    auditDetectedQAFalsePositives:count(x=>x.auditDetectedQAFalsePositive),
    finalSubmissionReady:count(x=>x.submissionReady), abandoned:count(x=>x.abandoned),
    technicallyCorrectDrafts:count(x=>x.draftReady), draftReadyWithBaselineLimitations:count(x=>x.draftReady && !x.submissionReady),
    cleanApplicableProjectChecks:count(x=>x.cleanApplicableProjectChecks),
    correctOrDefensiblyAbandoned:count(x=>x.technicallyCorrect || x.defensibleAbandonment),
    averageProofEffort:avg('proofSeconds'), averageSolveEffort:avg('solveSeconds'),
    regressionFailuresObserved:items.reduce((n,x)=>n+(x.regressionFailures ?? 0),0),
    jobsWithoutRegressionFailureMeasurement:count(x=>x.regressionFailures === null) };
}
const grouped = key => Object.fromEntries([...new Set(rows.map(x=>x[key]))].map(value=>[value,summarize(rows.filter(x=>x[key]===value))]));
const scorecard={ label:'SIMULATION / HISTORICAL REPLAY — NOT PAID WORK', generatedAt:new Date().toISOString(),
  measurement:'Elapsed phase wall time, including commands and agent work; not billable human hours or model compute time.',
  overall:summarize(rows), byCategory:grouped('category'), byWorker:grouped('worker'), jobs:rows };
await writeFile(resolve(root,'../scorecard.json'),JSON.stringify(scorecard,null,2)+'\n');
console.log(JSON.stringify(scorecard.overall,null,2));
