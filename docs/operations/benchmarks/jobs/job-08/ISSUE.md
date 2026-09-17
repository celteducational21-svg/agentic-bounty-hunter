# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

`unique_in_window` is unclear or wrong

https://github.com/more-itertools/more-itertools/issues/719

It's documented as:

> Yield the items from iterable that haven’t been seen recently. n is the size of the lookback window.

The example is:

```pycon
>>> iterable = [0, 1, 0, 2, 3, 0]
>>> n = 3
>>> list(unique_in_window(iterable, n))
[0, 1, 2, 3, 0]
```

It's unclear what "seen recently" means. Given the words "window" and "seen", one might think of it as a window of the last n seen input elements:

```
[0, 1, 0, 2, 3, 0]

[0]  => yield 0
[0, 1]  => yield 1
[0, 1, 0]  => don't yield 0, as another is in the window
   [1, 0, 2]  => yield 2
      [0, 2, 3]  => yield 3
         [2, 3, 0]  => yield 0
```

But that's not the case. It's really rather like this:

```
[0, 1, 0, 2, 3, 0]

[0]  => yield 0
[0, 1]  => yield 1
[0, 1, 0]  => don't yield 0, as another is in the window
[0, 1,    2]  => yield 2
   [1,    2, 3]  => yield 3
         [2, 3, 0]  => yield 0
```

Another example:

```pycon
>>> iterable = [0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 3, 4, 2]
>>> n = 2
>>> list(unique_in_window(iterable, n))
[0, 1, 2, 3, 4, 2]
```
The second 0 wasn't yielded, even though 0 hadn't been seen in the last eight elements. But the second 2 was yielded even though the first one was seen just three elements earlier.

If that's intentional, then maybe replace

> Yield the items from iterable that haven’t been seen recently.

with

> Yield the items from iterable that haven’t been yielded recently.

and replace the example with mine (since that rules out the other interpretation, unlike the current example).

Pre-fix SHA: c8baa10e66de18662114b71edcfa32f5dfdd2881

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
