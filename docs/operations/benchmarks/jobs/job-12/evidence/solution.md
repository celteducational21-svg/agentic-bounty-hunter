# Solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Reserve the mapper slot synchronously before starting the async source request; release it when source reports done. Existing mapper completion and error behavior remains. Pending reads count against concurrency, so multiple spawn paths cannot reserve the same free capacity.

Six new regressions measure actual simultaneous mappers rather than elapsed time, exercise async source at concurrency1/2/3 and finite/Infinity backpressure, and check pMapSkip plus ordered results. Exact issue reproduction now maximum1 with sequential events. Full npm test passes XO lint,55 AVA tests (including existing backpressure/error/empty-source cases), and tsd. Initial test-only lint style errors corrected; one functional implementation iteration. Build N/A: directly shipped JavaScript, no build command. Node24 Linux tested; minimum Node18 not tested. Independent QA pending.
