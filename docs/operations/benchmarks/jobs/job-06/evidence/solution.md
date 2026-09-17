# Solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Added ESC-backslash as an alternative to BEL at the end of the existing control-string branch. No payload expansion, new API, or change to onlyFirst/global behavior. Three regression cases cover BEL and ESC-backslash opening/closing sequences, stripping, onlyFirst, and adjacent text/color escapes.

Validation: exact issue reproduction fails baseline and passes patch. npm test passes XO lint, 424 AVA tests, and tsd type tests. node --check and git diff --check pass. Build N/A: this package ships JavaScript directly and defines no build step. Existing dependency deprecation warnings retained in log. Node24 Linux tested; minimum Node12 runtime not available. One functional implementation iteration. Independent QA pending.
