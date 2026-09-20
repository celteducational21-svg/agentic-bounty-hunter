# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## Escaped hyphen is invalid in Unicode regular expressions

Issue: https://github.com/sindresorhus/escape-string-regexp/issues/20

Escaping `-` currently produces `\-`. Constructing `new RegExp(escaped, "u")` with that output throws a syntax error.

Acceptance criteria:

- Output remains safe for matching a literal hyphen.
- Output compiles under the Unicode regular-expression flag.
- The expression matches the literal input.
- Other regular-expression operator escaping and non-string validation remain intact.
- Add focused regression evidence and run the practical package suite.

Pre-fix SHA: `5085b257c801507460270b747f645276fbc1d937`

Use only this packet and the exact pre-fix repository. Accepted fixes, fix commits, post-fix source, current main, and issue timelines or comments are out of bounds until independent QA is frozen.
