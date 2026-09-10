import test from 'node:test';
import assert from 'node:assert/strict';
import { materialState, SupabaseSnapshotStore, ABH_PROJECT_REF } from '../src/core/durable-history.js';
import { analyzeOpportunity } from '../src/core/intelligence.js';
import { fixtures, deep } from './fixtures.js';
const opportunity = analyzeOpportunity(fixtures.excellent, deep);
const config = { url: `https://${ABH_PROJECT_REF}.supabase.co`, secretKey: 'sb_secret_test_fixture' };
test('storage refuses CELT or any other project', () => assert.throws(() => new SupabaseSnapshotStore({ ...config, url: 'https://unrelated.supabase.co' }), /dedicated/));
test('storage refuses public or absent key', () => assert.throws(() => new SupabaseSnapshotStore({ ...config, secretKey: 'sb_publishable_test' }), /secret/));
test('retrieval timestamp does not create material change', () => assert.deepEqual(materialState(opportunity), materialState({ ...opportunity, retrievalTimestamp: 'later' })));
test('assignee order does not create material change', () => assert.deepEqual(materialState({ ...opportunity, assignees: ['a','b'] }), materialState({ ...opportunity, assignees: ['b','a'] })));
test('payment risk change creates material change', () => assert.notDeepEqual(materialState(opportunity), materialState({ ...opportunity, paymentRisk: 'CHANGED' })));
test('scan uses atomic RPC and removes duplicates', async () => {
  let captured;
  const store = new SupabaseSnapshotStore({ ...config, fetchImpl: async (url, options) => { captured = { url, options }; return { ok: true, json: async () => ({ persisted: true }) }; } });
  const result = await store.persistScan({ fetchedAt: '2026-09-10T00:00:00Z', candidates: [opportunity, opportunity], counts: {} });
  assert.equal(result.persisted, true);
  assert.ok(captured.url.endsWith('/rpc/abh_record_scan'));
  assert.equal(JSON.parse(captured.options.body).p_items.length, 1);
  assert.equal(captured.options.headers.apikey, config.secretKey);
});
test('storage errors do not expose provider bodies or secrets', async () => {
  const store = new SupabaseSnapshotStore({ ...config, fetchImpl: async () => ({ ok: false, status: 401, json: async () => ({ error: config.secretKey }) }) });
  await assert.rejects(store.persistScan({ candidates: [opportunity] }), error => error.message === 'ABH history storage failed (401)');
});
test('history rejects query injection', async () => {
  const store = new SupabaseSnapshotStore({ ...config, fetchImpl: async () => { throw new Error('Must not request'); } });
  await assert.rejects(store.history('ABH-GH-x&select=*'), /Invalid opportunity ID/);
});
