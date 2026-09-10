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

- Extract exact reward amount/currency and claim rules.
- Repository health, maintainer responsiveness, competition, stack, and effort estimation.
- Persist snapshots and explain every score.

## Phase 3 — Proof and approval

- Reproduction sandbox, solution plan, cost/value estimate, and evidence pack.
- User approval queue before any claim, comment, application, or pull request.
