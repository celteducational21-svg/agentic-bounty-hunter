import test from 'node:test';
import assert from 'node:assert/strict';
import opportunities from '../api/opportunities.js';
import operations from '../api/operations.js';
import { ABH_PROJECT_REF } from '../src/core/durable-history.js';

test('public APIs redact transport errors and do not expose credentials', async () => {
  const originalFetch = globalThis.fetch;
  const originalUrl = process.env.ABH_SUPABASE_URL;
  const originalKey = process.env.ABH_SUPABASE_SECRET_KEY;
  const sentinel = 'QA_PRIVATE_TRANSPORT_ERROR';
  const fakeKey = 'sb_secret_QA_FAKE_NOT_A_CREDENTIAL';
  const calls = [];
  try {
    process.env.ABH_SUPABASE_URL = `https://${ABH_PROJECT_REF}.supabase.co`;
    process.env.ABH_SUPABASE_SECRET_KEY = fakeKey;
    globalThis.fetch = async (url, options) => {
      calls.push({ url, method: options.method || 'GET' });
      throw new Error(`${sentinel}: ${fakeKey}`);
    };
    for (const handler of [opportunities, operations]) {
      let result;
      const response = {
        setHeader() {},
        status(code) { this.code = code; return this; },
        json(body) { result = body; }
      };
      await handler({ method: 'GET', query: { latest: '1' } }, response);
      assert.ok(result);
      assert.equal(JSON.stringify(result).includes(sentinel), false);
      assert.equal(JSON.stringify(result).includes(fakeKey), false);
    }
    assert.equal(calls.length, 2);
    assert.ok(calls.every(call => call.method === 'GET' && call.url.startsWith(`https://${ABH_PROJECT_REF}.supabase.co/rest/v1/abh_scans?`)));
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of [['ABH_SUPABASE_URL', originalUrl], ['ABH_SUPABASE_SECRET_KEY', originalKey]]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  }
});
