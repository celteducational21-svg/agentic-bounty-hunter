# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**PASS**, frozen revision `3a333c54c91bc117268e0d63be7933e65df851ca`.

Compared after freeze against accepted [p-map PR77](https://github.com/sindresorhus/p-map/pull/77), fix `82b8cdc26d9910c1a9abe6813ddad5f3a55f88b2`. Both reserve concurrency before awaiting `iterator.next()` and release the slot when the source is exhausted. Historical code renames the counter and increments at the beginning of the immediately invoked async closure; replay increments immediately outside it. The slot timing is equivalent.

Replay adds six combinations spanning concurrency/backpressure and skipped items. Independent QA covers 15 cases, with eight failures reproduced on baseline and every case passing after. Final 55 AVA tests, XO and tsd pass. A timing-sensitive pre-existing performance assertion failed once, then passed isolated and in the full rerun without code changes; the exact failure remains recorded.

Scope stays focused on scheduler accounting. No broader cancellation guarantees are claimed. Runtime validation is Node24 Linux, not the minimum Node18. Ready for simulated owner approval only.
