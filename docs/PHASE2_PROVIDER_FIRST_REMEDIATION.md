# Phase 2 provider-first remediation

This revision addresses the five failures in the Phase 2.2 audit. Phase 2 remains INCOMPLETE until a new frozen production audit proves quality. Earlier snapshots and failure evidence are preserved.

## Discovery and selection

Current public Opire catalogue discovery runs alongside the existing three GitHub queries. The adapter decodes the public server-rendered `initialRewards` JSON as data; it never executes source scripts. It captures exact GitHub URLs, provider listing IDs/URLs, USD-cent advertised totals, language, trying/claiming counts and retrieval provenance. It does not treat catalogue entries as verified task listings. The public initial page is bounded (30 entries observed), not exhaustive. Format changes return an explicit unavailable state.

GitHub and Opire observations merge by case-insensitive canonical issue URL. Provider-only issue state is UNKNOWN until fetched from GitHub. Up to ten provider originals receive medium checks for issue state, assignment, comment count and public repository/fork identity. These reads are reused during deep enrichment.

Preliminary selection is independent of final scores. Direct reward/task/provider signals, familiar stack and reasonable reward band prioritize investigation; UNKNOWN payment remains eligible. High comment count is only a bounded-cost penalty, never a popularity bonus. Fork status reduces preliminary priority without automatically invalidating legitimate fork development. Select one candidate per resolved repository first, then a second if needed; never more than two. Known mirror targets share the canonical repository cap and canonical duplicates cannot consume multiple slots. Five selected tasks should span at least three repositories when available.

## Transport and API cost

The shared budget records endpoint/category, HTTP status, authentication Boolean, sanitized failure body/message, x-ratelimit-limit/remaining/reset, retry-after and failure class. It never stores request authorization headers or token values. An optional dedicated ABH_GITHUB_TOKEN takes precedence over the existing application GITHUB_TOKEN; no connector credential is copied or reused.

Classifications: RATE_LIMIT, SECONDARY_RATE_LIMIT, PERMISSION, ENDPOINT_RESTRICTION, UNKNOWN. Primary limits stop the affected core/search resource until reset. Secondary limits pause all GitHub requests, respecting retry-after and at least a minute. Permission/restriction failures are not retried. Only transient 5xx responses get one short retry if budget remains. GitHub requests are serialized; public repository files may overlap.

Limits: 120 source requests, 50-second collection deadline, eight seconds per source; one page of 100 comments, one page of 100 search results, at most ten PR detail reads. Deeper timeline retrieval is reserved for selected candidates with bounded comments/PR search sets. Skipped/truncated/failed coverage stays PARTIAL and cannot establish LOW competition or HUNT. Assignees, provider attempts/claims and direct PR links contribute without assuming they describe disjoint serious competitors.

Public repository metadata/tree are cached per repository. README, CONTRIBUTING, present build manifests and up to two workflows are read from raw.githubusercontent.com after public GitHub metadata/tree verification, saving REST quota. Authorization is never sent to raw or provider hosts. Commands remain data; builds/tests of bounty repositories are NOT executed. Missing commands are UNKNOWN, and missing files/truncated trees remain incomplete.

Official error-handling reference: https://docs.github.com/en/rest/using-the-rest-api/troubleshooting-the-rest-api . Live 403 diagnosis belongs in the frozen audit; prior unclassified 403 responses cannot be retroactively identified with certainty.

## Payment and competition

Each exact Opire detail page must link the same canonical GitHub issue before listingVerified becomes true. The parser handles actual server-rendered punctuation/whitespace, captures reward availability/counts, paid counts, trying/claiming totals and language, and excludes unrelated catalogue totals below the task summary.

Original task advertisements are retained separately from provider totals. Provider extraction does not replace the original title or bypass grant/safety/assignment/funding-denial gates. An exact public listing with unknown issuer remains PARTIAL, never STRONG or VERIFIED. Funding remains PAY_ON_ACCEPTANCE, not secured funds. Provider mechanics: https://docs.opire.dev/overview/getting-started and https://docs.opire.dev/rewards/lifecycle . Stripe/no-retained-funds configuration remains the supplied current provider behavior; do not claim per-issuer escrow.

Provider trying/claiming counts are exposed separately from observed GitHub competitors and submissions. Without a defensible cross-source actor mapping, nonzero provider counts leave combined active competitors UNKNOWN; they do not establish LOW even when counts happen to equal GitHub counts. Existing scoring weights and HUNT thresholds remain intact; new evidence is fed into those calculations.

## Scope and dependencies

Individual Markdown checkboxes, numbered requirements, requirements/deliverables sections and Must/Include/Tested-on lines become deliverables. Headings, fenced examples, quotes and recognized injection directives are excluded. The actual earlier n8n issue now yields all eight explicit deliverables, scope clarity 75 (previously 15), Claude API credential, delivery account/webhook and n8n runtime dependencies.

Structured dependency provisioning categories are EASY_TO_PROVISION, USER_INPUT_REQUIRED, PAID_RESOURCE and HARD_BLOCKER; unrecognized requirements remain limitations/UNKNOWN. Public model APIs are not automatically hard-rejected. Physical devices, private infrastructure and mainnet funds retain hard-blocker handling. Unresolved user-provided/paid resources prevent HUNT; they cannot trigger credential disclosure or provisioning actions. Repository-derived dependencies retain source URLs.

FULLY_ENRICHED requires BASIC_SCREENED plus SOURCE_RESOLVED, PAYMENT_CHECKED, COMPETITION_CHECKED, REPO_CHECKED, SCOPE_CHECKED and DEPENDENCY_CHECKED. Completion means bounded inspection finished, not that funding or execution was proved. Final score is absent on incomplete enrichment. HUNT still requires every evidence gate; legitimate but unattractive fully inspected tasks can be SKIP.

## Validation and persistence

The pre-deployment suite preserves all earlier coverage, updating the five-candidate cache fixture to span three repositories under the new cap. New tests cover catalogue parsing, provider-originated five-task completion, canonical merge/diversity, exact listing whitespace, original-title rejection preservation, failure diagnosis/backoff/redaction, implicit dependencies and the eight workflow deliverables. Final totals are recorded in the production audit.

Local direct-network collector preflight could not establish reliable transport (timeouts); it is not a production scan or quality certificate. Public Opire catalogue/detail HTML was successfully inspected separately and used to validate the parser. Production runtime must independently verify sources.

Existing dedicated ABH JSONB snapshots persist the added evidence without schema changes; phase remains the existing 2.2 storage envelope. Runtime revision identifies this remediation. Normal scan responses use no-store to avoid hidden stale-while-revalidate scans; snapshot/history reads remain read-only. No database rebuild, history rewrite, scheduler or third-party bounty action was added.
