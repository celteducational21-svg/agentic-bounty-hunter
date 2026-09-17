# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**PASS**, frozen revision `6473d85e7f87f458b8fdadc1de9336478c0d2cfd`.

After freeze, compared against accepted [p-limit PR30](https://github.com/sindresorhus/p-limit/pull/30), fix `a8a76b639f2ae8bdda6f7f7503d3c693be60c60f`. The declaration correction is identical: a merged callable function/namespace with the Limit interface and CommonJS export assignment replaces the inaccurate default export declaration.

Replay additionally adds type regressions. Independent QA runs XO, 9 AVA tests, tsd, actual CommonJS and esModuleInterop TypeScript consumer compilation/execution, and negative type cases. Packaging succeeds. No runtime algorithm changes or observed regressions.

Minimum Node10 was not run; validated Node18 with the historical compiler. Ready for simulated owner approval only.
