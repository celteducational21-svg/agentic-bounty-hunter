# Unpublished PR draft

SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Branch: `abh/job-01-solution`  
Commit: `4c62da5db4c849a1cbbc60ced0c55c9460be45e3`  
PR title: Respect an explicitly empty prompt suffix  
Issue: https://github.com/pallets/click/issues/3019

## Summary

Avoid supplying Click's extra readline-workaround space to the input function when `prompt_suffix` is explicitly empty. Apply the behavior consistently to `prompt` and `confirm`, while preserving the existing workaround for default and other non-empty suffixes.

Add focused tests for both APIs covering empty, default, and custom non-empty suffixes.

## Validation

- 6 focused regression cases pass.
- Full suite: 1,308 passed, 21 skipped, 1 xfailed.
- Changed-file lint and formatting checks pass.
- Diff check and byte-compilation pass.

The full suite was run on Python 3.12 with pytest 8. No public action was taken.
