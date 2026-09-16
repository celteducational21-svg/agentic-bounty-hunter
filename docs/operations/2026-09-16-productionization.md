# ABH productionization — 2026-09-16

## Verified starting state

Main a4f58ff5e85432a3da1d5498a7ac304a32f98823 had successful Vercel status, deployment 83hc99myS48zMNjRgURHbnACe1zn. Baseline 184 tests passed. Runtime GitHub authentication checked 11:31 UTC: ABH_GITHUB_TOKEN authenticated, core limit 5000, remaining 4860. Fresh scan 11:32:06.775Z: 90 source entries, 30 Opire, 72 unique, 71 canonical candidate records; dedicated Supabase persistence confirmed true. Zero new machine-eligible proofs; see candidate investigation report.

## Changes

- Evidence-gated execution states with append-only transitions, version conflicts, independent QA and exact-revision owner submission approval.
- Trusted Git workflow records execution. Public API is read-only for execution; no unauthenticated state-mutation endpoint.
- Runtime scan snapshots retain prior operation records and mirror committed execution state plus daily log. Existing Supabase RPC and project only; no schema/admin migration.
- Operational dashboard shows status counts, active work, human actions, worker state and daily logs. Initial page reads saved data; discovery is explicit.
- Logical worker contracts, transition CLI and daily scan/log command documented. Invoked coding agents perform proof/solver/QA; no claim of always-on deployed model workers.
- Daily morning scheduled agent created (Asia/Kuwait); existing hourly human gate preserved. First scheduled run pending observation.
- Evidence-based provider outcomes adjust future priority by at most five points after three completed outcomes. Pending tasks and qualification rejection are not failed deliveries; no payment-confidence uplift.

## QA

Separate reviewer caught and verified fixes for disappearing historical operations, incorrect history-button binding, and stale Phase3 eligibility after verified closure. 205 tests passed, zero failed. Learning summary tests passed; live pipeline passes provider adjustments into existing priority function. Production deployment/readback verification follows this commit and is not inferred from local tests.

## Bounties and human actions

#12 stays WAITING_FOR_MAINTAINER. Prior 2026-09-14 proof is imported with provenance, not represented as a new proof. Existing reservation comment observed; no maintainer confirmation found and no duplicate posted. No solve or public PR started.

Other bounded live investigations are in 2026-09-16-candidates.md. No additional successful proof or income claimed.

Opire browser logged out: owner login/profile/payout setup needed before platform action. #27 cleanup attempted via GitHub integration, denied 403; account that created it must close as not planned. Vercel connector lacks project scope; GitHub deployment status and direct runtime HTTP checks remain available. Supabase admin verification is deferred maintenance, not a blocker.

## Live deployment verification

Operational build c8ddfeff635ad63acc97ee2958a35742dbdbc628 deployed successfully: Vercel GitHub status success, deployment CuGfxRyHQfdAXNUN39FQj6AfwrKr. Live `/api/operations` returned the same commit, runtime durable=true, WAITING_FOR_MAINTAINER=1 and active investigation records. Browser rendered live status counts and human actions. Saved-scan endpoint returned the prior immutable scan without starting discovery. Follow-up QA corrected provider normalization (Opire bounty provider vs Stripe processor); regression test added, 206 tests pass. Final patch receives a subsequent deployment check.

Opire follow-up: existing sign-in session recovered through Log in; fresh page shows account celteducational21-svg. Settings and Solving dashboard inspected, zero trying/claimed/paid. No payout-onboarding control was presented on those pages, so payout eligibility remains unverified and is a candidate-level prerequisite before claim/payment, not a present login blocker. No identity/bank details were entered and no account access was expanded.
