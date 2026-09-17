# job-02 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

Started 2026-09-17T10:25:36Z. Only ISSUE.md, intake.json, and supplied checkout inspected. No external issue, history, accepted patch, or audit material consulted.

Supplied HEAD is e4ac52dc9546b8adec5ec15c2b76e6f323f9edc6, whereas intake preFixSha records 751f8c148222e58aa173c83c4e5e6cfccb2cc124. Used supplied checkout as instructed, without retrieving another revision.

Build configuration and test commands inspected in pyproject.toml, tox.ini, requirements.txt, Makefile and .pre-commit-config.yaml before isolated environment installation. Build uses setuptools.build_meta and has no custom setup script.

Baseline command: `env PYTHONPATH=src python ../evidence/reproduce.py` (logged by `python ../evidence/run.py`). Exited 1, importing the supplied src/dotenv/__init__.py. UNC path input `'\\\\server\\share'` was read as `'\\server\\share'`; two backslashes before `d+` became one; a value comprising two backslashes became one. Complete exact input/file/read output is in commands.log.

The packet overstates the failure: plain single-backslash `C:\Users` and `\d+` round-trip correctly. Parser `_single_quote_escapes` recognizes only escaped backslashes and quotes, not arbitrary escapes such as `\U` or `\d`. Actual defect remains demonstrated for consecutive backslashes.

Root cause: main.set_key's quoted writer escapes only apostrophes. parser.decode_escapes collapses each pair of backslashes in single-quoted input, so the serializer is not the inverse of the parser. Escape original backslashes before escaping apostrophes, preserving introduced apostrophe escapes. Unquoted (`never`) writes require no change.

Setup completed 2026-09-17T10:27:20Z. Regression-only baseline: 18 failed, 32 passed. Proof completed 2026-09-17T10:27:28Z. Parent confirmed supplied HEAD is deliberately synthetic; upstream SHA is source provenance, so this is expected.
