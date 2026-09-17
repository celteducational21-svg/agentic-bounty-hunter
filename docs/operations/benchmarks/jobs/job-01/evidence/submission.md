# Unpublished submission draft
SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Branch: fix/cli-set-docs
Commit: 793425f99da7da72fd30ad42c70925393b61bae5
PR title: docs: correct dotenv set command syntax
Issue: https://github.com/theskumar/python-dotenv/issues/345

## PR body
The CLI examples currently pass KEY=value as a single argument, which exits with Missing argument VALUE. Update both examples to pass KEY and VALUE separately, matching the existing command and help text.

Verified both README commands execute and persist the expected USER and EMAIL values. CLI suite: 26 passed; full suite: 132 passed using compatible IPython 7.34. Package build succeeds. Existing flake8 F401 is unchanged; historical mypy cannot install on Python 3.12. No runtime behavior changes.

Evidence: proof.md, solution.md, commands.log, result.json, solution.patch and executable check_readme.py beside this draft. No PR published or remote writes performed.
