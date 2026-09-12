import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtures, deep } from './fixtures.js';
import { preliminaryPriority, finishEnrichment, sourceTarget, STEPS, unifiedBlockers } from '../src/core/enrichment.js';
import { parseOpireListing } from '../src/providers/opire.js';
import { createBudget, resolveSource, enrichCandidate, buildStagedScan } from '../src/live/pipeline.js';
const issue = fixtures.excellent;
const url = 'https://app.opire.dev/issues/01EXAMPLE';
const html = `<h1>$150.00 bounty for Parser</h1>Issue URL: ${issue.url} Status: Open. 1 available rewards and 0 paid rewards. 0 solvers are trying this issue and 0 solvers have claimed it.`;
test('Opire exact issue linkage', () => assert.equal(parseOpireListing(html,url,issue.url).listingVerified,true));
test('Opire wrong issue linkage rejected', () => assert.equal(parseOpireListing(html,url,issue.url+'0').listingVerified,false));
test('Opire reward USD scoped to issue not catalogue', () => { const x=parseOpireListing(html+' $100000 total open value',url,issue.url);assert.equal(x.rewardAmount,150);assert.equal(x.rewardCurrency,'USD'); });
test('Opire listing does not imply escrow', () => { const x=parseOpireListing(html,url,issue.url);assert.equal(x.fundingStatus,'PAY_ON_ACCEPTANCE');assert.equal(x.fundsReserved,false); });
test('verified platform leaves unknown issuer explicit', () => { const x=parseOpireListing(html,url,issue.url);assert.equal(x.issuerAuthority,'UNKNOWN');assert.equal(x.paymentConfidence,'PARTIAL'); });
test('third-party sponsor is not automatically ineligible', () => assert.ok(!finishEnrichment({...issue,issuer:'sponsor',authorAssociation:'NONE'},deep,[],{},null).rejectionReasons.some(x=>/sponsor/i.test(x))));
test('unrelated commenter cannot establish payment', () => assert.notEqual(finishEnrichment(issue,{...deep,comments:[{body:'I promise $999',user:{login:'outsider'}}]},[],{},null).paymentConfidence,'STRONG'));
test('mirror resolves target URL',()=>assert.equal(sourceTarget({...issue,repository:'bot/bounty-plaza',body:'Source URL\nhttps://github.com/original/project/issues/9'}),'https://github.com/original/project/issues/9'));
test('missing original is distinguished from timeout',async()=>{ const b=createBudget({fetchImpl:async()=>({ok:false,status:404})});const r=await resolveSource(issue,b);assert.equal(r.unavailable,true);assert.equal(r.ok,false); });
test('unknown payment does not starve preliminary priority',()=>assert.ok(preliminaryPriority({...issue,body:'Reward: $100\nAcceptance: add tests'})>=60));
test('all steps complete establishes FULLY_ENRICHED',()=>assert.equal(finishEnrichment(issue,deep,STEPS.map(step=>({step,status:'COMPLETE'})),{},null).enrichmentState,'FULLY_ENRICHED'));
test('API failure becomes INCOMPLETE not false reject',async()=>{ const x=await enrichCandidate(issue,createBudget({fetchImpl:async()=>{throw new Error('network');}}));assert.equal(x.decision,'INCOMPLETE');assert.ok(x.enrichment.steps.some(s=>s.retryable)); });
test('budget exhausted remains retryable',async()=>{const r=await createBudget({maxRequests:0}).request('https://api.github.com/repos/a/b');assert.equal(r.reason,'ENRICHMENT_BUDGET_EXHAUSTED');assert.equal(r.retryable,true);});
test('repository credentials become primary hard blocker',()=>{const x=finishEnrichment(issue,{...deep,repoDetails:{testSource:'requires HUMAN_VERIFIED_SIGNATURE'}},[],{},null);assert.equal(x.hiddenBlockerRisk,'HIGH');assert.equal(x.blockers[0].type,'EXTERNAL_CREDENTIAL');assert.equal(x.decision,'REJECT');});
test('physical hardware blocker',()=>assert.equal(unifiedBlockers({...issue,body:'Must test on physical device'},{}).at(0).type,'PHYSICAL_HARDWARE'));
test('identical repo requests reuse in-flight response',async()=>{let count=0;const b=createBudget({fetchImpl:async()=>{count++;return {ok:true,status:200,json:async()=>({})};}});await Promise.all([b.request('https://api.github.com/repos/a/b'),b.request('https://api.github.com/repos/a/b')]);assert.equal(count,1);});
test('partial evidence has no final score',()=>{const x=finishEnrichment(issue,deep,[],{},null);assert.equal(x.finalOpportunityScore,null);assert.equal(x.decision,'INCOMPLETE');assert.notEqual(x.decision,'HUNT');});
test('partial provider competition never becomes LOW',()=>{const p=parseOpireListing(html.replace('0 solvers are trying','5 solvers are trying'),url,issue.url);const x=finishEnrichment(issue,deep,STEPS.map(step=>({step,status:'COMPLETE'})),{},p);assert.equal(x.activeCompetitorCount,null);assert.equal(x.competitionConfidence,'UNKNOWN');});
test('Opire closed or paid-out listing is rejected',()=>{const p=parseOpireListing(html.replace('1 available rewards','0 available rewards'),url,issue.url);assert.equal(finishEnrichment(issue,deep,[],{},p).decision,'REJECT');});
test('fully enriched strong synthetic opportunity retains HUNT path',()=>{const context={...deep,rootEntries:[...deep.rootEntries,{name:'package-lock.json'}],repo:{...deep.repo,created_at:'2020-01-01'},repoDetails:{...deep.repoDetails,readme:'Development setup install npm ci',packageJson:{scripts:{test:'node --test',build:'tsc'}}},comments:[{author_association:'OWNER',created_at:new Date().toISOString(),body:'Payment on merge',user:{login:'owner'}}],providerEvidence:[{issueUrl:issue.url,url:'https://algora.io/bounties/test',status:'ACTIVE',funded:true,retrievedAt:new Date().toISOString(),amount:150,currency:'USD'}]};const x=finishEnrichment({...issue,authorAssociation:'OWNER'},context,STEPS.map(step=>({step,status:'COMPLETE'})),{},null);assert.equal(x.decision,'HUNT');});
test('five candidates complete the real staged collector with shared repository reads',async()=>{
  let repoCalls=0;const issues=Array.from({length:5},(_,i)=>{const repository=['acme/parser','acme/parser','acme/other','acme/other','acme/third'][i];return {...issue,repository,repositoryUrl:`https://github.com/${repository}`,id:String(100+i),number:10+i,url:`https://github.com/${repository}/issues/${10+i}`};});
  const budget=createBudget({fetchImpl:async address=>{
    const u=new URL(address);let data;
    if(/^\/repos\/acme\/[^/]+$/.test(u.pathname)){repoCalls++;data={...deep.repo,full_name:u.pathname.slice(7),default_branch:'main',private:false};}
    else if(u.hostname==='raw.githubusercontent.com')return {ok:true,status:200,text:async()=>u.pathname.endsWith('package.json')?'{}':'Development setup'};
    else if(u.pathname.includes('/git/trees/'))data={tree:[{path:'README.md',type:'blob'},{path:'package.json',type:'blob'},{path:'package-lock.json',type:'blob'}],truncated:false};
    else if(u.pathname.includes('/contents/'))data={encoding:'base64',content:Buffer.from(u.pathname.endsWith('package.json')?'{}':'Development setup').toString('base64'),html_url:issue.repositoryUrl+'/blob/main/README.md'};
    else if(u.pathname==='/search/issues')data={items:[],total_count:0,incomplete_results:false};
    else if(/\/(?:comments|timeline)$/.test(u.pathname))data=[];
    else {const n=Number(u.pathname.split('/').at(-1));const original=issues.find(x=>x.number===n);data={...original,html_url:original.url,repository_url:`https://api.github.com/repos/${original.repository}`,author_association:'OWNER'};}
    return {ok:true,status:200,json:async()=>data};
  }});
  const result=await buildStagedScan({discovery:{rawCount:5,issues,searchCoverage:[]},budget});assert.equal(result.funnel.fullyEnriched,5);assert.equal(repoCalls,3);assert.equal(result.funnel.selectedRepositories,3);assert.ok(result.candidates.every(x=>x.enrichment.complete));
});
test('deadline timeout does not produce a hard rejection',async()=>{const result=await enrichCandidate(issue,createBudget({deadlineMs:0}));assert.equal(result.enrichmentState,'INCOMPLETE');assert.equal(result.decision,'INCOMPLETE');});
