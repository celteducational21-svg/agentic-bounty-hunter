# job-09 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was fetched directly at `5085b257c801507460270b747f645276fbc1d937` with a depth-one fetch. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

At the supplied revision, `escapeStringRegexp("-")` returns `"\\-"`. Compiling an anchored expression from that output with the `u` flag fails:

```text
"\\-"
SyntaxError Invalid regular expression: /^\-$/u: Invalid escape
```

## Root cause

The implementation applies the same backslash-prefix replacement to all regular-expression operators and to the hyphen. Under Unicode regexp grammar, `\-` is not a valid identity escape outside a character class. Therefore the escaping routine can produce text that cannot be parsed in the stated consumer context.

## Fix proof

Remove `-` from the ordinary operator class and encode hyphens separately as the hexadecimal escape `\x2d`. This is unambiguous, represents the same literal code point, and is valid in Unicode-mode expressions. The original backslash escaping remains unchanged for every other operator.

The regression asserts the exact escaped phrase and constructs an anchored Unicode regexp that matches the original phrase. The existing metacharacter test passes, and an added type-validation assertion confirms that non-string input still throws the original `TypeError` message.

Validation results:

- Focused Unicode regression: 1 passed.
- Complete AVA suite: 3 passed.
- XO lint: passed under Node 12.22.12.
- TSD type tests: passed under Node 12.22.12 after transiently pinning `@types/node@12` in `node_modules`.
- Node syntax and `git diff --check`: passed.

The unpinned 2019 dependency ranges resolve an incompatible modern `@types/node` for the bundled old TypeScript, and XO's old dependency uses the removed `util.isDate` API on Node 24. The package's declared Node-era suite therefore ran under Node 12 with the transient type package pin; runtime syntax was also checked on Node 24.19.0. Independent QA remains pending.
