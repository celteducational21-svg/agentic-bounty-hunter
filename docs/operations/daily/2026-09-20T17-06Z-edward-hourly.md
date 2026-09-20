# Edward — ABH hourly operations, 2026-09-20 17:06Z

Real operations only. Historical benchmark results are excluded from work-secured, delivery and payment counts.

## Source checks

| Source | Checked at | Result | Coverage | New / changed |
| --- | --- | --- | --- | --- |
| GitHub | 2026-09-20T17:06:11.784Z | SUCCESS | 60 raw search results through the production discovery path | Runtime investigating count increased from 263 to 271 during this hourly cycle. The newly surfaced Omi bounty proposals already disclosed their own implementation PRs, so they are not available work. |
| Opire | 2026-09-20T17:06:12.713Z | SUCCESS | 30 current public catalogue rows; canonical issue checks remain bounded by runtime enrichment | No newly qualified small task. Provider aggregates remain subject to canonical reward and competition verification. |
| Superteam | 2026-09-20T17:05:54.030Z | SUCCESS | Authenticated official agent live feed, `take=100`; two listing details returned | No new or changed listing IDs. Both known records remain open and `AGENT_ALLOWED`; there was no application, assignment or award. |
| Gitpay | 2026-09-20T17:08:00Z | SUCCESS | Signed-in Explore view with `Issues with bounties` and `Open` visibly selected | Zero rows; the page displayed `No records for this table yet`. Historical records were not counted as live work. |

Raw evidence:

- [Production discovery summary](2026-09-20T17-05-54.148Z-summary.json) (the full 4.2 MB response is durably persisted by the runtime; its SHA-256 is recorded in the summary)
- [Authenticated Superteam snapshot](2026-09-20T17-05-53Z-superteam-authenticated.json)

The production scan observed 90 raw GitHub/Opire records and 72 unique records before source expansion. The public Superteam catalogue added the Vietnam listing for 73 distinct records. The authenticated feed also returned Builders Reflect & Share, while its Vietnam record deduplicated against the public catalogue, yielding 74 distinct observed opportunities across GitHub, Opire and authenticated Superteam. Gitpay added zero open bounty rows.

## Qualification and execution

- Five deep-admission candidates were reviewed. None qualified for private proof:
  - `BasedHardware/omi#15182`: the issue explicitly says the fix and test already exist in PR #15183. It is already being solved by its proposer, and the $25 is only proposed.
  - `jahmeergnlt/traefik#1`: multiple reward claims and competing implementations remain.
  - `claude-builders-bounty/claude-builders-bounty#1`: extremely saturated and outside a rational early-win race.
  - `lb1192176991-lab/zeroeye#2`: multiple claims plus unresolved reward discrepancies remain.
  - `dot-Justin/BonziAssist#7`: no new verified assignment or reward evidence justified proof allocation.
- Additional fresh Omi proposals likewise said `PR follows`, `PR ready`, or linked their own existing fix; they remain unavailable rather than proof candidates.
- New private proofs: **0**. Existing ivrit #12 proof remains historical operational evidence from September 14 and was not rerun.
- Work secured: **0**.
- Active solves / independent QA / ready to submit / submitted / changes requested / merged / confirmed paid: **0 each**.
- No public GitHub claim, comment or PR was posted. No Superteam or Gitpay submission was made.

## Active records

- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open, unassigned and at 16 comments. There is still no maintainer confirmation of active reward, scope or two-week reservation; status remains `WAITING_FOR_MAINTAINER`. No duplicate comment was posted.
- Builders Reflect & Share remains `NEEDS_OWNER_ACTION / INVESTIGATE`. The Cygnix inquiry is visible with no sponsor reply. No workshop attendance or qualifying X-post evidence is claimed.
- The Vietnam hackathon remains blocked for the current Kuwait-based remote profile by its detailed Vietnam-base and in-person HCMC pitch requirements.

## State snapshot

- Investigating: **271**
- Rejected: **15**
- Waiting for maintainer: **1**
- Do not hunt: **1**
- Phase 3 eligible / private proof / locked / solving / QA / ready to submit / submitted / changes requested / merged / paid: **0 each**

## Owner action

No new owner action arose in this cycle. Previously communicated workshop/X evidence and Gitpay KYC/payout setup remain unchanged and are not repeated here.

## Learning

- A newly opened bounty proposal can already contain or promise the proposer's own PR; it is not free work merely because the issue remains open.
- Gitpay's signed-in open-bounty filter still returns no current records, so the historical catalogue must stay outside live opportunity counts.
- The fresh persistence pass recorded 12 runtime changes. A verification pass immediately afterward was idempotent, confirming the same live candidate set without adding duplicate records.
