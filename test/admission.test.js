import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtures, deep } from './fixtures.js';
import { finishEnrichment, STEPS } from '../src/core/enrichment.js';
import { parseOpireListing } from '../src/providers/opire.js';
import { scopeIntelligence } from '../src/core/quality.js';
import { dependencyIntelligence } from '../src/core/dependencies.js';
import { createBudget, buildStagedScan, repositoryEvidence } from '../src/live/pipeline.js';
const issue = fixtures.excellent;
const steps = STEPS.map(step => ({step,status:'COMPLETE'}));
const source = {ok:true, canonicalIssueUrl:issue.url};
const listing = parseOpireListing(`$200.00 bounty for Task Issue URL: ${issue.url} Status: Open. 1 available rewards and 0 paid rewards. 2 solvers are trying this issue and 1 solvers have claimed it.`, 'https://app.opire.dev/issues/01TEST', issue.url);
test('private eligibility accepts pay on acceptance and unresolved provisionable setup', () => {
 const task = {...issue,body:issue.body+'\n- Test GitHub App installation token with real API call'};
 const r = finishEnrichment(task,{...deep,repo:{...deep.repo,private:false}},steps,source,listing);
 assert.equal(r.candidatePhase3Status,'PHASE3_ELIGIBLE');assert.equal(r.phase2MarketCertification,'INCOMPLETE');assert.notEqual(r.decision,'HUNT');
 assert.equal(r.providerVerifiedReward.amount,200);assert.equal(r.phase3Admission.publicActionAuthorized,false);
 assert.equal(r.phase3Admission.operationalSetup.status,'HUMAN_SETUP_REQUIRED');
});
test('unreachable catalogue title never becomes canonical reward or closed state',()=>{
 const r=finishEnrichment({...issue,providerSeed:true,state:'unknown',providerDiscovery:{advertisedRewardUsd:20,sourceUrl:'https://app.opire.dev/home'}},{},[],{ok:false,unavailable:true},null);
 assert.equal(r.canonicalIssueReward.amount,null);assert.equal(r.rewardAmount,null);assert.equal(r.advertisedReward.amount,20);assert.equal(r.currentlyAvailableReward.amount,0);assert.ok(!r.rejectionReasons.some(x=>/closed/i.test(x)));
});
test('closed provider amount is preserved separately from current availability',()=>{
 const r=finishEnrichment(issue,deep,steps,source,{...listing,availability:'CLOSED'});
 assert.equal(r.providerVerifiedReward.amount,200);assert.equal(r.currentlyAvailableReward.amount,0);assert.notEqual(r.candidatePhase3Status,'PHASE3_ELIGIBLE');
});
test('wrong issue provider cannot establish private admission',()=>{
 const r=finishEnrichment(issue,{...deep,repo:{...deep.repo,private:false}},steps,source,{...listing,canonicalIssueUrl:issue.url+'1'});
 assert.equal(r.providerVerifiedReward.amount,null);
});
test('fenced Go command retained as NOT_RUN and GitHub App classified',()=>{
 const x=scopeIntelligence({...issue,body:'```sh\ngo test -race -v ./pkg/server/...\n```'});
 assert.deepEqual(x.explicitCommands.map(x=>[x.command,x.status]),[['go test -race -v ./pkg/server/...','NOT_RUN']]);
 const deps=dependencyIntelligence({...issue,body:'Use a GitHub App installation token and a real API call'});
 assert.ok(deps.some(x=>x.type==='GITHUB_APP'&&x.provisioning==='USER_INPUT_REQUIRED'));
});
test('issue-specific named paths inspected and missing file retained',async()=>{
 const b=createBudget({fetchImpl:async url=>({ok:true,status:200,json:async()=>url.includes('/git/trees/')?{tree:[{path:'server_test.go',type:'blob'},{path:'go.mod',type:'blob'}]}:{private:false,default_branch:'main'},text:async()=> 'package server'})});
 const r=await repositoryEvidence({...issue,body:'Inspect server_test.go and pkg/server/router/router.go.\n```\ngo test -race -v ./pkg/server/...\n```'},b);
 assert.ok(r.context.repoDetails.sourceFiles.some(x=>x.path==='server_test.go'));
 assert.ok(r.context.repoDetails.expectedFiles.some(x=>x.path==='pkg/server/router/router.go'&&x.status==='MISSING'));
 assert.ok(dependencyIntelligence(issue,r.context).some(x=>x.type==='MISSING_EXPECTED_FILE'&&x.provisioning==='UNKNOWN'));
});
test('404 and closed candidates refill from same discovery without consuming deep attempts',async()=>{
 const tasks=Array.from({length:4},(_,i)=>({...issue,id:String(i),url:`https://github.com/acme/repo${i}/issues/1`,repository:`acme/repo${i}`,repositoryUrl:`https://github.com/acme/repo${i}`,number:1}));
 const b=createBudget({fetchImpl:async address=>{
 const u=new URL(address);let data;
 if(u.pathname==='/repos/acme/repo0/issues/1')return {ok:false,status:404};
 if(u.hostname==='raw.githubusercontent.com')return {ok:true,status:200,text:async()=>'{}'};
 if(u.pathname.endsWith('/issues/1')){const t=tasks.find(t=>address.includes(t.repository));data={...t,html_url:t.url,repository_url:'https://api.github.com/repos/'+t.repository,state:t.repository.endsWith('1')?'closed':'open'};}
 else if(u.pathname.endsWith('/timeline'))data=[];
 else if(u.pathname==='/search/issues')data={items:[],total_count:0,incomplete_results:false};
 else if(u.pathname.includes('/git/trees/'))data={tree:[],truncated:false};
 else data={...deep.repo,private:false,default_branch:'main'};
 return {ok:true,status:200,json:async()=>data};
 }});
 const r=await buildStagedScan({discovery:{issues:tasks,rawCount:4,searchCoverage:[]},deepLimit:2,budget:b});
 assert.equal(r.deepAdmissionAttempts,2);assert.equal(r.admissionAttempts.filter(x=>x.stage==='PREFLIGHT').length,2);assert.equal(r.candidates.length,4);
 assert.ok(!r.requests.some(x=>x.url.includes('/search/issues')&&!x.url.includes('is%3Apr')));
});
test('owner reward command retains identity without secured-funds assertion',()=>{
 const r=finishEnrichment(issue,{...deep,comments:[{author_association:'OWNER',user:{login:'owner'},body:'/reward 100',html_url:issue.url+'#issuecomment-1'}]},steps,source,{...listing});
 assert.equal(r.paymentTrust.knownRewardContributors[0].amount,100);assert.equal(r.paymentTrust.knownRewardContributors[0].fundingSecured,false);
});
