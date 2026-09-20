# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Handle ordinal suffixes without a numeric prefix

Branch suggestion: `solver-b/job-06-empty-ordinal`

Commit: `d0777b0bef24ec0f16d729b4fe837c3af67571fc`

Issue: `jaraco/inflect#131`

`number_to_words` recognizes `st`, `nd`, `rd`, and `th` as ordinal suffixes and strips them before conversion. For a suffix-only input this leaves no numeric payload, so the scalar result path eventually pops from an empty list and raises `IndexError`.

Normalize an empty payload after suffix removal to `0`, and clear ordinal post-processing so the result is the required cardinal `zero` rather than `zeroth`. Inputs that contain an ordinal number continue through the existing behavior unchanged.

Regression coverage checks all four suffix-only inputs. Validation passes the focused regression, all number-word tests, and the complete practical suite (69 tests), plus bytecode compilation and diff checks. Smoke checks preserve `1st` through `4th` and ordinary `42` conversion. Tested on Python 3.12.14/Linux. The historical optional lint/type plugin stack and full interpreter matrix were not run; 386 unrelated `ast` deprecation warnings remain. No PR was published; independent QA is pending.
