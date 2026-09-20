# Edward — ABH hourly operations, 2026-09-20 21:09Z

Real operations only. Historical benchmark results are excluded from work-secured, delivery and payment counts.

## Source checks

| Source | Checked at | Result | Coverage | New / changed |
| --- | --- | --- | --- | --- |
| GitHub | 2026-09-20T21:04:54.075Z | SUCCESS | 60 raw search results through the production discovery path; five selected records reconciled against live issue/comment evidence | No actionable assignment. BasedHardware #15281 is a new $50 proposal, but its author says the reward is only proposed and the fix/tests already exist in PR #15279. |
| Opire | 2026-09-20T21:04:54.885Z | SUCCESS | 30 current public catalogue rows; exact reward and competition reconciled against canonical issue evidence where selected | No newly qualified small task. Existing candidates remain claimed, heavily competed or unsupported by canonical reward evidence. |
| Superteam | 2026-09-20T21:04:37.225Z | SUCCESS | Authenticated official agent live feed, `take=100`; two listing details returned | No new listing IDs, application, assignment or award. Builders Reflect & Share still displays 35 submissions; its six-comment thread still has no sponsor reply to Cygnix Labs. |
| Gitpay | 2026-09-20T21:08:30Z | SUCCESS | Signed-in Explore view with `Issues with bounties` and `Open` visibly selected | Zero rows; the page displayed `No records for this table yet`. Historical rows were not counted as live work. |

Evidence:

- [Production discovery summary](2026-09-20T21-04-37.329Z-summary.json) (the full runtime response is durably persisted; its SHA-256 is recorded in the summary)
- [Authenticated Superteam snapshot](2026-09-20T21-03Z-superteam-authenticated.json)

The production scan observed 90 raw GitHub/Opire records and 85 unique records before source expansion. The public Superteam catalogue added the Vietnam listing for 86 distinct records. The authenticated feed also returned Builders Reflect & Share while its Vietnam record deduplicated against the public catalogue, yielding 87 distinct observed opportunities across GitHub, Opire and authenticated Superteam. Gitpay added zero open bounty rows.

## Qualification and execution

- Five deep-admission candidates were reviewed. None qualified for private proof:
  - `jahmeergnlt/traefik#1`: 40 comments, many competing implementations and repeated Opire claims; the latest observed claim still points to PR #35.
  - `BasedHardware/omi#15281`: the issue explicitly calls $50 a proposal rather than an award and says fix/tests already exist in PR #15279. Later comments are contributor/bot interest, not maintainer funding or assignment.
  - `claude-builders-bounty/claude-builders-bounty#1`: 2,184 comments and continuing solution PRs make it an irrational early-win race.
  - `lb1192176991-lab/zeroeye#2`: multiple claims remain, the latest observed claim points to PR #41, and provider reward evidence conflicts with the $50 issue title.
  - `dot-Justin/BonziAssist#7`: 60 comments, many overlapping PRs, and Opire already records all rewards claimed through PR #32.
- New private proofs: **0**. Existing ivrit #12 proof was not rerun.
- Work secured: **0**.
- Active solves / independent QA / ready to submit / submitted / changes requested / merged / confirmed paid: **0 each**.
- No public GitHub claim, comment or PR was posted. No Superteam or Gitpay submission was made.

## Active records

- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open and unassigned. The issue `updated_at` remains 2026-09-19T22:18:13Z; the fetched comment thread still ends with the previously observed contributor follow-up and has no maintainer confirmation of active reward, scope or two-week reservation. Status remains `WAITING_FOR_MAINTAINER`; no duplicate comment was posted.
- Builders Reflect & Share remains `NEEDS_OWNER_ACTION / INVESTIGATE`. The Cygnix participation inquiry is visible among six comments and no sponsor reply is present. No workshop attendance or qualifying X-post evidence is claimed.
- The Vietnam hackathon remains blocked for the current Kuwait-based remote profile by its detailed Vietnam-base and in-person HCMC pitch requirements.

## State snapshot

- Investigating: **320**
- Rejected: **15**
- Waiting for maintainer: **1**
- Do not hunt: **1**
- Phase 3 eligible / private proof / locked / solving / QA / ready to submit / submitted / changes requested / merged / paid: **0 each**
- Production commit before this evidence commit: `de4e1bdf38d898251354401c79eb03c475badce6`; runtime persistence is durable and the latest scan readback is `2026-09-20T21:04:54.075Z`.
- Automated verification: **229 tests passed**.

## Owner action

Nothing new. Previously communicated workshop/X evidence and Gitpay KYC/payout setup remain unchanged and are not repeated here.

## Learning

- A proposed reward is not current payable work when the same issue states the fix is already implemented in an existing PR.
- A claimed provider record with many overlapping PRs is not an available early win merely because its GitHub issue stays open.
- New discovery volume is not progress toward revenue unless assignment, delivery, acceptance and payment are tracked separately.
