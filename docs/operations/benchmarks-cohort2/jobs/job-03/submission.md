# Unpublished PR draft — iteration 2 — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Synchronize intervals only for custom spinner assignments

Branch suggestion: `solver-a/job-03-spinner-interval-v2`

Commit: `f13b0fbc85a3cffebd5e88ba5d6d42fd80356589`

Issue: `sindresorhus/ora#123`

When a custom spinner object is assigned, copy its interval into the Ora instance if the property is present. Check against `undefined` so zero remains a valid interval.

Keep this synchronization inside the custom-object branch. Assigning a built-in spinner name therefore changes the spinner frames without unexpectedly replacing an existing explicit interval. Constructor precedence is unchanged because the constructor still applies its explicit interval after initial spinner resolution.

Regression coverage verifies explicit constructor precedence, positive custom intervals, zero-valued custom intervals, and named-spinner interval preservation. The full AVA suite passes 26 tests, TSD passes, XO exits successfully under Node 16.20.2 with one pre-existing TODO warning, and direct boundary probes pass.

This is repair iteration two. The first revision failed historical audit; its full solver, QA, and audit record is preserved under `evidence/attempt-1/`. No PR was published. Fresh independent QA and audit are pending.
