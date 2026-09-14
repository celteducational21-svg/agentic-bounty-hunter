import { createBudget } from '../src/live/request-budget.js';

// Fixed public endpoint and allowlisted metadata only: never return credentials,
// request headers, GitHub response bodies, or private account information.
export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'GET') return response.status(405).json({ error: 'Method not allowed' });
  const source = process.env.ABH_GITHUB_TOKEN ? 'ABH_GITHUB_TOKEN' : process.env.GITHUB_TOKEN ? 'GITHUB_TOKEN' : 'NONE';
  const budget = createBudget({ maxRequests: 1, deadlineMs: 10000 });
  const result = await budget.request('https://api.github.com/repos/celteducational21-svg/agentic-bounty-hunter');
  const record = budget.requests[0] ?? {};
  const limit = Number(record['x-ratelimit-limit']) || null;
  const reset = Number(record['x-ratelimit-reset']) || null;
  return response.status(200).json({
    checkedAt: new Date().toISOString(), credentialSource: source,
    authorizationSent: record.authenticated === true,
    authenticated: result.ok && record.authenticated === true && limit > 60,
    githubStatus: record.status ?? null, rateLimit: limit,
    remaining: record['x-ratelimit-remaining'] == null ? null : Number(record['x-ratelimit-remaining']),
    resetAt: reset ? new Date(reset * 1000).toISOString() : null,
    failure: result.ok ? null : result.reason,
  });
}
