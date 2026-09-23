# Edward manager watch — 2026-09-23 14:55 UTC

## Newly verified event

The saved-scan endpoint regressed after its 14:00 UTC recovery. It now returns
HTTP 200 with `mode=ERROR` and reports that ABH discovery or history is
temporarily unavailable. The production operations endpoint remains on the
seven committed fallback records with `runtime.durable=false` and
`lastScan=null`.

The last verified durable scan remains 844 operations and 55 candidates from
`2026-09-23T10:08:07.850Z`. No fresh discovery is inferred from this reporting
watch.

`ivrit-ai/ivrit-py#12` remains open, unassigned and unreserved with 19 comments;
PRs 28, 30, 31 and 32 still have zero reviews. The Superteam sponsor reply is
unchanged. No assignment, reservation, QA completion, READY_TO_SUBMIT event,
requested changes, merge or payment was found.

## Next

Retry both production read paths independently. Retain the last durable scan as
the reference without presenting it as current discovery.

## Owner action

Nothing needed.
