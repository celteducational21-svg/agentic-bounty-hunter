# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## Validate negative indentation counts explicitly

Source: supplied historical pull-request problem statement; no upstream discussion or accepted change was inspected.

A negative `count` reaches `String.prototype.repeat` and leaks its opaque native `RangeError`.

Acceptance criteria:

- `indentString("foo", -1)` throws `RangeError`.
- The exact error message is `Expected \`count\` to be at least 0, got \`-1\``.
- Nonnegative counts continue to indent identically.
- Existing input, count-type, and indent-type validation remains unchanged.
- Add focused regression evidence and run the practical package suite.

Pre-fix SHA: `6b64e3744c81074e85361743498648850db5e2dc`

Use only this packet and the exact pre-fix repository. Accepted pull requests, fix commits, post-fix source, current main, and timelines or comments are out of bounds until independent QA is frozen.
