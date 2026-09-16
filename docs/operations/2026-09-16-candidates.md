# Fresh candidate investigation — 2026-09-16

Source: production live scan fetched at `2026-09-16T11:32:06.775Z` (90 raw, 72 unique, 71 apparent candidates), followed by live read-only GitHub issue/comment checks. A focused live TypeScript bounty-title search was also reviewed. No comments, claims, forks, PRs, or paid API calls were made. No new private proof or test execution is claimed.

## Active investigation leads

| Candidate | Reward evidence | Observed state / competition | Next action |
|---|---|---|---|
| [copperheadhq/copperhead #66](https://github.com/copperheadhq/copperhead/issues/66) | Issue explicitly offers **$50 USD, paid on merge** | OPEN, two assignees. Multiple open implementations, including [#68](https://github.com/copperheadhq/copperhead/pull/68), [#72](https://github.com/copperheadhq/copperhead/pull/72), [#77](https://github.com/copperheadhq/copperhead/pull/77), [#98](https://github.com/copperheadhq/copperhead/pull/98), [#284](https://github.com/copperheadhq/copperhead/pull/284), [#285](https://github.com/copperheadhq/copperhead/pull/285). | INVESTIGATING, low early-win priority. Privately assess remaining nonduplicate live-run failure and installation cost; do not duplicate a claim. |
| [dot-Justin/BonziAssist #7](https://github.com/dot-Justin/BonziAssist/issues/7) | Fresh exact-listing analysis reports **$270** across available Opire rewards; [listing](https://app.opire.dev/issues/01KVR6PWMT3NF9RTZSME5PKWFD) | OPEN; 60 comments. Fresh provider evidence reports 23 trying, 20 claiming. Numerous linked submissions. Original scope only says user cannot start it. | INVESTIGATING, low priority. Identify an unresolved startup failure distinct from existing PRs before any proof. Maintainer clarification question already exists from another contributor; do not add a duplicate. |
| [qtop/qtop #551](https://github.com/qtop/qtop/issues/551) | [Opire catalogue listing](https://app.opire.dev/issues/01M24CPAN10ENHF7NZP6D0ZDSS) exists, but amount is **UNVERIFIED**. Do not treat catalogue aggregate $135,062 as a dependable payment. | OPEN, zero issue comments, no assignees observed. Maintainer requests a lighter proof-of-humanity process with signed commits, identity claims and emailed challenge. | INVESTIGATING. Verify exact available reward and repository contribution policy, then scope a private PoC. Any real identity/profile/email challenge requires owner involvement. This is not yet Phase3 eligible. |

Copperhead is the clearest task-linked cash reward among these leads, but not a demonstrated quick win. Its acceptance requires a real nontrivial eight-stage KiCad run, automated coverage, source fixes as necessary, and findings report. A [live competitor report today](https://github.com/copperheadhq/copperhead/issues/66#issuecomment-5696164250) records stages 1–4 completed, stage 5 failing DRC on all three attempts, and no final-stage success. This is third-party evidence, not an ABH reproduction. KiCad and a model provider are provisionable requirements, not automatic rejection grounds.

## Cheap live exclusions and parked work

- [typeorm/typeorm #12578](https://github.com/typeorm/typeorm/issues/12578): canonical issue CLOSED, completed July 10. No proof attempted.
- [qtop/qtop #433](https://github.com/qtop/qtop/issues/433): canonical issue CLOSED; maintainer says fixed in #444. No proof attempted.
- [qtop/qtop #337](https://github.com/qtop/qtop/issues/337): CLOSED, completed May 14. No proof attempted.
- [storybookjs/storybook #12641](https://github.com/storybookjs/storybook/issues/12641): CLOSED, completed December 10, 2025. No proof attempted.
- [tscircuit/docs #886](https://github.com/tscircuit/docs/issues/886): open migration request from contributor whose implementation is already [#887](https://github.com/tscircuit/docs/pull/887); not selected for competing duplicate work.
- [OmniBlocks/bountyfarmer #5](https://github.com/OmniBlocks/bountyfarmer/issues/5): nominal "$100" title is contradicted by body saying currency undecided and payment may be physical touch. No credible cash bounty established; do not pursue as a paid early win.
- [Opire/docs #27](https://github.com/Opire/docs/issues/27): canonical API returned 404. Availability unresolved; no fabricated access result or proof.
- [flowese/UdioWrapper #7](https://github.com/flowese/UdioWrapper/issues/7): OPEN with many existing claims (including PR #37 and #42), live Udio-account/CAPTCHA dependency. Park pending a distinct permitted scope and owner-provided account access; no automated CAPTCHA work or tests attempted.

## Operational result and lesson

No additional candidate was honestly promoted to successful PRIVATE_PROOF in this bounded cycle. #12 remains the existing proof; this investigation did not touch its claim. Unknowns remain investigations and do not block ABH operations. The next cycle should favor a different repository with an explicit task-linked reward and no overlapping implementation, while tracking these leads cheaply.

Provider discovery can return closed canonical tasks and advertised totals that are not usable early-win rewards. Recheck canonical state before clone/install; retain the source timestamp and distinguish provider advertising, third-party claims, and actual ABH execution. Copperhead's explicit $50 body also shows that a missing scan reward extraction need not mean the task has no bounty: direct investigation can resolve that unknown.
