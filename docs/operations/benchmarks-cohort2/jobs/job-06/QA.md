# Independent QA — job-06

Reviewer: `independent_qa_1`  
Verdict: **PASS**  
Frozen revision: `d0777b0bef24ec0f16d729b4fe837c3af67571fc`

## Provenance and reconstruction

I initialized a new repository, configured `https://github.com/jaraco/inflect.git`, fetched only `98e19e3eb3ad28f9fa882baaad01674c44b59952`, and checked it out detached. The observed SHA and remote matched the intake, and the worktree was clean before patching.

The supplied `solution.patch` had SHA-256 `a60ea21b94a2c5f75f759e9ade55c5f27668701424bc0e1770dbb936d95db7d7`, passed `git apply --check`, and applied without offsets or conflicts. Its stable patch ID is `d549f8c393f1d1814dd67884b5f943bfe95203f3`. The reconstructed patched tree is `75da5291a78b5a6ec946cf957b24d495f268d673`; changed blob IDs match the patch headers. The frozen revision is identical across `result.json`, `solution.md`, and `submission.md`. I did not fetch the solver commit or inspect later repository history.

## Baseline and acceptance

On the pristine pre-fix source, each of `st`, `nd`, `rd`, and `th` raised `IndexError: list index out of range`.

After applying the patch, all four return `zero`. The focused test passes and covers all four inputs. Independent checks also preserved representative behavior for `0`, `1`, `42`, `1st` through `4th`, `11th` through `13th`, `21st` through `23rd`, and `100th`.

## Counterexample and regression search

The normalized suffix-only value behaves consistently with `wantlist=True`, `group=1`, and a custom `zero='nil'`. A probe using `threshold=1` still raises `ValueError` because threshold conversion occurs before ordinal suffix recognition. That ordering is present outside the changed block and the stated acceptance concerns the default calls; it is documented as a limitation rather than treated as an undisclosed pass.

The full practical suite completed with 69 passed, no failures, and 386 unrelated legacy-`ast` deprecation warnings.

## Quality checks

- Source and wheel build: pass; `uv build` produced an sdist and wheel.
- Bytecode compilation: pass.
- Whitespace check: pass.
- Lint: not applicable. This revision delegates lint to optional `pytest-flake8` and `pytest-black` plugins, which were unavailable; installation of the historical testing extra did not complete.
- Type checking: not applicable. This revision delegates typing to optional `pytest-mypy`, which was unavailable.

The change is localized, directly addresses the empty numeric payload, and includes focused coverage. It is ready for an unpublished PR with the plugin, interpreter-matrix, warning, and threshold-option limitations disclosed.
