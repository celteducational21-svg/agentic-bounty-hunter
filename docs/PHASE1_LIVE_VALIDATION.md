# Phase 1 live validation

Run date: 2026-09-10T08:43:44Z

## Verdict

PASS

The production deployment at `https://agentic-bounty-hunter.vercel.app` returned HTTP 200 for both the dashboard and discovery API. The API exercised the live GitHub Search API; source retrieval, normalization, deduplication, deterministic scoring, decision classification, and canonical GitHub URL checks all passed.

## Evidence

| Check | Result |
| --- | ---: |
| Live queries | 3 |
| Raw issues | 60 |
| Unique issues | 52 |
| Returned candidates | 30 |
| SHORTLIST | 3 |
| REVIEW | 27 |
| Production dashboard | HTTP 200 |
| Production API | HTTP 200 |
| Canonical source URLs | PASS |
| Score bounds (0-100) | PASS |
| Deduplication | PASS |

## Automatic shortlists

1. `Research: como editan mapas los otros proyectos de Argentum Online` — score 100.
2. `[EASY BOUNTY: 1 RTC] BoTTube First Impression — Tell Us What You Think` — score 77.
3. `[EASY BOUNTY: 1 RTC] Set Up Your BoTTube Profile` — score 77.

These are discovery candidates only, not approved jobs. Reward legitimacy, payment value, platform reputation, claim availability, legal terms, and expected-effort economics must be verified before any action.

## Quality findings for Phase 2

- Keyword discovery produces unrelated reward-system issues and bounty mirrors; stronger issuer and source validation is required.
- Token-denominated rewards need price/liquidity and payment-history checks before ranking.
- Impossible or suspicious requirements must be rejected by feasibility analysis.
- Human approval remains mandatory before claims, comments, wallet disclosure, pull requests, or terms acceptance.

## Validation command

`BASE_URL=https://agentic-bounty-hunter.vercel.app node scripts/validate-live.mjs`

Completed at `2026-09-10T08:43:44.518Z` with exit code 0.
