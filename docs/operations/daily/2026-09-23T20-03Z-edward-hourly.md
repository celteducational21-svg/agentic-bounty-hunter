# Edward hourly operations — 2026-09-23 20:03 UTC

Fresh GitHub, Opire and public-Superteam discovery failed with HTTP 502 on the
initial attempt and one bounded retry. No fresh results or persistence are
claimed for those sources. Authenticated Superteam discovery succeeded at
`2026-09-23T19:59:57.107Z` with zero live listings.

Gitpay was not run because its preserved browser session remains signed out, so
the required `Issues with bounties` and `Open` filters could not be verified.
This is a blocked source, not an empty result.

The prior saved scan is readable again and remains durable: 62 unique
opportunities with a 931-operation projection, fetched at
`2026-09-23T19:05:52.286Z`. It is retained as the last durable snapshot and is
not represented as fresh discovery. `/api/operations` remains degraded to its
seven-record committed fallback with `runtime.durable=false`.

`ivrit-ai/ivrit-py#12` remains open, unassigned and unreserved with 20 comments;
there is no maintainer confirmation. No DEEP review, private proof, solve,
independent QA, READY_TO_SUBMIT work, submission, merge or payment occurred.
The test suite passed 229/229.

Next: retry fresh provider discovery in the next cycle without treating the
saved snapshot as current. Owner action: nothing new.
