import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/github-auth.js';

test('runtime auth diagnostic returns only safe evidence and rejects invalid credentials', async () => {
  const oldFetch = globalThis.fetch, oldToken = process.env.ABH_GITHUB_TOKEN;
  const token = 'synthetic-test-credential';
  process.env.ABH_GITHUB_TOKEN = token;
  let status = 200;
  globalThis.fetch = async (url, options) => {
    assert.equal(options.headers.Authorization, `Bearer ${token}`);
    assert.equal(url, 'https://api.github.com/repos/celteducational21-svg/agentic-bounty-hunter');
    return new Response(JSON.stringify({ message: token }), { status, headers: {
      'x-ratelimit-limit': '5000', 'x-ratelimit-remaining': '4999', 'x-ratelimit-reset': '1800000000',
    } });
  };
  try {
    for (status of [200, 401]) {
      let body;
      const response = { setHeader() {}, status() { return this; }, json(value) { body = value; } };
      await handler({ method: 'GET' }, response);
      assert.equal(body.authenticated, status === 200);
      assert.equal(body.credentialSource, 'ABH_GITHUB_TOKEN');
      assert.equal(body.rateLimit, 5000);
      assert.equal(JSON.stringify(body).includes(token), false);
      assert.equal('responseBody' in body, false);
    }
  } finally {
    globalThis.fetch = oldFetch;
    if (oldToken === undefined) delete process.env.ABH_GITHUB_TOKEN;
    else process.env.ABH_GITHUB_TOKEN = oldToken;
  }
});
