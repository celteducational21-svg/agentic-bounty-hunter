# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Infer entry results when object mode is enabled

Branch suggestion: `solver-c/job-08-object-mode-types`

Commit: `fcc212f56644672596770b23174b5eb6df9f93bf`

Issue: `sindresorhus/globby#177`

Globby already forwards `objectMode` to `fast-glob` and returns entry objects at runtime, but its async and sync declarations always report string arrays.

Expose the upstream entry type and add leading overloads for an options subtype requiring literal `objectMode: true`. Default and literal-false calls keep their existing string-array types. The stream API retains the historical non-generic `NodeJS.ReadableStream` contract.

TSD coverage asserts async and sync entry inference, default and false string inference, and stream compatibility. Runtime coverage verifies object entries for both execution modes. AVA passes 119 tests with 2 known failures, TSD passes, and XO passes under a Node 24 compatibility shim for removed `util` predicates. The unshimmed combined command remains environment-blocked by that old lint dependency. No PR was published; independent QA is pending.
