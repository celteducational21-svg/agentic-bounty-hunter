# Edward manager watch — 2026-09-23 04:23 UTC

## Newly verified event

Production readback regressed after the preceding saved-scan recovery:

- `GET /api/opportunities?latest=1` returned HTTP 502.
- `GET /api/operations` returned HTTP 200 but only the seven committed fallback records, with `runtime.durable=false` and `lastScan=null`.

The latest durable hunt evidence remains the 2026-09-23 04:00 UTC scan with 802 operations. No fresh discovery or Solver process was launched from this reporting watch.

## Monitored work

- `ivrit-ai/ivrit-py#12` remains open with no assignee, 18 comments and no maintainer reservation response. Competing PRs #30, #31 and #32 remain open without reviews.
- The Superteam sponsor thread still contains the previously reported Google Meet eligibility reply to Cygnix Labs. No newer sponsor reply or preliminary-entry permission was found.
- No assignment, reservation, QA completion, READY_TO_SUBMIT transition, requested changes, merge or confirmed payment was found.

## Next

Retry both production read paths independently. Keep the hunting worker separate.

## Owner action

Nothing needed.
