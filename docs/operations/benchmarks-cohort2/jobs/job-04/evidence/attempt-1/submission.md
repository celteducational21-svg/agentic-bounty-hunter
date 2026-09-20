# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Drain the queue after skipping an already-aborted job

Branch suggestion: `solver-a/job-04-abort-drain`

Commit: `9c75913a771fc773c00b2bac053d06a2464beb1d`

Issue: `sindresorhus/p-queue#168`

An already-aborted job incremented the pending count, directly rejected its add promise, and returned before the shared `#next()` cleanup. When a running job and the next queued job were aborted in the same turn, the queued job took this path and left `pending` stuck at 1 even though both promises had rejected and the queue was empty.

Throw `AbortError` into the existing task-error path instead. The catch block rejects and emits the error event, then execution reaches `#next()` to decrement pending and continue normal queue processing.

The regression uses concurrency 1, separate abort signals, two abort-aware never-settling jobs, and one timer callback that aborts both controllers. It verifies both `AbortError` rejections, size 0, pending 0, and `onIdle()` completion.

Validation on Linux: TypeScript build passes; focused behavior passes; the complete practical suite passes through a temporary TypeScript-to-JavaScript harness (45 passed, 2 known failures, 0 unexpected failures); XO exits 0 under Node 16.20.2 with two pre-existing TODO warnings; diff check passes. The historical AVA 4/ts-node 10 ESM loader cannot directly discover the TypeScript suite on available Node runtimes, so no dependency changes were made and the limitation is disclosed. No PR was published; independent QA is pending.
