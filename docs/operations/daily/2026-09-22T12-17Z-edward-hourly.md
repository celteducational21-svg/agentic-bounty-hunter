# Edward hourly operations — 2026-09-22 12:17Z

## Outcome

- Fresh GitHub/Opire/public-Superteam discovery failed once with HTTP 502, then recovered on its bounded retry and durably persisted: GitHub 60, Opire 30, public Superteam 0; 82 unique records.
- Authenticated Superteam failed on both bounded attempts with `SUPERTEAM_NETWORK_FAILED`. No result count or empty-catalogue claim is made.
- Gitpay remained at its previously reported sign-in/reCAPTCHA gate, so its open-bounty filters were not run.
- No work was secured. No private proof, solve, independent QA, submission, merge, or confirmed payment occurred.
- Production readback recovered on retry and matched 657 runtime operations: 640 `INVESTIGATING`, 15 `REJECTED`, 1 `WAITING_FOR_MAINTAINER`, and 1 `DO_NOT_HUNT`.

## Qualification

- Admission stages were 77 PREFLIGHT and 5 DEEP attempts. One historical record was fully enriched; no newly discovered record became Phase 3 eligible.
- Eighteen runtime records were newly observed.
- Eleven Omi records are retrospective funding proposals for work already implemented or submitted in linked PRs. They are not available work.
- Two relayhop records are aggregator notices for sports/proof-of-work posts, not direct software assignments.
- Five Bounty Plaza records are fake, negative-value, recursive, or retrospective mirrors without a credible available software reward.
- The five DEEP candidates were source-checked. Traefik #1, Claude Builders Bounty #1, Zeroeye #2 and BonziAssist #7 are heavily saturated or already claimed; Omi #15882 already has solution PR #15881. None justified private proof.

## Source checks

| Source | Result | Coverage |
| --- | --- | --- |
| GitHub | SUCCESS AFTER RETRY — 60 results | Three bounded current search queries |
| Opire | SUCCESS AFTER RETRY — 30 results | Bounded public catalogue; exact listing evidence remains candidate-specific |
| Superteam public Development | SUCCESS AFTER RETRY — 0 records | Bounded public agent view |
| Superteam authenticated agent API | FAILED AFTER TWO ATTEMPTS | Coverage not established; zero listings is not claimed |
| Gitpay | NOT RUN / BLOCKED | Preserved session redirected to sign-in with reCAPTCHA |

## Active records and verification

- `ivrit-ai/ivrit-py#12` remains open, unassigned and unreserved. Its 18 comments are unchanged; no maintainer confirmation of active scope or a two-week reservation exists. Competing PRs #30, #31 and #32 remain open with zero reviews.
- `#12` remains `WAITING_FOR_MAINTAINER` and received no Solver capacity.
- Durable runtime persistence recorded 19 changes. An independent production readback matched the saved 657-operation projection after one transient readback failure.
- `npm test`: 229 passed, 0 failed.

## Next action

Retry authenticated Superteam independently while continuing fresh GitHub/Opire discovery for credible, funded, unassigned $25–$300 Python/JS/TS work. Keep #12 idle unless its maintainer explicitly confirms the reservation.

## Owner action

Nothing new this cycle. The Gitpay login/CAPTCHA gate is unchanged and is not repeated as a new request.
