import test from 'node:test';
import assert from 'node:assert/strict';
import {parseSuperteamListings,discoverSuperteam,SUPERTEAM_CATALOGUE} from '../src/providers/superteam.js';
const at='2026-09-17T10:00:00.000Z';
const row={id:'abc-123',slug:'example-job',title:'Fix SDK integration',type:'bounty',agentAccess:'AGENT_ALLOWED',status:'OPEN',isWinnersAnnounced:false,sponsor:{name:'Sponsor',isVerified:true},rewardAmount:100,token:'USDC',deadline:'2026-10-01T00:00:00.000Z',_count:{Submission:2}};
test('agent discovery excludes forbidden/unknown policies, expired/completed and unverified listings',()=>{
  const bad=[{agentAccess:'HUMAN_ONLY'},{agentAccess:undefined},{status:'CLOSED'},{isWinnersAnnounced:true},{deadline:'2020-01-01'},{deadline:'invalid'},{sponsor:{isVerified:false}},{slug:'../../private'}];
  const p=parseSuperteamListings([{...row,agentAccess:'AGENT_ONLY'},...bad.map((x,i)=>({...row,id:`bad-${i}`,slug:`bad-${i}`,...x})),{...row,agentAccess:'AGENT_ONLY'}],at);
  assert.equal(p.listings.length,1); assert.equal(p.rawCount,10);
  assert.equal(p.listings[0].agentAccess,'AGENT_ONLY');assert.equal(p.listings[0].privateProofEligible,false);
  assert.equal(p.listings[0].focus,'PRIMARY_ADVERTISED_BAND');
});
test('conflicting duplicate policy/status cannot leave an earlier allowed listing eligible',()=>{
  for (const change of [{agentAccess:'HUMAN_ONLY'},{status:'CLOSED'},{rewardAmount:1},{deadline:'2020-01-01'}]) {
    for (const rows of [[row,{...row,...change}],[{...row,...change},row]]) {
      const p=parseSuperteamListings(rows,at);assert.equal(p.listings.length,0);assert.equal(p.excluded.conflictingIdentity,2);
    }
  }
  assert.equal(parseSuperteamListings([{...row,deadline:at}],at).listings.length,0);
  assert.equal(parseSuperteamListings([row,{...row,id:'different-id',agentAccess:'HUMAN_ONLY'}],at).listings.length,0);
});
test('hackathon pool and unfamiliar currency are not promoted to a small fixed payable reward',()=>{
  const p=parseSuperteamListings([{...row,type:'hackathon',rewardAmount:10000,token:'USDG',deadline:null}],at).listings[0];
  assert.equal(p.focus,'OUTSIDE_INITIAL_SMALL_TASK_LANE');assert.match(p.reward.meaning,/prize pool/);
  assert.equal(p.geographicEligibility,'UNKNOWN_REQUIRES_LISTING_DETAILS');
});
test('source failures remain visible and do not throw or reveal response bodies',async()=>{
  const failed=await discoverSuperteam({checkedAt:at,fetchImpl:async()=>({ok:false,status:401,text:()=>{throw Error('secret')}})});
  assert.equal(failed.status,'UNAVAILABLE');assert.equal(failed.rawCount,null);assert.equal(failed.httpStatus,401);
  const malformed=await discoverSuperteam({checkedAt:at,fetchImpl:async()=>({ok:true,text:async()=>'{"not":"array"}'})});
  assert.equal(malformed.status,'UNAVAILABLE');assert.deepEqual(malformed.listings,[]);
});
test('official public read path sends no credentials or mutation',async()=>{
  let called;
  const r=await discoverSuperteam({checkedAt:at,fetchImpl:async(url,options)=>{called={url,options};return {ok:true,text:async()=>JSON.stringify([row])};}});
  assert.equal(called.url,SUPERTEAM_CATALOGUE);assert.equal(called.options.method,'GET');assert.equal(called.options.redirect,'error');
  assert.equal(called.options.headers.Authorization,undefined);assert.equal(r.listings.length,1);
});
