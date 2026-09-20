# job-08 solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Revision: `fcc212f56644672596770b23174b5eb6df9f93bf`

The public declarations now distinguish literal object mode from the default string mode. A public `Entry` alias exposes the entry shape supplied by `fast-glob`, and a narrow `ObjectModeOptions` interface drives earlier async and sync overloads returning entries. General and literal-false calls retain their original string-array return types.

The stream declaration remains the compatible historical `NodeJS.ReadableStream` because that type is not generic here. Compile-time tests cover all modes, while runtime tests confirm that async and sync object-mode results contain entry objects.

AVA passes 119 tests with 2 known expected failures, TSD passes, and XO passes with a Node 24 shim for predicates removed from `util`. The unshimmed combined command is limited by that historical lint dependency, not the patch. Tested on Node.js 24.19.0/Linux; the historical Node matrix was not run. Independent QA is pending.
