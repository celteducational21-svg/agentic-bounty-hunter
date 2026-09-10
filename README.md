# Agentic Bounty Hunter

Standalone system for discovering and qualifying paid, clearly scoped software bounties. It is intentionally separate from ARES.

## Live deployment

- Dashboard: https://agentic-bounty-hunter.vercel.app
- API: https://agentic-bounty-hunter.vercel.app/api/opportunities
- Phase 1 validation: PASS (2026-09-10)
- Phase 2: opportunity intelligence, evidence-backed ranking, and hard rejection gates

## Current scope

- Phase 0: repository, operating policy, deterministic qualification engine, dashboard, and test suite.
- Phase 1: live GitHub discovery through public APIs, normalization, and deduplication.
- Phase 2: reward, legitimacy, claims/competition, repository health, scope clarity, AI solvability, effort, and weighted WIN scoring.
- Human approval remains mandatory before claiming work, posting comments, opening pull requests, or accepting legal/payment terms.

## Qualification policy

Hard rejection gates run before scoring. Unverified sources, mirrors, grants, Upwork-routed issues, suspicious/illiquid token rewards, assignments, completed solutions, stale work, archived repositories, inaccessible infrastructure, and prohibited work cannot become HUNT. Shallow-only analysis is capped below HUNT.

## Local verification

```bash
npm test
BASE_URL=https://your-deployment.example npm run validate:live
BASE_URL=https://your-deployment.example npm run snapshot:live
```

No secrets are required. `GITHUB_TOKEN` is optional and raises GitHub API limits. Phase 2 remains analysis-only: no claims, comments, forks, PRs, wallet disclosure, terms, or contractual actions.
