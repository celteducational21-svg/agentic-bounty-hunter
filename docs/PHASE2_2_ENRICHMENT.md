# Phase 2.2 staged enrichment

Status: INCOMPLETE until the fixed production audit establishes every quality gate.

Existing normalization, legacy scoring helpers, history schema, dedicated Supabase URL guard and human-action boundary remain. New `src/live/pipeline.js` orchestrates cheap screening, canonical resolution, payment inspection, competition inspection and repository inspection. Final scores are null until all five steps complete; transport/deadline failures produce INCOMPLETE, not REJECT. Hard ineligibility gates still override. A completed inspection can conclude payment is uncertain; it does not invent funding.

The preliminary priority uses direct reward wording, provider linkage and task clarity, independent of final scores. Five survivors receive enrichment; obvious assigned/closed/policy-invalid entries do not consume that budget. Two workers share per-request and per-repository promises. Limits: 120 requests, 45-second enrichment deadline, 8-second per-request timeout, three comment pages, two timeline pages, 100 PR search results and ten referenced PR detail reads. All limits are recorded and incompleteness is explicit. Discovery is limited to public GitHub issues; a targeted Opire query replaces the ambiguous currency query.

Canonical resolver follows up to three exact GitHub issue URLs and detects cycles. A copied issue’s original public repository must be established before fetching it. 404 original sources are ineligible; timeouts/rate limits are retryable. Canonical duplicates are consolidated while retaining discovery provenance.

Repository inspection reads metadata and a bounded recursive tree, identifies present README/CONTRIBUTING/build manifests/workflows, reads those files, and inspects directly referenced Node test entrypoints. A truncated tree or missing required file prevents completion. Commands are analyzed, never executed. Unified blocker evidence promotes repository credentials, physical hardware, private infrastructure and mainnet requirements to HIGH hidden-blocker risk and hard rejection.

## Opire

Read-only adapter: `src/providers/opire.js`. It parses the issue-specific public listing summary, checks exact GitHub URL linkage, captures advertised USD total, available/paid reward counts and trying/claiming solver counts. It never parses unrelated catalogue totals as the task reward. Solver counts may overlap and are not added. Missing actor identities leave cross-source competition totals UNKNOWN.

Official mechanics checked 2026-09-12:

- https://docs.opire.dev/overview/commands — dollar-denominated task rewards, attempts and post-solution claims.
- https://docs.opire.dev/overview/getting-started — payment is not automatic; creators pay after confirming requirements, separately when multiple sponsors exist.
- https://docs.opire.dev/rewards/lifecycle — reward/claim lifecycle and separate creator obligations.
- https://opire.dev/home — anyone may sponsor a public issue; creator chooses who receives payment.

Funding model: PAY_ON_ACCEPTANCE, never automatic escrow/pre-funding. Stripe and no-funds-held mechanics follow the user-provided current Opire behavior; the official pages above verify post-acceptance payment but did not independently expose all processor details during this check. Creator identity and same-issuer paid history are UNKNOWN in the public summary. Platform verification, listing verification, issuer authority, funding status and payment confidence remain separate. An exact listing with unknown creator remains PARTIAL, not STRONG or VERIFIED.

No other provider adapter is claimed. Generic GitHub-native payment evidence remains conservative. Third-party sponsorship alone is not a rejection, but an unrelated comment cannot prove payment authority.

## Persistence and audit

JSONB storage requires no migration. Material state includes enrichment state, funding/listing/issuer fields and blockers. Phase2.2 scan summaries retain the immutable complete payload under `frozenSnapshot`; `?snapshot=<ISO timestamp>` reads it without searching or rescoring. The dashboard can load the same snapshot and exposes its exact data read-only. Existing material history and its timestamp deduplication are preserved.

No new database, credentials, scheduler, bounty claims/comments, forks, solution PRs, external registration, wallet disclosure or transactions are introduced. HUNT additionally requires FULLY_ENRICHED; incomplete candidates have no final score. No Phase3 work starts here.
