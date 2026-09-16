import { mkdir, writeFile, readFile } from 'node:fs/promises';
const base = 'https://agentic-bounty-hunter.vercel.app';
const stamp = new Date().toISOString();
const response = await fetch(`${base}/api/opportunities`, {signal:AbortSignal.timeout(90000)});
if (!response.ok) throw new Error(`Discovery failed (${response.status}); no success log written`);
const scan = await response.json();
if (!scan.persistence?.durable) throw new Error('Scan was not durably persisted');
const root = new URL('../docs/operations/daily/',import.meta.url);
await mkdir(root,{recursive:true});
const name=stamp.replaceAll(':','-');
await writeFile(new URL(`${name}.json`,root),JSON.stringify(scan,null,2)+'\n');
console.log(JSON.stringify({saved:`docs/operations/daily/${name}.json`,fetchedAt:scan.fetchedAt,funnel:scan.funnel,persistence:scan.persistence,dailyLog:scan.dailyLog},null,2));
// Commit this evidence using the authenticated Git workflow. Solver/QA are agent
// handoffs defined in WORKER_RUNBOOK, not background processes hidden in this script.
