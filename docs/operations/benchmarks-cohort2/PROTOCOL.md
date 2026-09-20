# ABH Delivery Lab — Cohort 2 protocol

**SIMULATION / HISTORICAL REPLAY — NOT PAID WORK**

This second cohort measures whether the ABH agent chain can independently reproduce and solve ten additional real historical open-source issues. It is separate from live bounty operations and from Cohort 1.

## Selection rules

- Ten issues not used in Cohort 1.
- Each issue had a real accepted or merged upstream fix.
- Normal bounded software-engineering work only; exclude security vulnerabilities, proprietary infrastructure and specialized hardware.
- A specific pre-fix revision must be available and locally executable.
- Maximum two issues per repository.
- Preserve language and task diversity.

## Anti-leakage protocol

1. The curator records the issue, accepted fix and pre-fix revision privately.
2. The Solver receives only the original issue packet, the pre-fix source snapshot and repository instructions.
3. Accepted PRs, accepted patches, post-fix source and solution discussions remain unavailable until the Solver proposal and independent QA are frozen.
4. A different QA worker validates the frozen revision. Any revision after a QA failure requires fresh QA.
5. Only then may the benchmark auditor compare behavior and scope with the historical accepted fix.

Isolation is enforced by role prompts, sanitized workspaces and filesystem separation. It is not claimed to be an operating-system security boundary.

## Required evidence per case

- Scout/intake record and pre-fix provenance.
- Qualifier decision, difficulty and blockers.
- Exact setup and baseline commands.
- A failing reproduction or defensible proof of the reported defect.
- Root-cause analysis.
- Frozen Solver patch and revision.
- Independent QA results with tests, regressions, build, lint and typecheck marked PASS, FAIL, NOT_RUN or justified NOT_APPLICABLE.
- Professional unpublished submission draft.
- Post-freeze historical comparison.
- Final outcome, limitations, effort and lessons.

No issue comment, claim, reservation, PR, account action or payment action may be published during this cohort.

## Cohort verdict

The final report must distinguish:

- technically correct solutions;
- strict READY_TO_SUBMIT solutions;
- correct drafts with baseline/toolchain limitations;
- repaired QA failures;
- defensible abandonments; and
- unresolved failures.

Historical acceptance is ground truth for comparison only. It is never counted as a new ABH contribution, accepted result or payment.
