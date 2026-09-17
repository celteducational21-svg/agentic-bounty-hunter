# ABH operations — current instructions

Goal: first accepted paid bounty. Work, learn, improve from observed outcomes. Global historical Phase 2 certification is not an operating gate. ABH remains separate from ARES and CELT.

## Recover and run

1. Pull GitHub main; read `state.json`, `WORKER_RUNBOOK.md`, and latest daily/candidate evidence.
2. Read `/api/operations` and `/api/opportunities?latest=1`. Loading the dashboard reads saved data; it does not start discovery.
3. Run `npm run operations:daily` for fresh provider-first discovery and durable runtime persistence. GitHub authentication diagnostics: `/api/github-auth`. UNKNOWN means investigate; pay-on-acceptance is acceptable.
4. Invoke Scout → Qualifier → Proof → Solver → independent QA → Submission preparation → Tracking → Learning using the runbook. These are scheduled/invoked coding-agent workers, not continuously running LLM services on Vercel.
5. Import an admitted runtime operation into `state.json` before private execution, preserving its complete transitions/version. Use `npm run operations:transition -- --id ... --to ... --actor ... --reason ... --expected-version ... --evidence-file ...`. Authenticate evidence provenance; names/boolean fields alone are not authorization.
6. Commit state, evidence and daily log; push without force. On conflict, reload latest state and reapply against current version. Never overwrite a competing writer's events. A transition is complete only after GitHub commit succeeds. Fresh runtime scans mirror committed execution records and all prior runtime records in immutable Supabase scan summaries.
7. Check runtime readback. If mirroring fails, GitHub remains durable; mark runtime mirror deferred and retry later. Supabase admin login is not a blocker. Only project `xyuxxunpmzlyqocberia` is allowed.

## Schedule

`ABH Daily Operations` is enabled daily in Kuwait mornings (approximately 08:00); `ABH Human Gate` already checks hourly. The first daily execution ran on 2026-09-17: fresh discovery persisted, #12 replies checked, three supplemental candidates investigated; see `daily/2026-09-17.md`. Each cycle uses actual available tooling and records failures honestly. A scheduled prompt is not evidence that a solve/test/payment occurred.

## Current work

ivrit-ai/ivrit-py #12: historical setup/reproduction/focused tests PASS; existing reservation request posted. Keep WAITING_FOR_MAINTAINER. No new claim/comment. Require maintainer confirmation of active reward, scope and two-week reservation before LOCKED → SOLVING. Public PR requires exact owner approval after independent QA.

## Durable records and organization

- `src/`, `api/`, `public/`: production code.
- `state.json`: committed execution projection and full transition events.
- `WORKER_RUNBOOK.md`: current logical worker contracts and evidence shapes.
- `daily/`: dated immutable scan/run outputs; never relabel failures as successes.
- `benchmarks/`: **SIMULATION / HISTORICAL REPLAY — NOT PAID WORK**. Separate delivery-lab packets, frozen patches, independent QA, audit comparisons, control drills and scorecards. Never import these jobs into live bounty state or count historical merges as ABH wins.
- `benchmarks/REPORT.md`: frozen delivery certification, including failures, repairs and strict versus scoped submission readiness.
- `market-research/`: source qualification, live discovery observations and economic learning. Superteam's official public agent Development catalogue is integrated into daily scans; other proposed sources require evidence before adapters.
- `HUMAN_PLATFORM_SETUP.md`: consolidated owner steps; public discovery continues while account/payout setup waits.
- Dated proof/candidate documents in this directory: original evidence retained in place.
- `../PHASE2*.md`: historical development audits, preserved for provenance, not active release gates.

Daily cycle records discovery, investigations, proofs, waiting replies, solves, QA, submissions, payment, human actions and lessons. Preserve actual effort, reviewer identity/revision, maintainer response, acceptance reason and payment evidence. Unknown outcomes stay unknown. No inferred income or fabricated success.

Human gates are candidate-specific: logins, account permissions, CAPTCHA/identity, payout configuration, paid access, financial/legal decisions, claim/comments/public submission. They do not stop other private work.
