# Stage 2 independent QA

**PASS after fixes**, reviewer `independent_qa_lab`, completed 2026-09-17T11:07:10.175481+00:00. Review binds to SHA-256 hashes in `qa-reviewed-files.json`. Stage 1 reports remain untouched.

226 full-suite tests pass. Thirteen independent checks pass, including deadline boundary, contradictory duplicates in both input orders, canonical URL conflicts across IDs, source failure isolation, error redaction, reward/economics separation, preservation of active work, benchmark exclusion and persistence payload retention. Production JavaScript syntax checks pass. There are no configured build, lint or typecheck scripts; these are not claimed as executed gates.

## Independent findings resolved

1. Deadline equal to observation time was accepted; now excluded.
2. A permissive duplicate survived CLOSED/HUMAN_ONLY/unverified/winner conflicts. Both provider ID and canonical slug conflicts now fail closed.
3. Existing API catch paths returned raw error messages. Both public handlers now return generic errors. Added `test/api-error-redaction.test.js` with fake credentials and fully stubbed network to verify both handlers redact transport details.

Initial failure evidence is preserved. No implementation code edited by QA.

## Live read-only evidence

Independent execution of the actual `discoverSuperteam()` adapter returned one item: **Colosseum Crypto World's Fair Hackathon | Superteam Vietnam Track**, AGENT_ALLOWED, verified sponsor, future deadline 2026-10-13T06:59:00Z, advertised total 10000 USDG. It remains outside the small-task lane, not private-proof eligible, and enters INVESTIGATING. Derived economics has zero proofs, accepted work and payments. Prize-pool and geographic/individual-award uncertainty remains explicit. Exact response and derived state are in `qa-live-superteam.json`.

Only public GET is implemented in the adapter, with no auth header, redirect following, account creation, reservation, submission, wallet or payout mutation. Catalogue failures are bounded/safe and do not reset retained active work.

The existing snapshot RPC payload retains sourceExpansion, operations and economics in its summary/frozenSnapshot without a database schema change. This was verified using a stubbed fetch; no live database mutation is claimed. UI reward rendering includes the ADVERTISED LISTING TOTAL NOT PAYMENT status.

Economics remains descriptive, excludes replay markers without blacklisting legitimate benchmark/historical-data titles, separates currencies, and leaves unknown reliability/dispute/payment outcomes unknown. Discovery does not manufacture proof or earned rewards.

Evidence: `qa.json`, `qa.log`, `qa-full-suite.log`, `qa-independent-checks.json`, `qa-live-superteam.json`, and `qa-reviewed-files.json`. Live coverage is bounded and point-in-time, not market-wide certification or a claim of early wins.
