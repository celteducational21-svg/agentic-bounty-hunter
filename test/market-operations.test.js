import test from 'node:test';
import assert from 'node:assert/strict';
import {operatingView} from '../src/core/operating-store.js';
import {parseSuperteamListings} from '../src/providers/superteam.js';
const at='2026-09-17T10:00:00.000Z';
const listing=parseSuperteamListings([{id:'example',slug:'example',title:'Agent development event',type:'hackathon',agentAccess:'AGENT_ALLOWED',status:'OPEN',isWinnersAnnounced:false,sponsor:{name:'Verified',isVerified:true},rewardAmount:10000,token:'USDG',deadline:null,_count:{Submission:5}}],at).listings[0];
test('external source persists investigation without fabricating eligibility or a payable personal award',()=>{
  const scan={fetchedAt:at,candidates:[],sourceExpansion:{opportunities:[listing]}};
  const view=operatingView(scan,{operations:[]});
  const op=view.operations[0];
  assert.equal(op.status,'INVESTIGATING');assert.equal(op.evidence.eligibility,undefined);
  assert.equal(op.transitions.length,2);assert.equal(op.sourceUrl,listing.url);
  assert.equal(op.reward.status,'ADVERTISED_LISTING_TOTAL_NOT_PAYMENT');
  assert.equal(view.counts.SOLVING,0);assert.equal(view.counts.PAID,0);
});
test('provider outage and subsequent discovery cannot reset retained execution',()=>{
  const initial=operatingView({fetchedAt:at,candidates:[],sourceExpansion:{opportunities:[listing]}},{operations:[]}).operations;
  const active={...initial[0],status:'SOLVING',version:20};
  const outage=operatingView({fetchedAt:at,candidates:[],sourceExpansion:{opportunities:[]}},{operations:[]},[active]);
  assert.equal(outage.operations[0].status,'SOLVING');
  const fresh=operatingView({fetchedAt:at,candidates:[],sourceExpansion:{opportunities:[listing]}},{operations:[]},[active]);
  assert.equal(fresh.operations[0].version,20);assert.equal(fresh.operations[0].status,'SOLVING');
});
