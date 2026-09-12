# Phase 2.2 fixed production source audit

**Verdict: INCOMPLETE. Ranking quality is NOT certified.** Zero HUNT is conservative, but is not evidence that enrichment quality passed. Earlier failures in PHASE2_LIVE_VALIDATION.md and PHASE2_FIXED_SNAPSHOT_AUDIT.md remain intact.

## Build and immutable population

- Runtime source commit: `e04b8f8602a63eb84a3264ff355c253342418fac`.
- Production: https://agentic-bounty-hunter.vercel.app
- Deployment: `dpl_4chqeyaKgXxBrwAoHkhCwV9hQWo8`; https://agentic-bounty-hunter-76nxp7ghv-celteducational21-3805.vercel.app
- Engine: `phase2.2-staged-v1`.
- Automated tests: **127 passed, 0 failed** (105 existing, 22 added).
- Frozen scan timestamp: **2026-09-12T09:45:03.212Z**.
- Read-only snapshot: https://agentic-bounty-hunter.vercel.app/?snapshot=2026-09-12T09%3A45%3A03.212Z
- Complete original-source inputs, request outcomes and results are retained in this scan's existing dedicated ABH database JSONB snapshot. The curated review is `audits/phase2_2-fixed-production-review.json`.

Exactly one new production scan is used for this audit. Its `auditSelection` determines the five rows below; concurrent completion can change tied card display order, not membership. No later scan, independently discovered listing or substituted candidate is counted in this audit. The source review reads the fetched original GitHub issue bodies, repository metadata/tree/README and successfully retrieved PR records from this frozen population. It does not treat board payment claims as provider confirmation. Unretrieved comments/PRs and unverified payment listings remain UNKNOWN.

## Production and persistence

The existing production alias rendered the new enrichment/payment UI and completed the scan. It reported history saved. An independent read through `?snapshot=` returned the identical timestamp and counts with `snapshotReadOnly: true` and `persistence: {durable: true, backend: supabase-postgres}`. The dashboard history button returned the persisted INCOMPLETE record for issue #4 at the same timestamp. One browser navigation transiently returned 502; retrying the read-only URL succeeded. Continuous availability is not claimed.

The dedicated ABH database was retained; no CELT/ARES connection or new database was used. No schema migration or history deletion was needed. Existing cross-deployment retention tests remain passing. Exact aggregate opportunity/history row totals were not queried and are UNKNOWN; current scan persistence, immutable readback and one material history read were directly verified.

## Scan funnel

| Stage | Count |
|---|---:|
| Raw scanned | 60 |
| Unique discovery issues | 55 |
| Basic screened | 55 |
| Final canonical-deduplicated candidate records | 52 |
| Original source resolved by enrichment | 5 |
| Provider listings verified | 0 |
| Repository checks completed | 5 |
| FULLY_ENRICHED | 0 |
| HUNT | 0 |
| WATCH | 0 |
| SKIP | 0 |
| REJECT | 20 |
| INCOMPLETE | 32 |

All five selected candidates completed BASIC_SCREENED, SOURCE_RESOLVED and REPO_CHECKED. PAYMENT_CHECKED and COMPETITION_CHECKED remained INCOMPLETE. Of 85 recorded enrichment requests, 20 returned HTTP 403. Rate-limit headers were not recorded, so the exact reason for 403 is UNKNOWN. The runtime deadline was not the observed bottleneck. Threads contain 1,133–2,131 comments; the 300-comment, 200-timeline-event and ten-PR-detail limits cannot certify their competition or absence of provider links. Four threads yielded 300 comments each; #1 yielded none after failed retrieval.

The preliminary selector placed all five slots in one high-volume board. It did not diversify repositories or account for comment/PR retrieval cost. Thus this run did not establish that fewer than five legitimate opportunities existed: other potential candidates were deferred, not proved invalid. It fails the complete-enrichment gate.

## Provider verification

| Provider encountered | Verification | Payment model | Funding model | Limitation |
|---|---|---|---|---|
| Opire, linked from all five original issues | Platform independently confirmed active; exact listings for these five NOT verified | Platform mechanics require creator confirmation after a solver claim; Stripe mechanics configured from the supplied current behavior | Platform mechanics are PAY_ON_ACCEPTANCE, not assumed escrow; each audited listing's funding remains UNKNOWN | Only the Opire homepage was linked in fetched task text; missing comments may contain exact listings. Creator identity, funding, paid history and exact reward attachment are unverified. |
| GitHub-native issue promise | GitHub issue and repository exist; this is not an independent payment provider | Board asserts automatic payment on merge | UNKNOWN | GitHub existence and issue-author identity do not establish payout authority. |

