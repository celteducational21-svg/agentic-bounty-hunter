# job-08 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was initialized locally and fetched directly at `c1a3b3244ae992ba7e7e76f501a510ea0d9306df` with a depth-one SHA fetch. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected. The snapshot's self-referential development dependency pointed at current main, so it was temporarily omitted during dependency installation and restored before any solution diff was created.

## Baseline reproduction

Direct runtime calls already return entry objects for both async and sync object mode:

```text
async: object; keys dirent,name,path
sync:  object; keys dirent,name,path
```

The pre-fix declarations nevertheless hard-code `Promise<string[]>` and `string[]` for all calls, including `{objectMode: true}`. That source-level declaration establishes the supplied type defect; the existing TSD suite had no object-mode assertion.

## Root cause

`GlobbyOptions` correctly inherits `objectMode` from `fast-glob`, but Globby's callable and `sync` signatures do not overload on its literal value. The implementation passes options through and therefore has conditional runtime behavior that its public types erase.

## Fix proof

The declaration now exposes the upstream entry type, defines an option subtype requiring literal `objectMode: true`, and places corresponding async and sync overloads before the general string-returning signatures. Calls with omitted options or literal `false` continue selecting the string overload. The stream type remains `NodeJS.ReadableStream`, which is non-generic in this historical declaration environment.

TSD assertions cover async and sync `true`, async and sync `false`, existing defaults, and object-mode stream compatibility. Runtime tests confirm async and sync results have object entries with string paths.

Validation results:

- Runtime AVA suite: 119 passed, 2 known pre-existing expected failures.
- TSD suite: passed with 0 errors.
- XO lint: passed under a Node 24 compatibility shim restoring removed `util.isDate` and `util.isRegExp` predicates for the historical lint plugin.
- `git diff --check`: passed before freeze.
- Combined `npm test`: blocked at XO without the shim by `TypeError: util.isDate is not a function`; AVA and TSD were then run independently and passed.

Tests ran on Node.js 24.19.0/Linux. The historical Node matrix was not run. The lint shim and dependency-install adjustments were environment-only and are not in the solution. Independent QA remains pending.
