# Edward manager watch — 2026-09-23 11:12 UTC

## Newly verified event

The saved-scan endpoint regressed to HTTP 502 after returning HTTP 200 during
the 11:08 UTC hunting check. The production operations endpoint remains on the
seven committed fallback records with `runtime.durable=false` and
`lastScan=null`.

This is a production read-path regression, not verified data loss. The most
recent durable scan remains the scan persisted at `2026-09-23T10:08:07.850Z`
with 844 runtime operations and 55 candidates.

`ivrit-ai/ivrit-py#12` remains open, unassigned and unreserved with 19 comments.
PRs 28, 30, 31 and 32 still have zero reviews. The Superteam sponsor thread is
unchanged. No assignment, reservation, QA completion, READY_TO_SUBMIT event,
requested changes, merge or payment was found. No discovery or Solver was
launched from this reporting watch.

## Next

Retry the production operations and saved-scan read paths independently. Keep
the last verified durable scan as the reference and do not represent the
failed read as a fresh scan.

## Owner action

Nothing needed.
