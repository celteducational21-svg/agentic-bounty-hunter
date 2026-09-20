# job-07 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `9e5a766c093c6e7b9de8096409825672fa3404e9`

The empty-option guard is now anchored to the start of the normalized argument. It continues rejecting arguments made only from three or more leading hyphens, while no longer treating trailing hyphens in a valid long-option name as an empty key.

The regression exercises three- and four-hyphen suffixes and explicitly locks down the neighboring cases: bare `-`, end-of-options `--`, an ordinary dashed name, `---`, and `----=test`.

All requested suites pass: CommonJS 357, ESM 17, and TypeScript 20 tests. The historical toolchain needed local compatibility pins for TypeScript and Node declarations; these were installation-only and are not part of the solution. Node.js 24.19.0/Linux was exercised; browser and historical Node matrices were not. Independent QA is pending.
