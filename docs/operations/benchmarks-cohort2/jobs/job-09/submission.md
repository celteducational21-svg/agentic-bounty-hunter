# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Emit a Unicode-safe escape for hyphens

Branch suggestion: `solver-b/job-09-unicode-hyphen`

Commit: `08745712ad624121cdb9bf4b5343f97fca825a42`

Issue: `sindresorhus/escape-string-regexp#20`

Backslash-prefixing a hyphen produces `\-`, which Unicode regular-expression grammar rejects as an invalid identity escape outside a character class. Encode hyphens as `\x2d` instead, while retaining the existing escaping path for all other operators.

The regression verifies the exact escaped form, compiles it in Unicode mode, and matches the original literal phrase. Existing metacharacter behavior and non-string validation also pass.

Validation: focused regression passes; complete AVA suite passes (3 tests); XO lint and TSD type tests pass; syntax and diff checks pass. The historical unpinned toolchain required Node 12.22.12 and a transient `@types/node@12` pin; no manifest or production dependency changed. No PR was published; independent QA is pending.
