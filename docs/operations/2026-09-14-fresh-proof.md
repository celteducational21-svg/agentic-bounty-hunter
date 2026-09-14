# ABH fresh discovery and private proof — 2026-09-14

**Decision: APPROVE_HUNT for owner approval of a maintainer scope/reservation request. No public action taken. The bounty is not completed.**

## Infrastructure

Main was safely fast-forwarded from `959c958` to `e16d9dfac87b9f7447467b6b5613bbca3c2fce19`, including all deployed changes and prior project logs. Vercel automatically deployed main: `dpqnWjZfjnEQCMqMeQvF24qGgLPG`, Ready, on the existing production alias. This report is a subsequent documentation-only commit.

ABH tests: **184 passed / 0 failed**. Runtime `ABH_GITHUB_TOKEN` authentication remains verified: HTTP 200, core limit 5000, remaining 4710, reset 2026-09-14T12:31:28Z at the 12:00:36Z check. No credential value was read or exported.

Fresh production scan `2026-09-14T11:56:38.575Z`: 60 GitHub results plus 30 Opire cards,90 raw / 80 pre-canonical unique / 79 persisted records. Five candidates entered deep analysis;13were rejected. The 120-request internal budget was consumed within the 50-second scan window; this was not GitHub quota exhaustion. Full Supabase readback matched the candidate array exactly. Zero machine-admitted candidates in that frozen scan; later manual admission below does not rewrite it.

## Fresh discovery and qualification

Supplemental current Opire price filters covered 58 unique cards across the default, $20–$300 and $1–$49 pages. Live GitHub searches also supplied fresh alternatives. Closed originals were rejected cheaply;404s with unresolved cause remained investigate/unavailable. No scoring redesign was performed.

Eight distinct candidates received deep investigation: five in the production scan, ivrit-py #12, and OpenAO #3/#19. Further source checks and their outcomes appear in `2026-09-14-fresh-attempts.json`; all runtime attempts and current provider cards are recorded in `2026-09-14-fresh-proof.json`.

The independent qualifier found three open unmerged submissions for OpenAO #3 and four for #19. #3 remains INVESTIGATE pending campaign verification;#19 is DO_NOT_HUNT for this run due competition. Existing submissions were not mislabeled as merged solutions. Scottcjn #2127 requires owner VPS access and was not selected. Most supplemental Opire software leads were already closed or deleted.

## Selected candidate

- [ivrit-ai/ivrit-py#12](https://github.com/ivrit-ai/ivrit-py/issues/12): analyze word-level streaming alternatives, especially repeated transcription with confidence analysis.
- GitHub-native reward: **100 NIS**, stated on the exact issue; no invented USD conversion. No separate provider listing or escrow claim.
- Public, nonarchived Python repository; open and unassigned. Private clone commit `76cac007abbf3e4ab2bea9fc28495d583d8a7926`.
- Five interest comments. Matching prior PR #19 was closed by its author without merging; no active matching solution PR observed. Competition is moderate and the task is not reserved for ABH.
- [Bounty rules](https://github.com/ivrit-ai/ivrit-py#bounty-rules): discuss scope, obtain a two-week reservation, receive reward after an accepted merged PR. AI assistance is allowed; the contributor must explain the work and reviews may be live. Payment rail and current owner responsiveness remain unverified.
- **PHASE3_ELIGIBLE**, independent of global Phase 2 INCOMPLETE. No hard technical blocker found.

## Private proof

Setup PASS: isolated Python environment, editable package install, pytest, faster-whisper, ffmpeg and tiny CPU model. Build requires `PACKAGE_VERSION`; the documented dev extra is stale, so inspected dependencies were installed explicitly. The environment's SOCKS dependency was provisioned without an account or secret.

Nine repository-defined focused unit tests passed; ten tests in that file were deselected because they exercise larger models or external services. The full model/service test suite was not claimed as passed.

Reproduction PASS: `WhisperSession._transcribe_buffered()` calls `FasterWhisperModel.transcribe_core()` without required `output_options`. The exception is caught and converted to an empty result. Both append and flush fail; deterministic proof retained 32,000 PCM bytes and made zero backend calls. A proof-only adapter supplying the options restored one segment and its word probability. The existing session test permits an empty list, so it can miss this failure.

Real audio confirmed the same defect and demonstrated repeated-call feasibility using `tests/test_input_10s.mp3`, model `tiny`, CPU, int8, two threads:

| Prefix seconds | Words | Call seconds | Unchanged word prefix versus previous call |
|---:|---:|---:|---:|
|2|4|0.613|—|
|4|8|0.542|0|
|6|13|0.573|0|
|8|18|0.753|4|
|10|21|0.775|4|

Real unmodified session: 0 segments. Options adapter: 1 segment. Word probabilities were present and ranged roughly 0.119–0.980 across these calls. Those values are model likelihoods, not calibrated accuracy. Timings are single samples excluding model loading. One short Hebrew fixture and a tiny model do not establish production performance or transcription quality.

Relevant files: `ivrit/audio.py`,`ivrit/types.py`,`tests/test_session.py`, and the existing audio fixture. Proposed deliverable: runnable rolling-window probe, tested word-stability/confidence helpers, and a repository-specific alternatives report. Propose the session-contract correction separately within maintainer-agreed scope. Test nonempty session results, forwarding, revised words, duplicate suppression, timestamp offsets after trimming, silence and final flush. Compare quality/latency on representative audio using the intended model.

Estimated effort: **6–10 focused engineering hours**, plus maintainer review and optional larger-model evaluation. AI solvability: HIGH for this bounded analysis; complete comparative work is still pending. Independent QA reran the deterministic proof, inspected the real-audio evidence, confirmed the root cause and approved the narrowly framed hunt proposal.

## Memory and next

The Scout → Qualifier → Proof → Solver → Independent QA → Submission preparation → Learning workflow is defined in `AGENT_CHAIN.md`. The qualifier/QA agent ran independently; later stages are idle, not a continuously deployed agent service.

Fresh scan and its attempt ledger are confirmed in dedicated ABH Supabase. Supplemental manual/proof records are committed here. Their additional database append is **pending ABH admin login**: the browser session expired and the connected database account exposes only CELT, which was not touched. A prepared append-only payload is retained with the private evidence; no prior snapshot will be rewritten.

Lessons: refresh originals before engineering; do not confuse a 5,000-request GitHub limit with internal scan bounds; accept credible non-USD reward evidence without fabricated conversion; combine deterministic regression proof with real data; do not tighten global rules from one poor population.

Owner action: approve asking the maintainer to confirm the analysis deliverable, 100 NIS reward and two-week reservation. Before committing, clarify payment method and any live-review expectation. No claim, comment, public fork, PR, wallet disclosure or terms acceptance has occurred. Restore ABH Supabase browser login when convenient so the prepared proof record can be appended and read back.
