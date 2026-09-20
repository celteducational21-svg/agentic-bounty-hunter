# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## Queue does not drain when two jobs are aborted in the same turn

Issue: https://github.com/sindresorhus/p-queue/issues/168

With concurrency 1, enqueue two never-settling abort-aware jobs using separate `AbortSignal` instances. If both controllers abort in the same timer turn, both returned promises reject with `AbortError`, but the queue remains stuck instead of draining.

Acceptance criteria:

- Both returned promises reject with `AbortError`.
- `queue.size === 0` and `queue.pending === 0` after settlement.
- `queue.onIdle()` resolves.
- A deterministic local regression covers the same-turn abort lifecycle.
- The existing build and practical test suite remain green.

Pre-fix SHA: `c905aaf2a826c4581a604ee6bbb1ae41b062a598`

Use only this packet and the exact pre-fix repository. Accepted fixes, post-fix source, current main, issue timelines, and comments are out of bounds until independent QA is frozen.
