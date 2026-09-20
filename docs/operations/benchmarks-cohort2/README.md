# ABH benchmark cohort 2

> **SIMULATION / HISTORICAL REPLAY — NOT PAID WORK**

This directory records ten reproducible, anti-leakage replays of public historical bug reports. No issue, pull request, comment, claim, or payment request was created during this cohort.

- [Protocol](PROTOCOL.md)
- [Owner report](REPORT.md)
- [Lessons and controls](LESSONS.md)
- [Machine-readable scorecard](scorecard.json)
- Per-case evidence: [`jobs/`](jobs/)

The scorecard is regenerated with:

```sh
node scripts/summarize-benchmark-cohort2.mjs
```

Its focused contract test is:

```sh
node --test test/benchmark-cohort2-summary.test.js
```
