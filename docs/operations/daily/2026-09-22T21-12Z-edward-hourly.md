# Edward hourly operations — 2026-09-22 21:12Z

## Outcome

- Fresh discovery recovered on the second bounded attempt after the first returned HTTP 502: 60 GitHub search results, 6 Opire catalogue records, 0 public Superteam records and 46 unique records.
- Authenticated Superteam independently succeeded at `2026-09-22T21:06:39.854Z` and returned 0 eligible live listings. No application or submission was made.
- Durable scan persistence succeeded with 8 material changes. The saved-scan endpoint matched `fetchedAt` `2026-09-22T21:07:54.777Z` and reports 757 runtime records: 735 `INVESTIGATING`, 20 `REJECTED`, 1 `WAITING_FOR_MAINTAINER` and 1 `DO_NOT_HUNT`.
- Material partial readback failure remains: `/api/operations` returned `runtime.durable=false`, `lastScan=null` and only the 7 committed fallback records even though the direct saved-scan readback succeeded.
- Seven DEEP admission attempts produced 4 `INVESTIGATE` and 3 `REJECTED` outcomes, with 0 Phase-3-eligible candidates. No new private proof was justified.

## Source coverage

- GitHub: `SUCCESS` after retry, three bounded authenticated issue-search queries, 60 raw results.
- Opire: `SUCCESS` after retry, 6 current public catalogue records.
- Public Superteam agent Development catalogue: `SUCCESS`, 0 records.
- Authenticated Superteam agent API: `SUCCESS`, 0 eligible live records; non-secret evidence is in `2026-09-22T21-07Z-superteam-authenticated.json`.
- Gitpay: `NOT_RUN/BLOCKED`; the preserved browser tab remained at `https://gitpay.me/#/signin`, so the required `Issues with bounties` + `Open` filters were not run and no empty result is claimed.

## Investigations and active work

- One new runtime record, [secondlife/viewer #4802](https://github.com/secondlife/viewer/issues/4802), is an open crash report with no direct task reward. Its latest contributor comment says the crash did not reproduce during QA. It remains `INVESTIGATE`; no proof was started.
- DEEP `INVESTIGATE`: [claude-builders-bounty #1](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/1) is extremely saturated with 2,211 comments and many delivered solutions; [BasedHardware/omi #15589](https://github.com/BasedHardware/omi/issues/15589) has only a proposed discretionary $150 reward and an implementation was already delivered; [frantic-board #432](https://github.com/auscaster/frantic-board/issues/432) advertises $1.05 per slot and had an active claim/delivery plus competing PRs; [relayhop #1175](https://github.com/relayhop/sn-monetization-runtime/issues/1175) mirrors a 10,000-sats task and already has a competing PR. None justified private proof admission.
- DEEP `REJECTED`: [agent-bounties #1340](https://github.com/NSPG13/agent-bounties/issues/1340) had an unapproved/unfunded proposed reward; [ditto-subnet #2047](https://github.com/ditto-assistant/ditto-subnet/issues/2047) and [MisakaNet #2066](https://github.com/Ikalus1988/MisakaNet/issues/2066) lacked a direct credible task reward.
- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open, unassigned and unreserved. Four matching pull requests (#28, #30, #31 and #32) remain open. No maintainer confirmation of the active reward, scope or two-week reservation was observed; no duplicate comment or Solver work was started.
- Work secured, new proofs, active solves, independent QA, READY_TO_SUBMIT records, submissions, merges and confirmed payments: **0**.

## Verification and evidence

- Direct saved-scan readback matched the fresh scan and durable Supabase persistence. The operations aggregation endpoint remained on the committed fallback state and requires recovery.
- `npm test`: 229 passed, 0 failed.
- Full generated scan: `docs/operations/daily/2026-09-22T21-07-35.952Z.json`, SHA-256 `c94beb38f9dba8915fe4a98c9621768e1b99907d4b516c44fb5855d1cf2994e6`; the 4.35 MB scan was durably persisted by the ABH runtime. Compact evidence is retained in GitHub.
- No trusted CLI transition was run because no candidate state change was warranted.

## Lessons

- A successful scan write and direct saved-scan read can coexist with a degraded `/api/operations` aggregation read; both surfaces must be checked before claiming full runtime health.
- Exact source inspection prevented proposed, already-delivered, saturated and below-target work from consuming private-proof capacity.

## Next action

Continue fresh discovery and retry the degraded operations aggregation readback while retaining the four DEEP records only for changed funding, competition or assignment evidence.

## Owner action

Nothing new this cycle.
