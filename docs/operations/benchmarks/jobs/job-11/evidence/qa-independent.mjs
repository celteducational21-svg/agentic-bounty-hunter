import assert from 'node:assert/strict';
import {getEventListeners} from 'node:events';
import pMap from './repo/index.js';
const count=s=>getEventListeners(s,'abort').length;
const c=new AbortController();const external=()=>{};c.signal.addEventListener('abort',external);
let release;const pending=new Promise(r=>{release=r});
const slow=pMap([1],()=>pending,{signal:c.signal});
const fast=pMap([2],x=>x,{signal:c.signal});
assert.equal(count(c.signal),3);assert.deepEqual(await fast,[2]);assert.equal(count(c.signal),2);
release(1);assert.deepEqual(await slow,[1]);assert.equal(count(c.signal),1);assert.deepEqual(getEventListeners(c.signal,'abort'),[external]);
for(const options of [{concurrency:0},{}]) {
 const input=options.concurrency===0?[1]:{[Symbol.iterator](){throw new Error('factory')}};
 await assert.rejects(pMap(input,x=>x,{...options,signal:c.signal}));assert.equal(count(c.signal),1);
}
await assert.rejects(pMap([Promise.reject(new Error('value'))],x=>x,{signal:c.signal}));assert.equal(count(c.signal),1);
const c2=new AbortController();let finish;const work=pMap([1],()=>new Promise(r=>{finish=r}),{signal:c2.signal});
await new Promise(r=>setImmediate(r));assert.equal(count(c2.signal),1);const reason={why:'cancel'};c2.abort(reason);await assert.rejects(work,e=>e===reason);assert.equal(count(c2.signal),0);finish(99);await new Promise(r=>setImmediate(r));assert.equal(count(c2.signal),0);
const c3=new AbortController();let releaseNext;const source={ [Symbol.asyncIterator](){return{next(){return new Promise(r=>{releaseNext=r})}}}};
const waiting=pMap(source,x=>x,{signal:c3.signal});c3.abort('stop');await assert.rejects(waiting,e=>e==='stop');assert.equal(count(c3.signal),0);releaseNext({done:true});await new Promise(r=>setImmediate(r));assert.equal(count(c3.signal),0);
const c4=new AbortController();c4.abort('before');let mapperCalls=0;await assert.rejects(pMap([1],()=>mapperCalls++,{signal:c4.signal}),e=>e==='before');assert.equal(mapperCalls,0);assert.equal(count(c4.signal),0);
console.log('PASS independent concurrent shared-signal listener ownership, validation/factory/input rejection, active pending mapper and async iterator abort, late completion, pre-aborted signal');
