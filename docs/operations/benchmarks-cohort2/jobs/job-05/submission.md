# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Avoid collisions between built-in help and user parameters

Branch suggestion: `solver-b/job-05-help-parameter`

Commit: `b4083da1e535cd6878b486321dca78970f04f6fd`

Issue: `pallets/click#2819`

Click's auto-added `--help` option derived the internal parameter name `help` from its public flag. Because parser values are keyed by parameter name, that collided with a user argument or option bound to a callback parameter named `help`, causing ordinary strings to be converted as the synthetic boolean flag.

Choose a collision-free internal name when creating the synthetic option. The public `--help` spelling, eager behavior, non-exposed value, and command callback API remain unchanged.

Regression coverage uses `CliRunner` for both a positional `help` argument and an option bound to `help`. Ordinary values reach the callback, while `--help` still prints help and exits 0.

Validation: focused tests pass (2/2); practical suite passes (1,896 passed, 24 skipped, 1 expected failure); Ruff lint and formatting pass; diff check passes. Tested on Python 3.12.14/Linux. Stress tests and the full interpreter matrix were not run. No PR was published; independent QA is pending.
