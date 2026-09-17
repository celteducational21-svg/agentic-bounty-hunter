# Independent QA — job-11

PASS first pass. Reviewer independent_qa_lab; revision `6a8d05a5e772ad90db29c2ec0c574bdcd89f8087`; 2026-09-17T10:48:32.496372+00:00.

XO, 58 AVA tests and tsd pass. Independent lifecycle test verifies two concurrent pMap calls sharing a signal remove only their own listener, preserve an external listener, and clean up after validation/factory/input failures, active pending mapper or iterator abort, late completion and an already-aborted signal. All pass with exact listener counts and rejection reasons.

Resolve/reject wrappers consistently remove the stored handler; pre-aborted early return prevents registration. No external listener removal or runtime API changes. ESM has no compilation build; syntax and npm pack dry-run pass. Separate QA copy; no upstream access. Current Node only, minimum-version matrix untested. Exact output qa-commands.log.
