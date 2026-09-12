// Read-only public-source transport. Never persist headers containing credentials.
export function classifyFailure(status, message, headers = {}) {
  if (![403, 429].includes(status)) return status === 401 ? 'PERMISSION' : 'UNKNOWN';
  if (/secondary rate|abuse detection/i.test(message)) return 'SECONDARY_RATE_LIMIT';
  if (headers['x-ratelimit-remaining'] === '0' || /API rate limit exceeded/i.test(message)) return 'RATE_LIMIT';
  if (/resource not accessible|permission|requires authentication|bad credentials/i.test(message)) return 'PERMISSION';
  if (/blocked|restriction|not supported|disabled|legal reasons/i.test(message)) return 'ENDPOINT_RESTRICTION';
  return 'UNKNOWN';
}
export function requestCategory(url) {
  const u = new URL(url);
  if (u.hostname !== 'api.github.com') return u.hostname === 'app.opire.dev' ? 'PROVIDER' : 'REPOSITORY_FILE';
  if (u.pathname.startsWith('/search/')) return 'SEARCH';
  if (/\/comments$/.test(u.pathname)) return 'COMMENTS';
  if (/\/timeline$/.test(u.pathname)) return 'TIMELINE';
  if (/\/pulls\//.test(u.pathname)) return 'PR_DETAIL';
  if (/\/issues\//.test(u.pathname)) return 'ORIGINAL_ISSUE';
  return 'REPOSITORY';
}
export function createBudget({ fetchImpl = fetch, maxRequests = 120, deadlineMs = 50000, timeoutMs = 8000, token = process.env.ABH_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)) } = {}) {
  const started = Date.now(), cache = new Map(), requests = [], paused = new Map();
  let githubQueue = Promise.resolve();
  async function perform(url, type) {
    const github = new URL(url).hostname === 'api.github.com';
    const category = requestCategory(url), resource = category === 'SEARCH' ? 'search' : 'core';
    for (let attempt = 0; attempt < 2; attempt++) {
      const remaining = deadlineMs - (Date.now() - started);
      if (requests.length >= maxRequests || remaining <= 0) return { ok: false, retryable: true, reason: 'ENRICHMENT_BUDGET_EXHAUSTED', url };
      const pause = github && (paused.get('all') ?? paused.get(resource));
      if (pause && pause.until > Date.now()) return { ok: false, retryable: true, reason: pause.reason, retryAt: new Date(pause.until).toISOString(), url };
      const record = { url, endpoint: new URL(url).pathname, category, authenticated: github && Boolean(token), attemptedAt: new Date().toISOString(), attempt: attempt + 1 };
      requests.push(record);
      const headers = { Accept: type === 'json' ? 'application/vnd.github+json' : 'text/html,text/plain', 'User-Agent': 'ABH/2.3' };
      if (github && token) headers.Authorization = `Bearer ${token}`;
      try {
        const response = await fetchImpl(url, { headers, signal: AbortSignal.timeout(Math.max(1, Math.min(timeoutMs, remaining))), redirect: 'error' });
        record.status = response.status;
        for (const key of ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset', 'retry-after']) record[key] = response.headers?.get?.(key) ?? null;
        if (!response.ok) {
          const body = await response.text?.() ?? '';
          record.responseBody = (token ? body.split(token).join('[REDACTED]') : body).slice(0, 1500);
          try { record.message = JSON.parse(record.responseBody).message ?? record.responseBody; } catch { record.message = record.responseBody; }
          record.failureClass = classifyFailure(response.status, record.message, record);
          if (github && ['RATE_LIMIT', 'SECONDARY_RATE_LIMIT'].includes(record.failureClass)) {
            const reset = Number(record['x-ratelimit-reset']) * 1000;
            const retryAfter = record['retry-after'];
            const until = Math.max(Date.now() + 60000, Number.isFinite(Number(retryAfter)) ? Date.now() + Number(retryAfter) * 1000 : Date.parse(retryAfter) || 0, record.failureClass === 'RATE_LIMIT' ? reset || 0 : 0);
            paused.set(record.failureClass === 'SECONDARY_RATE_LIMIT' ? 'all' : resource, { until, reason: record.failureClass });
            record.retryAt = new Date(until).toISOString();
          }
          // Only transient server failures receive one short retry. Rate limits defer
          // beyond this scan; permission/restriction failures are never retried.
          if (response.status >= 500 && attempt === 0 && remaining > 2000) { await sleep(500); continue; }
          return { ok: false, status: response.status, reason: record.failureClass === 'UNKNOWN' ? `HTTP_${response.status}` : record.failureClass, retryable: ![401, 404].includes(response.status) && !['PERMISSION', 'ENDPOINT_RESTRICTION'].includes(record.failureClass), url };
        }
        const data = type === 'json' ? await response.json() : await response.text();
        return { ok: true, data, url };
      } catch (error) { record.error = error.name; const detail = String(error.cause?.message ?? error.message ?? error.name); record.message = (token ? detail.split(token).join('[REDACTED]') : detail).slice(0, 1000); return { ok: false, reason: error.name, retryable: true, url }; }
    }
  }
  function request(url, type = 'json') {
    if (cache.has(url)) return cache.get(url);
    // Serial API reads avoid secondary-limit bursts; public file/provider reads
    // can overlap without carrying GitHub authorization.
    const job = new URL(url).hostname === 'api.github.com' ? githubQueue.then(() => perform(url, type)) : perform(url, type);
    if (new URL(url).hostname === 'api.github.com') githubQueue = job.catch(() => {});
    cache.set(url, job); return job;
  }
  return { request, requests, cache, started };
}
