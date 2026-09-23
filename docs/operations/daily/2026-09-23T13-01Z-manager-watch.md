# Edward manager watch — 2026-09-23 13:01 UTC

## Newly verified event

The production operations endpoint recovered from its seven-record fallback and
again returned the last durable projection: 844 operations, including 822
INVESTIGATING, 20 REJECTED, 1 WAITING_FOR_MAINTAINER and 1 DO_NOT_HUNT. The
runtime reports `durable=true` with `lastScan=2026-09-23T10:08:07.850Z`.

The separate saved-scan endpoint still returned HTTP 502, so this is a partial
readback recovery rather than a new discovery scan. No new scan or Solver was
launched from this reporting watch.

`ivrit-ai/ivrit-py#12` remains open, unassigned and unreserved with 19 comments;
PRs 28, 30, 31 and 32 still have zero reviews. The Superteam sponsor reply is
unchanged. No assignment, reservation, QA completion, READY_TO_SUBMIT event,
requested changes, merge or payment was found.

## Next

Continue independent readback checks and retain the durable operations
projection as the verified reference while the saved-scan endpoint is degraded.

## Owner action

Nothing needed.
