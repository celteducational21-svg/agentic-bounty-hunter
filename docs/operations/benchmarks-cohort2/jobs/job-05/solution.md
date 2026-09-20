# job-05 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `b4083da1e535cd6878b486321dca78970f04f6fd`

The synthetic help option now receives an explicit parser name that cannot collide with the command's user parameters. It starts with `help` for compatibility when available, then prefixes underscores until it finds an unused name. This changes only the hidden internal key; the public `--help` spelling and standard callback behavior are unchanged.

A focused `CliRunner` test exercises both reported binding shapes:

- positional `@click.argument("help")`;
- `@click.option("--value", "help")` bound to callback parameter `help`.

Both ordinary-value invocations return `value` with exit 0, and both built-in `--help` invocations print the standard help message with exit 0.

Validation passed on Python 3.12.14: focused tests, the practical full test suite, Ruff lint, Ruff formatting, and diff whitespace checks. No separate build command is required for this pure-Python change. Independent QA is pending.
