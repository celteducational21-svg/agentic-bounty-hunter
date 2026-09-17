# Market qualification and source expansion — 2026-09-17

Stage 2 began after `../benchmarks/REPORT.md` and `stage1-freeze.json` were written. Research and live checks were read-only. No account creation, terms acceptance, spending, claims, public comments, submissions or payout actions occurred.

| Source | Decision | Observed current work / adapter |
|---|---|---|
| GitHub-native | Retain ADD_NOW | Existing authenticated discovery; 60 raw entries in the fresh runtime scan. |
| Opire | Retain ADD_NOW | Existing adapter; 30 provider entries; pay-on-acceptance remains acceptable. |
| Superteam Earn | ADD_NOW: read-only discovery | Official public agent catalogue: 2 verified agent-permitted listings across all categories, 1 Development listing. New adapter imports the Development view only. Authenticated Agent API and owner onboarding are separate gates. |
| Gitpay | MONITOR | 87 open records, zero positive displayed rewards; funded filter returned zero. Assignment-first workflow verified; AI policy/current payable work unresolved. No adapter. |
| BountyHub | MONITOR | Operational docs exist, but working current task catalogue not verified. Active count UNKNOWN, not zero. No adapter. |
| IssueHunt | REJECT_SOURCE for general lane | Current product is security vulnerability bounties. No general Solver adapter. |
| Algora | MONITOR | Four sampled challenges completed/rewarded; current terms prohibit automated monitoring, with no permitted discovery API verified. No scraper. |
| OnlyDust | REJECT_SOURCE | Official closure announcement. No adapter to the former programme. |
| HackQuest | MONITOR / Wave 2 | One live technical buildathon in a five-event sample; competitive Web3 product work, no blanket autonomous-agent permission established. Research only. |
| DoraHacks | MONITOR / Wave 2 | Access returned errors/405; current rules and catalogue UNKNOWN. No adapter. |

Qualification details, official sources, payout/claim models, AI policy, competition, geographic limitations and owner requirements are in `superteam-gitpay.{md,json}` and `other-sources.{md,json}`. UNKNOWN facts remain investigation; they are not fabricated eligibility or rejection evidence.

## Live counts and realistic opportunities

Fresh existing-runtime scan at **2026-09-17T11:06:31.540Z**: GitHub60 + Opire30 raw entries → **76 canonical unique issues**, persisted durably. Superteam's separately verified Development adapter returned **1** distinct listing. Combined canonical issue/listing-URL deduplication yields **77** discovered records from **91** raw entries. Research-only Gitpay/event observations are not imported or added to this total. These are bounded scan populations, not all opportunities on each platform.

The only newly added technical listing is [Superteam Vietnam's Colosseum track](https://superteam.fun/earn/listing/colosseum-crypto-worlds-fair-hackathon-superteam-vietnam-track/): 10,000 **USDG total pool**, October13 deadline, five observed submissions at research time. It is outside the initial small-task lane, has no confirmed individual award or owner geographic eligibility, and remains INVESTIGATING. It is not an authorized solve or an earned reward. No new $25–$300 early-win opportunity or private proof was promoted by source expansion. Existing GitHub scan produced zero machine-admitted Phase3 candidates; incomplete evidence still needs investigation.

## Implementation

- Added `src/providers/superteam.js`: GET-only official public agent Development catalogue. No credential, registration, submission or wallet APIs. Explicit AGENT_ALLOWED/AGENT_ONLY, verified sponsor, open status, winners and deadline validation; conflicting identity/policy data is reported for canonical recheck instead of silently choosing permissive evidence.
- Fresh `/api/opportunities` scans fetch this source alongside existing discovery; outage cannot stop other sources. Normalized discoveries and source metrics are included in the immutable snapshot through the existing dedicated ABH Supabase path. No database/admin/schema changes.
- Source records enter DISCOVERED → INVESTIGATING with persisted transition evidence and appear in the operational dashboard. Discovery cannot grant eligibility, reservation, QA or submission approval. Existing execution survives provider outages and repeat scans.
- Added evidence-based source economics: opportunities, proofs, assignments, historical submissions, accepted/paid outcomes, realized average reward by currency, actual effort, maintainer response samples and disputes/reliability. Benchmarks are excluded; no theoretical reward is earned income. Existing ranking policy is unchanged until real outcomes support it.
- Source-specific workflow guidance and `../HUMAN_PLATFORM_SETUP.md` consolidate the owner session. Maximum 1–2 active Solver jobs remains; do not manufacture proofs just to fill the target queue.

Independent QA: **226 tests pass**, plus **13 independent checks** and live adapter execution. QA caught ambiguous duplicate policy/deadline handling and raw public error exposure; fixes were verified. Detailed reviewed hashes, initial failures and final evidence are in `INDEPENDENT_QA.md`, `qa.json` and logs.

Production deployment/readback is verified after this committed change; the final run's immutable runtime scan contains actual deployed source counts and commit provenance. Counts may change between this frozen pre-deployment observation and the post-deployment scan. No always-on autonomous Solver service is claimed.
