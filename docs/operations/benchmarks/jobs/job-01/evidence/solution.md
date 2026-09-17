# Solution
Correct both README set examples to separate KEY VALUE syntax; preserve supported CLI API. Patch is two lines, README only. No product code/test changes needed for this low-impact correction; independent executable regression lives in evidence/check_readme.py, reads actual README commands, runs them, and verifies parsed persisted values.

Validation: README executable regression PASS; CLI tests 26 PASS; full suite 132 PASS after pinning IPython<8; sdist/wheel build PASS; git diff --check PASS. Flake8 has unchanged pre-existing F401. Historical type checker NOT_RUN because typed_ast cannot build on Python3.12; README contains no types. All exact output in commands.log; install output also in setup logs. No new failures. This is solver validation, not independent QA.
