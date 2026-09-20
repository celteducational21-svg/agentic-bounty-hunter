# job-06 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `d0777b0bef24ec0f16d729b4fe837c3af67571fc`

After recognizing and stripping an ordinal suffix, `number_to_words` now treats a missing numeric payload as zero and disables ordinal post-processing for that normalized value. This prevents the empty `numchunks.pop(0)` path and returns the required cardinal word `zero` rather than `zeroth`.

The behavior change is limited to suffix-only strings. Existing ordinals with numeric payloads and ordinary number conversion continue through the original path.

A focused regression covers `st`, `nd`, `rd`, and `th`. Validation passed on Python 3.12.14: focused test, all number-word tests, the complete practical suite (69 tests), bytecode compilation, and diff whitespace checks. The historical optional lint/type plugin stack was not installed, and the suite emitted unrelated `ast` deprecation warnings. Independent QA is pending.
