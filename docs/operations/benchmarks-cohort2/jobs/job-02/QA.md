# Independent QA — job-02

Reviewer: `independent_qa_4`  
Verdict: **PASS**  
First pass: **yes**  
Frozen revision: `ffe99a75429ad4038cf2922863300c74d53dd2b3`

## Provenance and exact revision match

I initialized a new repository, fetched only pre-fix revision `acd3d1052776e9f815fdadf49cff02aa6c5a7a91`, and checked it out detached. I did not inspect accepted fixes, later upstream source, issue timelines, or audit data.

The supplied patch applied cleanly and has SHA-256 `f27a3c5bc55d011adbd2f39a6e8a57ca6a6dd0281d6b547122eb6cdb555cc176` and stable patch ID `850170b2566ce9d693157ac4d4f49e8a88613149`. The reconstructed tree is `05ecdf5dbb3a6ba62bbdd5480f4365aa7b26e7b5`, exactly matching the tree of the frozen Solver revision. The recorded revision also agrees across the result, solution, and unpublished submission artifacts.

## Acceptance and counterexamples

The pristine source reproduced the report: structuring `Annotated[str | None, "required"]` through the JSON converter raised `ClassValidationError` containing `IndexError`.

After applying the patch:

- optional values `"text"` and `None` structure and unstructure correctly;
- a registered union structure hook receives the exact underlying `str | int` type;
- registered structure and unstructure hooks both work through `Annotated`;
- scalar and list `Annotated` values remain correct;
- an optional nested inside an `Annotated` list remains correct.

The focused Annotated selection passed all four tests. An expanded suite with BSON, CBOR2, MessagePack, YAML, TOMLKit, ujson, and orjson installed passed 441 tests, with one skip and 15 expected failures, after excluding one unrelated baseline property test.

That excluded test generated the literal dictionary value `{"Hyp": 0}` and then asserted that `"Hyp"` was absent from its representation. It fails identically on the untouched pre-fix worktree, confirming it is not a patch regression.

## Quality checks

- Build: pass; sdist and wheel produced.
- Compilation: pass.
- Black: pass.
- Repository-era Ruff: exits successfully, although it prints a parser diagnostic for PEP 593 syntax.
- Current Ruff comparison: four findings are identical on pristine and patched files and none touches a changed line.
- Whitespace check: pass.
- Type checking: not applicable; this revision provides no type-check target or development dependency in Makefile, tox, or its dependency groups.

The adapter is narrowly scoped and consistently invokes the selected handler with the same underlying type used for dispatch. It is ready for an unpublished PR subject to the documented historical-toolchain, baseline-property-test, and single-platform limitations.
