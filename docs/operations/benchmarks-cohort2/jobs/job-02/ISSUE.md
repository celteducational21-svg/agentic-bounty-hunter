# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Annotated optional union fails during structuring

https://github.com/python-attrs/cattrs/issues/418

`make_converter().structure` fails with `ClassValidationError` wrapping `IndexError` for `Annotated[str | None, "required"]`. Non-union `Annotated` fields work.

Acceptance criteria:

- Annotated optional and union fields structure and unstructure correctly.
- Registered hooks for the underlying union continue to work and receive the underlying type.
- Existing scalar and list `Annotated` behavior remains intact.
- Focused tests and a practical repository suite pass.

Pre-fix SHA: `acd3d1052776e9f815fdadf49cff02aa6c5a7a91`

Use only this packet and the exact pre-fix repository. No accepted fix, merged PR, post-fix source, timeline, comments, or historical solution was inspected.
