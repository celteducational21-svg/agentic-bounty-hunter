# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID
Setup PASS: supplied Go1.27.1, no external dependencies. Inspected go.mod, Makefile and CONTRIBUTING.md. Repaired missing executable bits on supplied compiler tools after initial permission error. Full pre-fix baseline go test ./... PASS.

Reproduction PASS: focused test introduced before production patch fails in both tee cases: expected cumulative bytes 18 (7-byte prefix plus 11-byte ReadFrom), got 29. Non-tee controls pass, with and without Reader implementing WriterTo. Exact commands/output in commands.log.

Root cause PASS: ReadFrom tee path invokes io.Copy on basicWriter, whose Write already increments bytes. ReadFrom then adds the copied bytes again. Sent candidate accepted/proof to root before implementation.
