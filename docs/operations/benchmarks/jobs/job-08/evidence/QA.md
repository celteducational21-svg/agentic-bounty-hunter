# Independent QA — PASS (documented baseline tooling limits)

SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Reviewer `control_drills_qa`; frozen revision `081d4696f5770dae073a7e1d6cfc55ebb7e3e87a`. Separate copied checkout/environment; frozen Solver untouched.

The issue explicitly permits clarifying that the window tracks yielded items. The patch takes that compatibility-preserving option, states skipped duplicates do not advance the window, explains keyed comparisons, and uses the issue's disambiguating example. This is a legitimate documentation-plus-executable-test fix, not a behavioral algorithm correction.

QA's four independent tests cover the new explicit documentation, 729 exhaustive input sequences across four window sizes against an independent reference, keyed object identity, lazy consumption, empty input, and repeated singleton values. On historical parent the documentation assertion fails while behavioral checks pass, accurately demonstrating the documentation defect. All four pass on the frozen revision. Full unittest/doctests: 740 pass including QA additions.

Packaging builds pass. Broad lint E721 and Black whole-test-file failures also occur on parent. Historical CI actually contains `stubtest`; contrary to the Solver's no-typechecker limitation, QA executed it and observed the same missing `__all__` declarations on both parent and solution. Thus lint/typecheck remain FAIL_PRE_EXISTING. Sphinx generated HTML, but strict `-W` exits1 for modern theme deprecation in unchanged configuration. These are disclosed limitations rather than clean-tooling claims.

The focused patch is explainable and appropriate for unpublished PR preparation with these results disclosed. No accepted fix was read. Exact commands/output: `qa-commands.log`; independent tests: `qa-independent-tests.py`.
