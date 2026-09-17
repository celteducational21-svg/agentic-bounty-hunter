# Independent QA — job-09

PASS focused boundary fix; reviewer independent_qa_lab; revision `33f394fa3e87365d9d6a31214e9af424f8826258`; 2026-09-17T10:44:09.927838+00:00.

693 unittest tests pass. Independently computed expected chunks for 762 binary sequences/maxsplit combinations and verified no premature consumption and no predicate calls after maxsplit is reached. Empty-input/maxsplit=0 special behavior remains unchanged. Focused fix avoids yielding an empty final remainder without broad API changes.

Wheel build passes after recovering flit_core from local pip cache; initial dependency/network failure retained. Lint and typecheck are **FAIL_PRE_EXISTING**, not PASS: independently executed flake8, Black and stubtest against current source and supplied initial baseline, reproducing the same E721, file formatting and two missing __all__ stub findings. No new typing surface in this implementation-only fix.

Separate QA copy/environment, no upstream access. Python3.12 only. Exact outputs qa-commands.log; independent cases qa-independent.py.
