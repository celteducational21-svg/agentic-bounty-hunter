# Edward hourly operations — 2026-09-22 20:03Z

## Outcome

- Material partial failure: the existing main discovery runtime returned HTTP 502 on both bounded attempts. No fresh GitHub, Opire or public Superteam result was produced, and no new runtime persistence is claimed.
- Authenticated Superteam independently succeeded at `2026-09-22T19:57:34.328Z` and returned 0 eligible live listings. No application or submission was made.
- Production readback recovered: `/api/operations` returned 756 records and `/api/opportunities?latest=1` returned the last saved scan from `2026-09-22T19:07:46.770Z`. That saved scan is evidence of the preceding successful cycle, not a fresh result for this cycle.
- The last verified runtime projection remains 756 records: 734 `INVESTIGATING`, 20 `REJECTED`, 1 `WAITING_FOR_MAINTAINER` and 1 `DO_NOT_HUNT`. Discovery records are not secured assignments.

## Source coverage

- GitHub: `FAILED`; main runtime returned HTTP 502 twice. No prior result was counted as fresh.
- Opire: `FAILED`; main runtime returned HTTP 502 twice. No prior result was counted as fresh.
- Public Superteam agent Development catalogue: `FAILED`; main runtime returned HTTP 502 twice. No prior result was counted as fresh.
- Authenticated Superteam agent API: `SUCCESS`, 0 eligible live records; non-secret evidence is in `2026-09-22T19-55Z-superteam-authenticated.json`.
- Gitpay: `NOT_RUN/BLOCKED`; the preserved browser tab remained at `https://gitpay.me/#/signin`, so the required `Issues with bounties` + `Open` filters were not run and no empty result is claimed.

## Investigations and active work

- The three DEEP candidates retained from the preceding successful scan remain under investigation; this failed scan produced no new candidate evidence and no private proof admission.
- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open, unassigned and unreserved. Four matching pull requests remain open. No maintainer confirmation of the active reward, scope or two-week reservation was observed; no duplicate comment or Solver work was started.
- Work secured, new proofs, active solves, independent QA, READY_TO_SUBMIT records, submissions, merges and confirmed payments: **0**.

## Verification and evidence

- Production `/api/operations` and `/api/opportunities?latest=1` both returned successfully; the latter still identifies the preceding `2026-09-22T19:07:46.770Z` scan.
- `npm test`: 229 passed, 0 failed.
- No trusted CLI transition was run because no candidate state change was warranted.
- The authenticated Superteam evidence contains no credentials or claim codes.

## Lessons

- A successful stale saved-scan readback verifies durable prior state but cannot be reported as a fresh discovery cycle.
- Per-source isolation preserved authenticated Superteam coverage even though the combined GitHub, Opire and public Superteam runtime path failed.

## Next action

Retry the failed discovery sources independently on the next cycle without treating the saved scan as current; continue investigation of the three retained DEEP candidates.

## Owner action

Nothing new this cycle.
