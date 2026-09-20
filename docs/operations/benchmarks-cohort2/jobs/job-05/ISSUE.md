# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## Auto-added help option collides with user parameter named `help`

Issue: https://github.com/pallets/click/issues/2819

The automatically added `--help` option internally uses the name `help`. That name collides with a user argument, option, or callback binding also named `help`.

Acceptance criteria:

- A user `help` argument receives ordinary positional values.
- A user option bound to the callback parameter `help` receives ordinary option values.
- The built-in `--help` still prints help and exits with status 0.
- The fix avoids the parser/binding collision and includes focused `CliRunner` tests.
- A practical existing test suite passes.

Pre-fix SHA: `8c1a0a7abbc1c36f70d1f65f3604acc46c5ce6ab`

Use only this packet and the exact pre-fix repository. Accepted fixes, post-fix source, current main, and issue timelines or comments are out of bounds until independent QA is frozen.
