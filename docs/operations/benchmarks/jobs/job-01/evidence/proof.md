# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID
Candidate accepted from supplied issue and pre-fix repository only.
Setup inspected setup.py, requirements.txt, tox.ini and Makefile before installing. Python 3.12 isolated venv; local editable 0.18.0. Installation logs: setup.log and setup-compatible.log. Initial old mypy dependency failed to build typed_ast; retried runtime/test dependencies. Initial baseline pytest: 129 passed, 3 IPython 9 API failures. Baseline flake8: pre-existing F401 typing.Pattern.

Exact reproduction and output: commands.log, `python ../evidence/reproduce.py`. Both README set examples exit 2: Missing argument VALUE. Control `set USER foo` exits 0 and writes USER='foo'. README uses KEY=value whereas src/dotenv/cli.py declares two required Click arguments key/value. Existing test_set_quote_options and utility tests confirm separate arguments are intentional. Root cause is documentation, not parser failure. Guided proof sent to root before patch.
