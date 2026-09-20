# Post-repair benchmark audit

Final verdict: **PASS AFTER REPAIR** for revision `8c949104b87b91f09a96687b1a46f8e71f835538`.

Auditor: `benchmark_auditor_6`  
Readiness: `READY_TO_SUBMIT_SIMULATED_APPROVAL_REQUIRED`  
Current repair required: no

Historical comparison was authorized after the iteration-2 Solver and independent QA freeze. The accepted reference is p-queue commit [`81846550274256011a2d55b06aeb36b23877eb43`](https://github.com/sindresorhus/p-queue/commit/81846550274256011a2d55b06aeb36b23877eb43).

The repaired implementation matches the accepted fix's material lifecycle: PQueue owns cancellation of running work, races an abort rejection against the operation, and releases pending accounting in `finally`. Direct probes against both exact revisions used two never-settling callbacks that ignore their signals. With same-turn abort in either add order, both promises rejected with the package `AbortError`, queue size and pending count reached zero, idle resolved, and a follow-up task returned `42`. Queued-first abort and ordinary error identity also matched.

The repaired revision is stronger on two bounded cleanup edges. It installs the abort listener before invoking the callback, so a callback that aborts synchronously before returning still rejects and drains; the accepted revision missed that event and remained pending in the auditor's deadline probe. It also removes its listener after successful work, whereas the accepted revision left the listener attached. These differences improve lifecycle cleanup and do not expand the public contract.

Independent QA reported the focused acceptance test passing, 45 practical tests passing, and build/typecheck passing. Two practical-suite failures were documented as baseline/runtime incompatibilities, and XO emitted warnings; neither affects the direct accepted-behavior comparison. The broad accepted commit also contains unrelated typing, timeout, package, and tsconfig work that this benchmark does not require.

The first attempt at revision `9c75913a771fc773c00b2bac053d06a2464beb1d` remains preserved under `evidence/attempt-1`. Its fix covered only an already-aborted queued task; the accepted never-settling reproduction hit the deadline with size `1` and pending `1`. The FAIL audit and one independent-QA false positive are retained as history; this is not a first-pass success.

Limitations: the auditor used deterministic built-artifact probes and frozen QA results rather than reproducing the accepted revision's full historical CI matrix. No patch or Solver artifact was altered during this audit.
