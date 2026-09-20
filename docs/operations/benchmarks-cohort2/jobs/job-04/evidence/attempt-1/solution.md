# job-04 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `9c75913a771fc773c00b2bac053d06a2464beb1d`

The already-aborted path in `add()` now throws `AbortError` into the existing task-failure lifecycle instead of rejecting and returning early. The existing catch block performs promise rejection and error emission, after which the shared `#next()` cleanup decrements `#pendingCount` and processes the remaining queue.

The regression test uses concurrency 1 and two abort-aware jobs with separate controllers. Both controllers abort in the same timer callback. The test verifies that both job promises reject with `AbortError`, the queue drains to size 0 and pending 0, and `onIdle()` completes.

The TypeScript build passes. A full practical test run of the repository's test source, transpiled to a temporary JavaScript harness because the historical AVA/ts-node loader is incompatible with available runtimes, reports 45 passed and 2 known failures with no unexpected failures. XO exits successfully under Node 16.20.2 with two unrelated existing TODO warnings. Generated validation files were removed. Independent QA is pending.
