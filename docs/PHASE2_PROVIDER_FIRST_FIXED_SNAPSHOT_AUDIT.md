# Provider-first fixed production audit

**Phase 2 verdict: INCOMPLETE. Ranking quality is NOT certified.**

## Exact build and population

One production scan was run, at **2026-09-12T15:14:49.227Z**, using source commit `32f04fc20d06f38cd6de6dcf0c1d87f9f31eee77` and revision `phase2.3-provider-first-v1`.

Scan deployment: `dpl_46E4v8PUSWuaDr98NQwcBEyfZZ4n`, https://agentic-bounty-hunter-879bd09io-celteducational21-3805.vercel.app . Production alias: https://agentic-bounty-hunter.vercel.app . Immutable read-only view: https://agentic-bounty-hunter.vercel.app/?snapshot=2026-09-12T15%3A14%3A49.227Z . Full raw inputs are retained in the existing dedicated ABH database; curated original-source evidence and request diagnostics are in `audits/provider-first-production-review.json`.

After the audit exposed concrete failures, narrow corrections were made to the catalogue URL, cheap multi-issue report screening, cross-task README dependency isolation and transport exception diagnostics. Final correction deployment: `dpl_GtYh7pKyS4iGiWZsWp6vgmo2cWb3`, https://agentic-bounty-hunter-hr3laad22-celteducational21-3805.vercel.app , revision `phase2.3-provider-first-v2`. **Those corrections were not subjected to a second production scan.** Do not attribute this frozen result to the corrected selector or replace its population. Final test suite: **166 passed, 0 failed**; scan-build suite: 163 passed, 0 failed.

The audit uses the five selected discovery URLs, including the AutoKey repost resolved to its original. It does not substitute independently found Opire catalogue entries or the top five visible dashboard cards. The resolved AutoKey record can appear below deferred rows because the existing dashboard orders discovery URLs; its canonical record is included here explicitly.

## Funnel and storage

| Stage | Count |
|---|---:|
| Raw GitHub results | 60 |
| Provider-originated results in this scan | 0 |
| Unique / basic screened | 45 / 45 |
| Final opportunity records | 45 |
| Selected original sources resolved | 5 |
| Selected distinct repositories | 5 |
| Exact provider listings verified | 1 |
| Repository inspection steps marked complete | 5 |
| All seven inspection steps complete | 2 |
| Eligible FULLY_ENRICHED opportunities | 0 |
| HUNT / WATCH / SKIP | 0 / 0 / 0 |
| REJECT / INCOMPLETE | 13 / 32 |

The API's `fullyEnriched: 2` counts completed inspection modules even when hard-rejected. Both such records are aggregation reports and have `enrichmentState: REJECTED`; they are not two genuine fully enriched bounty opportunities. This does not satisfy the five-candidate target or establish that fewer than five legitimate opportunities exist in the market.

The dashboard rendered the deployed collector, saved the scan, and read back the identical timestamp/funnel/counts through the production alias with `snapshotReadOnly: true` and durable Supabase persistence. Existing ABH database/schema/history were retained; CELT/ARES were not accessed. Exact aggregate database row totals are UNKNOWN. No new scan is triggered by the immutable readback.

The final correction deployment also rendered this exact stored snapshot and successfully loaded the changelog opportunity history, confirming readback/history retention through redeployment without rescanning. Deployment status-tool inspection was unavailable for this personal Vercel account; health is based on the functioning deployed dashboard, database readback and history flow, not an unobserved monitoring status.

## HTTP 403 diagnosis and provider access

There were **67 recorded source requests**, **zero HTTP 403**, and one provider transport exception. All recorded GitHub requests were unauthenticated and successful HTTP 200. Search headers showed a limit of 10; core headers showed 60, with 17 remaining on the final core response. The collector now records all requested headers, endpoint/category, status, authentication Boolean and sanitized failure messages. No credential was copied, created or exposed. A dedicated credential was not necessary to complete this run's attempted GitHub requests.

The earlier 20 HTTP 403 responses lacked diagnostic headers/body. Their exact cause cannot be certified retrospectively. The unauthenticated 60-request core limit is now demonstrated, making primary exhaustion a plausible explanation for the earlier run, not a proved historical diagnosis. Current serial requests, bounded thread work and raw-file reads avoided 403s. New primary/secondary/permission/restriction handling is covered by tests; do not claim that a live permission failure was observed.

