# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Parse option names that end in multiple hyphens

Branch suggestion: `solver-c/job-07-trailing-hyphens`

Commit: `9e5a766c093c6e7b9de8096409825672fa3404e9`

Issue: `yargs/yargs-parser#433`

The parser's empty-option check was unanchored, so the sequence used to identify an argument made only of hyphens also matched valid option names ending in three or more hyphens. Those arguments were sent to the positional array before long-option parsing.

Anchor that check to the beginning of the normalized argument. This retains the existing invalid empty-name behavior but allows trailing hyphens to remain part of a long option's key.

Regression coverage includes boolean and assigned long options ending in multiple hyphens, plus bare `-`, `--`, ordinary dashed options, and empty invalid option forms. Validation passes 357 CommonJS, 17 ESM, and 20 TypeScript tests. Tested on Node.js 24.19.0/Linux with installation-only compatibility pins for the historical TypeScript toolchain. The browser suite and historical Node matrix were not run. No PR was published; independent QA is pending.
