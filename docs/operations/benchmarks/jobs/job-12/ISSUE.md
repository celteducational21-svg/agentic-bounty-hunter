# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Incorrect `pMapIterable` behaviour

https://github.com/sindresorhus/p-map/issues/76

`pMapIterable` doesn't adhere to the concurrency limit when the source is an async iterable and `backpressure` > `concurrency`.

Here's an example program that reproduces the issue:

```ts
import { setTimeout } from 'timers/promises';
import { pMapIterable } from 'p-map';

async function* source() {
  yield 1;
  yield 2;
  yield 3;
}

const target = pMapIterable(source(), async n => {
  console.log(`Running with ${n}...`);
  await setTimeout(1000);
  console.log(`Finished running with ${n}`);
}, {
  concurrency: 1,
  backpressure: 2
});

for await (const _ of target) { }
```

Current output:
```
Running with 1...
Finished running with 1
Running with 2...
Running with 3...
Finished running with 2
Finished running with 3
```

Expected output:
```
Running with 1...
Finished running with 1
Running with 2...
Finished running with 2
Running with 3...
Finished running with 3
```

As you can see, the mapper function has two instances running in parallel even though concurrency is set to 1.

FYI @Richienb 

Pre-fix SHA: 2ba3a002acac080c60c47ca1dfa2fad3e17f5b7c

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
