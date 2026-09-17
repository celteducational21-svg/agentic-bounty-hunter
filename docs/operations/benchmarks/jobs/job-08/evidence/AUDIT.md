# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**FAIL: historical acceptance alignment. ABANDONED / SCOPE_MISMATCH.** Frozen revision `081d4696f5770dae073a7e1d6cfc55ebb7e3e87a` is a technically sound documentation alternative, not the accepted historical behavior.

Compared only after authorized freeze against [more-itertools PR720](https://github.com/more-itertools/more-itertools/pull/720), fix `719a333bccd20ced15a7b4688fb6d47f05d8606d`. Accepted code advances its window for every input; replay preserves a window over yielded items.

On the issue's window2 example, replay returns `[0,1,2,3,4,2]`; accepted code returns `[0,1,0,2,3,4,2]`. For window1 and `[1,2,3,4,4,4]`, replay suppresses duplicate4s but accepted code returns every item.

Original author proposed documentation changes only **if** behavior was intentional. No original maintainer confirmation establishes that condition. The eventual historical solution chooses the behavior correction. Solver and QA's interpretation is defensible from the thin packet, but it cannot count as historical acceptance equivalence. This is an intake/qualification miss, not an introduced runtime regression.

QA's 740 tests/doctests and exhaustive reference tests validate the chosen alternative. Existing lint/typecheck/strict documentation build failures are disclosed. No post-reveal imitation is performed to inflate the score; this case is defensibly abandoned and not submission-ready. Preserve the Solver/QA artifacts and this failed alignment result unchanged.
