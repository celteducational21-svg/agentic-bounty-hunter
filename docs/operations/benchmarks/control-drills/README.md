# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

These records exercise the real `src/core/operations.js` state machine using isolated fixture records. They never import or modify live `docs/operations/state.json`, call a provider, post a comment, submit a PR, or create a real owner approval. `simulation://` references and `SIMULATED_OWNER` are deliberately non-production evidence.

## Commands and outputs

1. Before the fix: `node --test test/operations-review-cycle.test.js` → exit 1, 0 pass / 1 fail. Exact output: `before-fix.log`.
2. After the fix: `node --test test/operations-review-cycle.test.js test/operations.test.js` → exit 0, 13 pass / 0 fail. Exact output: `after-fix.log`.
3. `node scripts/benchmark-control-drills.mjs` → exit 0. Exact output: `execution.log`; structured assertions: `report.json`; isolated transitions: `state.json`.
4. `npm test` → exit 0, 207 pass / 0 fail. Exact output: `full-tests.log`.

## Evidence-backed defect

The previous projection retained successful QA and owner public approval after entering a new correction cycle. Re-entering QA on the same revision could reuse both old attestations. Even on a changed revision, obsolete evidence remained projected as current rather than being invalidated. The regression demonstrates retained QA before the fix.

The small correction removes projected `qa` and `publicApproval` when entering SOLVING or when the solution revision changes. Prior evidence remains in immutable transition events. Fresh independent QA and exact-revision owner approval are then mandatory. The updated existing test expects the missing-QA error rather than a stale-revision error after invalidation.

## Scope of the claims

Final execution is bound to job03 revision `7b781a57bcd3027421a96ea24629ffa4831e691f`, independently reviewed by `independent_qa_lab` and historically audited after freeze. `actual-solution-binding.json`, `bound-execution.log` and `report.json` record all three drills PASS. The earlier unbound run remains in `execution.log`. `final-binding-verification.log` records two passing follow-up tests, including rejection of missing or nonpassing actual QA checks. The following default-run caveat applies when invoking the script without this binding.

- Credential drill: PASS; the valid fixture reaches NEEDS_HUMAN_INPUT, retains the private-proof resume point, and an unrelated candidate continues investigating.
- Submission drill: control assertions PASS. Until a real successful historical solution and independent QA are bound, the result is explicitly PENDING_REAL_SOLUTION. The default fixture is not counted as successful technical delivery.
- Review drill: PASS as a workflow simulation. The review requests an empty-input regression test; fixture revisions model code changes. This is not a claim that a technical test was written or technically reviewed.
- Seven injected invalid actions are caught: same-author QA, stale revision QA, unapproved submission, missing fresh QA, injected obsolete QA, missing renewed approval, injected obsolete approval.
- No network or public action is implemented in this drill runner. No secret values are read.

To bind the submission drill after actual technical QA freezes, pass a JSON file to `node scripts/benchmark-control-drills.mjs <evidence.json>`. It must identify the solution revision/author/evidence path and independent QA result/revision/reviewer/evidence path. The script requires PASS, matching revision, different reviewer, readable evidence files, and explicit `qa.checks` for every operational gate. Build/lint/typecheck must be PASS or NOT_APPLICABLE with `qa.notApplicableReasons`; NOT_RUN and FAIL_PRE_EXISTING do not become PASS. Actual statuses and evidence are preserved in the final report/state. Only the separate simulated correction revision uses synthetic QA. Binding tests cover missing checks, NOT_RUN, unexplained NOT_APPLICABLE rejection, and preservation of explained NOT_APPLICABLE.

Example shape (replace every placeholder with actual evidence):

```json
{
  "solution": { "revision": "FROZEN_COMMIT", "author": "solver-agent", "reference": "path/to/solution-evidence.md" },
  "qa": { "result": "PASS", "revision": "FROZEN_COMMIT", "reviewer": "separate-qa-agent", "reference": "path/to/qa-evidence.md",
    "checks": { "acceptanceCriteria": "PASS", "tests": "PASS", "regressions": "PASS", "explainability": "PASS", "prReadiness": "PASS", "build": "PASS", "lint": "PASS", "typecheck": "PASS" }
  }
}
```
