# Independent QA — PASS

SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Reviewer `control_drills_qa`; frozen revision `3a333c54c91bc117268e0d63be7933e65df851ca`. Separate QA copy; original Solver repository remains clean. No historical accepted solution was read.

The root cause is a concurrency reservation made after awaiting the asynchronous source. The patch reserves before that await and releases the reservation for exhausted input. This directly prevents simultaneous spawns from observing the same free slot, with a small understandable change and focused regression tests.

Fifteen independently authored checks passed: concurrency1/2, backpressure equal/greater/infinite, immediate and delayed async input, skipped results, index/output ordering, consumer backpressure, mapper failure with settled work, source rejection and empty input. On the historical parent eight checks fail, measuring two or three active mappers under limits one or two. All fifteen pass the frozen solution.

The first full npm test run hit a timing-sensitive existing performance-ratio assertion for a separate pMapSkip path. The exact failure is retained. Isolated performance retry and the complete npm test rerun both passed without Solver changes: XO,55AVA tests,tsd. This is one transient observed failure, not hidden as a flawless first execution. Independent tsd and syntax checks also passed. No build command exists for this direct ES-module package; build is NOT_APPLICABLE, not fabricated PASS.

The submission patch is focused and explainable. QA requires no code repair. Tests ran on Node24/Linux only. Commands/output are in `qa-commands.log`; independent tests are in `qa-independent-tests.mjs` (original import is relative to QA scratch layout).
