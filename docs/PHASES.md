# Delivery phases

## Phase 0 — Foundation

- Standalone repository and deployment.
- Deterministic normalized opportunity model and scoring policy.
- Live-ready dashboard and API boundary.
- Safety boundary: discovery is automated; external representation is not.
- Unit tests for reward, assignment, scoring, and deduplication gates.

Exit gate: tests pass, production deployment is healthy, and no secret is required.

## Phase 1 — Live validation

- Query real GitHub issues from three bounty/reward searches.
- Normalize and deduplicate results.
- Prove timestamps, source URLs, scores, and decisions are valid.
- Record raw, unique, and decision counts from the deployed runtime.

Exit gate: live endpoint returns non-empty real results and the validation script passes every assertion.

## Phase 2 — Opportunity intelligence

Status: INCOMPLETE / exit gate NOT PASSED. See PHASE2_LIVE_VALIDATION.md.
Durable production history is a Phase 2 requirement, not deferred completion credit for Phase 3.

- Extract reward amount/currency/range, payment platform/trigger/risk, and credible USD estimates.
- Detect mirrors, grants, Upwork routing, assignments, claims, abandoned claims, related PRs, suspicious tokens, and prompt injection.
- Inspect repository activity, setup/build signals, tests, CI, lint/type checking, scope criteria, AI solvability, and effort.
- Apply hard rejection gates before the weighted WIN score; output `HUNT`, `WATCH`, `SKIP`, or `REJECT` with evidence.
- Retain stable opportunity IDs and state-change snapshots. Browser history and the snapshot CLI are durable; serverless in-memory history is best-effort until a production database is connected.

Exit gate: production and tests healthy; live ingestion works; false positives materially reduced; top five manually checked; ranking quality demonstrated; no external action performed. It is valid to return zero HUNT candidates.

## Phase 3 — Proof and approval

- Add a durable production opportunity store and scheduled revalidation.
- Build a read-only candidate dossier: reproducibility sandbox plan, solution outline, cost/value estimate, and evidence pack.
- Add an explicit user approval queue before any claim, comment, fork, terms acceptance, wallet disclosure, or pull request.
