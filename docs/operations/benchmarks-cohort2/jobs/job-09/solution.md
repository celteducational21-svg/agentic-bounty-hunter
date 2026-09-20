# job-09 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `08745712ad624121cdb9bf4b5343f97fca825a42`

Hyphens are now emitted as the hexadecimal escape `\x2d` instead of the Unicode-invalid identity escape `\-`. All other regular-expression operators continue through the original backslash-prefix replacement.

The regression compiles the escaped phrase as an anchored Unicode expression and verifies a literal match. Existing metacharacter coverage and a new non-string assertion preserve the rest of the API contract.

Validation passed: focused regression, complete three-test AVA suite, XO lint, TSD type tests, Node syntax, and diff whitespace check. XO and TSD required Node 12.22.12 plus a transient `@types/node@12` pin because the historical unpinned toolchain is incompatible with current Node and type packages. No production dependency or manifest was changed. Independent QA is pending.
