# job-06 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was fetched directly at `98e19e3eb3ad28f9fa882baaad01674c44b59952` with a depth-one fetch. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

A direct call through `inflect.engine()` reproduced the defect for every supplied input:

```text
st IndexError list index out of range
nd IndexError list index out of range
rd IndexError list index out of range
th IndexError list index out of range
```

## Root cause

`number_to_words` recognizes the final two characters as an ordinal suffix and removes them. For a suffix-only string this leaves `num` empty. The later chunk-building path leaves `numchunks` empty, but the scalar return path unconditionally calls `numchunks.pop(0)`, raising `IndexError`.

## Fix proof

Immediately after removing a recognized suffix, normalize an empty numeric payload to `"0"` and clear the ordinal flag. Clearing the flag is necessary because the required answer is `zero`, not `zeroth`. Inputs with an actual numeric payload continue through the unchanged ordinal conversion path.

The regression loops over all four supplied suffixes and asserts `zero`. Additional smoke output confirms `1st`, `2nd`, `3rd`, and `4th` still produce `first`, `second`, `third`, and `fourth`, while `42` still produces `forty-two`. The existing number-word tests and complete practical suite pass.

Validation results:

- Focused regression: 1 test passed, covering 4 inputs.
- Number-word test module: 4 passed.
- Practical full suite: 69 passed; 0 failures.
- Bytecode compilation: passed.
- `git diff --check`: passed before freeze.

The old suite emits 386 Python 3.12 deprecation warnings for unrelated `ast` APIs. The package's historical optional lint/type plugin stack was not installed; source compilation and the full functional suite were used as the practical checks. Python 3.12.14 on Linux was tested. Independent QA remains pending.
