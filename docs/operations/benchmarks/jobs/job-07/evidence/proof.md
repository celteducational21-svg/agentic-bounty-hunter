# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID
Read issue and supplied pre-fix source only. Inspected pyproject/tox, fileutils and pathutils. Shared local pytest interpreter from solver's job01 environment; imports resolve current repository. No installation hooks for tests. Baseline 593 tests/doctests PASS.

Focused initial regression: 7 failures, 5 controls pass. AtomicSaver uses dest_path + '.part' before converting the original path; iter_find_files uses directory.split; path_to_unicode assumes non-string objects have decode. pathlib and custom __fspath__ implementations fail at these points. Existing pathutils support works through stdlib controls. Candidate/proof communicated before implementation. Commands and full outputs in commands.log.
