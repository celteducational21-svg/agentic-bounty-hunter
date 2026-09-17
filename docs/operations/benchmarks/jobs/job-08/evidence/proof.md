# job-08 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

Started 2026-09-17T10:33:45Z (initial packet inspection interleaved with job02 repair). Inspected only supplied packet/source. pyproject uses Flit; tox invokes unittest; no custom build/install scripts. Python3.12 local runtime suffices for dependency-free tests. Isolated environment adds build and Black tooling.

Baseline script reproduces exact issue input: with n=2, result [0,1,2,3,4,2] omits the second0 despite eight intervening input items. Assertion against the documented seen-input interpretation [0,1,0,2,3,4,2] fails. This is a documentation-contract ambiguity, not a crash or claim that the existing algorithm violates an established behavioral test. Original three focused tests pass. Complete commands/output retained.

Root cause: duplicates are skipped before deque advancement, and deque stores keys only for yielded items. The set eviction/count logic intentionally models an output window. Existing n=1 duplicate-suppression tests are consistent with that interpretation. The issue explicitly offers clarifying yielded semantics if intentional. Chosen resolution preserves the algorithm and clarifies that contract, avoiding an unrequested behavioral compatibility change. Proof completed 2026-09-17T10:34:55Z.
