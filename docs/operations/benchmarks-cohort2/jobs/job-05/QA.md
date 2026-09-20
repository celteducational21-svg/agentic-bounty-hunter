# Independent QA — job-05

Reviewer: `independent_qa_1`  
Verdict: **PASS**  
Frozen revision: `b4083da1e535cd6878b486321dca78970f04f6fd`

## Provenance and reconstruction

I initialized a new repository, configured `https://github.com/pallets/click.git`, fetched only `8c1a0a7abbc1c36f70d1f65f3604acc46c5ce6ab`, and checked it out detached. The observed SHA and remote matched the intake, and the worktree was clean before patching.

The supplied `solution.patch` had SHA-256 `464dd2881d185dac5cac4017787c62657b027c4e3c1a997264eef2409ceabb76`, passed `git apply --check`, and applied without offsets or conflicts. Its stable patch ID is `cd2f4d76b013fd6bbf535511430bd11c02b569d6`. The reconstructed patched tree is `9d57fd4cddd2543a11865d2050917ca43e409016`; changed blob IDs match the patch headers. The frozen revision is identical across `result.json`, `solution.md`, and `submission.md`. I did not fetch the solver commit or inspect later repository history.

## Baseline and acceptance

On the pristine pre-fix source, both the positional `help` argument and an option bound to callback parameter `help` failed ordinary-value invocation with exit 2 because the value was converted as the built-in boolean `--help` option.

After applying the patch:

- focused regression: 2 passed;
- positional `help` receives `alpha` and exits 0;
- an option bound to `help` receives `beta` and exits 0;
- built-in `--help` prints `Show this message and exit.` and exits 0.

## Counterexample and regression search

Independent probes forced a chain in which user parameters occupied `help`, `_help`, and `__help`; the synthetic option selected `___help`, all values bound correctly, and `--help` remained eager. A command without collisions retained the internal name `help` and `expose_value=False`. A command defining its own public `--help` continued to own that option rather than gaining a synthetic help callback.

The practical suite completed with 1,896 passed, 24 skipped, 31,000 stress-test deselections, one expected failure, and no failures.

## Quality checks

- Ruff lint: pass.
- Ruff formatting: pass.
- MyPy strict check: pass, 26 source files.
- Source and wheel build: pass; `uv build` produced an sdist and wheel.
- Bytecode compilation: pass.
- Whitespace check: pass.
- Current Pyright: six errors and one warning, reproduced identically on the pristine baseline. The patch adds no Pyright diagnostic; the line-number-only difference in `core.py` reflects the inserted lines.

The implementation is narrow, preserves the public option spelling and callback behavior, and has focused coverage. It is ready for an unpublished PR subject to the recorded interpreter and stress-suite limitations.
