# Benchmark audit — job-09

Auditor: `benchmark_auditor_4`  
Compared solver revision: `08745712ad624121cdb9bf4b5343f97fca825a42`  
Accepted fix: [escape-string-regexp PR #21](https://github.com/sindresorhus/escape-string-regexp/pull/21), `732905da074f0220487ad6a27590f89bd0819374`  
Verdict: **PASS**  
Readiness: **READY**

## Accepted-fix comparison

The accepted and solver patches share the same diagnosis and structure: remove hyphen from the ordinary backslash-escaped operator set, then replace it separately with a fixed code-point escape.

Their only production difference is representation:

- accepted: `\u002d`;
- solver: `\x2d`.

Both encode literal ASCII hyphen, are valid in JavaScript Unicode and non-Unicode regular expressions, and are fixed-width, so following letters or digits cannot extend the escape. Direct probes passed for standalone, repeated, and adjacent hyphens; Greek and emoji text; the full existing metacharacter set; grouped expressions; and Unicode character classes.

The accepted regression checks Unicode compilation and literal matching. The solver does the same, asserts its exact complete escaped phrase, and adds explicit non-string validation coverage. Both patches remain confined to the implementation and its tests.

## Audit judgment

The textual serialization differs, but the frozen acceptance is behavioral and does not mandate `\u002d`. The solver is behaviorally equivalent, appropriately scoped, and regression-safe for the supported JavaScript use case. No repair is required.

`qaFalsePositive: false`  
`requiresRepair: false`
