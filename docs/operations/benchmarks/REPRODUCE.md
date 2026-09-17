# Reproduce a frozen historical replay

**SIMULATION / HISTORICAL REPLAY — NOT PAID WORK**

1. Read the job's `intake.json`, original issue packet and `UPSTREAM_LICENSE.txt`.
2. Download the upstream repository archive at `preFixSha`, verify against `snapshot-provenance.json`, and unpack into an isolated workspace. Do not use current main. The curated workspace's synthetic baseline commit differs from upstream SHA because future history was intentionally removed.
3. Follow the retained setup commands and compatible dependency versions in `evidence/commands.log`, `proof.md` and setup logs. Generated dependency trees, caches and baseline scratch checkouts are deliberately not committed; they are reproducible inputs, not the evidence record.
4. Reproduce the failing case before applying a patch. Apply `evidence/solution-full.patch` to the original pre-fix tree. This is the complete diff from the synthetic source root to the exact frozen final revision, including any repairs. `solution.patch` retains the Solver's original export; `patch-provenance.json` records both comparisons. Initial attempts remain under `attempt-1` and initial audit files.
5. Rerun focused and practical regression/build/lint/typecheck commands. Inspect `qa.json` for actual status and baseline/toolchain limitations rather than assuming every tool passed.
6. Independent QA harnesses and audit counterexamples are retained in each evidence directory. Accepted-fix links and audit comparisons were revealed only after the corresponding Solver/QA freeze. A new blind replay must withhold those files again.

No upstream issue should be reopened or receive these drafts. The issues were resolved historically. Replaying an accepted fix does not create a customer win, contribution acceptance or payment.
