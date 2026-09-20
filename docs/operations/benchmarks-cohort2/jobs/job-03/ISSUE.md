# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

## Changing the spinner does not update its interval

Issue: https://github.com/sindresorhus/ora/issues/123

The constructor honors an explicit `interval`, but assigning a new spinner object that carries its own `interval` does not update the Ora instance's interval.

Acceptance criteria:

- Assigning a spinner object with an interval synchronizes `ora.interval`.
- An explicit constructor interval still wins over the initial spinner's interval.
- A focused regression test covers both behaviors.
- The existing test and type-definition suites remain green.

Pre-fix SHA: `38c2be947f39d2fadd74d676096863943f472b01`

Use only this packet and the exact pre-fix repository. Accepted fixes, post-fix source, current main, issue timelines, and comments are out of bounds until independent QA is frozen.
