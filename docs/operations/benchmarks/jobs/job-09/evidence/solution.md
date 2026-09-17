# Solution
Materialize the remainder after the final split and yield only if nonempty. Keep maxsplit=0 behavior and iteration timing unchanged. Eight boundary regression cases include singleton, final delimiter, exact multiple splits, remaining values, and empty input.

Focused cases PASS. Full repository unittest runner (includes doctests): 693 tests PASS. Existing E721 lint finding unchanged; baseline comparison logged. Build, formatting and type-stub check output in commands.log. No public actions or independent-QA claim.

Wheel build PASS. Latest black and mypy stubtest expose baseline differences: both files would be reformatted, and both stubs lack __all__. The same failures reproduced on local pre-fix copies; no signatures/stubs changed.
