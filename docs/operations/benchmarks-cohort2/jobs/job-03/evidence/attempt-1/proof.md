# job-03 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

The repository was fetched directly at `38c2be947f39d2fadd74d676096863943f472b01` with a depth-one fetch. Its remote was removed immediately. No branch, later revision, issue discussion, accepted patch, or historical comparison was inspected.

## Baseline reproduction

A local Node script created an Ora instance with an explicit constructor interval of 25 ms and an initial spinner interval of 10 ms. The constructor correctly retained 25 ms. Assigning `{frames: ['b'], interval: 75}` then left `instance.interval` at 25 instead of changing it to 75:

```text
{"expected":75,"actual":25}
```

## Root cause

The `spinner` setter resets `frameIndex` and resolves the new spinner into `_spinner`, but it never synchronizes the public `interval`. The constructor masks this omission during initialization because it assigns `this.interval` immediately after invoking the setter. Subsequent setter calls have no corresponding interval assignment.

## Fix proof

After resolving and validating the spinner, the setter copies a truthy spinner interval into the Ora instance. Constructor order remains unchanged, so an explicit constructor interval is still assigned after the initial setter call and retains precedence.

The focused test constructs an instance with an explicit interval of 50 ms and an initial spinner interval of 100 ms, verifies that the constructor retains 50 ms, assigns a new spinner with a 200 ms interval, and verifies that the instance updates to 200 ms.

Validation results:

- Focused AVA regression: 1 passed.
- Full AVA suite: 26 passed.
- TSD type-definition checks: passed.
- XO lint under Node 16.20.2: exit 0 with one pre-existing TODO warning.
- `git diff --check`: passed before freeze.

The default Node 24.19.0 runtime cannot execute this repository's legacy XO dependency because it calls the removed `util.isDate` API. The repository-compatible Node 16.20.2 binary was therefore used for the full lint/test/typecheck chain. Independent QA remains pending.
