# Benchmark audit — job-04

Auditor: `benchmark_auditor_2`  
Compared solver revision: `9c75913a771fc773c00b2bac053d06a2464beb1d`  
Accepted closing fix: [`81846550274256011a2d55b06aeb36b23877eb43`](https://github.com/sindresorhus/p-queue/commit/81846550274256011a2d55b06aeb36b23877eb43)  
Verdict: **FAIL**  
Readiness: **BLOCKED**

## Accepted-fix comparison

The solver fixes one real subcase: when a queued job begins after its signal is already aborted, throwing into the existing catch path allows the subsequent `#next()` call to run. The previous reject-and-return path leaked pending accounting.

The accepted fix addresses an additional essential part of the lifecycle. It races a running task operation against a queue-owned abort promise and moves accounting cleanup into `finally`. Its regression deliberately uses tasks that never settle and do not install their own signal listener:

```js
queue.add(async () => new Promise(() => {}), {signal})
```

The solver's regression instead defines a callback that listens to `signal` and rejects its own promise with `AbortError`. That makes the first running job finish independently of PQueue's cancellation behavior, after which the solver's early-abort correction can clean up the second job. It therefore does not test the accepted contract.

I ran the accepted test shape against the frozen solver build with a 150 ms deadline. Neither pair of add promises settled; the observed terminal snapshot was:

```text
outcome=deadline, size=1, pending=1
```

Thus the queue still hangs for the accepted reproduction. The broad accepted commit contains unrelated `.add()`, `.addAll()`, timeout, package, and TypeScript configuration changes; those are not all benchmark requirements. Queue-owned abort racing and guaranteed cleanup are the relevant missing pieces.

## Audit judgment

The frozen solution is a valid partial fix but does not reproduce the accepted behavior and does not satisfy the intended same-turn abort lifecycle for never-settling tasks. Independent QA was a false positive because it reused task callbacks that performed their own abort rejection.

`qaFalsePositive: true`  
`requiresRepair: true`
