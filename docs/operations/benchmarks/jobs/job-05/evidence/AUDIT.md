# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**PASS AFTER REPAIR** for frozen revision `1cfdfe67a481004d5453a5f474e877b07f4be514`. Initial frozen revision `25ac173a1af27467018189061e627d28a78432e4` failed after an initial QA false positive; that audit remains unchanged in `AUDIT-initial.md` and `audit-initial.json`.

Comparison authorized only after Solver and QA freeze. Historical [godotenv PR205](https://github.com/joho/godotenv/pull/205), fix `3fc4292b58a67b78e1dbb6e47b4879a6cc602ec4`, fixes internal unquoted whitespace while preserving CR and LF line boundaries. Replay fixes spaces but searches only LF.

Auditor executed the same harness against the exact pre-fix archive and frozen replay. `A=foo\rB=bar` correctly produces two assignments on baseline; replay consumes B into A's value. This is a demonstrated regression, not a newly invented acceptance requirement. Exact outputs are `audit-baseline.log` and `audit-frozen.log`; harness is `audit-reproduce.go`.

Initial full Go tests, race, vet and build passed, including LF/CRLF cases, but QA omitted bare CR. Solver then repaired CR/LF boundary handling across values, comments and malformed-line diagnostics, and added regression cases. Fresh independent QA checked 27 mixed-separator combinations, original composition tests and auditor cases, then reran full/race suites, vet and build/typecheck successfully. Auditor reran the original counterexample; both assignments now survive. See `audit-repair.log`.

Replay's focused forward comment scan is reasonable; broader historical dead-code cleanup is not required. Final simulated submission readiness is restored. Metrics must retain one initial regression and the initial QA false positive; this is not a first-pass success.
