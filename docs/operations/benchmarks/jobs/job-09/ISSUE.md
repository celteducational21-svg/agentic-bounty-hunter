# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Inconsistent behavior of split_after when maxsplit=1

https://github.com/more-itertools/more-itertools/issues/658

I'm seeing what appears to be inconsistent behavior with `split_after` when I specify a `maxsplit` of 1. Here's what I see with no `maxsplit`:
```
>>> tuple(split_after([1], lambda x: x == 1))
([1],)
```

And I see the same result with `maxsplit == 2`:
```
>>> tuple(split_after([1], lambda x: x == 1, maxsplit=2))
([1],)
```

However, `maxsplit == 1` gives my an unexpected second result in the tuple:
```
>>> tuple(split_after([1], lambda x: x == 1, maxsplit=1))
([1], [])
```

Do I just misunderstand how `split_after` is supposed to work? If so, how should I know when to expect an empty list like that?

Pre-fix SHA: 6793bd3e4ed15318746ed2511733f12a9932eb64

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
