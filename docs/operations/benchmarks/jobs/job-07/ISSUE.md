# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Supporting more PathLike in path-related methods

https://github.com/mahmoud/boltons/issues/383

Whilst working on https://github.com/mahmoud/boltons/pull/382 I noticed a few places (`AtomicSaver`'s `dest_path` parameter to name one) where the code could be updated to support `os.PathLike` instead of just a string.

It wasn't my goal there to do any logic changes. But that's something I noticed could be worth improving support for. And will be easier to spot with annotations in place.

Pre-fix SHA: ebc7a8f776debfa33f0b380b57a444bca75a251b

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
