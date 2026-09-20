# Independent QA — job-08

Reviewer: `independent_qa_2`

Verdict: **PASS**

First pass: **yes** — no solver patch edits or repair revision were needed.

Revision: `fcc212f56644672596770b23174b5eb6df9f93bf`

## Isolation and revision verification

QA initialized a new repository, fetched only pre-fix commit `c1a3b3244ae992ba7e7e76f501a510ea0d9306df` at depth one, removed the remote, and applied the supplied `solution.patch`. No accepted fix, pull request, later source, issue discussion, or audit record was inspected.

The reconstructed tree is `9c0d3554e0220555b31cdfa5c5b0df2fc0a33dc1`. Recreating the commit from the supplied patch's parent, tree, author identity, author date, commit identity, and message yielded the exact recorded revision `fcc212f56644672596770b23174b5eb6df9f93bf`.

## Acceptance and counterexamples

The repository TSD tests pass for literal object mode, false mode, default mode, and stream compatibility. A separate temporary QA declaration test additionally verified:

- inline `{objectMode: true}` returns `Promise<Entry[]>` and `Entry[]`;
- a reusable `{objectMode: true} as const` options object selects the entry overloads;
- omitted and literal-false async/sync calls remain string arrays;
- an object-mode stream remains assignable to `NodeJS.ReadableStream`.

Independent runtime assertions verified entry objects with string `path` and `name` plus `dirent` for async, sync, and stream object mode. Default async and false-mode sync results remained strings.

The overload ordering and narrow `ObjectModeOptions` constraint match the behavior: literal true selects entry-returning overloads, while the existing general overload remains the fallback. Re-exporting the upstream entry type makes the new return contract nameable without duplicating its shape.

## Validation

- Runtime AVA: 119 passed, 2 known failures, 0 unexpected failures.
- Repository TSD: passed.
- Independent TSD counterexamples: passed.
- Runtime acceptance/counterexamples: passed.
- XO: passed under Node 16.20.2.
- Whitespace: `git diff --check` passed.
- Build: not applicable; this revision has no build script or generated product artifact.

The historical dependency stack requires two setup accommodations. The self-referential `globby#main` development dependency was omitted during installation to avoid retrieving prohibited current source and then restored unchanged. TSD used the documented installation-only `@types/node` 14.14.10 pin. The combined Node 24 `npm test` command remains blocked in XO because a legacy plugin calls removed `util.isDate`; running XO with compatible Node 16 succeeds. Tracked files remained clean.

The patch is ready for the next benchmark audit stage.
