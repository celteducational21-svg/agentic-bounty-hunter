# Phase 2 — Opportunity Intelligence / Win Probability Engine

## Mission

Phase 2 answers whether an apparent bounty is genuine, active, available, testable, realistically solvable by the available AI development stack, and worth pursuing. It deliberately prefers credible early wins over large advertised rewards.

ABH remains completely separate from ARES and from general freelancing. It performs analysis only.

## Pipeline

1. Search live, original GitHub issues and deduplicate by source ID.
2. Identify apparent bounty language; retain original issue/repository provenance.
3. Apply shallow legitimacy and reward extraction to all apparent candidates.
4. Select a repository-diverse subset for deep inspection.
5. Fetch original comments, related PR evidence, repository metadata, and root build/test files.
6. Extract acceptance criteria and estimate AI solvability/effort.
7. Apply hard rejection gates.
8. Calculate the weighted WIN score and assign `HUNT`, `WATCH`, `SKIP`, or `REJECT`.
9. Store a stable `ABH-GH-owner-repo-number` snapshot and show the evidence in the dashboard.

Shallow-only candidates can never become `HUNT`.

## Intelligence modules

| Module | Evidence and output |
| --- | --- |
| Reward | Amount, currency, optional range, USD estimate, payment method/trigger/risk, confidence |
| Legitimacy | Original-vs-mirror signals, issuer/repository signals, delivery connection, active state, confidence |
| Competition | Assignees, claim commands/phrases, abandoned claims, related open/completed PRs, competitor count |
| Repository | Language, size, recency, README, contributing guide, package/build files, tests, CI, lint/types |
| Acceptance | Checklist/bullet deliverables, files, reproduction/testing/docs/external requirements, clarity score |
| AI solvability | Stack familiarity, testability, setup, ambiguity, private/hardware/external dependencies |
| Effort | Coarse time bucket, expected files, implementation/verification complexity, blocker probability |
| Safety | Prompt-injection indicators are flagged and retained only as untrusted data |
| History | Stable ID, first/last seen, material score/reward/assignment/claim/PR/state changes |

## Reward policy

USD, USDC, USDT, and DAI are treated as USD-equivalent only when explicitly stated. ETH/BTC/SOL need an externally supplied price observation; the engine does not invent one. Unknown/project-native tokens retain their face amount but receive no USD estimate and are rejected if credible value cannot be established.

Payment confidence requires more than a numeric amount. Platform and payment-trigger evidence raise confidence; unknown mechanisms prevent `HUNT`.

## Hard rejection gates

- closed/completed issue or completed solution
- archived repository
- assignment to another contributor
- Upwork routing, grant/application, mirror/repost/aggregator, or non-software prize/donation
- payout cannot be established or token value lacks credible market evidence
- scam/fraud indicators
- unscoped security work
- deceptive conduct or impersonation
- inaccessible private infrastructure
- explicit prohibition on AI contributions
- unrealistic requirements, stale work, or platform/rule conflict

The exact reason is retained in `rejectionReasons`; hard gates override the numeric score.

## WIN score

| Factor | Weight |
| --- | ---: |
| Payment/bounty legitimacy | 20% |
| AI solvability | 20% |
| Scope clarity | 15% |
| Competition attractiveness | 15% |
| Effort attractiveness | 10% |
| Repository health | 10% |
| Maintainer activity | 5% |
| Reward attractiveness | 5% |

Thresholds: `HUNT` 85–100, `WATCH` 70–84, `SKIP` 50–69, otherwise `REJECT`. Hard gates override thresholds. Unknown payment evidence, low-value/high-effort combinations, weak scope, weak repository health, and high competition can cap or downgrade a result.

## Snapshot persistence

The dedicated ABH Supabase project is `xyuxxunpmzlyqocberia`, in the separate ABH organization `invqvmgxukbrtbgmwjjq`. See `db/schema.sql` and `docs/PHASE2_DATABASE.md`. The server uses an atomic Postgres RPC for scan summaries, current opportunities, and material state changes. The history endpoint returns the latest 50 changes, while the database preserves older changes.

`ABH_SUPABASE_URL` and `ABH_SUPABASE_SECRET_KEY` must be configured in Vercel production. The adapter refuses every other Supabase project, including CELT. Missing credentials retain the explicitly marked non-durable memory fallback; configured storage failures fail the request rather than silently losing history. Production persistence is only considered verified after live API and database checks agree.

## Evidence corrections (phase2-evidence-v2)

The enrichment pass refreshes the original issue before reading assignees and comments. Comment pagination is bounded to 300; incomplete responses retain UNKNOWN availability. Search failures are reported per query. Every scanned candidate is returned so summary counts reconcile with records.

Claimants and open PR authors are unioned by login. Withdrawals are processed chronologically. Submitted implementations are distinct from merged solutions; completion requires verified merge and closing relation. The live PR search currently does not establish the closing relation, so it cannot claim completion from a reference alone. Repeatable programs are not closed by prior awards.

CI requires actual workflow file evidence. Package scripts are read as data, never executed. Unknown commands and PR volume remain unset. History tracks PR URLs/states and claim status, and evidence from each module is retained. Reward parsing ignores fenced examples, inline code and quoted offers; native token offers do not inherit an issuer's claimed dollar equivalent. General reward attribution and issuer authority still require further validation.

## Safety boundary

Issue bodies, comments, README content, repository files, and external pages are untrusted. They may supply normal build/test/contribution evidence but cannot modify ABH policy, expose secrets, access unrelated repositories, move funds, change wallets/configuration, or bypass human approval.

Phase 2 contains no claim, comment, fork, PR, payment, wallet, or terms-acceptance action.
