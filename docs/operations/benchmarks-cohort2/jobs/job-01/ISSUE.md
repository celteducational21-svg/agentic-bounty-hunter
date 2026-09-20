# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Empty `prompt_suffix` still inserts a space

https://github.com/pallets/click/issues/3019

`click.prompt` and `click.confirm` with `prompt_suffix=""` still insert a space. A prompt of `test` with input `foo` renders `test foo` instead of `testfoo`.

Acceptance criteria:

- An empty suffix adds no character for both `prompt` and `confirm`.
- Default and ordinary non-empty suffix behavior remains unchanged.
- Focused regression tests cover the behavior.

Pre-fix SHA: `5f86603a84e12bdec1584c15c9f982740e613c45`

Use only this packet and the exact pre-fix repository. No accepted fix, merged PR, post-fix source, timeline, comments, or historical solution was inspected.
