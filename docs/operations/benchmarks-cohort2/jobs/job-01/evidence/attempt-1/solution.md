# Solution

Both terminal input sites now pass an empty prompt to the underlying input function only when the caller explicitly supplied `prompt_suffix=""`. For every non-empty suffix, they continue passing the existing single-space prompt, preserving Click's readline workaround and historical formatting.

Six focused cases cover `prompt` and `confirm` with empty, default, and ordinary non-empty suffixes. Results:

- Focused suffix tests: **6 passed**.
- Full repository suite: **1,308 passed, 21 skipped, 1 xfailed**.
- Ruff lint on changed files: **PASS**.
- Ruff format check on changed files: **PASS**.
- `git diff --check`: **PASS**.
- Python byte-compilation of `src` and `tests`: **PASS**.

The initial full-suite attempt used pytest 9 and stopped during collection because this historical suite promotes a pytest 10 deprecation warning to an error. Re-running with pytest 8 (the compatible test runner) passed fully. Only Python 3.12 was exercised; the repository's broader interpreter and platform matrix was not run.

Frozen solver revision: `4c62da5db4c849a1cbbc60ced0c55c9460be45e3`.
