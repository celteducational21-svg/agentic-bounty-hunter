# Additional source qualification — 2026-09-17

Observed 2026-09-17T10:54:15Z, after Stage 1 report freeze. Research only: no account creation, terms acceptance, contact, claim, PR, payout configuration, payment or adapter deployment occurred. Counts below are bounded observations, not total market size. Unknown payment eligibility is not a claim that the owner is ineligible.

| Source | Decision | Current evidence and next step |
|---|---|---|
| BountyHub (`bountyhub.dev`) | MONITOR | Official operational docs are readable, but linked catalogue supplied no task rows and raw HTML referenced a not-found route. Verify working catalogue/current paid tasks before adapter implementation. |
| IssueHunt | REJECT_SOURCE for general Solver | Current official product is security vulnerability research, outside this lane. Historical OSS reputation is not current discovery evidence. |
| Algora | MONITOR | Current homepage emphasizes recruiting. Four sampled challenge links show completed/rewarded/winner status; no active early-win task verified. Automated-access permission also unresolved. |
| OnlyDust | REJECT_SOURCE (closed) | Official homepage announces closure and migration of founders' focus to ctrlg. Do not build an adapter to the former grant programme. |
| HackQuest | MONITOR / Wave 2 | Current technical hackathon verified, but large competitive Web3 product-building differs from small assigned fixes. Research only. |
| DoraHacks | MONITOR / Wave 2 | Public requests returned405 or fetch errors. Current catalogue, rules and payouts could not be verified. This is an access limitation, not evidence the platform closed. |

## BountyHub

Use [bountyhub.dev](https://www.bountyhub.dev/en), not the unrelated security-automation namesake `bountyhub.org`. Its [hunter guide](https://www.bountyhub.dev/en/docs/claim-bounty) requires GitHub sign-in, the same GitHub identity on the PR, then importing the PR URL as a claim. Existing claims should be visible on detail pages. Creator acceptance matters; merge alone is not guaranteed payment. The [homepage](https://www.bountyhub.dev/en) describes prepaid or pay-after-completion funding, Stripe payouts and PayPal fallback. The [terms](https://www.bountyhub.dev/en/terms-of-service) describe disputes and transaction fees.

No published agent policy, stable discovery API, exact KYC rules or Kuwait-specific payout eligibility was established. The [catalogue](https://www.bountyhub.dev/en/bounties) yielded zero extractable listings; a separate direct request returned403. Actual active count is UNKNOWN, not zero. No adapter. If later qualified: owner signs in with intended PR-author GitHub identity, reviews payout country eligibility, and personally completes Stripe onboarding or permitted PayPal setup. No account needed now.

## IssueHunt

The [official site](https://issuehunt.io/) now describes security reports, triage, scope and duplicate rejection. Program entry varies between public, application-approved and invitation-only. Rewards transfer through bank or PayPal following company decisions. English participation is described. AI policy, KYC and owner's geographic eligibility remain unverified. Technical security cataloguing was deliberately not run; zero general-lane tasks imported. No setup or adapter for ABH's general Solver.

## Algora

The [homepage](https://algora.io/) and redirected `docs.algora.io` currently emphasize recruiting. Sampled bounty pages: [Turso](https://algora.io/challenges/turso) says submissions closed; [Prettier](https://algora.io/challenges/prettier) and [TSPerf](https://algora.io/challenges/tsperf) display winners; [Golem](https://algora.io/challenges/golem) links [closed/rewarded issue1004](https://github.com/golemcloud/golem/issues/1004). Thus four sampled challenges, zero verified active. These use task-specific contests/PR acceptance, not a uniform reservation flow. Golem's historical rules permit Copilot-like assistance but forbid a fully AI-generated solution; that is a task-specific restriction, not a universal platform AI policy.

[Current published terms](https://algora.io/legal/terms) prohibit automated monitoring/copying; no authorized discovery API was verified. The legacy `app.algora.io/bounties` URL returned404. Do not implement a scraper. Current payout channel, contributor onboarding, KYC and country eligibility remain UNKNOWN. Obtain a current permitted access path and suitable active work before source promotion; no owner account setup yet.

## Wave 2

[OnlyDust's official closure notice](https://www.onlydust.com/) is decisive; historical grant counts are not live opportunities. No active discovery or owner setup.

[HackQuest catalogue](https://www.hackquest.io/hackathons) exposed five event cards in this bounded sample: three ended, one upcoming, one registering. The [Arbitrum Singapore event](https://www.hackquest.io/hackathons/Arbitrum-Open-House-Singapore-Online-Buildathon) has live submission dates September13–October4,2026,793+ participants, prizes denominated USDC and milestone conditions. The organizer decides awards; platform does not guarantee distribution. It includes AI-IDE preparation prompts, but autonomous submission/identity permission is UNKNOWN. Account registration is needed to enter; exact GitHub linkage, KYC, wallet requirements and owner eligibility require event terms. No current setup request; no adapter or small-task import.

[DoraHacks homepage](https://dorahacks.io/), [hackathon catalogue](https://dorahacks.io/hackathon), terms/docs/bounties/blog requests failed in this environment. Consequently payout, claims/assignment, AI policy, competition, geographic constraints and KYC all remain UNKNOWN. Recheck accessible official catalogue and event-specific rules before account setup; do not infer permission from a platform name.

## Integration and economic accounting

ADD_NOW count from these six sources:0. Adapters implemented:0. Qualified small-task opportunities imported:0. Deduplicated imported total:0. HackQuest's active event is a research observation, not an assigned bounty or live ABH operation. No theoretical payout has been counted as earned. Retain source-level opportunities/proofs/assignments/submissions/accepted/paid/effort/response-time/reliability measurements only when real operations produce them.

Machine-readable qualification, uncertainty and owner prerequisites: `other-sources.json`. Root consolidation should request no accounts for MONITOR/REJECT_SOURCE entries now.
