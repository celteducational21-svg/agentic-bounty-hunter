# Independent QA — job-04 iteration 2

Reviewer: `independent_qa_6`  
Revision: `8c949104b87b91f09a96687b1a46f8e71f835538`  
Verdict: **PASS**  
First pass: **false**; this is repaired iteration 2.

The exact pre-fix revision was checked out and only the current patch applied. Reconstructed tree `ccc753104946fda43e66f810e76d976cf428619e` and supplied metadata reproduce the current revision exactly. Attempt 1 remains preserved and confirms the former callback-cooperation flaw and stuck queue state.

Independent callbacks deliberately accepted no signal and never settled. Both same-turn abort orders reject both additions with `AbortError`, drain size and pending to zero, resolve `onIdle`, and allow following work. Additional probes cover aborting the queued job first, a pre-aborted queued state, synchronous abort from a running callback, listener removal after success/abort/error, non-abort error identity, and a late rejection from underlying work after queue-owned abort without an unhandled rejection.

| Check | Result | Evidence |
|---|---|---|
| Acceptance criteria | PASS | Both adds reject, accounting drains, and onIdle resolves. |
| Tests | PASS | Native focused 1; full AVA 45 passed and 2 known failures. |
| Regressions | PASS | Abort orders/states, cleanup, following work, and ordinary errors pass. |
| Explainability | PASS | Queue-owned abort race plus finally cleanup covers every lifecycle path. |
| PR readiness | PASS | Focused lifecycle change, deterministic regression, exact reconstruction. |
| Build | PASS | TypeScript build and package prepare pass. |
| Lint | PASS_WITH_WARNING | XO exits 0 with two pre-existing TODO warnings. |
| Typecheck | PASS | Production TypeScript compilation passes. |

Linux only; no accepted fix was inspected and no public action was taken.
