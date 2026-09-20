# Cohort 2 lessons and controls

> **SIMULATION / HISTORICAL REPLAY — NOT PAID WORK**

## What the run established

- The separated curator → solver → QA → auditor chain can reproduce and resolve varied Python and JavaScript defects.
- Independent QA alone was insufficient: it returned three false positives in ten cases.
- Comparison with the hidden historical fix was effective as a final semantic oracle, provided it occurred only after the solver revision was frozen.
- The repair loop worked on all three misses without discarding or rewriting the failed evidence.

## Controls adopted

| Risk exposed | Required control |
| --- | --- |
| A narrow output assertion misses API call-boundary behavior | Assert both observable output and relevant collaborator calls/state transitions. |
| Truthy fallback erases valid zero/empty values | Test presence separately from truthiness; always include zero, empty, false, and undefined cases. |
| Cooperative mocks hide lifecycle ownership bugs | Add at least one uncooperative or never-settling dependency in cancellation/timeout tests. |
| A repaired patch inherits a stale QA approval | Match QA and audit records to the exact current revision; rerun both after every repair. |
| A clean final result hides learning | Preserve failed solver, QA, audit, logs, and patch under an immutable attempt directory. |
| Historical toolchains fail for unrelated reasons | Record baseline failures and compatibility pins; do not call them patch regressions or silently omit them. |
| Unmeasured execution time invites invented metrics | Report duration only from captured machine evidence; otherwise leave it null. |

## Recommended next benchmark gate

Before any live public submission phase, require another cohort to meet all of these conditions:

1. At least ten fresh cases that were not used to tune the current prompts.
2. At least two languages beyond the current Python/JavaScript coverage when compatible toolchains are available.
3. Automated timestamps for proof and solve stages.
4. Mandatory adversarial boundary generation based on value domains and lifecycle ownership.
5. Zero stale revision approvals and complete attempt preservation.
6. Human approval before any external issue comment, pull request, claim, or payment action.
