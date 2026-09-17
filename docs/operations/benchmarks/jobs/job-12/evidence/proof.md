# job-12 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

Started 2026-09-17T10:37:52Z. Only supplied packet/source inspected. Package test is xo && ava && tsd, no build/custom install. Dependencies installed with lifecycle scripts disabled. Node24.19.0 Linux.

Baseline dependency-free script uses the issue's async-generator source and mapper, shortening its delay from1000ms to10ms. Observed maximum2 with concurrency1 and backpressure2; events start1/end1/start2/start3/end2/end3 exactly reproduce issue ordering. Assertion max==1 fails. Six AVA regressions independently fail at concurrency1/2/3 with backpressure concurrency+1 or Infinity, each reaches concurrency+1. Full exact commands/output logged. Proof completed 2026-09-17T10:39:23Z.

Root cause: trySpawn checks runningMappersCount, starts an async task, and increments count only after await iterator.next(). While pending, another spawn (from mapper completion or consumer removing buffered result) sees that slot as free. Both pass the concurrency gate, then both invoke mappers.
