# Dedicated ABH history database

Organization: Agentic Bounty Hunter (`invqvmgxukbrtbgmwjjq`).
Project: Agentic Bounty Hunter (`xyuxxunpmzlyqocberia`).
Plan observed: Free. Region: ap-northeast-2 (Seoul).
This is separate from CELT, ARES, and Study Abroad AI.

## Schema and access

`db/schema.sql` was applied through the signed-in Supabase SQL editor. The project initially had zero public tables.

- `abh_scans`: one summary per retrieval timestamp; retry deduplication.
- `abh_opportunities`: stable opportunity ID, first seen, latest check, current state and full snapshot.
- `abh_history`: full snapshots only when material state changes.
- `abh_record_scan`: security-invoker RPC with a transaction advisory lock, atomic updates and protection against older scans replacing newer state.

RLS is enabled on all three tables. Anonymous and authenticated client roles have no table access or RPC execution. Only the server service role has the required grants. No secret is present in the repository or dashboard code.

## Server configuration

Vercel project: `agentic-bounty-hunter`, existing production environment only.

- `ABH_SUPABASE_URL`: the dedicated project URL.
- `ABH_SUPABASE_SECRET_KEY`: existing Supabase secret key, stored as a Vercel Secret.

The native-fetch adapter sends the key in the API-key header, never a URL. The adapter enforces the ABH project reference. Preview deployments do not receive the production key.

`GET /api/opportunities` writes the resulting scan and returns the confirmed persistence result. `GET /api/opportunities?history=ABH-GH-owner-repo-number` reads up to 50 recent material changes. Source content remains untrusted data; nothing stored can execute instructions or change configuration.

## Verification

67 automated tests pass, including 8 new storage tests. `db/verify.sql` passed against live Postgres, including RLS/access restrictions, duplicate retries, unchanged-state deduplication, assignment changes, older-scan protection, and an RPC call under `service_role`. Test data was rolled back.

The Vercel environment page confirmed both variables are scoped to Production. End-to-end deployed persistence validation is pending at this checkpoint; schema tests alone do not prove that the application is connected.

## Limits

No recurring scanner or retention job has been enabled. Scans occur on requests subject to CDN caching. Monitor Free-plan database size before enabling frequent scheduled scans; history currently has no automatic deletion policy. History starts with the first successful database-backed scan, not earlier memory-only runs. This storage work does not establish Phase 2 ranking-quality PASS.
