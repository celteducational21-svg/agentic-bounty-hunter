# Solution
Scan unquoted value until LF (CRLF is normalized by existing parser). Preserve internal whitespace, strip inline comments introduced by whitespace followed by hash, trim trailing whitespace, then expand variables. Keep quoted-value path untouched.

Nine regression cases use public Unmarshal and exact full-map assertions so spurious keys cannot pass. Fail before/pass after. Full race suite, go vet, go build, gofmt, git diff --check PASS. Compiler supplies type check; separate third-party lint not configured. No new regression failures. Solver validation only, not QA.
