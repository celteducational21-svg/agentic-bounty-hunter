# Edward hourly operations — 2026-09-22 13:14Z

## Outcome

- Fresh GitHub/Opire/public-Superteam discovery completed and persisted durably: GitHub 60, Opire 30, public Superteam 0; 79 unique records.
- Authenticated Superteam failed once transiently, then recovered on its bounded retry. The live feed returned zero eligible listings and no application was submitted.
- Gitpay redirected the preserved browser session to sign-in, so the required `Issues with bounties` plus `Open` filters were not run and no empty result is claimed.
- No work was secured. No private proof, solve, independent QA, submission, merge, or confirmed payment occurred.
- Production readback matched 669 runtime operations: 652 `INVESTIGATING`, 15 `REJECTED`, 1 `WAITING_FOR_MAINTAINER`, and 1 `DO_NOT_HUNT`.

## Qualification

- Admission stages were 74 PREFLIGHT and 5 DEEP attempts. No record became fully enriched or Phase 3 eligible.
- Twelve runtime records were newly observed. Seven Omi records are retrospective or already-implemented bounty proposals, two Accensa records are feature requests with no reward, one BountyScout record is an aggregator notice, Nexussyn #3 offers only $10 with 31 comments, and Nobay Protocol #2 provides no funded amount. None justified private proof.
- The five DEEP candidates were source-checked. Traefik #1 is saturated despite its $100 label; Claude Builders Bounty #1 has 2,206 comments; Zeroeye #2 already points to upstream PR #304; Omi #15892 already has solution PR #15891; Rustchain-bounties #16248 offers 5 RTC without independent USD value evidence.

## Source checks

| Source | Result | Coverage |
| --- | --- | --- |
| GitHub | SUCCESS — 60 results | Three bounded current search queries |
| Opire | SUCCESS — 30 results | Bounded public catalogue; exact listing evidence remains candidate-specific |
| Superteam public Development | SUCCESS — 0 records | Bounded public agent view |
| Superteam authenticated agent API | SUCCESS AFTER RETRY — 0 eligible listings | Live authenticated feed returned successfully |
| Gitpay | NOT RUN / BLOCKED | Preserved session redirected to sign-in; filters were not verified |

## Active records and verification

- `ivrit-ai/ivrit-py#12` remains open, unassigned and unreserved. Its 18 comments are unchanged; no maintainer confirmation of active scope or a two-week reservation exists. Competing PRs #30, #31 and #32 still have zero reviews.
- `#12` remains `WAITING_FOR_MAINTAINER` and received no Solver capacity.
- Durable runtime persistence recorded 18 changes. Independent production readback matched the saved 669-operation state.
- `npm test`: 229 passed, 0 failed.

## Next action

Continue fresh discovery for credible, funded, unassigned $25–$300 Python/JS/TS work. Keep #12 idle unless its maintainer explicitly confirms the reservation. Retry Gitpay only through the preserved browser session without attempting authentication or CAPTCHA work.

## Owner action

Nothing new this cycle.
