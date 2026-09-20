# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID

The supplied revision was checked out exactly. A `CliRunner` reproduction calling `click.prompt("test", prompt_suffix="")` with input `foo` produced `test foo`, proving that one character was inserted despite the empty suffix. The same input path is shared by `confirm`.

Root cause: `_build_prompt` correctly preserves the empty suffix, and `echo(text.rstrip(" "), nl=False)` writes no trailing character. Immediately afterward, however, `prompt` unconditionally calls the selected input function with `" "`; `confirm` independently calls `visible_prompt_func(" ")`. Python's input helper writes that argument as an additional prompt, so both APIs add a space outside the suffix mechanism.

The regression tests distinguish exact-empty behavior from compatibility behavior: empty suffixes concatenate user input directly, while the default `": "` and an ordinary non-empty `">"` suffix retain their existing one-space input-helper behavior.

No upstream solution, post-fix source, accepted commit, PR, timeline, or issue discussion was inspected. No public action was taken.
