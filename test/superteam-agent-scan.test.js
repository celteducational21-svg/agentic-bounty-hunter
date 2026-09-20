import test from 'node:test';
import assert from 'node:assert/strict';
import {scanAgent} from '../scripts/superteam-agent-scan.mjs';
const at='2026-09-20T12:00:00Z';
const row={id:'job-1',slug:'example-job',agentAccess:'AGENT_ALLOWED',status:'OPEN',isWinnersAnnounced:false,deadline:'2026-10-01T00:00:00Z'};
test('authenticated discovery stays on canonical host, refuses redirects and rechecks detail eligibility',async()=>{
  const calls=[];
  const result=await scanAgent({apiKey:'test-only',checkedAt:at,fetchImpl:async(url,options)=>{
    calls.push({url,options});return {ok:true,text:async()=>JSON.stringify(calls.length===1?[row,{...row,id:'forbidden',agentAccess:'HUMAN_ONLY'}]:{...row,agentAccess:'HUMAN_ONLY'})};
  }});
  assert.equal(calls.length,2);
  for (const {url,options} of calls) {assert.equal(new URL(url).origin,'https://superteam.fun');assert.equal(options.redirect,'error');assert.equal(options.method,'GET');}
  assert.equal(result.listings[0].status,'RECHECK_REQUIRED');assert.equal(result.submitted,0);
  assert.ok(!JSON.stringify(result).includes('test-only'));
});
test('authentication and transport failures cannot leak remote response or credential',async()=>{
  await assert.rejects(scanAgent({apiKey:'test-only',fetchImpl:async()=>({ok:false,status:401,text:async()=>'SECRET'})}),/^Error: SUPERTEAM_HTTP_401$/);
  await assert.rejects(scanAgent({apiKey:'test-only',fetchImpl:async()=>{throw new Error('SECRET')}}),/^Error: SUPERTEAM_NETWORK_FAILED$/);
  await assert.rejects(scanAgent({apiKey:''}),/^Error: SUPERTEAM_CREDENTIAL_REQUIRED$/);
});
