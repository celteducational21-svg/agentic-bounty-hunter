import assert from 'node:assert/strict';
import test from 'node:test';
import {setTimeout as delay} from 'node:timers/promises';
import {pMapIterable, pMapSkip} from './repo/index.js';

for (const concurrency of [1, 2]) {
  for (const backpressure of [concurrency, concurrency + 2, Infinity]) {
    for (const slowNext of [false, true]) {
      test(`async source concurrency=${concurrency} pressure=${backpressure} slowNext=${slowNext}`, async () => {
        let active = 0;
        let maximum = 0;
        async function* source() {
          for (let n = 0; n < 15; n++) {
            if (slowNext) await delay(n % 3);
            yield n;
          }
        }
        const output = [];
        for await (const value of pMapIterable(source(), async (n, index) => {
          assert.equal(index, n);
          active++;
          maximum = Math.max(maximum, active);
          await delay(n % 2 ? 1 : 4);
          active--;
          return n % 4 === 0 ? pMapSkip : n * 2;
        }, {concurrency, backpressure})) {
          output.push(value);
          await delay(2);
        }
        assert.ok(maximum <= concurrency, `Observed ${maximum}, limit ${concurrency}`);
        assert.equal(active, 0);
        assert.deepEqual(output, Array.from({length:15}, (_, n) => n).filter(n => n % 4).map(n => n * 2));
      });
    }
  }
}
test('finite backpressure limits prefetched work while consumer pauses', async () => {
  let started = 0;
  async function* source() { for (let n = 0; n < 20; n++) yield n; }
  const iter = pMapIterable(source(), async n => { started++; await delay(1); return n; }, {concurrency:2, backpressure:3})[Symbol.asyncIterator]();
  assert.deepEqual(await iter.next(), {value:0, done:false});
  await delay(40);
  assert.ok(started <= 4, `started ${started}; one consumed plus three buffered`);
  await iter.return();
  await delay(10);
});
test('mapper rejection propagates and started work settles', async () => {
  let active = 0;
  async function* source() { for (let n = 0; n < 10; n++) yield n; }
  const collect = async () => {
    for await (const ignored of pMapIterable(source(), async n => {
      active++;
      try { await delay(2); if (n === 2) throw new Error('qa-mapper'); return n; }
      finally { active--; }
    }, {concurrency:2, backpressure:4})) {}
  };
  await assert.rejects(collect, /qa-mapper/);
  await delay(20);
  assert.equal(active, 0);
});
test('source rejection and empty source terminate', async () => {
  async function* broken() { yield 1; throw new Error('qa-source'); }
  await assert.rejects(async () => { for await (const ignored of pMapIterable(broken(), n => n, {concurrency:1,backpressure:2})) {} }, /qa-source/);
  async function* empty() {}
  const output = [];
  for await (const n of pMapIterable(empty(), n => n, {concurrency:2,backpressure:3})) output.push(n);
  assert.deepEqual(output, []);
});
