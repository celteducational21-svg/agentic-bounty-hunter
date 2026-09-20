# job-10 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `4587cf6eefd198e343569a1a79cfacb6a3681f28`

The function now checks for a negative numeric count before calling `String.repeat` and throws an explicit `RangeError` with the exact required message. The new check follows the existing number-type check, so non-number behavior remains unchanged.

The regression asserts the error class and exact message. Existing tests preserve zero and positive indentation, line handling, custom indent strings, and input/count/indent type validation.

Validation passed: focused regression, complete ten-test AVA suite, XO lint, TSD type tests, Node syntax, diff whitespace check, and explicit nonnegative smoke checks. XO and TSD required Node 12.22.12 plus a transient `@types/node@12` pin because the historical unpinned toolchain is incompatible with current Node and type packages. No production dependency or manifest was changed. Independent QA is pending.
