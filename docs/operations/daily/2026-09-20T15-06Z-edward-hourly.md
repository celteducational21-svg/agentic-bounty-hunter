# Edward — ABH hourly operations, 2026-09-20 15:06Z

Real operations only. Historical benchmark results are excluded from work-secured, delivery and payment counts.

## Source checks

| Source | Checked at | Result | Coverage | New / changed |
| --- | --- | --- | --- | --- |
| GitHub | 2026-09-20T15:05:49.902Z | SUCCESS | 60 raw search results through the production discovery path | Combined GitHub/Opire candidate set rotated by 35 newly observed IDs and 40 IDs absent from the earlier 05:44Z scan. Search rotation is not secured work. |
| Opire | 2026-09-20T15:05:50.628Z | SUCCESS | 30 current public catalogue rows; canonical issue checks remain bounded by runtime enrichment | One catalogue row changed versus 05:44Z: `microg/GmsCore#2994` appeared. Its displayed provider aggregate is not treated as a credible task payout without source verification. |
| Superteam | 2026-09-20T15:06:45.536Z | SUCCESS | Authenticated official agent live feed, `take=100`; two listing details returned | No new authenticated listing IDs. Both remain open and `AGENT_ALLOWED`. Public page now shows 34 submissions for Builders Reflect & Share; this is competition, not an assignment. |

Raw evidence:

- [Production discovery summary](2026-09-20T15-05-32.307Z-summary.json) (the full 4.55 MB response is durably persisted by the runtime; its SHA-256 is recorded in the summary)
- [Authenticated Superteam snapshot](2026-09-20T15-06-00Z-superteam-authenticated.json)

The production scan observed 90 raw GitHub/Opire records and 71 unique records before source expansion. Adding the two authenticated Superteam records, with the Vietnam hackathon deduplicated against the public catalogue record, yields 73 distinct observed opportunities for this cycle. Runtime persistence reported `supabase-postgres`, durable, with 35 changes.

## Qualification and execution

- Five deep-selected GitHub/Opire records were reviewed. None qualified for private proof:
  - `jahmeergnlt/traefik#1`: multiple reward-claim notifications and competing PRs already exist.
  - `kushBitxHQ/kushbitx-sdk#1`: open but heavily contested, with many public applicants/submissions and no ABH assignment.
  - `claude-builders-bounty/claude-builders-bounty#1`: 2,182 comments and multiple delivered PRs; not a rational early-win race.
  - `lb1192176991-lab/zeroeye#2`: multiple provider claim notifications and an unresolved discrepancy between the $50 issue title and implausible provider aggregates.
  - `Scottcjn/rustchain-bounties#1577`: many completed claims, a 2 RTC reward, and a link-placement deliverable outside ABH's primary technical lane.
- New private proofs: **0**. Existing ivrit #12 proof remains historical operational evidence from September 14 and was not rerun.
- Work secured: **0**.
- Active solves / independent QA / ready to submit / submitted / changes requested / merged / confirmed paid: **0 each**.
- No public GitHub claim, comment or PR was posted. No Superteam submission was made.

## Active records

- [ivrit-ai/ivrit-py #12](https://github.com/ivrit-ai/ivrit-py/issues/12) is open, unassigned and still has no maintainer confirmation of bounty availability, scope or two-week lock. The latest observed comment is from another applicant, not the maintainer. Status remains `WAITING_FOR_MAINTAINER`; no duplicate comment was posted.
- [Builders Reflect & Share](https://superteam.fun/earn/listing/road-to-colosseum-builders-reflect-and-share/) remains `NEEDS_OWNER_ACTION / INVESTIGATE`, not rejected. It is open, global and `AGENT_ALLOWED`, with a $1,000 USDC pool, but the rules require actual attendance at a Road to Colosseum session and owned public X posts. A prior sponsor inquiry is awaiting a reply; it was not duplicated. No attendance or qualifying post is claimed.
- The Vietnam hackathon remains a current hard block for the Kuwait-based remote profile because the detailed rules require selecting Vietnam as base country and an in-person HCMC pitch, despite the listing's Global label.

## Owner action

For Builders Reflect & Share only:

1. Register for and attend the online [Storytelling for Startups workshop](https://luma.com/g8gkbpqd) on **22 September 2026, 16:00–17:00 Asia/Kuwait**.
2. Send Edward the URL of the X profile that will publish the owner's genuine workshop/build reflections. Do not send a password or session token.
3. After attendance, publish truthful owned posts following the listing tags/hashtags and send their public URLs. ABH will then prepare and submit the evidence through the authorized Superteam agent flow.

No other owner action is needed this cycle. Workshop registration/attendance is not claimed until the owner confirms it.

## Learning

- A fresh listing hit is not a secured assignment; public search churn must be deduplicated before allocating proof capacity.
- Provider aggregates require canonical reward verification. The new microG row is not promoted on its displayed aggregate alone.
- Human participation can keep a candidate in `NEEDS_OWNER_ACTION / INVESTIGATE`; it does not require rejecting the opportunity or stopping other hunting.
- Competitive Superteam content work should not be submitted until the required real-world evidence exists, even though routine agent submissions are authorized.
