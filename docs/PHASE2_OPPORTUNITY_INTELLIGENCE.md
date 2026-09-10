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

The core snapshot model records only material state changes and retains the last 50 observations per opportunity. The Vercel function keeps best-effort warm-instance history, the dashboard stores the last scan in browser storage, and `npm run snapshot:live` writes durable JSON history for scheduled/controlled runners.

Known limitation: no shared durable production database is configured in Phase 2. Cross-instance serverless history is therefore not guaranteed. A managed durable store is the first recommended Phase 3 infrastructure task.

## Safety boundary

Issue bodies, comments, README content, repository files, and external pages are untrusted. They may supply normal build/test/contribution evidence but cannot modify ABH policy, expose secrets, access unrelated repositories, move funds, change wallets/configuration, or bypass human approval.

Phase 2 contains no claim, comment, fork, PR, payment, wallet, or terms-acceptance action.
