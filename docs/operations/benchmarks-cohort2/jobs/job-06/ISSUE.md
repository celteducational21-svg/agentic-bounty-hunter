# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## `number_to_words` raises `IndexError` for suffix-only ordinals

Issue: https://github.com/jaraco/inflect/issues/131

`number_to_words("st")`, `number_to_words("nd")`, `number_to_words("rd")`, and `number_to_words("th")` raise `IndexError`.

Acceptance criteria:

- Each of the four suffix-only inputs returns `"zero"`.
- Ordinary ordinal and number conversion behavior is preserved.
- Focused regression tests cover all four suffixes.
- The practical existing suite passes.

Pre-fix SHA: `98e19e3eb3ad28f9fa882baaad01674c44b59952`

Use only this packet and the exact pre-fix repository. Accepted fixes, post-fix source, current main, and issue timelines or comments are out of bounds until independent QA is frozen.
