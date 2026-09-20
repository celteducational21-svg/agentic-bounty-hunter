# Independent QA — job-04

Reviewer: `independent_qa_3`  
Verdict: **PASS**  
First pass: **true**  
Frozen revision: `9c75913a771fc773c00b2bac053d06a2464beb1d`

## Provenance and reconstruction

I initialized a fresh repository, fetched only `c905aaf2a826c4581a604ee6bbb1ae41b062a598`, and checked it out detached. The supplied patch has SHA-256 `d417a1048c2e1ef29b7802a9c4a8038dd589a9719eca2ec62b9beda36f0a1c9c`, stable patch ID `85e5e8f6409844ae29da0719eae77742bfce6fd5`, and applied cleanly.

The reconstructed tree is `6fe8cf8f57fd4acf57f385d7da591432ba4f2438`. It exactly matches the tree of the claimed local frozen revision, whose sole parent is the supplied pre-fix SHA. `result.json`, `solution.md`, and `submission.md` agree on the revision. Only parent/tree metadata was read from the frozen commit for identity verification; no accepted fix, later source, or issue discussion was inspected.

## Acceptance and race probes

The focused regression passes and verifies both `AbortError` rejections, `size === 0`, `pending === 0`, and `onIdle()` completion.

Independent deadline-bounded probes additionally covered:

- first-controller then second-controller abort in the same timer turn;
- reverse abort ordering in that same turn;
- a queued job whose signal is already aborted before it starts;
- queue draining and `onIdle()` after each ordering;
- an ordinary thrown error preserving object identity and emitting the same error;
- a subsequent queued task still running and returning `42` after that ordinary error.

All probes passed. This confirms the fix does not turn unrelated errors into aborts and does not stall later work.

## Regression and quality checks

- Focused transpiled regression: 1 passed.
- Full practical transpiled suite: 45 passed, 2 known failures, 0 unexpected failures.
- Build/typecheck: passed through `npm run build` and `tsc`.
- XO: exited 0 with two pre-existing TODO warnings under a Node 24 compatibility shim.
- Whitespace check: passed.

Native AVA discovery of the TypeScript test still fails in the historical AVA/ts-node loader on Node 24. The entire test source was therefore transpiled without semantic edits and run with AVA; generated files were removed afterward. The patch is ready for an unpublished PR subject to this documented toolchain limitation.
