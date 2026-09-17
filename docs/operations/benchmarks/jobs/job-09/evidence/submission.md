# Unpublished PR draft
SIMULATION / HISTORICAL REPLAY — NOT PAID WORK
Branch: fix/split-after-empty-remainder
Commit: 33f394fa3e87365d9d6a31214e9af424f8826258
PR title: Avoid an empty trailing group at split_after maxsplit boundary
Issue: https://github.com/more-itertools/more-itertools/issues/658

When the final permitted split occurs on the last input item, split_after unconditionally yields an empty remainder. Yield that remainder only when it contains items, matching unlimited splitting and larger maxsplit values.

Add eight boundary cases including the issue reproduction, multiple splits, nonempty remainder and empty input. Focused regressions pass; all 693 unittest/doctests pass; wheel builds. Existing flake8 E721, current-black formatting differences and missing __all__ stubtest errors reproduce on baseline unchanged. Evidence: proof.md, solution.md, commands.log, result.json, solution.patch. No public actions taken.
