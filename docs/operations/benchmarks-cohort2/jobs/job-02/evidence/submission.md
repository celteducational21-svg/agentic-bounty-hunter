# Unpublished PR draft

SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Branch: `abh/job-02-solution`  
Commit: `ffe99a75429ad4038cf2922863300c74d53dd2b3`  
PR title: Dispatch Annotated union handlers with their underlying type  
Issue: https://github.com/python-attrs/cattrs/issues/418

## Summary

Ensure generated handlers for `Annotated` fields are invoked with the same underlying type used to select them. Previously an optional-union handler was selected for `Annotated[str | None, ...]` but invoked with the outer Annotated alias, causing its union argument lookup to raise `IndexError`.

Add coverage for optional values through the JSON preconfigured converter, round-trip unstructuring, and an underlying registered union hook. Existing scalar and list Annotated tests remain green.

## Validation

- 4 focused Annotated tests pass.
- Practical suite: 447 passed, 1 skipped, 15 xfailed.
- Changed-file Black and Ruff checks pass.
- Diff check and byte-compilation pass.

The optional-codec `test_preconf.py` module was not run because its BSON and other backend dependencies were unavailable; the focused regression directly uses `preconf.json.make_converter`. No public action was taken.
