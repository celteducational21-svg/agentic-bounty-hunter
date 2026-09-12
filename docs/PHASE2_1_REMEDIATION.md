# Phase 2.1 remediation — 2026-09-12

Verdict: **INCOMPLETE / EXIT GATE NOT PASSED**. This is a substantial quality remediation, not certification of bounty ranking. The dedicated ABH Supabase project and existing JSONB history schema are retained. No migration, new database, or CELT connection was made.

## Implemented architecture

- `src/core/payment.js`: pure, context-aware reward extraction and structured issuer/payment verification. Monetary evidence must occur in a direct task-offer context. Fenced/inline code, quoted offers, budgets, historical payments and market-price examples are excluded. Body offers take precedence over stale titles; conflicting evidence is retained. Malformed `,250 USDC` becomes UNKNOWN, not $250. Conflicting body offers are uncertain.
- Reward records carry amount, currency, USD estimate, type, evidence text, source URL, location, confidence, direct-task status and conflicts. USD/stablecoin estimates are nominal; they do not establish funding. Non-stable tokens require timestamped external price evidence with exchangeability and high liquidity confidence; bare price numbers and issuer-claimed equivalents are rejected.
- Payment records distinguish payer/role, GitHub association, authority, funding confidence, confidence level, provider, trigger and evidence. VERIFIED requires a collector-supplied active funded record tied to the exact canonical issue and reward. STRONG requires an authoritative promise, clear trigger, credible value and an established project. Names, badges and URLs alone never establish funding. **No live provider adapter currently supplies independently verified funded records.** This remains a blocker.
- `src/core/quality.js`: actor-deduplicated interest, claim, implementation, submission, merged, abandoned and unknown states; exact issue/PR relation analysis; execution readiness; separated scope and dependency analysis. Old unresolved claims become UNKNOWN rather than assumed abandoned. Missing/truncated API evidence never means zero competition.
- Live collector reads original issues, bounded comments (3×100), PR search (20), timeline (100), related PR details (20), repository metadata, root files, workflows, package scripts and README/CONTRIBUTING. A directly referenced local Node test entrypoint may be read, never run. Missing pages/details set PARTIAL. These are bounded searches, not exhaustive proof that no solution exists.
- Readiness uses actual scripts, lockfiles, documentation and CI signals, with build execution explicitly NOT_RUN. Known credential-only harnesses are blocked. Python documentation receives limited pytest recognition; broad multi-language setup/build inference is unfinished.
- Scope identifies code/tests/docs and external validation requirements, including physical devices, private staging/APIs, mainnet funds and Tenstorrent hardware models. AI scores are capped by readiness. Source text never executes commands or changes ABH policy.
- Dashboard labels the score **ABH score**, explicitly heuristic, not a probability. It displays structured payment, reward source, readiness, unknown coverage and failing HUNT gates. All ranked results, including partial evidence, can be inspected.
- Durable material history now includes payment classification, issuer/funding confidence, reward evidence, contributor states and readiness. Retrieval timestamps remain excluded from material comparisons. Existing history is preserved.

## Scoring and mandatory gates

Weights: payment legitimacy 20%, AI solvability 20%, scope 15%, competition 15%, effort 10%, minimum of repository health/readiness 10%, maintainer response evidence 5%, reward 5%. Missing maintainer evidence receives a conservative scoring default while the public evidence field stays UNKNOWN.

HUNT needs score >=85 and all explicit gates: open, active repository, unassigned, no completed solution, direct credible reward, VERIFIED/STRONG payment, scope >=70, AI >=75, readiness >=70, known competition <=2, complete bounded evidence, accessible validation and no hard rejection. Thresholds were not lowered. Weighted score is not a win probability.

Hard gates include existing exclusions plus malformed/no direct payout, prior-work payout requests, inaccessible test credentials, specialized unavailable validation hardware, and the observed unrealistic arbitrary-graph linear-time requirement.

## Tests

105 tests pass, 0 fail (Node test runner). All original 67 tests remain; the existing token conversion test now uses timestamped market/liquidity evidence instead of an unverified bare number. New tests cover the requested adversarial categories plus malformed live amounts, credential-only tests, provider lookalike domains, stale claims, unrelated cross-repository PR numbers and payout requests. A synthetic clear bug with independently verified payment passes HUNT, proving the gates do not simply suppress all recommendations.

Legacy exported `analyzeCompetition` and repository helper tests remain for compatibility; production ranking uses the new evidence models. Their older output should not be used as the Phase 2.1 authoritative competition classification.

## Validation and remaining blockers

See PHASE2_FIXED_SNAPSHOT_AUDIT.md. The frozen scan retrieved 60 raw results / 43 candidates, 0 HUNT / 0 WATCH / 0 SKIP / 43 REJECT. All ten selected enrichments were partial or failed; only three retained complete input bundles for replay, none met deep coverage. This is not proof that all 43 are illegitimate. Some are conservative score-based rejects with insufficient evidence.

Remaining work before PASS:

1. Reliable authenticated/budgeted GitHub enrichment in the deployed runtime; distinguish absent files from denied/unavailable calls and avoid wasting deep checks on known mirrors.
2. A live, original-source provider/payment workflow that verifies exact issue linkage, payer authority and active funding; historic payment records are not yet collected. GitHub author association alone misses some legitimate corporate program managers.
3. More complete PR/timeline pagination and comment semantics (negation, proposed patches, repeatable awards, stale claims). UNKNOWN is honest but does not demonstrate accurate LOW competition.
4. Wider repository evidence: actual workflow commands, nested monorepo setup, Python manifests, recent merged PRs, test substance and response latency. No third-party build was executed in this phase.
5. Better effort calibration and delivery-specific scope parsing. Clear prose without action bullets can be underestimated; a generic time bucket is not a guarantee.
6. Repeat final-engine Top-5 quality review on a fully enriched immutable production snapshot. This audit preserves the initial failing snapshot and reviews the same identities after remediation; it is not certification of a different later ranking.

No Phase 3 candidate is recommended. Next action is to finish these Phase 2 evidence gaps. After genuine PASS, the first Phase 3 operational step is scheduled revalidation and preparation of an approval-only candidate dossier, not automatic solving.

Production verification found remaining optimistic estimates with partial enrichment. The final revision caps AI solvability at 50 and sets effort/verification effort to UNKNOWN whenever enrichment is incomplete. The dashboard legitimacy count now requires VERIFIED/STRONG payment plus direct reward evidence; unverified keyword matches no longer count as legitimacy passes.
