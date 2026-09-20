# Independent QA — job-07

Reviewer: `independent_qa_2`

Verdict: **PASS**

First pass: **yes** — no solver patch edits or repair revision were needed.

Revision: `9e5a766c093c6e7b9de8096409825672fa3404e9`

## Isolation and revision verification

QA initialized a new repository, fetched only pre-fix commit `a0305515248ed493b82b52489c28e554dc783a8e` at depth one, removed the remote, and applied the supplied `solution.patch`. No accepted fix, pull request, later source, issue discussion, or audit record was inspected.

The reconstructed tree is `6332cb8618e080c551649e8f50453651406ea6f6`. Recreating the commit from the supplied patch's parent, tree, author identity, author date, commit identity, and message yielded the exact recorded revision `9e5a766c093c6e7b9de8096409825672fa3404e9`.

## Acceptance and counterexamples

The focused tests pass for `--foo---` and `--foo----=value`. Independent probes also confirmed:

- `--foo---=` keeps an empty string value;
- `--a---b` remains an ordinary named option;
- bare `-` remains positional;
- `--` remains the end-of-options marker;
- `---` and `----=value` remain positional invalid empty option names;
- with `unknown-options-as-args`, an unconfigured `--foo---` remains positional.

The change is mechanically consistent with the diagnosis. The parser normalizes runs of leading hyphens before the guard. Anchoring the regular expression restricts the invalid-empty-name match to the beginning rather than accidentally matching a valid name's trailing hyphens.

## Validation

- Focused regression: 2 passed.
- CommonJS: 357 passed.
- ESM: 17 passed.
- TypeScript: 20 passed.
- Build: TypeScript compilation and Rollup CommonJS build passed.
- Lint: StandardX passed.
- Whitespace: `git diff --check` passed.

The setup used the documented installation-only TypeScript 4.5.5 and `@types/node` 16.11.4 pins because the historical manifests use unconstrained ranges that resolve incompatibly today. Tracked files remained clean. The Puppeteer browser suite and historical Node matrix were not run.

The patch is ready for the next benchmark audit stage.
