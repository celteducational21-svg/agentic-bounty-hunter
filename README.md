# Agentic Bounty Hunter

Standalone system for discovering and qualifying paid, clearly scoped software bounties. It is intentionally separate from ARES.

## Live deployment

- Dashboard: https://agentic-bounty-hunter.vercel.app
- API: https://agentic-bounty-hunter.vercel.app/api/opportunities
- Phase 1 validation: PASS (2026-09-10)

## Current scope

- Phase 0: repository, operating policy, deterministic qualification engine, dashboard, and test suite.
- Phase 1: live GitHub discovery through public APIs, normalization, deduplication, scoring, and evidence-based validation.
- Human approval remains mandatory before claiming work, posting comments, opening pull requests, or accepting legal/payment terms.

## Qualification policy

The engine favors beginner-friendly, recent, well-scoped opportunities with an explicit reward signal. Candidates without a reward signal are rejected. Security-sensitive, stale, oversized, assigned, or ambiguous items are penalized or rejected.

## Local verification

```bash
npm test
BASE_URL=https://your-deployment.example npm run validate:live
```

No secrets are required for Phase 0. `GITHUB_TOKEN` is optional and raises GitHub API limits when configured in the deployment environment.
