# Solution

`gen_structure_annotated` now captures the underlying type and returns a small adapter that always invokes the selected handler with that type. This makes Annotated dispatch internally consistent: handler selection and handler invocation use the same target.

Focused coverage verifies both non-`None` and `None` values through `preconf.json.make_converter`, round-trip unstructuring, and a registered hook for an Annotated non-optional union. The existing scalar and list Annotated tests continue to pass.

Results:

- Focused Annotated tests: **4 passed**.
- Practical repository suite excluding `tests/test_preconf.py`: **447 passed, 1 skipped, 15 xfailed**.
- Black check on changed files: **PASS**.
- Ruff lint on changed files: **PASS**.
- `git diff --check`: **PASS**.
- Python byte-compilation of `src` and `tests`: **PASS**.

The complete preconfigured-backend test module was not collected because its module-level imports require optional BSON and other codec packages. The regression nevertheless exercises `preconf.json.make_converter` directly. The first broad attempt used current attrs/Hypothesis versions and exposed unrelated historical-suite incompatibilities; pinning the repository-era declared minima (`attrs==23.1.0`, `hypothesis==6.79.4`) produced the passing practical suite above. Only Python 3.12 was exercised.

Frozen solver revision: `ffe99a75429ad4038cf2922863300c74d53dd2b3`.
