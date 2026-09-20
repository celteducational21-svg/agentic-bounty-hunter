# Edward — ABH hourly operations, 2026-09-20 15:58Z

Real operations only. Historical benchmark results are excluded from work-secured, delivery and payment counts.

## Source checks

| Source | Checked at | Result | Coverage | New / changed |
| --- | --- | --- | --- | --- |
| GitHub | 2026-09-20T15:58:40.223Z | SUCCESS | 60 raw search results through the production discovery path | Search rotation surfaced four recent Omi bounty proposals. Live issue and PR checks showed that each proposal already named its own implementation PR; none is available work. |
| Opire | 2026-09-20T15:58:41.195Z | SUCCESS | 30 current public catalogue rows; canonical issue checks remain bounded by runtime enrichment | No newly qualified small task. Provider aggregates continue to require canonical reward verification before use. |
| Superteam | 2026-09-20T15:58:24.623Z | SUCCESS | Authenticated official agent live feed, `take=100`; two listing details returned | No new or changed authenticated listing IDs. The two known listings remain open and `AGENT_ALLOWED`; neither produced a new submission or assignment event. |
| Gitpay | 2026-09-20T16:00:00Z | SUCCESS | Signed-in Explore view with `Issues with bounties` and `Open` filters visibly selected | Zero rows: the page displayed `No records for this table yet`. Historical all-status rows are not counted as open work. |

Raw evidence:

- [Production discovery summary](2026-09-20T15-58-24.739Z-summary.json) (the full 4.55 MB response is durably persisted by the runtime; its SHA-256 is recorded in the summary)
- [Authenticated Superteam snapshot](2026-09-20T15-58-00Z-superteam-authenticated.json)

The production scan observed 90 raw GitHub/Opire records and 79 unique records before source expansion. The public Superteam catalogue added the Vietnam listing for 80 distinct records. The authenticated feed also returned Builders Reflect & Share, while its Vietnam record deduplicated against the public catalogue, yielding 81 distinct opportunities across GitHub, Opire and authenticated Superteam. Gitpay added zero open bounty rows. Runtime persistence reported `supabase-postgres`, durable, with 13 changes.

## Qualification and execution

- Five deep-admission candidates were reviewed; none qualified for a private proof:
  - `BasedHardware/omi#15164`: the issue itself disclosed PR #15163, and the author confirmed that PR was merged before this scan. The task is already solved.
  - `jahmeergnlt/traefik#1`: multiple reward-claim notifications and competing PRs already exist.
  - `kushBitxHQ/kushbitx-sdk#1`: heavily contested, with no ABH assignment.
  - `claude-builders-bounty/claude-builders-bounty#1`: thousands of comments and multiple delivered PRs make it an irrational early-win race.
  - `lb1192176991-lab/zeroeye#2`: multiple claims and an unresolved discrepancy between the $50 issue title and implausible provider aggregates.
- Three additional Omi proposals surfaced in the live GitHub set. `#15176` and `#15178` each named an already-created implementation PR in their issue body; `#15179` likewise disclosed an existing fix. They are not available bounty work.
- New private proofs: **0**. Existing ivrit #12 proof remains historical operational evidence from September 14 and was not rerun.
- Work secured: **0**.
- Active solves / independent QA / ready to submit / submitted / changes requested / merged / confirmed paid: **0 each**.
- No public GitHub claim, comment or PR was posted. No Superteam or Gitpay submission was made.

## Active records

- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) remains open and unassigned. No maintainer confirmation of bounty availability, scope or two-week lock appeared; status remains `WAITING_FOR_MAINTAINER` and no duplicate comment was posted.
- Builders Reflect & Share remains `NEEDS_OWNER_ACTION / INVESTIGATE`. The sponsor inquiry has no verified reply in this cycle; no attendance or qualifying X-post evidence is claimed.
- The Vietnam hackathon remains a hard block for the current Kuwait-based remote profile because its detailed requirements call for Vietnam-base eligibility and an in-person HCMC pitch.

## State snapshot

- Investigating: **263**
- Rejected: **15**
- Waiting for maintainer: **1**
- Do not hunt: **1**
- Locked / solving / QA / ready to submit / submitted / changes requested / merged / paid: **0 each**

## Owner action

No new owner action arose in this cycle. Previously communicated workshop/X evidence and Gitpay identity/payout setup remain unchanged and are not repeated here.

## Learning

- A title containing “bounty proposal” is not enough: issue bodies and comments must be checked for an existing patch before proof allocation.
- Recently opened issues can already be solved before discovery reaches them; canonical PR checks are part of qualification, even when the issue remains open.
- Gitpay's signed-in open-bounty filter currently yields zero work; historical rows must not inflate live opportunity counts.
