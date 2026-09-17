# Independent QA — job-06

PASS first pass; reviewer `independent_qa_lab`; frozen revision `2f046e297a923a51c151136678d510e2dd208c5f`; 2026-09-17T10:35:12.020209+00:00.

`npm test` passes XO lint, 424 AVA tests and tsd. Independently exercised 12 combinations of BEL and ESC-backslash terminators, mixed opening/closing terminators, URL queries/fragments, adjacent style escapes, onlyFirst and visible-text retention. All pass. `npm pack --dry-run` and Node syntax check pass. No compilation build exists: NOT_APPLICABLE with packaging check performed.

Patch is narrowly scoped to accepted string terminators and retains existing matching structure/API. Tests include the packet reproduction and adjacent codes. Current Node runtime only; minimum supported Node12 untested. Separate QA copy used. No upstream fix access. Exact outputs in qa-commands.log.
