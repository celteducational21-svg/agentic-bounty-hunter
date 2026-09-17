# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**PASS**, frozen revision `6a8d05a5e772ad90db29c2ec0c574bdcd89f8087`.

Compared after freeze against accepted [p-map PR81](https://github.com/sindresorhus/p-map/pull/81), fix `65e893e306f97fc4fbf1f12d126ba3141dafde48`. Both retain a named abort handler and remove it on promise resolution/rejection. Replay also returns immediately for pre-aborted signals, avoiding registration after an already-settled promise; the historical patch lacks that guard.

Replay's nine lifecycle tests and independent QA cover success, empty/skipped output, mapper/iterator errors, concurrent shared-signal ownership, existing external listeners, active and already-aborted signals, and late completion. Full 58 AVA tests, XO, tsd, syntax and packaging checks pass. The historical patch added no tests.

Scope remains a small lifecycle correction. Explicit removal makes the historical once-listener option unnecessary for native AbortSignal behavior. No observed regression; minimum-supported Node18 was not exercised. Ready for simulated owner approval only.
