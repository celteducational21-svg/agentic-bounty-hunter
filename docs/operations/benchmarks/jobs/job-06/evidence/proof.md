# job-06 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

Started 2026-09-17T10:30:06Z. Inspected only packet and supplied source. package.json test script is xo && ava && tsd; no custom install/build script. Dependencies installed with lifecycle scripts disabled and no lockfile changes.

Baseline `node ../evidence/reproduce.mjs` exits 1. Exact reported input is used. Matches are partial ESC]8;;h and ESC]8, leaving URL residue, ESC-backslash controls, and semicolons in stripped text. Complete command/output retained in commands.log.

Root cause: first pattern branch accepts only BEL as the terminator. The CSI-like fallback then partially consumes unmatched OSC input. Add ESC followed by literal backslash as an alternative terminator within the existing OSC-like branch, leaving the allowed payload and other control-sequence alternatives unchanged. The issue text's codepoint typo is interpreted from its actual supplied example, which ends sequences with ESC-backslash.

Proof completed 2026-09-17T10:30:59Z using installed Node24.19.0 and dependency-free reproduction. Optional full-suite dependency install completed during solution phase.
