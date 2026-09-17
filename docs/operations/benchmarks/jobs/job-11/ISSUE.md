# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Memory leak when using abort signals

https://github.com/sindresorhus/p-map/issues/75

We have encountered a memory leak issue. After an extensive search for the source of the leak, it was found that it occurred in pMap. Upon reviewing the source code of your package, I discovered that you subscribe to the AbortSignal event but do not unsubscribe from it, which causes the memory leak.

Pre-fix SHA: a38d5a7180ba9ecd6a02e37ec5cc6ae11f3433ac

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
