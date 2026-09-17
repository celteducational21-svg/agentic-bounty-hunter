# Unpublished PR draft
SIMULATION / HISTORICAL REPLAY — NOT PAID WORK
Branch: fix/abort-listener-cleanup
Commit: 6a8d05a5e772ad90db29c2ec0c574bdcd89f8087
PR title: Remove abort listeners when pMap settles
Issue: https://github.com/sindresorhus/p-map/issues/75

pMap retains its anonymous abort listener after success or failure, keeping the operation reachable through long-lived signals. It also registers a listener after rejecting an already-aborted signal. Keep a named handler, remove it in shared resolve/reject cleanup, and return immediately for pre-aborted input.

Add nine lifecycle regressions that inspect native listener counts, preserve unrelated listeners, and verify outputs/errors for success, empty/skip, mapper/aggregate and sync/async iterator failures, active abort and pre-aborted input. All nine fail on pre-fix source and pass with the change. npm test passes XO, 58 AVA tests and tsd; npm pack succeeds. No signature changes. Evidence: proof.md, solution.md, commands.log, result.json and solution.patch. No public actions taken.
