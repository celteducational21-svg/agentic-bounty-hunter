# job-05 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was fetched directly at `8c1a0a7abbc1c36f70d1f65f3604acc46c5ce6ab` with a depth-one fetch. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

Using `PYTHONPATH=src` and `CliRunner`, a command with `@click.argument("help")` failed on the ordinary input `hello` with exit code 2:

```text
Error: Invalid value for '--help': 'hello' is not a valid boolean.
```

The same failure occurred for `@click.option("--value", "help")` invoked as `--value hello`. The independently exercised built-in `--help` path already printed usage and exited 0.

## Root cause

`Command.get_help_option` creates the synthetic eager option from the public spelling `--help`. `Option._parse_decls` consequently assigns it the internal parameter name `help`. Click's parser uses parameter names as keys. A user argument or option with that same name therefore shares a parser slot with the synthetic boolean flag, so the ordinary string is processed as the built-in help flag's boolean value before callback binding.

## Fix proof

When the synthetic option is first created, collect the names of user parameters and choose an internal help name that is not in that set. Preserve `help` when it is free; otherwise prefix underscores until the name is unique. Pass this explicit internal name into the existing help-option decorator. The option spelling, eager callback, `expose_value=False` behavior, and callback API remain unchanged.

The focused parametrized regression covers both a positional argument and an option bound to `help`. In each case an ordinary value reaches the callback, and a separate `--help` invocation prints the standard help line and exits 0.

Validation results:

- Focused regression: 2 passed.
- Practical full suite: 1,896 passed, 24 skipped, 1 expected failure; 0 failures.
- Ruff lint: passed.
- Ruff format check: passed.
- `git diff --check`: passed before freeze.

The full suite reports 31,000 deselected stress cases because the repository's configured pytest options exclude its stress marker. Python 3.12.14 on Linux was tested. Independent QA remains pending.
