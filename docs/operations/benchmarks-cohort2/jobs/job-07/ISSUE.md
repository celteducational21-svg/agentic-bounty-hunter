# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## Options ending with three or more hyphens become positional arguments

Issue: https://github.com/yargs/yargs-parser/issues/433

Options such as `--foo---` and `--foo----=value` are incorrectly returned in the positional `_` array rather than parsed as named options.

Acceptance criteria:

- Parse option names ending in three or more hyphens as options.
- Preserve the special handling of bare `-` and `--`.
- Preserve ordinary hyphenated options and invalid empty option spellings such as `---` and `----=value`.
- Add focused regression coverage.
- Pass the CommonJS, ESM, and TypeScript suites.

Pre-fix SHA: `a0305515248ed493b82b52489c28e554dc783a8e`

Use only this packet and the exact pre-fix repository. Accepted fixes, post-fix source, current main, and issue timelines or comments are out of bounds until independent QA is frozen.