Official Opire sources: [commands](https://docs.opire.dev/overview/commands), [getting started](https://docs.opire.dev/overview/getting-started), [reward lifecycle](https://docs.opire.dev/rewards/lifecycle), [platform](https://opire.dev/home). These verify dollar-denominated rewards and creator-mediated post-claim payment. In particular, creator confirmation contradicts the board's automatic-on-merge promise. These pages did not independently establish every Stripe/no-funds-held detail during this review; those configured mechanics follow the user's supplied current behavior. No claim of secured funds is made.

An independently inspected [public Opire listing](https://app.opire.dev/issues/01HWT2MKE4GWPJXDPMAFEAHHHE) displayed a $70 reward tied to Strapi issue #11998 with solver/reward counts. It informed the adapter's exact-issue summary parser. It is OUTSIDE this frozen scan and is not counted as a verified candidate here. No additional provider adapter or legacy Gitcoin API was introduced.

## Shared source truth for the five rows

Repository: https://github.com/claude-builders-bounty/claude-builders-bounty . README: https://github.com/claude-builders-bounty/claude-builders-bounty/blob/main/README.md . All five originals were open and unassigned in the frozen GitHub responses. Author `claudebounty` had GitHub association CONTRIBUTOR; that is not proof of repository ownership, funding or maintainer authority. The board README names Opire/Stripe but supplies no independently verified task listing in the reviewed evidence.

Repository metadata: not archived, approximately 55 KB, no dominant language, created and last pushed 2026-03-27. Large issue/fork activity does not prove maintenance responsiveness. The inspected tree/README did not establish an executable project, package/build/test/lint/typecheck commands or an existing test suite for these greenfield deliverables. Repository inspection completed; execution readiness did not. No third-party commands were run. Machine execution readiness and repository health were 0/100; setup/testing remain UNKNOWN, build NOT_RUN. AI solvability was conservatively 20/100 for each, effort UNKNOWN, final opportunity score UNKNOWN because enrichment was incomplete. These are heuristic outputs, not measured failure or win probabilities.

Common payment fields: advertised USD amount is directly tied to each issue's task; exact provider listing NOT VERIFIED; payment confidence PARTIAL; issuer UNKNOWN_PARTY; actual funding UNKNOWN; actual payment trigger UNKNOWN. PARTIAL is defensible as an unverified task promise, not as funding assurance. In the generic fallback, `platformVerified: true` refers to GitHub source existence and must not be read as verification of an Opire listing; the mixed GitHub-native/Opire display remains a clarity limitation.

## Fixed Top-5 machine versus source audit

ABH IDs are `ABH-GH-claude-builders-bounty-claude-builders-bounty-<issue number>`.

| ID suffix / original title | Machine reward / source advertisement | Competition and solution evidence | Scope, execution and blockers | Machine / audit decision | Agreement |
|---|---|---|---|---|---|
| [5 — n8n weekly dev summary](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/5) | $200 USD / $200 task promise; actual payable listing UNKNOWN | Total UNKNOWN/PARTIAL; 20 observed actors, ten retrieved open PR records; no exhaustive completed-solution exclusion | Exportable workflow, weekly GitHub digest, Claude API, notification destination, real n8n screenshot and setup README. Scope score 15 understates explicit criteria. Readiness 0, AI 20, effort UNKNOWN. Machine blockers empty; source requires external Claude API/account and workflow/delivery configuration, accessibility/cost UNKNOWN. | INCOMPLETE / INCOMPLETE | YES, with extraction gaps |
| [4 — PR review agent](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/4) | $150 USD / $150 task promise; actual payable listing UNKNOWN | Total UNKNOWN/PARTIAL; 25 observed actors, ten retrieved open PR records | CLI/action, structured review, two real PR examples, README. Scope 15 understates explicit criteria. Readiness 0, AI 20, effort UNKNOWN. GitHub/model execution access and ability to validate posting require assessment; no permission to post was inferred. | INCOMPLETE / INCOMPLETE | YES, with extraction gaps |
| [3 — destructive-command hook](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/3) | $100 USD / $100 task promise; actual payable listing UNKNOWN | Total UNKNOWN/PARTIAL; 20 observed actors, only two retrieved open PR details; additional details failed | Python/bash hook and specified command-blocking behavior. Scope 15 misses much of the checkbox specification. Readiness 0, AI 20, effort UNKNOWN. Safe isolated test harness not established; dangerous strings were data, never executed. | INCOMPLETE / INCOMPLETE | YES, with extraction gaps |
| [2 — Next.js/SQLite CLAUDE.md](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/2) | $75 USD / $75 task promise; actual payable listing UNKNOWN | Total UNKNOWN/PARTIAL; 27 observed actors, ten retrieved open PR records | Project conventions, migration/build instructions and context verification. Scope 25 incomplete; subjective acceptance remains. Readiness 0, AI 20, effort UNKNOWN; greenfield validation environment not established. | INCOMPLETE / INCOMPLETE | YES, with extraction gaps |
| [1 — changelog skill](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/1) | $50 USD / $50 task promise; actual payable listing UNKNOWN | Total UNKNOWN/PARTIAL; zero observed actors because comments failed, not zero competitors; no successful PR detail reads | Generate categorized changes since a tag, real example and README. Scope 25 incomplete. Readiness 0, AI 20, effort UNKNOWN; reproducible fixture/test path not established. | INCOMPLETE / INCOMPLETE | YES, with extraction gaps |

Retrieved open PR examples: [#3759 for issue 5](https://github.com/claude-builders-bounty/claude-builders-bounty/pull/3759), [#4155 for issue 4](https://github.com/claude-builders-bounty/claude-builders-bounty/pull/4155), [#3885 for issue 3](https://github.com/claude-builders-bounty/claude-builders-bounty/pull/3885), [#4154 for issue 2](https://github.com/claude-builders-bounty/claude-builders-bounty/pull/4154). The curated artifact retains every successfully retrieved detail in the five selected inputs. These counts are observed records, not independently certified unique serious active implementations. No retrieved PR was merged, but incomplete search cannot establish absence of a merged/completed solution.

## Audit metrics and disagreements

| Metric | Result and interpretation |
|---|---|
| Top-5 validity | UNKNOWN: 5/5 advertise software tasks, 0/5 have independently established payable listings. Not five certified bounties. |
| Reward extraction | 5/5 match direct task advertisements in original issue title/body; actual provider payout amounts UNKNOWN. |
| Payment confidence | 5/5 appropriately below STRONG; no listing/funding verification invented. Board automatic-payment claim conflicts with official mechanics. |
| Assignment | 5/5 correctly open and unassigned at snapshot time. |
| Competition | 5/5 remain UNKNOWN/PARTIAL; no false LOW. Actual counts/completed solutions cannot be certified. |
| Repository evidence | 5/5 inspection completed using shared cached metadata/tree/README; 0/5 executable test/build path established. No package-presence readiness bonus. |
| Machine/source decision agreement | 5/5 INCOMPLETE is defensible. This does not certify ranking discrimination among real payable bounties. |
| False-positive HUNT | None; HUNT count zero. |
| Scope/dependency quality | FAILED: explicit checkbox criteria under-extracted; external API requirements not consistently represented as structured dependencies/blockers. |

No decision-level disagreement was found. Field-level errors remain: scope under-extraction; incomplete external dependency detection; ambiguous generic provider/platform display. The new unified blocker model and adversarial tests cover explicit private credential/hardware requirements, but this live wording escaped it. Those failures are preserved rather than silently repaired in the frozen records. No precision/recall or statistical win probability is claimed from five examples.

## Precise remaining exit blockers

1. **Complete source coverage:** all five slots were consumed by the same very large board. Bounded comment/timeline/PR retrieval plus 20 HTTP 403 responses left payment and competition incomplete. Improve repository diversity/cost-aware preliminary selection and resumable source coverage/access diagnostics, then validate a separately identified snapshot; do not replace this failed one.
2. **Concrete payment evidence:** no exact provider listing, authoritative payer, funding state or credible task-specific payment lifecycle was verified for any selected candidate. Homepage references are insufficient. Exact-listing resolution and independent issuer/payment confirmation remain necessary; no escrow assumption is acceptable.
3. **Scope and dependency fidelity:** checkbox acceptance criteria and implicit external API/runtime requirements are not fully extracted. The live workflow's Claude API dependency must enter the structured model, and scope scores must reflect actual deliverables before AI/effort/ranking can be certified.

The lack of a runnable baseline in these five repositories is an observed opportunity limitation, not a reason to fabricate high readiness or lower HUNT thresholds. Production, durable storage and tests pass operational checks; ranking-quality gates do not. No Phase 3 candidates are recommended. No claims, comments, `/try`, `/attempt`, third-party forks, solution PRs, wallet disclosures, contracts or transactions occurred.
