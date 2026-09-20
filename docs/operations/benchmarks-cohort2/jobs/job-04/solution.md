# job-04 solution — iteration 2 — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `8c949104b87b91f09a96687b1a46f8e71f835538`

Iteration one revision `9c75913a771fc773c00b2bac053d06a2464beb1d` fixed only the already-aborted queued path. Its regression callbacks listened to their own signals, so the test did not prove queue-owned cancellation. That attempt failed audit and is preserved in full under `evidence/attempt-1/`.

The repaired lifecycle creates an abort promise owned by PQueue before invoking the task, races it against the task operation, and removes the signal listener during cleanup. An abort therefore rejects the `add()` promise with `AbortError` even when the running callback ignores its signal and never settles.

Cleanup now lives in `finally`, so every completion path decrements `#pendingCount` and advances the queue. An already-aborted queued task throws into the same catch/finally path. Ordinary task errors retain their identity, and following tasks continue to run.

The focused regression exactly uses concurrency 1, two separate signals, and two callbacks that return never-settling promises without accepting or observing a signal. Both controllers abort in the same timer callback. The test verifies both `AbortError` rejections, size 0, pending 0, `onIdle()` completion, a following result of 42, and preservation of a sentinel non-abort error.

The TypeScript build passes. The focused generated AVA test passes 1/1; the complete practical suite passes 45 tests with 2 known failures and 0 unexpected failures; XO exits 0 under Node 16.20.2 with two pre-existing TODO warnings; direct probes pass both abort orders and synchronous in-task abort. Fresh independent QA and audit are pending.
