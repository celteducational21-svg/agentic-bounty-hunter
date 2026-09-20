# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## `objectMode: true` does not change the TypeScript return type

Issue: https://github.com/sindresorhus/globby/issues/177

Globby delegates object-mode execution to `fast-glob` and returns entry objects at runtime, but the async and sync declarations always report `string[]`.

Acceptance criteria:

- Async calls with literal `objectMode: true` infer entry objects.
- Sync calls with literal `objectMode: true` infer entry objects.
- Omitted options and `objectMode: false` continue to infer `string[]`.
- Stream use with object mode remains assignable to the existing stream contract.
- Add runtime and compile-time regressions and run the practical runtime, type, and lint checks.

Pre-fix SHA: `c1a3b3244ae992ba7e7e76f501a510ea0d9306df`

Use only this packet and the exact pre-fix repository. Accepted fixes, post-fix source, current main, and issue timelines or comments are out of bounds until independent QA is frozen.
