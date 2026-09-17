# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**PASS**, frozen revision `81d28b46970f5514eb193c4f76bcc725073f472a`.

After Solver and QA freeze, compared against accepted [chi PR1097](https://github.com/go-chi/chi/pull/1097), fix `818fdcfc4786168651768377ba647cf9dd5b3953`. The one-line implementation matches: request Pattern uses composed public RoutePattern data. Root cause, behavior and focused scope match, while replay adds broader nested Route/Mount/wildcard and middleware tests.

Intake caveat: the original body only links an analogous feature request. Basic Pattern support already existed at the supplied base, which prompted a provenance review. That review confirmed the first-parent pre-fix snapshot and withheld the accepted solution. The original title specifically requests RoutePattern data; Solver independently demonstrated that public-contract mismatch. This is a faithful interpretation of the issue, not a newly invented nested-routing requirement.

Independent QA passes full Go tests, race detector, vet, build/typecheck and added parameter/normalization/Group checks. Other Go versions were not executed. Ready for simulated owner approval only.
