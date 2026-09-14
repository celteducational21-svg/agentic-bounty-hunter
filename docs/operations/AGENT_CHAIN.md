# ABH execution chain

Owner policy updated 2026-09-14: prioritize fresh provider-first discovery, investigate up to 20 promising candidates as needed, and stop discovery once one candidate is ready for private proof. Global market certification is independent. Unknown facts trigger investigation. Maximum two candidates per repository remains a diversity preference.

| Role | Input | Required output | Boundary |
|---|---|---|---|
| Scout | Current Opire catalogue and live GitHub bounty issues | Frozen population, source timestamps, advertised rewards | Read only; distinguish exact listings from reposts |
| Qualifier | Frozen population | Canonical state, five reward provenance fields, competition, scope, dependency classes, admission decision | Unknown is investigate; pay-on-acceptance is acceptable |
| Proof/Reproduction | PHASE3_ELIGIBLE dossier | Pinned private clone, setup evidence, safe tests, reproduction, root cause, fix/test plan, effort | No public fork, claim, comment, PR or terms |
| Solver | Owner approval and platform assignment when required | Bounded implementation and regression tests against exact acceptance criteria | Begin after approval; no scope expansion without evidence |
| Independent QA | Solver changes and acceptance criteria | Independent test/review results, regressions, remaining gaps | Must distinguish mocked checks from real integrations |
| Submission preparation | QA-passed change | Draft PR body, verification evidence, checklist and required disclosures | Owner approval before submission |
| Learning/Memory | Every attempted stage | Append-only outcomes, actual effort, setup, maintainer, claim, acceptance and payment results | Never invent unobserved outcomes or harden policy from one failure |

Use the dedicated ABH Supabase project only. Runtime scans already preserve immutable attempts and learning records. If administrative access expires, commit the project log and retain a pending append-only database payload; do not write to another connected project.

Roles are an operating workflow, not a claim that a continuously running multi-agent service exists. In the September 14 fresh run, a separate agent qualified OpenAO and independently checked the selected private reproduction. Solver and public stages remain idle pending owner approval.
