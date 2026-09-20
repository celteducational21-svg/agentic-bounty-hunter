# job-10 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was fetched directly at `6b64e3744c81074e85361743498648850db5e2dc` with a depth-one fetch. No branch, later revision, discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

At the supplied revision, `indentString("value", -1)` raises the native error:

```text
RangeError Invalid count value: -1
```

The exception class happens to be correct, but the engine-owned message is not the explicit API diagnostic required by the problem statement.

## Root cause

The function checks only `typeof count === "number"`. A negative number passes that validation and reaches `options.indent.repeat(count)`, delegating the failure and message to the JavaScript engine.

## Fix proof

After the existing count type check, reject `count < 0` explicitly with `RangeError` and the required interpolated message. Keeping the check after type validation preserves the existing `TypeError` for non-numbers. Keeping the rest of the function untouched preserves the zero fast path, positive indentation, and indent-option validation.

The focused regression asserts both `instanceof RangeError` and the exact message for `-1`. The complete existing suite exercises zero, positive counts, custom indentation, empty-line behavior, and all prior type validations. A separate smoke run confirms counts 0, 1, and 3 remain unchanged.

Validation results:

- Focused negative-count regression: 1 passed.
- Complete AVA suite: 10 passed.
- XO lint: passed under Node 12.22.12.
- TSD type tests: passed under Node 12.22.12 after transiently pinning `@types/node@12` in `node_modules`.
- Node syntax and `git diff --check`: passed.

The unpinned 2019 dependency ranges resolve an incompatible modern `@types/node` for the bundled old TypeScript, and XO's old dependency uses the removed `util.isDate` API on Node 24. The package's declared Node-era suite therefore ran under Node 12 with the transient type package pin; runtime syntax and behavior were also checked on Node 24.19.0. Independent QA remains pending.
