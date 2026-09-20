# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Validate negative indentation counts explicitly

Branch suggestion: `solver-b/job-10-negative-count`

Commit: `4587cf6eefd198e343569a1a79cfacb6a3681f28`

Source: supplied historical pull-request problem statement.

Negative numeric counts currently pass the type check and reach `String.repeat`, exposing an engine-specific `RangeError` message. Validate the lower bound directly after the count type check and throw the package-level diagnostic `Expected \`count\` to be at least 0, got \`-1\``.

The regression asserts both the `RangeError` class and exact message. Existing tests preserve zero and positive indentation, line handling, custom indentation, and prior type validation.

Validation: focused regression passes; complete AVA suite passes (10 tests); XO lint and TSD type tests pass; syntax and diff checks pass. The historical unpinned toolchain required Node 12.22.12 and a transient `@types/node@12` pin; no manifest or production dependency changed. No PR was published; independent QA is pending.
