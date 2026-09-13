# ABH continuation — 2026-09-13

## Authoritative state and verification

GitHub main remains `959c958c02f1069e2807b0a9bfd665102916eb93`. The existing correction branch was verified at `7a872b8560b71387ad0b677fa9b83c954d29ace6`; its tree exactly matches local commit `641492b`. Local uncommitted refinements were preserved and verified: **183 tests passed, zero failed**; diff whitespace checks passed. No production deployment was performed. Global market certification remains INCOMPLETE.

The Supabase connection lists CELT only. A read-only query to ABH project `xyuxxunpmzlyqocberia` was denied. Vercel lists no teams. Current direct production snapshot retrieval timed out; the earlier audit's successful database read is historical evidence, not a current health certificate. No database mutation was attempted and CELT was not modified.

## Preserved population

Replayed the existing frozen 30-listing population with zero live network requests: 30 cheap investigations, five deep attempts across five repositories, 24 REJECT, six INCOMPLETE, zero PHASE3_ELIGIBLE. The prior live run and Phase 2.4 failure remain unchanged. The replay is not a production scan.

## Additional discovery coverage investigation

Public Opire UI price filters exposed **17 cards at $50–$100** at `https://app.opire.dev/home?maxPrice=100&minPrice=50`. This separate manually observed population was frozen before candidate review. It is not an automated adapter scan or production certification. Ten candidates were investigated, without another discovery to replace failures. Three received additional discussion/repository investigation; no private execution proof occurred.

| Candidate | Provider listing ID | Advertised USD | Observed outcome |
|---|---|---:|---|
| ArcaneCircle/pixelsocial #3 | 01K9AEB05K6XCMKMAVNB0P0FQ8 | 70 | GitHub 410: issue deleted. REJECT. |
| qtop/qtop #551 | 01M24CPAN10ENHF7NZP6D0ZDSS | 62 | Open, unassigned, public active repository. INVESTIGATE / human participation requirements. |
| formbricks/formbricks #3302 | 01JARC75G44M6EQCJCR1DTBHD6 | 60 | Closed and assigned. REJECT. |
| strapi/strapi #11998 | 01HWT2MKE4GWPJXDPMAFEAHHHE | 70 | Closed. REJECT. |
| mmccl5/go-task-task #1 | 01KT4P994B3T2MTC6JBNWHZH8R | 86 | Closed. REJECT. |
| denoland/deno #18147 | 01J8T24PJDXX69RM7XV24SQT11 | 70 | Open, 40 comments; maintainer explicitly declines additional PRs because an implementation is already open. DO_NOT_HUNT. |
| XAMPPRocky/octocrab #224 | 01HWR51JFNKM63CH4NS657FSCD | 70 | Open, 17 comments; maintainer explicitly declines new contributors for this feature. DO_NOT_HUNT. |
| sebastianbergmann/phpunit #4440 | 01HWX4P9F1935V3ZXN4TY7VDEQ | 50 | Closed. REJECT. |
| qtop/qtop #357 | 01KRPNS7FV0DJCWV5ASMAJ1WR4 | 98.22 | Open but assigned; documentation-only meta-PR covering at least five prior PRs. Not admitted. |
| trovu/trovu #329 | 01HTN11YX5NYSS7GGB3SHNCJSS | 70 | Open, 79 comments, 38 provider solver records; Android video and personally written human communication required, unresolved platform limitation. DO_NOT_HUNT for starter objective. |

The remaining seven frozen cards were go-github token handling, electron-template tray indicator, another go-github token task, Electron macOS package dialog, restfuncs busboy review/rewrite, Opire French docs, and microG WearOS. They remain NOT_INVESTIGATED in this supplementary review; no conclusions are inferred.

Exact listing linkage was observed in the Opire detail drawers. “Unpaid” reward rows are NOT escrow or proof of currently payable funds. Provider catalogue values are advertised amounts until full availability checks establish more.

## Closest remaining candidate: qtop #551

Issue: https://github.com/qtop/qtop/issues/551

Provider: https://app.opire.dev/issues/01M24CPAN10ENHF7NZP6D0ZDSS

Scope: propose and demonstrate a simpler contributor proof-of-humanity workflow using signed commits, a small YAML claims registry and an email nonce/challenge. This is a feature/PoC request, not a reproduced application defect. No security exploitation is requested.

Provider drawer: $62 from three unpaid rows ($22 + $20 + $20), zero displayed solvers. GitHub timeline separately reveals a competing PoC merged into a contributor's own fork, `gloskull/qtop#1`; this is NOT upstream acceptance. Search `repo:qtop/qtop is:pr 551` returned zero results with incomplete_results=false, but lexical search does not prove no competition.

Read `CONTRIBUTING.md`, `Makefile`, `pyproject.toml`, and repository trees. Contributions must use develop. The develop tree observed was `582234ff05edd17cd48596c2c65e9c75e6a5fc13`. No PoH implementation path was found in that tree. The contribution guide welcomes AI assistance but rejects autonomous bot PRs; it requires owner accountability, precise AI disclosure, DCO, and Python 3.6/RHEL8 demonstration. Identity/verification requirements are USER_INPUT_REQUIRED, not a fabricated technical HARD_BLOCKER. Email delivery is an external-service requirement; local nonce logic could be investigated with a mock without sending email or asserting identity.

Admission: **INVESTIGATE**, not automatically PHASE3_ELIGIBLE. Current payment availability, detailed acceptance, the competing fork's status, and contribution fit remain unresolved. Opire profile setup was not used as a rejection reason.

Phase 3: setup NOT_RUN; reproduction NOT_RUN; root cause not applicable/established; no solver result. Potential investigation files are CONTRIBUTING.md, Makefile, requirements-ci.txt and future PoH registry/validator/tests. Proposed investigation: assess a dependency-light schema validator, nonce expiry/replay protection and signed-commit verification with synthetic identities only. Required tests would cover malformed claims, signature failure, expired/reused nonce, binding to a specific commit and account, and Python compatibility. Effort and reliable solvability are NOT_ESTABLISHED until private setup and acceptance checks complete. `make test` / `python3 -m pytest` remain NOT_RUN.

## Learning and next

- Price filtering materially improves discovery coverage; implement it within the existing provider adapter only after capturing its exact public request/response contract. Do not guess parameters or redesign scoring.
- Exact current maintainer statements matter more than an open issue or nominal provider reward.
- A merged PR in a contributor's own fork is not a completed upstream solution.
- Zero displayed provider solvers does not prove zero competition.
- No new universal rejection rule, payment-trust increase or capability uplift follows from this review.

Next: restore ABH-scoped Vercel/Supabase access, deploy the reviewed correction branch after resolving the prior shared-branch approval requirement, verify durable write/read, and continue qtop evidence investigation or the seven remaining frozen candidates. Owner participation would be needed before any qtop public contribution, including understanding the solution and personally satisfying identity/DCO requirements. Do not request Opire/Stripe setup until useful.

**Decision: NEEDS_HUMAN_INPUT for infrastructure access. No hunt is approved.** One legitimate, reproducible bounty has NOT yet been proven. No claim, public bounty comment, PR, wallet disclosure, terms acceptance, or payment action occurred.

Persistence note: automatic approval review rejected public upload of the large captured audit payload due to possible sensitive data. Detailed evidence is retained separately in the owner's private ABH audit archive; this branch stores reviewed code and concise findings only. This continuation supersedes incomplete local publication plans. Raw payload publication requires owner approval.
