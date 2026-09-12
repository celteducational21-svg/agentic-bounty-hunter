# Phase 2.4 — final live validation

**Verdict: INCOMPLETE. Ranking quality is NOT certified. No Phase 3 candidate is recommended.**

Exactly one new production scan was run, at **2026-09-12T17:11:05.218Z**. Its population and decisions are preserved. The previous failed scan at 2026-09-12T15:14:49.227Z remains a failed audit.

## Build, production and persistence

- Audited runtime commit: `d203c52a3f132222eaceb183e3849f0cf4cdaa84`.
- Runtime revision: `phase2.4-live-validation`.
- Production: https://agentic-bounty-hunter.vercel.app . Deployment: `dpl_BGsMa7JA4iCz8vAZ1p8hR4yinfMN`, https://agentic-bounty-hunter-301slxl9h-celteducational21-3805.vercel.app . Verification used the public production alias; individual deployment URLs can require Vercel authentication.
- Automated tests: **172 passed / 0 failed**, including all 166 starting tests and six focused additions.
- Dedicated ABH Supabase remains `xyuxxunpmzlyqocberia`; no schema or credential changes. The scan persisted **78 opportunity records**, with **12 material changes reported**. These are this scan's counts, not lifetime database totals.
- Read-only database retrieval returned exactly the same candidates, request evidence and audit selection. Candidate-array SHA-256 in both responses: `1784c0590c03a753852d8417d4e5351fa6df610c672a696bdef5312d910bb786` (hash of JSON.stringify on the browser-decoded candidate array).
- The dashboard loaded existing history for the first selected opportunity. An unchanged record retained its earlier history point; no new duplicate point was required.
- [Read the immutable production snapshot](https://agentic-bounty-hunter.vercel.app/?snapshot=2026-09-12T17%3A11%3A05.218Z). Opening this URL reads storage; it does not create a scan.

## Provider discovery proved before the scan

A small read-only `?providerCheck=opire` diagnostic was added because the ordinary endpoint immediately creates a scan. It performs provider reads only, with no GitHub ingestion and no opportunity/database write. Two diagnostic invocations occurred: initial verification, then verification of a specific reward correction. They are not additional scans.

| Production provider check | Result |
|---|---|
| Catalogue request | `https://app.opire.dev/home`, HTTP 200 |
| Entries parsed | 30 |
| Exact listing pages verified | 29/30 |
| Provider pages reporting OPEN with available rewards | 19 |
| Failed listing | Godot `01J8YJ06HPSY7ZAMAW08T83YBD`: eight-second timeout |
| Coverage | Initial public catalogue page only; PARTIAL, not the whole market |

Every listing URL, canonical GitHub URL, advertised amount, observed solver/claim counts, status, response and timestamp is in `docs/audits/phase2_4-provider-preflight.json` and `phase2_4-provider-preflight-corrected.json`. Provider status can be stale: an OPEN provider record does not establish a currently open GitHub issue.

The initial check exposed a real reward bug: Opire's headline includes paid rewards. Leantime #1099 displayed $300 total, consisting of $100 paid and $200 available. qtop #433 displayed $253 total, consisting of $33 paid and $220 available. The narrow correction sums only the current issue's AVAILABLE rows, preserves the headline/paid totals separately, and returns UNKNOWN when a mixed paid/available breakdown is missing. The second production check verified $200 and $220 respectively. See [Leantime's original listing](https://app.opire.dev/issues/01J8NCWJBS24GDWTCAQEK16PVK).

Opire is the only independently checked external bounty provider in this scan. GitHub search is the other discovery path. Exact Opire listings establish advertised rewards and platform state; they do not establish escrow. Funding remains PAY_ON_ACCEPTANCE, issuer/payment history may be UNKNOWN, and no listing was upgraded to STRONG or VERIFIED payment. Opire's [official lifecycle](https://docs.opire.dev/rewards/lifecycle) and [getting-started documentation](https://docs.opire.dev/overview/getting-started) say creators pay after accepting a claimed solution, each for their own reward. The GitHub-native changelog issue's claim of automatic payment on merge conflicts with these mechanics and was not accepted as payment proof.

## Frozen scan funnel

| Metric | Frozen value |
|---|---:|
| GitHub raw results | 60 |
| Provider-originated discoveries | 30 |
| Combined raw | 90 |
| Unique before final canonical deduplication | 79 |
| Final opportunity records | 78 |
| Basic screened | 57 |
| Canonical sources resolved in deep inspection | 3 |
| Exact provider listings checked in deep inspection | 2 |
| Selected repositories | 5; one candidate each |
| All seven steps marked complete | 1; a closed, rejected issue |
| **Genuine active FULLY_ENRICHED candidates** | **0** |
| HUNT / WATCH / SKIP / REJECT / INCOMPLETE | **0 / 0 / 0 / 26 / 52** |

The 29 preflight listings are not substituted for the scan's two provider checks. The audit uses the exact `auditSelection` field below; dashboard ordering differs slightly but contains the same five records. No candidate was substituted, manually promoted, or rescanned.

## Exact Top-5: source and payment audit

All stable IDs use the `ABH-GH-` prefix. UNKNOWN means evidence was not established, not zero or false.

| ID suffix / title | Original GitHub issue | Exact provider listing | Machine reward → source audit | Funding / payment confidence | Machine → audit decision |
|---|---|---|---|---|---|
| Opire-docs-27 — Add French | [Opire/docs #27](https://github.com/Opire/docs/issues/27) | [Opire listing](https://app.opire.dev/issues/01KT0PSXD0JZ4RRQW361CD36R8) | **$20 → current-task reward UNKNOWN**. Provider shows $1,040 in three nominal available rows ($20+$20+$1,000), but marks issue CLOSED; original repository and issue return 404. | Machine UNKNOWN / UNVERIFIED. Provider mechanics PAY_ON_ACCEPTANCE; issuer UNKNOWN. | REJECT → REJECT; category agrees, reward provenance does not. |
| jahmeergnlt-traefik-1 — Concurrent configuration race | [jahmeergnlt/traefik #1](https://github.com/jahmeergnlt/traefik/issues/1) | [Opire listing](https://app.opire.dev/issues/01KYRESD5QRR8KX7BA97JMG2MF) | **$200 → $200** nominal available: $100+$50+$50; zero paid rows. | PAY_ON_ACCEPTANCE / PARTIAL; no secured-funds evidence. | INCOMPLETE → INCOMPLETE; do not pursue while source/competition gaps remain. |
| aueangpanit-electron-template-1 — Tray orange-dot indicator | [aueangpanit/electron-template #1](https://github.com/aueangpanit/electron-template/issues/1) | [Opire listing](https://app.opire.dev/issues/01K6K4YTSWT7XF53GM3KCTBG7S) | **UNKNOWN → UNKNOWN current task**. Provider advertises $100, OPEN, one available reward; original repository and issue return 404. | Machine UNKNOWN / UNVERIFIED. Listing-only mechanics PAY_ON_ACCEPTANCE; issuer UNKNOWN. | REJECT → REJECT for unavailable original; GitHub closure is UNKNOWN. |
| velldharami44d-go-github-3 — Stateless installation tokens | [velldharami44d/go-github #3](https://github.com/velldharami44d/go-github/issues/3) | [Opire listing](https://app.opire.dev/issues/01M139CMFHRNMRTQKF10H3CDNM) | **$120 → $120 nominal listing rows**, $100+$20, but issue CLOSED. This is not an available target. | PAY_ON_ACCEPTANCE / PARTIAL. Owner claims completion/disbursement; actual payout unverified, provider paid-reward count zero. | REJECT → REJECT. |
| claude-builders-bounty-claude-builders-bounty-1 — Structured changelog | [claude-builders-bounty #1](https://github.com/claude-builders-bounty/claude-builders-bounty/issues/1) | UNKNOWN; issue links only Opire homepage | **$50 → $50 stated promise**, not verified platform reward. | UNKNOWN / PARTIAL. Automatic-on-merge assertion unverified. | INCOMPLETE → INCOMPLETE; unresolved payout plus extensive competition. |

The first row materially overstates attribution confidence: its `$20` came from a provider-discovered title, yet the machine labels the original GitHub URL as the reward source with confidence 90 after that original returned 404. The title is historical advertising, not verified current task payment. It must remain separate from verified reward evidence. This alone prevents PASS.

The two 404s were reproduced through independent GitHub issue and repository reads. They establish source unavailability, not whether the repositories were deleted, renamed or made private. The machine's additional “closed/completed” reason is unsupported for UNKNOWN GitHub state; the valid reason is original-source unavailable.

Issuer evidence is underused. Traefik's repository owner `jahmeergnlt` posted `/reward 100` ([comment](https://github.com/jahmeergnlt/traefik/issues/1#issuecomment-5125797171)); provider-bot messages also name another sponsor. The go-github owner `velldharami44d` posted `/reward 100` ([comment](https://github.com/velldharami44d/go-github/issues/3#issuecomment-5448345063)). The adapter still reports issuer UNKNOWN for the whole listing. PARTIAL payment remains defensible, but the known contributor to the reward should be retained separately; neither owner comment proves all advertised money is secured.

## Exact Top-5: availability and competition

| Candidate | GitHub state / assignment | Provider trying / claimed | GitHub evidence in frozen record | Completeness / audit |
|---|---|---:|---|---|
| Opire/docs #27 | UNKNOWN / UNKNOWN; original 404 | 5 / 4 in provider preflight; not checked by scan | No comments or PRs obtained | PARTIAL / UNKNOWN; provider says CLOSED |
| jahmeergnlt/traefik #1 | OPEN / unassigned | 18 / 12 | 34 comments; 13 observed GitHub actors; ten fetched open solution PRs from ten authors; no merged PR among fetched details | PARTIAL / UNKNOWN total. Observed submission pressure is HIGH; 19 search matches and >10 linked references exceed the detail bound. |
| electron-template #1 | UNKNOWN / UNKNOWN; original 404 | 2 / 2 in provider preflight; not checked by scan | No comments or PRs obtained | PARTIAL / UNKNOWN; provider says OPEN, which cannot override missing original |
| go-github #3 | CLOSED / unassigned | 2 / 2 | Ten comments; three observed actors; PR #9 open, #4 closed unmerged, #11 open. Owner says code was force-applied and paid. | BOUNDED_COMPLETE retrieval; combined count UNKNOWN because provider/GitHub actors are not mapped. Completion comment was missed by contributor-state classification; closed gate correctly rejects. |
| Changelog #1 | OPEN / unassigned | UNKNOWN / UNKNOWN | 2,133 comments advertised; first 100 read; 11 observed actors; ten fetched open PRs from eight authors | PARTIAL / UNKNOWN total. Observed submission pressure is HIGH; independent search returns 1,630 matches. No exhaustive merged-solution claim is made. |

Representative original submissions: [Traefik #32](https://github.com/jahmeergnlt/traefik/pull/32), [Traefik #19](https://github.com/jahmeergnlt/traefik/pull/19), [go-github #4](https://github.com/velldharami44d/go-github/pull/4), [go-github #9](https://github.com/velldharami44d/go-github/pull/9), [go-github #11](https://github.com/velldharami44d/go-github/pull/11), [changelog #3887](https://github.com/claude-builders-bounty/claude-builders-bounty/pull/3887). The [go-github owner completion statement](https://github.com/velldharami44d/go-github/issues/3#issuecomment-5448443316) is an assertion, not independently verified payment.

No false LOW competition or false zero-competitor conclusion was found. Search match counts are not competitor counts. Provider trying/claiming counts can overlap and were not added together.

## Exact Top-5: technical, scope and dependency audit

| Candidate | Source-backed execution evidence | Scope extraction | Dependencies / blockers missed | Machine readiness / AI / effort / ABH score |
|---|---|---|---|---|
| Opire/docs #27 | Original unavailable; language/framework/install/test/build/CI UNKNOWN | No original criteria available | All operational requirements UNKNOWN | 0 / 20 / UNKNOWN / UNKNOWN |
| jahmeergnlt/traefik #1 | Small public Go 1.21 repository, 4 KB metadata size; go.mod, main.go, server.go and server_test.go; nine-byte README. No CONTRIBUTING or workflows. Issue names `go test -race -v ./pkg/server/...`; test source uses local mock HTTP requests. Actual execution NOT_RUN. | All five explicit checkboxes retained; nine total criteria. Missing several concrete integration-test steps; synchronization is incorrectly included under required tests. | Go race-detector toolchain/runtime should be structured; `pkg/server/router/router.go` named in issue is absent. Scope-to-repository mismatch unresolved. | 10 / 30 / UNKNOWN / UNKNOWN |
| electron-template #1 | Provider says TypeScript; original files, framework, install/test/build and graphical runtime UNKNOWN | Original unavailable | Tray UI implies graphical validation, but no original requirements can be certified | 0 / 20 / UNKNOWN / UNKNOWN |
| go-github #3 | Small public fork, 11 KB metadata size; github source/tests present; README only 11 bytes; no go.mod, CONTRIBUTING or workflows. Test/build setup UNKNOWN. | All five explicit checkboxes retained; eight total criteria. Manual/integration steps are omitted. | **GitHub App configured for stateless tokens, installation token, account/access and real API call** are explicitly required, but dependencyEvidence is empty. Should be EXTERNAL_API_CREDENTIAL / USER_INPUT_REQUIRED, not assumed accessible. | 10 / 30 / 4–8 h / 46; closed REJECT |
| Changelog #1 | Repository contains README and LICENSE only; no implementation, manifest, tests or CI. Bash/Python is an allowed task stack; it is not an established repository setup. | All six checkboxes retained, including sample output and a README with ≤3 setup steps. | Real repository sample validation still required. No Claude/OpenAI API, n8n or delivery credential is required by this task; unrelated README row no longer leaks these dependencies. | 0 / 20 / UNKNOWN / UNKNOWN |

The explicit criteria retained are: Traefik atomic provider updates, handler/router consistency, immediate reflected configuration, synchronization and no performance regression; go-github token unmarshalling, variable-length validation, exact authorization headers, backward compatibility and edge cases; changelog command/script, commits since tag, four change categories, formatted output, real-repo sample and short setup README. All **16/16 available explicit checkboxes** were retained. This does not mean all acceptance requirements were captured.

Independent repository trees and relevant test files are retained in `phase2_4-source-audit.json`. Test files were read as untrusted data; no target code was executed, cloned for solving, modified or submitted. Source-backed candidate test commands should not be described as successful runs. Effort scores are heuristics and remain uncertain.

## Transport diagnosis

The frozen scan made **64 recorded source requests**: 3 provider, 6 GitHub search, 12 original issue, 12 repository, 3 comments, 23 PR detail, 1 timeline and 4 repository-file requests. **Zero HTTP 403**, zero scan transport timeouts, two HTTP 404s. GitHub calls were unauthenticated; core limit 60, final recorded remaining 8. No dedicated credential was needed to diagnose this run and none was added or copied from a connector.

The scan's requests finished in about 14.1 seconds, within the existing 50-second/120-request limits. The main failure was selection/coverage logic, not an exhausted wall-clock budget. Earlier HTTP 403 responses without headers still cannot be retroactively classified.

## Transparent quality results

| Check | Result |
|---|---|
| Provider-originated production discovery | PROVEN: 30 |
| Diverse frozen population | 5 repositories, max 1 each; 4 provider-originated + 1 GitHub path |
| Genuine active fully enriched population | **0/5 — FAIL**. The single 7/7 row is closed/rejected. |
| Machine/source decision categories | 5/5 conservatively defensible, **not** a ranking certificate; two rejection explanations need UNKNOWN-state correction |
| Top-5 reward attribution | **4/5 defensible; FAIL** on Opire/docs title-to-current-reward attribution |
| Payment confidence levels | 5/5 conservative; no STRONG/VERIFIED claim; issuer and provider details remain incomplete |
| Assignment | 3/3 accessible originals unassigned; two UNKNOWN, not five verified unassigned issues |
| Competition | No known false LOW; two heavily submitted candidates incomplete; completed-owner statement not classified |
| Explicit checkboxes | 16/16 on three accessible originals; broader scope/dependency extraction incomplete |
| Repository execution | Conservative scores, but Go test path and required files insufficiently inspected by the machine |
| HUNT safety | 0 incomplete or invalid records promoted |
| External bounty actions | 0 |

Seven BountyScout multi-task report records now have UNKNOWN rewards and are REJECT. One separate single-task [bounty-plaza repost](https://github.com/zhangjiayang6835-cyber/bounty-plaza/issues/1518) still attributes the original task's $50 to its own copied text despite canonical-source enrichment being deferred. It is REJECT and outside the Top-5, but remains a material provenance limitation. The original [slugify issue](https://github.com/maaltarifi97-maker/aioa-playground/issues/1) was not substituted into this audit or recommended.

## Precise remaining blockers and smallest remediation

1. **`src/live/pipeline.js`, medium screening → deep selection:** two cached 404 provider originals stay `providerSeed` and remain eligible; an unscreened closed go-github #3 enters after the ten-item medium batch; crowded threads then consume remaining slots. Preserve per-seed terminal source failures and verified provider availability, basic-check each provisional deep candidate, and refill only invalid slots from the same discovered population before freezing selection. UNKNOWN payment remains eligible. No global scoring or threshold change is needed. The scan did not establish that fewer than five genuine market candidates exist.
2. **Reward provenance / UNKNOWN state (`payment.js`, `finishEnrichment` provider-seed path):** never label a catalogue/repost title as verified canonical task reward before the original is retrieved. Keep advertised money separate, use UNKNOWN for unverified current payment, and do not infer CLOSED from UNKNOWN state. The first audit row and the single-task repost are exact regression fixtures.
3. **`repositoryEvidence`, `scopeIntelligence`, `dependencyIntelligence`:** inspect the issue-mentioned Go test/implementation files within the current file budget, retain explicit test commands as NOT_RUN, check missing named paths, and extract the stated GitHub App/account/token/manual API requirements. Preserve owner reward/completion evidence in existing payment and competition fields. Do not raise confidence or call funding secured merely because an owner posted a reward command.

No post-audit production rescan was run. Further corrections require a later, separately identified validation snapshot; this one must remain INCOMPLETE. No claim, comment, `/try`, `/attempt`, fork, bounty solution, external PR, wallet disclosure, legal commitment or transaction occurred.
