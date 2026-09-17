import assert from 'node:assert/strict';
import {setTimeout} from 'node:timers/promises';
import {pMapIterable} from '../repo/index.js';
async function* source() {yield 1; yield 2; yield 3;}
let active = 0;
let maximum = 0;
const events = [];
for await (const value of pMapIterable(source(), async n => {
  active++;
  maximum = Math.max(active, maximum);
  events.push(`start ${n}`);
  await setTimeout(10);
  events.push(`end ${n}`);
  active--;
  return n;
}, {concurrency: 1, backpressure: 2})) {}
console.log({maximum, events});
assert.equal(maximum, 1);
