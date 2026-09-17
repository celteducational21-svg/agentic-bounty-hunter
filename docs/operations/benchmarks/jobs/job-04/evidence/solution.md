# Solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Set r.Pattern using rctx.RoutePattern() at the existing pre-handler assignment point. This provides composed parent/child pattern data, with mount wildcards normalized by the established public API. Tests verify Route and Mount nesting, parameter/wildcard preservation, handler visibility, and outer middleware visibility after next. Existing basic route tests remain intact.

One implementation iteration. Focused TestPattern suite passes after demonstrated baseline failures. go test -race ./... passes router and middleware packages; go vet ./... and go build ./... pass. gofmt applied and diff whitespace check passes. Static typing checked through build/vet; no separate typechecker applies. Go1.27.1 Linux runtime used, not Go1.23 or other platforms. Independent QA pending.
