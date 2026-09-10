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

The Vercel environment page confirmed both variables are scoped to Production. Deployment `dpl_CwsXv8hGgffir2pMU1NSNKZXxhy7` reached Ready. The live dashboard retrieved 60 raw issues and 32 apparent candidates: 0 HUNT, 0 WATCH, 3 SKIP, 29 REJECT. A separate live SQL query confirmed **1 persisted scan, 32 opportunities and 32 history entries**, last scan `2026-09-10 13:12:45.39+00`. Source commit: `37af18fae91a726309c3b91956306ab712c3241f`.

The dashboard displays whether history was durably saved and provides a read-only history viewer inside each evidence panel. Direct API navigation in Cloud Browser returned `ERR_BLOCKED_BY_CLIENT`; this is not treated as an application failure or a bot-detection event. The dashboard's own API request and the independent SQL record counts confirmed ingestion and persistence.

Cross-deployment verification: source `eba8ae6abbd244b15761320b5e40a9718180f10c` deployed as `dpl_GBBECEk1dA3qbTjbDDfUUXYdivG2`. The dashboard displayed **History saved to database** at `2026-09-10 13:16:50.99+00`. Live SQL then reported **2 scans, 32 opportunities, 32 history entries**. Unchanged opportunities did not create duplicate history. Opening the first evidence panel and clicking **Load score history** returned its earlier `13:12:45` record (REJECT, WIN 72). This verifies history survives redeployment and the read path works. Browser logs inspected at this point contained extension metadata errors, not ABH application errors.

## Limits

No recurring scanner or retention job has been enabled. Scans occur on requests subject to CDN caching. Monitor Free-plan database size before enabling frequent scheduled scans; history currently has no automatic deletion policy. History starts with the first successful database-backed scan, not earlier memory-only runs. This storage work does not establish Phase 2 ranking-quality PASS.
