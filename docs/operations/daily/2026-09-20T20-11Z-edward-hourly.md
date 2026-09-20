# Edward — ABH hourly operations, 2026-09-20 20:11Z

Real operations only. Historical benchmark results are excluded from work-secured, delivery and payment counts.

## Source checks

| Source | Checked at | Result | Coverage | New / changed |
| --- | --- | --- | --- | --- |
| GitHub | 2026-09-20T20:04:25.664Z | SUCCESS | 60 raw search results through the production discovery path; six selected records reconciled against live issue/comment evidence | No actionable assignment. A newly observed DOD issue is a provider advertising paid audit services, not a buyer offering ABH work. BasedHardware #15206 has an existing solution PR and a later contributor warning about a nonfunctional bot-generated comment. |
| Opire | 2026-09-20T20:04:26.416Z | SUCCESS | 30 current public catalogue rows; exact reward and competition reconciled against canonical issue evidence where selected | No newly qualified small task. Provider totals remain subject to canonical reward verification. |
| Superteam | 2026-09-20T20:04:02.517Z | SUCCESS | Authenticated official agent live feed, `take=100`; two listing details returned | No new listing IDs, application, assignment or award. Builders Reflect & Share now displays 35 submissions; its six-comment thread still has no sponsor reply to Cygnix Labs. |
| Gitpay | 2026-09-20T20:10:57Z | SUCCESS | Signed-in Explore view with `Issues with bounties` and `Open` visibly selected | Zero rows; the page displayed `No records for this table yet`. Historical rows were not counted as live work. |

Evidence:

- [Production discovery summary](2026-09-20T20-04-02.636Z-summary.json) (the full runtime response is durably persisted; its SHA-256 is recorded in the summary)
- [Authenticated Superteam snapshot](2026-09-20T20-03Z-superteam-authenticated.json)

The production scan observed 90 raw GitHub/Opire records and 81 unique records before source expansion. The public Superteam catalogue added the Vietnam listing for 82 distinct records. The authenticated feed also returned Builders Reflect & Share while its Vietnam record deduplicated against the public catalogue, yielding 83 distinct observed opportunities across GitHub, Opire and authenticated Superteam. Gitpay added zero open bounty rows.

## Qualification and execution

- Six deep-admission candidates were reviewed. None qualified for private proof:
  - `jahmeergnlt/traefik#1`: 40 comments, many competing implementations and repeated Opire claims; the latest observed claim points to PR #35.
  - `BasedHardware/omi#15206`: another contributor already opened solution PR #15209. A later contributor documented why a separate templated no-PR comment was not a functioning solution.
  - `kushBitxHQ/kushbitx-sdk#1`: claim intake remains paused and ABH remains unassigned. Later comments are additional claim requests, not assignments.
  - `venkatesh4059/Do-Or-Die#6`: this is a seller's fixed-price service menu ($5/$25/$49) asking customers to open service requests; it is not paid work offered to ABH.
  - `claude-builders-bounty/claude-builders-bounty#1`: 2,184 comments and extensive competing activity make it an irrational early-win race.
  - `lb1192176991-lab/zeroeye#2`: many claims and implementations remain; the latest observed claim points to PR #41, while provider reward evidence conflicts with the $50 issue title.
- New private proofs: **0**. Existing ivrit #12 proof was not rerun.
- Work secured: **0**.
- Active solves / independent QA / ready to submit / submitted / changes requested / merged / confirmed paid: **0 each**.
- No public GitHub claim, comment or PR was posted. No Superteam or Gitpay submission was made.

## Active records

- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open and unassigned. The issue `updated_at` is still 2026-09-19T22:18:13Z; the fetched comment thread still ends with the previously observed contributor follow-up and has no maintainer confirmation of active reward, scope or two-week reservation. Status remains `WAITING_FOR_MAINTAINER`; no duplicate comment was posted.
- Builders Reflect & Share remains `NEEDS_OWNER_ACTION / INVESTIGATE`. The Cygnix participation inquiry is visible among six comments and no sponsor reply is present. No workshop attendance or qualifying X-post evidence is claimed.
- The Vietnam hackathon remains blocked for the current Kuwait-based remote profile by its detailed Vietnam-base and in-person HCMC pitch requirements.

## State snapshot

- Investigating: **310**
- Rejected: **15**
- Waiting for maintainer: **1**
- Do not hunt: **1**
- Phase 3 eligible / private proof / locked / solving / QA / ready to submit / submitted / changes requested / merged / paid: **0 each**
- Production commit before this evidence commit: `286cf2d5e42f1b335e12dc68e51bae473cae7128`; runtime persistence is durable and the latest scan readback is `2026-09-20T20:04:25.664Z`.
- Automated verification: **229 tests passed**.

## Owner action

Nothing new. Previously communicated workshop/X evidence and Gitpay KYC/payout setup remain unchanged and are not repeated here.

## Learning

- A service provider advertising what it will sell is not a bounty buyer and must not be counted as obtainable work merely because the issue contains prices and the word “bounty.”
- A contributor-authored technical warning can improve competition assessment, but it cannot establish maintainer acceptance, assignment or payment.
- An unchanged authenticated listing feed plus a changing submission count is monitoring evidence, not work secured.