The public catalogue request to `https://app.opire.dev` returned a transport TypeError without an HTTP status or captured cause. Browser navigation established its current destination as `https://app.opire.dev/home`; that destination was also successfully read through web retrieval. A redirect-refusal explanation is consistent with the collector configuration but not conclusively recorded by the failed request. The corrected collector requests `/home` directly and records exception causes. Current public HTML yields 30 structured catalogue entries in the parser; production provider-first discovery from the corrected URL still requires validation.

Unlike catalogue discovery, exact-listing retrieval succeeded for [AutoKey on Opire](https://app.opire.dev/issues/01J73BXYSGA83XKW25TPF2QMK0). The original GitHub issue and provider page agree on the exact task and its CLOSED state. Opire advertises $590, seven available reward entries, zero paid entries, 26 trying solvers and 13 claimants. This is not an active eligible task or proof that money is held. Provider confidence remains PARTIAL, issuer UNKNOWN, funding PAY_ON_ACCEPTANCE, payment after creator acceptance through the configured Stripe lifecycle. [Official payment mechanics](https://docs.opire.dev/overview/getting-started) require creator confirmation; a listing alone is not escrow.

## Top-5 source audit

All assignee lists were empty in original GitHub responses. All five repositories were not archived. Total competition remains UNKNOWN for the three incomplete inspections. Zero observed discussion/PR activity on an aggregation report does not establish a worthwhile low-competition bounty.

| Selected source → canonical issue | Advertised / provider-verified reward | Payment and funding | Availability and competition | Scope / dependencies | Readiness / AI / effort / score | Machine → source audit |
|---|---|---|---|---|---|---|
| [Changelog skill #1](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/1) | $50 USD / UNKNOWN | Opire homepage only; PARTIAL; issuer UNKNOWN; funding/trigger UNKNOWN | Open, unassigned; 2,131 comments; 11 observed GitHub actors; ten fetched open submissions, coverage PARTIAL; provider counts UNKNOWN | Six checkboxes correctly extracted, clarity 85. Frozen machine incorrectly inherited Claude API/n8n requirements from another README bounty row; source audit removes those dependencies. | 0 / 20 / UNKNOWN / UNKNOWN | INCOMPLETE → INCOMPLETE; YES with dependency error |
| [AutoKey repost](https://github.com/abdulmajeedsualihu/Autokey/issues/1) → [original #87](https://github.com/autokey/autokey/issues/87) | Discovery repost $40; original issue no fixed amount; exact Opire listing $590 total | Exact listing VERIFIED; payout confidence PARTIAL; issuer UNKNOWN; PAY_ON_ACCEPTANCE, not secured funds | CLOSED, unassigned; 278 comments; provider 26 trying / 13 claimed; nine observed GitHub actors; retrieved open/closed submissions, coverage PARTIAL | Wayland/Gnome shortcut support; reproduction steps present, clarity 30. Requires suitable graphical Linux/Wayland validation; structured runtime dependency remains incomplete. | 25 / 45 / UNKNOWN / UNKNOWN | REJECT → REJECT; YES, original closure overrides advertised availability |
| [freedom-winds/BountyScout #1038](https://github.com/freedom-winds/BountyScout/issues/1038) | Machine $25 USD; actual task reward NONE for this report | No provider listing; UNVERIFIED; funding/issuer UNKNOWN | Open, unassigned; zero comments/related submissions for report, complete bounded inspection | Aggregation of eleven different issues, not a deliverable. $25 belongs to a linked proposed task. Clarity 25/empty criteria. Report repository setup is irrelevant to solving those external tasks. | 45 / 65 / 30–90 min / 51; these values are irrelevant because hard-rejected | REJECT → REJECT; YES, reward attribution error remains in frozen record |
| [RustChain badge #13949](https://github.com/Scottcjn/rustchain-bounties/issues/13949) | 2 RTC / no provider verification; USD UNKNOWN | Owner-authored promise, PARTIAL; no verified market value; source describes a revocable pending transfer, funding UNKNOWN | Open, unassigned; 66 comments; one observed GitHub actor; one closed unsuccessful PR and one merged reference; timeline coverage PARTIAL | Promotional badge placement on a repository the participant owns. No software-delivery acceptance criteria; clarity 15. No wallet was disclosed. Source review considers this outside ABH's software-delivery target. | 45 / 50 / UNKNOWN / UNKNOWN | INCOMPLETE → REJECT recommendation; NO, eligibility disagreement recorded |
| [vansh-09/BountyScout #1109](https://github.com/vansh-09/BountyScout/issues/1109) | Machine $25 USD; actual task reward NONE for this report | No provider listing; UNVERIFIED; funding/issuer UNKNOWN | Open, unassigned; zero comments/related submissions for report, complete bounded inspection | Aggregation of twelve issues; copied $25 proposed reward does not pay for this report. Clarity 25/empty criteria. | 45 / 65 / 30–90 min / 51; irrelevant after rejection | REJECT → REJECT; YES, reward attribution error remains in frozen record |

Stable ABH IDs, full original bodies, repository metadata, selected README/build/workflow source paths and fetched PR records are preserved in the curated artifact. Repository readiness is analysis of retrieved evidence, never proof of an executed build. AutoKey's legacy Python build/setup evidence and graphical-runtime requirements are not fully established by the current selected file set. This is a technical-enrichment limitation, not permission to run untrusted code.

Example PR evidence: [changelog #3887](https://github.com/claude-builders-bounty/claude-builders-bounty/pull/3887), [AutoKey #1103](https://github.com/autokey/autokey/pull/1103), [AutoKey #1192](https://github.com/autokey/autokey/pull/1192), [badge unsuccessful submission #16779](https://github.com/Scottcjn/rustchain-bounties/pull/16779), [badge merged reference #16657](https://github.com/Scottcjn/rustchain-bounties/pull/16657). The merged badge reference is not falsely classified as a completed solution. Independent original GitHub page review additionally showed AutoKey related PR #1076, outside the fetched ten-detail set; incomplete search is therefore material.

## Quality metrics

- Repository diversity: 5/5 distinct selected repositories, maximum one each. This is structural diversity, not five genuine opportunities; two are scanner forks producing similar reports.
- Exact listing verification: 1/5, correctly cross-linked and correctly rejected as closed. No secured funds asserted.
- Reward attribution: 3/5 do not materially misstate the original/task/provider evidence; 2/5 report rows wrongly display a linked task's $25. Hard rejection prevented elevation but did not make those reward fields accurate.
- Assignment/status accuracy: 5/5 match original snapshots; AutoKey closed, the other four open, all unassigned.
- Competition: no known false LOW for an eligible incomplete task. Three relevant investigations remain PARTIAL, so true counts/absence of completed solutions are not certified.
- Scope extraction: the six changelog checkboxes are captured; replay of the prior actual n8n issue yields all eight criteria, score 75 and three operational dependency types. No claim is made that prose-only scope or all repository runtime needs are fully understood.
- Dependency precision: source audit found a cross-task README-row false positive; corrected and regression-tested after freezing. The record itself is unchanged.
- Machine/source decision agreement: 4/5; badge promotion receives an audit REJECT recommendation while machine says INCOMPLETE. No HUNT was produced.
- Eligible fully enriched opportunities: 0. No precision/recall or win-probability calibration is claimed.

## Corrections versus remaining blockers

Already corrected after freezing: direct `/home` catalogue URL; diagnostics include exception cause; multi-issue reports retain their existing rejection before deep selection; another issue's README row no longer creates current-task dependencies. All final 166 tests pass. This honors the one-scan instruction and does not retroactively modify evidence.

Remaining certification blockers are precise:

1. **Provider-originated production ingestion and complete genuine-candidate coverage remain unproved.** The sole permitted scan had zero catalogue discoveries, two complete rejected report inspections and three incomplete competition inspections. The corrected URL/selector needs a separately authorized future scan; large-thread/timeline coverage must remain explicit.
2. **The frozen source audit still has material field/eligibility defects:** two aggregator reward-attribution errors and the promotional badge eligibility disagreement. Early report screening now prevents those reports consuming future audit slots, but this population cannot pass reward/ranking certification.
3. **Technical readiness is not complete for the genuine source inspected:** AutoKey's legacy build path and graphical-runtime dependency were not sufficiently established, and its closed state independently prevents pursuit. No other complete, active, provider-verified technical candidate was produced.

Do not weaken thresholds or declare fewer-than-five market availability from this sample. No Phase 3 candidate is recommended. No claims/comments, `/try`, `/attempt`, third-party forks, solution PRs, payment/wallet disclosure, contracts or financial actions occurred. Next work remains Phase 2 validation/remediation, not solving or scheduling.
