# job-04 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

Started 2026-09-17T10:28:59Z. Only supplied packet/source inspected. Go1.27.1 linux/amd64 compiler available; go.mod minimum1.23, no dependencies. Inspected Makefile before running tests.

Issue body is terse; title requests filling Request.Pattern with RoutePattern data. Supplied source already populates Pattern from private rctx.routePattern and basic existing TestPattern passes. Acceptance inferred transparently from title: handler Request.Pattern equals public RouteContext(...).RoutePattern(), including composed Route/Mount registrations.

Added test exercises Route and Mount, with an additional nested user-ID route and wildcard files route. `go test . -run TestPattern -count=1` fails in both cases: Pattern is /files/* while public RoutePattern() is /users/{userID}/files/*. Outer middleware after next also receives leaf-only Pattern. Exact output in commands.log. Proof completed 2026-09-17T10:30:02Z.

Root cause: private routePattern holds only the last tree match, while RoutePatterns includes parent matches and public RoutePattern() composes them and removes mount wildcards. Existing setter uses the former.

Solver paused scope between 10:30 and 10:31 while parent checked provenance. Parent confirmed pre-fix source correctness and title-derived acceptance, without supplying solution details. No upstream/audit/history material accessed. Solve wall time includes pause and interleaved job06 work; it is not CPU effort.
