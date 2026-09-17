# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID
Inspected supplied package.json, index.js and tests before npm install --ignore-scripts --no-audit --no-fund --package-lock=false. Node24.19.0. No runtime dependencies. Baseline npm test passes XO, 49 AVA tests and tsd.

Native node:events getEventListeners reproduction shows 1 retained listener after pMap settles (initial count 0). Lifecycle script shows the same for success, empty, skip, mapper rejection, aggregated rejection, iterator rejection and pre-aborted signal. Exact commands/output in commands.log. The anonymous handler is never removed; pre-aborted flow additionally registers after rejecting. Root proof sent before implementation.

Nine regression tests fail against a local pre-fix copy, each with an extra listener. First regression run used deepEqual on arrays containing retained functions and timed out during failed-test reporting; replaced those with scalar listener-count assertions and identity membership checks. The final regression run fails promptly on all 9 baseline cases. No upstream source consulted.
