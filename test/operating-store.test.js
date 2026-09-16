import test from 'node:test';
import assert from 'node:assert/strict';
import {operatingView} from '../src/core/operating-store.js';
import {createOperation,transitionOperation} from '../src/core/operations.js';
const at='2026-09-16T10:00:00.000Z';
const empty={operations:[],humanActions:[]};
test('prior operations survive disappearance from next discovery population',()=>{
 const old=createOperation({opportunityId:'prior'},{at});
 const view=operatingView({fetchedAt:'2026-09-17T10:00:00.000Z',candidates:[]},empty,[old]);
 assert.deepEqual(view.operations,[old]);
});
test('saved operation transitions are not regenerated on read',()=>{
 const old=createOperation({opportunityId:'prior'},{at});
 assert.deepEqual(operatingView({fetchedAt:at,candidates:[],operations:[old]},empty).operations,[old]);
});
test('committed execution overrides same version discovery and cannot roll back newer state',()=>{
 const first=createOperation({opportunityId:'prior'},{at});
 const next=transitionOperation(first,'INVESTIGATING',{at,actor:'qualifier',reason:'Check task',expectedVersion:1});
 assert.equal(operatingView(null,{...empty,operations:[first]},[next]).operations[0].version,2);
});
test('verified closure removes stale Phase3 eligibility and appends history',()=>{
 let row=createOperation({opportunityId:'closed-later'},{at});
 const advance=(to,evidence={})=>row=transitionOperation(row,to,{at,actor:'qualifier',reason:'Evidence',expectedVersion:row.version,evidence});
 advance('INVESTIGATING');
 advance('PHASE3_ELIGIBLE',{eligibility:{issueOpen:true,repositoryAccessible:true,credibleReward:true,scopeUnderstandable:true,competitionNotHopeless:true,noHardBlocker:true}});
 const scan={fetchedAt:'2026-09-17T10:00:00.000Z',candidates:[{opportunityId:row.opportunityId,canonicalIssueUrl:'https://github.com/a/b/issues/1',candidatePhase3Status:'REJECTED',rejectionReasons:['Issue closed/completed'],reason:'Issue closed/completed'}]};
 const actual=operatingView(scan,empty,[row]).operations[0];
 assert.equal(actual.status,'REJECTED');
 assert.deepEqual(actual.transitions.slice(0,3),row.transitions);
 assert.equal(actual.transitions.length,4);
});
