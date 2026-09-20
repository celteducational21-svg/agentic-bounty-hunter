# job-03 proof — iteration 2 — SIMULATION / HISTORICAL REPLAY — NOT PAID

The complete failed first attempt, including independent QA and historical audit, is preserved under `evidence/attempt-1/`. The repaired revision is a new single commit over the original pre-fix SHA `38c2be947f39d2fadd74d676096863943f472b01`. No historical accepted source or patch was inspected or copied during repair.

## Initial failure

Revision `b651274572730d6cca0d785452768c7e69def017` synchronized after every spinner resolution and used a truthiness check. Deterministic audit probes showed two failures:

- assigning `{interval: 0}` preserved the old interval rather than accepting zero;
- assigning the built-in spinner name `dots` changed an explicit interval of 333 to the spinner's default.

## Repaired root cause and behavior

Only a custom spinner object should carry assignment-time interval state into the Ora instance. Presence, not truthiness, decides whether the interval was supplied. The update now lives inside the custom-object branch and uses `spinner.interval !== undefined`.

Direct repaired probe:

```text
constructor: 333
positive custom assignment: 125
zero custom assignment: 0
named spinner after interval reset: 333
custom spinner without interval: 333
job-03 interval assignment counterexamples: PASS
```

## Validation

- Focused AVA regression: 1 passed, covering all four required behaviors.
- Full AVA suite: 26 passed, 0 failed.
- TSD: passed.
- XO under Node 16.20.2: exit 0 with one pre-existing TODO warning.
- `git diff --check`: passed.
- Frozen repaired revision: `f13b0fbc85a3cffebd5e88ba5d6d42fd80356589`.

Fresh independent QA and historical comparison remain pending.
