# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID
Title: Match terminal hyperlinks terminated by ESC-backslash
Branch: solver-b/job-06-osc-terminator
Commit: 2f046e297a923a51c151136678d510e2dd208c5f
Issue: chalk/ansi-regex#56

OSC hyperlinks may use ESC-backslash rather than BEL. The existing pattern only accepts BEL and partially matches the reported input, leaving URL and control bytes after stripping. Extend the terminator alternative to accept the two-byte ESC-backslash form.

Regression tests verify complete opening/closing matches, text preservation, onlyFirst, and adjacent color codes. Exact supplied example now strips to `This is a link hello`.

Validation: npm test passes lint, 424 tests, and type tests; Node syntax and diff checks pass. Node24 Linux tested. No build step applies. No PR published; independent QA pending.
