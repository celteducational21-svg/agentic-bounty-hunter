# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Preserve backslashes when set_key writes quoted values
Branch: solver-b/job-02-backslash-round-trip
Commit: 866beae4af46caa1758cbc15a578a7fd65a30a76
Issue: theskumar/python-dotenv#661 (provided packet only)

## Body
set_key currently emits existing backslashes unchanged in single-quoted values. Reading the result collapses consecutive backslashes, corrupting UNC paths and escaped regexes. Escape original backslashes before apostrophes so quoted serialization round-trips through the existing parser.

Adds API regression coverage for quoted modes, insertion and replacement, paths, regexes and mixed quotes, plus CLI set/get round trips. never-quoted output stays literal.

Validation: 18 new baseline failures become 50 focused passes; full suite 272 passed / 1 skipped. Ruff lint/format, mypy targets Python 3.10–3.14, and sdist/wheel builds pass. Runtime checked on Linux Python 3.12. The packet's plain single-backslash examples already pass; consecutive-backslash corruption is independently reproduced.

No PR published. Independent QA pending.

Revision 2 commit: 7365e383b46ed6ce4c60d7cfbe55d805b8615bcc. Also fixes parser boundary handling for escaped backslashes before closing single quotes, so subsequent quoted bindings remain parseable. Eight additional regressions cover 1–4 trailing backslashes and both quoted modes. Final suite280 passed1skipped; lint/format/mypy/build pass. First submission failed independent audit; revised independent QA pending.
