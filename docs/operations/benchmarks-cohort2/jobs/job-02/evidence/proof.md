# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID

The supplied revision was checked out exactly. Using `cattrs.preconf.json.make_converter`, an attrs class with `value: Annotated[str | None, "required"]` failed for `{"value": "x"}` with `ClassValidationError`; its nested exception was `IndexError("tuple index out of range")`. The `None` case happened to pass.

Root cause: `Converter.gen_structure_annotated` dispatches on the Annotated type's underlying `__origin__`, which correctly selects the optional-union handler. It returns that handler directly, however. Generated attrs structuring code later calls it with the outer Annotated type as the second argument. `_structure_optional` then indexes `union.__args__[1]`; an Annotated alias exposes only its underlying type in `__args__`, so index 1 does not exist. Other generated handlers often ignore their second argument, explaining why non-union Annotated cases worked.

The repair keeps dispatch on the underlying type and wraps the selected handler so invocation also receives that same underlying type. This is important both for built-in optional handling and for user-registered union hooks.

No upstream solution, post-fix source, accepted commit, PR, timeline, or issue discussion was inspected. No public action was taken.
