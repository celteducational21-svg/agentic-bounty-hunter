# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID
Title: Populate Request.Pattern with the composed RoutePattern
Branch: solver-b/job-04-request-pattern
Commit: 81d28b46970f5514eb193c4f76bcc725073f472a
Issue: go-chi/chi#1089

Request.Pattern currently receives only the most recent tree match. For nested routers a request to /users/42/files/a/b reports /files/*, even though RoutePattern() reports /users/{userID}/files/*. Populate the request field through the existing public composition helper so handlers and middleware see the full routing pattern.

Adds Route and Mount regressions covering nested parameters, wildcards, and middleware observations. Baseline fails both cases; patched focused tests pass. Full race-enabled suite, vet, build, and formatting/diff checks pass on Linux Go1.27.1. Existing minimum Go version1.23 unchanged.

Issue has a terse body; this implements its title's RoutePattern-data requirement. No PR published. Independent QA pending.
