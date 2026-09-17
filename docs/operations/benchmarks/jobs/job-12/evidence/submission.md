# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID
Title: Reserve pMapIterable concurrency while reading async sources
Branch: solver-b/job-12-reserve-concurrency
Commit: 3a333c54c91bc117268e0d63be7933e65df851ca
Issue: sindresorhus/p-map#76

Concurrent spawn paths can pass the capacity check while iterator.next() is pending because the mapper count is incremented only after that await. Reserve capacity before starting the read and release it when the source is exhausted. This keeps the concurrency limit effective even when backpressure allows extra buffered tasks.

Adds six async-source regressions across concurrency1–3 and finite/unbounded backpressure, with skip handling and output-order checks. All six fail baseline and pass fixed code. Exact issue reproduction changes from max2 to max1. npm test passes lint,55 tests,and type tests. No build step applies. No PR published; independent QA pending.
