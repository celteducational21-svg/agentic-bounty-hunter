# Edward hourly operations — 2026-09-23 11:08 UTC

## Outcome

Fresh GitHub, Opire and public-Superteam discovery was blocked before execution
by the runtime safety gate. No fresh result or persistence is claimed for those
sources, and no retry was attempted through an alternate path. Authenticated
Superteam completed independently with zero live listings. No work is secured.

## Source results

- GitHub: NOT RUN / BLOCKED — the established `operations:daily` command was rejected before execution.
- Opire: NOT RUN / BLOCKED — same rejected established command; the previous catalogue result was not reused as fresh evidence.
- Public Superteam agent Development view: NOT RUN / BLOCKED — same rejected established command.
- Authenticated Superteam: SUCCESS at `2026-09-23T11:06:15.308Z` — zero live listings from the official feed with `take=100`.
- Gitpay: BLOCKED / NOT RUN — the preserved browser session remains signed out behind reCAPTCHA; the required `Issues with bounties` + `Open` filters were not run.

The latest saved scan recovered to HTTP 200 and still identifies the previously
persisted scan at `2026-09-23T10:08:07.850Z` with 55 candidates and durable
Supabase persistence. It is retained as the last durable scan, not represented
as fresh discovery for this cycle.

## Existing work and verification

The production operations endpoint regressed to its seven committed fallback
records with `durable=false` and `lastScan=null`, while the saved-scan endpoint
returned HTTP 200. This is a read-path inconsistency, not evidence of data loss.

`ivrit-ai/ivrit-py#12` remains open and unassigned. A nineteenth comment was
added by another prospective contributor at
https://github.com/ivrit-ai/ivrit-py/issues/12#issuecomment-5793459345, but it is
not a maintainer confirmation or reservation. PRs 28, 30, 31 and 32 still have
zero submitted reviews. No duplicate comment or claim was posted.

The existing Superteam sponsor reply remains unchanged; no new reply or bounty
submission was found. The repository test suite passed 229/229.

Private proofs, active solves, independent QA, READY_TO_SUBMIT work,
submissions, merges and payments: 0.

## Next

Retry the established discovery command in a later run when the runtime gate
permits it. Independently retry the production operations read path; keep the
recovered saved scan as the durable reference until then.

## Owner action

Nothing new.
