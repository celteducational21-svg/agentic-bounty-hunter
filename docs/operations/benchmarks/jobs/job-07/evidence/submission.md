# Unpublished PR draft
SIMULATION / HISTORICAL REPLAY — NOT PAID WORK
Branch: fix/fileutils-pathlike
Commit: 54b96407a212d17425c574e4b871acc9c9ac1837
PR title: Support PathLike arguments in fileutils
Issue: https://github.com/mahmoud/boltons/issues/383

AtomicSaver's default part-file name, iter_find_files depth calculation and path_to_unicode currently assume string or byte methods. pathlib and other os.PathLike inputs fail despite neighboring stdlib operations accepting them. Normalize through the filesystem path protocol before those operations, retaining existing decoding and save behavior, and document PathLike acceptance.

17 regressions cover pathlib/custom __fspath__/str/bytes, atomic commit/rollback/cleanup, optional part filenames and directory depth. Full suite and doctests: 610 passed. Wheel build and byte compilation pass. New tests lint cleanly; three existing fileutils style findings unchanged. No typing gate configured; Windows native replacement not run. Evidence: proof.md, solution.md, commands.log, result.json and solution.patch. No public actions taken.
