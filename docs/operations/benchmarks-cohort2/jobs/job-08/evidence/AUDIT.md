# Benchmark audit — job-08

Auditor: `benchmark_auditor_3`  
Compared solver revision: `fcc212f56644672596770b23174b5eb6df9f93bf`  
Accepted reference: [globby PR #178](https://github.com/sindresorhus/globby/pull/178), squash commit `a08264f2ff5ad99e89368c3c95f1294a6a71acf6`  
Verdict: **PASS**  
Readiness: `READY_TO_SUBMIT_SIMULATED_APPROVAL_REQUIRED`

Historical comparison was authorized only after the Solver and independent QA revisions were frozen.

## Comparison

The diagnosis matches upstream: fast-glob already returns entry objects when `objectMode` is true, but globby's public declarations only promised strings. Both fixes expose fast-glob's `Entry` and add earlier literal-true overloads for asynchronous and synchronous calls, leaving default and false-mode calls on the broad string-returning signature.

The declaration syntax differs without a behavioral difference:

- Accepted uses `GlobbyOptions & {objectMode: true}` inline and an intersection of call signatures for `sync`.
- Replay names the narrow input `ObjectModeOptions` and expresses `sync` as a callable object with overload signatures.

TSD and independent QA confirm equivalent selection for inline literal true, reusable `as const` options, omitted options, literal false, async and sync calls. The replay also verifies stream compatibility. Its extra public `ObjectModeOptions` interface is a modest surface-area increase compared with accepted, but it is structurally the same constraint and does not require repair.

Replay test coverage is stronger than the accepted patch: accepted adds two compile-time assertions; replay adds explicit false and stream assertions plus runtime async/sync object-shape tests. Runtime implementation remains unchanged in both revisions, appropriately reflecting that this is a declaration bug.

## Decision

`qaFalsePositive` is **false** and `requiresRepair` is **false**. The replay is semantically equivalent to the accepted fix, with broader but relevant evidence. Runtime AVA, TSD, compatible-runtime XO, whitespace, and independent counterexamples pass. Build remains correctly not applicable because this snapshot has no build script or generated artifact.

Limitations are historical toolchain accommodations, Linux-only matrix coverage, and the replay's unnecessary but harmless additional public options interface. No patch was modified and no public action was taken.
