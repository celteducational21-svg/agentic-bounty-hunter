# Independent QA — job-01

Reviewer: `independent_qa_4`  
Verdict: **PASS**  
First pass: **yes**  
Frozen revision: `4c62da5db4c849a1cbbc60ced0c55c9460be45e3`

## Provenance and exact revision match

I initialized a new repository, fetched only pre-fix revision `5f86603a84e12bdec1584c15c9f982740e613c45`, and checked it out detached. I did not inspect accepted fixes, later upstream source, issue timelines, or audit data.

The supplied patch applied cleanly and has SHA-256 `312af9b9d5758d70e05e512d6e37f07b82958e743c5c8a424bec3bf3702a2a89` and stable patch ID `f6369c6d9d08cb65105e05f782605b5f8128e9de`. The reconstructed tree is `a6e93f70da34cb82d0b22f9c6d582b16bdcf5138`, exactly matching the tree of the frozen Solver revision. The recorded revision also agrees across the result, solution, and unpublished submission artifacts.

## Acceptance and counterexamples

The pristine source reproduced the report: `prompt_suffix=""` rendered `test foo` for `prompt` and `test y` for `confirm`.

After applying the patch:

- empty suffix output is `testfoo` and `testy`, with no inserted character;
- the default suffix still renders `test: foo`;
- a custom `>` suffix still renders `test> foo`;
- both yes and no confirmation inputs behave correctly;
- hidden prompt input adds no unexpected space;
- an invalid confirmation response followed by a retry renders each empty-suffix prompt correctly.

The focused matrix passed all six cases. The complete practical suite passed with 1,308 passed, 21 skipped, one expected failure, and no failures.

## Quality checks

- Build: pass; sdist and wheel produced.
- Compilation: pass.
- Ruff lint and formatting: pass repository-wide.
- MyPy strict type check: pass, 26 source files.
- Pyright: 16 errors and 2 warnings, reproduced identically on the pristine tree; no patch regression.
- Whitespace check: pass.

The patch is narrowly scoped, its behavior is independently explained by the separate readline-workaround space, and its tests cover both affected APIs. It is ready for an unpublished PR subject to the recorded single-platform limitation.
