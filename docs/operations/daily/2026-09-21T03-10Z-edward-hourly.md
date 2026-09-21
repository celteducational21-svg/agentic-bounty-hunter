# Edward — ABH hourly operations, 2026-09-21 03:10Z

Real operations only. Historical benchmark results are excluded from work-secured, delivery and payment counts.

## Source checks

| Source | Checked at | Result | Coverage | New / changed |
| --- | --- | --- | --- | --- |
| GitHub | 2026-09-21T03:07:37.956Z | SUCCESS | 60 raw results through three bounded public searches; five newly plausible technical records received canonical checks | Seven records were newly deduplicated by the first persisted scan. Two are settlement/payout requests for completed work, not available tasks. The five technical records all have existing fixes or heavy solution competition. |
| Opire | 2026-09-21T03:07:37.956Z | SUCCESS | 30 current public catalogue rows, reconciled against canonical GitHub evidence | No newly qualified $25–$300 Python, JavaScript or TypeScript task. |
| Superteam | 2026-09-21T03:04:29.088Z | SUCCESS — EMPTY | Authenticated official agent feed, `take=100`; the public agent Development catalogue also returned zero | The two prior records disappeared from both feeds. Builders Reflect remains publicly open, so this is recorded as an inventory/API change rather than closure or lost eligibility. No application, assignment or award exists. |
| Gitpay | 2026-09-21T03:08:00Z | BLOCKED / NOT RUN | The preserved browser remained on Gitpay sign-in; the Open-bounty filter result could not be observed | Result count remains unknown. The previously reported recovery action is unchanged and is not repeated as a new alert. |

Evidence:

- [Production discovery summary](2026-09-21T03-07-37.956Z-summary.json)
- [Authenticated Superteam snapshot](2026-09-21T03-04Z-superteam-authenticated.json)

The first discovery request exceeded the client's 90-second wait but completed server-side and durably persisted seven new records. A non-overlapping verification request returned successfully in 69.6 seconds with zero further row changes. Runtime persistence is therefore healthy; the timeout is retained as latency evidence rather than reported as a failed scan.

## Qualification and execution

- Runtime deep admission selected five unchanged candidates: `jahmeergnlt/traefik#1`, `claude-builders-bounty#1`, `zeroeye#2`, `BasedHardware/omi#15311` and `BonziAssist#7`. None advanced.
- Five newly plausible technical records received supplemental canonical review:
  - `BasedHardware/omi#15320`, `#15318` and `#15316`: `INVESTIGATE`; each is a proposed $25 reward and already has a reporter-linked fix PR (`#15321`, `#15319`, `#15317`).
  - `cocohub-main#45`: `HARD_BLOCK` for Proof/Solver capacity; six claims and at least six solution PRs already exist, with no ABH assignment.
  - `Tarsnap/spiped#438`: `HARD_BLOCK`; the first-reporter work already has canonical fix PR `#457`.
- New private proofs: **0**. Work secured: **0**.
- Active solves / independent QA / ready to submit / submitted / changes requested / merged / confirmed paid: **0 each**.
- No public GitHub claim, comment or PR was posted. No Superteam or Gitpay application/submission was made.

## Active records

- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open and unassigned at revision `2026-09-19T22:18:13Z`. No maintainer confirmed the active reward, scope or two-week reservation. It stays `WAITING_FOR_MAINTAINER`; no duplicate comment was posted.
- Builders Reflect & Share remains `NEEDS_OWNER_ACTION / INVESTIGATE`. The public page remains open with 35 submissions, and the sponsor's online-participation reply is unchanged. Attendance and owned X-post evidence remain unverified; no bounty submission exists.

## State snapshot

- Investigating: **359**
- Rejected: **15**
- Waiting for maintainer: **1**
- Do not hunt: **1**
- Phase 3 eligible / private proof / locked / solving / QA / ready to submit / submitted / changes requested / merged / paid: **0 each**
- Runtime persistence: **durable**, latest scan `2026-09-21T03:07:37.956Z`.
- GitHub API authentication: **healthy**, 4,996 requests remained at verification.
- Automated verification: **229 tests passed**.

## Owner action

No new owner action. The already reported Gitpay sign-in recovery and Builders Reflect attendance/X evidence steps remain unchanged.

## Learning

- Newly created bounty-proposal issues with author-linked fixes are not unclaimed early wins.
- Settlement and payout-request issues for already merged work are not available bounties and should be cheaply screened.
- A successful empty agent feed is valid coverage, but disappearance from a feed does not prove closure when the canonical public listing remains open.
