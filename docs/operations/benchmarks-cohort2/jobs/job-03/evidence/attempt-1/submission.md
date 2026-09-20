# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID

Title: Keep interval synchronized when replacing a spinner

Branch suggestion: `solver-a/job-03-spinner-interval`

Commit: `b651274572730d6cca0d785452768c7e69def017`

Issue: `sindresorhus/ora#123`

Ora resolved a newly assigned spinner into `_spinner`, but did not copy that spinner's interval into the instance. As a result, replacing a spinner could leave the timer configured with stale state.

Synchronize `interval` in the spinner setter when the resolved spinner provides one. The constructor's existing assignment order is preserved, so an explicit constructor interval continues to override the initial spinner interval.

Regression coverage verifies both constructor precedence and the update after assignment.

Validation on Node 16.20.2/Linux: focused AVA regression passes; full AVA suite passes (26/26); TSD passes; XO exits 0 with one pre-existing TODO warning; diff check passes. The historical lint dependency is incompatible with the available default Node 24 runtime because it calls removed `util.isDate`. No PR was published; independent QA is pending.
