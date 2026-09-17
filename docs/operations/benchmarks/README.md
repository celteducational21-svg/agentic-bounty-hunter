# ABH delivery lab

**SIMULATION / HISTORICAL REPLAY — NOT PAID WORK**

This area is independent of live bounty state, discovery counts, payouts and customer wins. Historical issues were already resolved upstream. Local replay branches and submission drafts must never be published as new solutions to those issues.

## Protocol

1. Intake curator verifies the original issue, accepted historical fix and pre-fix SHA. Accepted-fix material stays in a separate audit workspace until solution and independent QA are frozen.
2. Solver receives only the original issue requirements, pre-fix source snapshot and repository instructions. Snapshots omit future Git history. Solver does not browse upstream discussions or accepted patches. Isolation is a worker protocol and filesystem separation, not a claim of an operating-system security boundary between agents.
3. Solver records setup, baseline, failing reproduction, root cause, changes and exact verification commands with output. It freezes its patch and local revision before independent QA.
4. A separate QA session verifies requirements and the frozen solution without accepted-fix access. Failures return to Solver; every changed revision needs new QA.
5. Submission preparation creates local branch/commit information, PR title/body, issue link and evidence. Public submission requires separate exact owner approval and is not performed in this lab.
6. Only after QA freeze may the auditor compare with the historical fix. Behavioral correctness matters, not textual patch similarity.
7. Preserve failures, repairs, command limitations and measured elapsed effort. Missing evidence is NOT_RUN or unverified, never PASS.

The target is 12 jobs from at least six repositories, approximately six easy, four medium and two bounded harder cases. Selected tasks must exclude security vulnerabilities, proprietary infrastructure and specialized hardware. Difficulty is an intake estimate, not a promised completion time. The original issue may itself contain a proposed solution; any such contamination must be disclosed and excluded or sanitized before handoff.

## Metrics

Count jobs attempted, setup/reproduction/root-cause/solution successes, first-pass QA, repair success, submission-ready cases, abandonments and observed regression failures. Report measured proof/solve wall time separately from unavailable active model-compute or token-cost metrics. Report worker and category breakdowns. Record human-gate detections and attempted versus successful gate bypasses separately. No historical merge or payment counts as an ABH outcome.

Control drills use the production transition library with separate simulation records. Synthetic approval and submission receipts may only exist in explicitly marked drill fixtures. No drill may alter `docs/operations/state.json` or call public submission tools.

Stage 2 source research starts only after the Stage 1 results report is frozen. An unsuccessful certification must remain visible even if source research proceeds.
