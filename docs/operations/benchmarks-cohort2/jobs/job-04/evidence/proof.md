# job-04 proof — iteration 2 — SIMULATION / HISTORICAL REPLAY — NOT PAID

The complete failed first attempt, including independent QA and historical audit, is preserved under `evidence/attempt-1/`. The repaired revision is a new single commit over original pre-fix SHA `c905aaf2a826c4581a604ee6bbb1ae41b062a598`. No historical accepted source or patch was inspected or copied during repair.

## Initial failure

Revision `9c75913a771fc773c00b2bac053d06a2464beb1d` converted the already-aborted early return into a thrown error so shared cleanup ran. Its regression callback installed its own abort listener and rejected itself. With the required callbacks that ignore the signal and never settle, the running task never left `await operation`, so the queue remained at size 1 and pending 1.

## Repaired root cause and behavior

PQueue must own cancellation of the promise it returns. Before invoking a task with a signal, the queue now installs a one-shot abort listener that rejects an internal `AbortError` promise. It races that promise against the task operation. Catch preserves the ordinary error/rejection path, while `finally` removes the listener and always calls `#next()`.

This covers both phases of the same-turn reproduction:

- the running never-settling task loses the race to its abort promise;
- the second task, whose signal is already aborted when dequeued, throws before callback invocation and still reaches `finally`.

Direct repaired probes passed both controller-abort orders, 200 ms deadlines, size/pending drain, `onIdle()`, following-task result 42, non-abort error identity, and a callback that synchronously aborts its own controller without installing a listener.

## Validation

- TypeScript build/typecheck: passed.
- Focused generated AVA regression: 1 passed.
- Complete practical generated suite: 45 passed, 2 known failures, 0 unexpected failures.
- XO under Node 16.20.2: exit 0 with two pre-existing TODO warnings.
- `git diff --check`: passed.
- Frozen repaired revision: `8c949104b87b91f09a96687b1a46f8e71f835538`.

Fresh independent QA and historical comparison remain pending.
