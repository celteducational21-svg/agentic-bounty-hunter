# Unpublished PR draft — iteration 2 — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Own abort cancellation and cleanup in the queue lifecycle

Branch suggestion: `solver-a/job-04-abort-lifecycle-v2`

Commit: `8c949104b87b91f09a96687b1a46f8e71f835538`

Issue: `sindresorhus/p-queue#168`

PQueue previously checked a signal only when a queued task began. Once a task was running, the returned `add()` promise could remain pending forever unless the callback implemented its own signal listener. The already-aborted early return could also bypass pending-count cleanup.

Install a queue-owned abort promise before invoking signaled work and race it against the task operation. Route both aborts and ordinary failures through the existing rejection path, then remove the listener and call `#next()` in `finally` so accounting and queue progression are guaranteed.

The regression uses concurrency 1 and two callbacks that return never-settling promises without observing their signals. Both controllers abort in one timer callback. Both add promises reject with `AbortError`, size and pending reach zero, and `onIdle()` resolves. The test also verifies a following task and non-abort error identity.

Validation: TypeScript build passes; focused regression passes; practical suite passes 45 tests with 2 known failures; XO exits successfully under Node 16.20.2 with two pre-existing TODO warnings; direct probes pass both abort orders and synchronous in-task abort.

This is repair iteration two. The first revision failed historical audit; its complete solver, QA, and audit record is preserved under `evidence/attempt-1/`. No PR was published. Fresh independent QA and audit are pending.
