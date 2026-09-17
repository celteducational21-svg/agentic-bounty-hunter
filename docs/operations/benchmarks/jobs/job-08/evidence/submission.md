# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID
Title: Define unique_in_window in terms of previously yielded items
Branch: solver-b/job-08-window-docs
Commit: 081d4696f5770dae073a7e1d6cfc55ebb7e3e87a
Issue: more-itertools/more-itertools#719

The phrase “seen recently” suggests an input window, but the algorithm advances its window only when yielding an item. Preserve existing behavior and clarify that n counts previously yielded items (or their keys). Use the reported long-duplicate-run example to distinguish the two interpretations and explain why the second0 is suppressed while the second2 is yielded.

Adds focused regression tests for duplicate runs and key-based equivalence. Full736 tests including doctests, focused5 tests, and package builds pass. Changed formatting passes; whole-file Black has a demonstrated pre-existing unrelated failure. No API/type changes. No PR published; independent QA pending.
