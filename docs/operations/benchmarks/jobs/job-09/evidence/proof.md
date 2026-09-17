# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID
Inspected package/build/CI configuration and local split_after implementation and tests. Runtime source imported locally using existing solver pytest interpreter; no production runtime dependencies. Baseline 562 pytest tests plus 2206 subtests PASS.

Added regression before implementation: 3 failing subtests for exact maxsplit exhaustion, with nonempty-remainder, empty-input and unlimited controls passing. Exact reproduction/output in commands.log. Root cause unconditional yield list(it) after final permitted split, producing [] if the iterator is exhausted. Guided proof sent to root before implementation.
