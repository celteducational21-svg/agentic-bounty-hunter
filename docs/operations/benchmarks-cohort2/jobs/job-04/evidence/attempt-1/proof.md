# job-04 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was fetched directly at `c905aaf2a826c4581a604ee6bbb1ae41b062a598` with a depth-one fetch. Its remote was removed immediately. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

A deterministic script built the pre-fix source, created a queue with concurrency 1, and enqueued two jobs that reject with `AbortError` when their separate signals abort. A single timer callback aborted both controllers. Both returned promises rejected correctly, but the queued already-aborted job leaked the pending counter and idle never resolved:

```text
{"results":[true,true],"size":0,"pending":1,"idle":false}
```

## Root cause

Each dequeued job increments `#pendingCount` before checking whether its signal was already aborted. In the already-aborted branch, the code directly rejects the outer promise and returns from `run`. That early return bypasses the common `#next()` call below the try/catch. The counter therefore remains incremented after the second job is dequeued, even though its promise has rejected and the internal queue is empty.

## Fix proof

Throw `AbortError` from the already-aborted branch instead of directly rejecting and returning. The existing catch block rejects the add promise and emits the error event; control then reaches the shared `#next()` cleanup, decrementing the pending count and continuing queue processing. This uses the same lifecycle path as any other task failure.

The regression uses concurrency 1 so the first abort-aware job is running while the second remains queued. Both controllers abort in one timer callback. It verifies both `AbortError` rejections, `size === 0`, `pending === 0`, and successful `onIdle()` completion.

Validation results:

- Compiled focused reproduction: both rejections are `AbortError`, size 0, pending 0, idle resolved.
- TypeScript build/typecheck: passed.
- Focused AVA regression through a generated JavaScript test harness: 1 passed.
- Complete practical AVA suite through the same harness: 45 passed, 2 known failures, 0 unexpected failures.
- XO lint under Node 16.20.2: exit 0 with two pre-existing TODO warnings.
- `git diff --check`: passed before freeze.

The historical AVA 4 plus ts-node 10 ESM-loader path cannot load the TypeScript tests directly under the available Node 18/24 runtimes, and timed out during discovery under Node 14/16. To avoid altering dependencies or product code, the unchanged TypeScript test file was transpiled with the repository's installed TypeScript compiler to a temporary JavaScript file, its source import was redirected to the freshly built `dist`, and AVA ran the full test corpus from that temporary file. The generated file and config were removed after validation. Independent QA remains pending.
