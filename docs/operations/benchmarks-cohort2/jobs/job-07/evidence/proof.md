# job-07 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was initialized locally and fetched directly at `a0305515248ed493b82b52489c28e554dc783a8e` with a depth-one SHA fetch. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

After building the supplied snapshot, direct parser calls produced:

```text
--foo---  {"_":["--foo---"]}
--foo---- {"_":["--foo----"]}
--foo-bar {"_":[],"foo-bar":true,"fooBar":true}
-         {"_":["-"]}
--        {"_":[]}
```

The first two results reproduce the defect; the latter three establish adjacent behavior that must remain stable.

## Root cause

The parser normalizes runs of three or more *leading* hyphens into `---`, then uses `/---+(=|$)/` to reject options without a key name. Because that rejection expression is not anchored, it also matches three or more hyphens at the end of an otherwise valid option name. Those arguments are pushed into `_` before normal long-option parsing can run.

## Fix proof

Anchoring the invalid-empty-option expression at the beginning restricts it to the intended leading-hyphen spellings. Long options whose actual names end in hyphens then reach the existing long-option branches unchanged.

Focused tests cover a boolean option ending in three hyphens, an assigned option ending in four, bare `-`, bare `--`, an ordinary hyphenated option, and the invalid empty-name forms `---` and `----=test`.

Validation results:

- CommonJS suite: 357 passing, 0 failing.
- ESM suite: 17 passing, 0 failing.
- TypeScript suite: 20 passing, 0 failing.
- `git diff --check`: passed before freeze.

The unconstrained historical dependency ranges required pinning TypeScript `4.5.5` and `@types/node` `16.11.4` locally: newer resolved versions could not be consumed by the repository's old Rollup TypeScript plugin. Puppeteer's browser download was skipped because the requested browser suite was not part of acceptance. Tests ran on Node.js 24.19.0/Linux; the historical Node matrix and browser suite were not run. Independent QA remains pending.
