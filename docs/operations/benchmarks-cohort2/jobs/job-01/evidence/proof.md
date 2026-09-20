# Proof — iteration 2

SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

At the exact pre-fix revision, `click.prompt("test", prompt_suffix="")` with input `foo` renders `test foo`: the built prompt contains no suffix, but the input function is still called with a separate space. `confirm` has the same independent input path and defect.

The first solution suppressed that input-function argument only for an empty suffix. It fixed the reported output, but an independent audit exposed two contract violations: custom `prompt_suffix=">"` still rendered an implicit space (`test> foo` / `test> y`), and the empty-suffix path no longer routed any prompt character through the input function, bypassing Click's readline backspace safeguard. That attempt, its QA false positive, and its audit are preserved verbatim in `evidence/attempt-1/`.

The repaired invariant is uniform: echo every character except the last, then let the input function write the final character. Concatenating those two writes reconstructs the complete built prompt exactly. Thus an empty suffix on `test` routes `t` through the input function and displays `test`; custom `>` routes `>` and displays `test>`; default `": "` routes the final space and displays `test: `. The same rule is applied to `prompt` and `confirm`.

Focused output tests cover empty, custom `>`, and default suffixes for both APIs. Independent call-shape probes also assert that the input function receives the final built-prompt character in all six cases.

No upstream solution or post-fix source was inspected or copied during repair. No public action was taken.
