# Economic learning from actual operations

`summarizeSourceEconomics(operations, sourceDiscoveryResults)` is a pure descriptive summary. It does not modify ranking, payment trust, admission, live state, or source qualification. It makes no network requests and cannot independently authenticate referenced receipts: callers must supply the trusted operation ledger and verified observations. A status, advertised bounty, pending payment, or benchmark result is never payment evidence.

The return value contains `sampleSize`, `excludedOperations` and a `providers` map. Providers are generic names, including GitHub maintainer, Opire, and future qualified sources. An absent provider means no supplied observations, not no opportunities in the market.

## Operation metrics

Each opportunity is counted once, using the highest operation version, then latest `updatedAt` for ties. Explicit simulation/historical/benchmark flags or modes, dedicated replay IDs (such as SIMULATION/, ABH-BENCH and job-N), and known local benchmark-artifact references are excluded; if any supplied version marks an identity as a replay, every version of that identity is quarantined. Known benchmark-artifact references include docs/operations/benchmarks and abh-benchmark-jobs. Ordinary titles, categories and external source paths mentioning historical data or performance benchmarks do not exclude real work. No benchmark outcomes are imported into economic learning.

| Field | Required observation |
| --- | --- |
| `observedOpportunities` | Unique actual operation identity in the trusted ledger; not a completed outcome |
| `proofs` | Referenced proof with setup, reproduction and focused tests all PASS |
| `reservationsOrAssignments` | Referenced, confirmed reservation with active bounty and confirmed scope |
| `submissions` | Actual submission URL and revision matching the solution at a SUBMITTED transition, or retained evidence on a submitted/reviewed/merged/paid projection |
| `accepted` | MERGED/PAID evidence with merge reference and commit, or confirmed received payment |
| `paid` | PAID event/projection, confirmed positive finite amount, explicit currency and receipt reference |
| `realizedRewardsByCurrency` | Per-currency sample count, total, average, and receipt references; no exchange conversion or cross-currency aggregate |
| `actualEffort` | Finite nonnegative recorded effort with a work/outcome reference; estimates excluded |
| `maintainerResponses` | Verified request/reply pair, both references, valid ordered timestamps; average in minutes |
| `disputes` | UNKNOWN unless an explicit verified observation exists; absence of reports does not imply no disputes |
| `reliability` | UNKNOWN until a referenced accepted/paid or completed failed execution outcome; descriptive outcomes, never a platform trust guarantee |

Historical operational transitions are replayed in version order with their evidence deltas. Thus a real submission is retained after merge, payment, or a later review cycle changes the current solution revision. This is actual operation history, distinct from excluded historical benchmark replays. Counts describe unique opportunities, not numbers of PR revisions or repeated proof attempts.

An explicit `verified: false` on proof, reservation, submission, merge, payment or effort evidence prevents that observation from qualifying. Existing operation evidence gates do not require a separate `verified: true` where structured proof/confirmation fields already establish the observation. References and required fields are checked locally; this is not a replacement for evidence collection.

Realized rewards use `evidence.payment.{confirmed,amount,currency,reference}`. Currency codes are trimmed and uppercased but never converted. Each paid operation contributes one received-payment sample, not a sum of installment events. Add an explicit installment schema before using this summary for multiple receipts per operation. Pending payments contribute no income and no payment failures.

Actual effort uses referenced `evidence.outcome.effortMinutes` or `evidence.effort.{minutes,reference}`, once per operation. Zero is a valid recorded sample. Missing effort produces a null average, not zero effort.

Maintainer response observations use `evidence.maintainerResponse` or `evidence.maintainerResponses[]`:

- `verified: true`
- `requestedAt`, `respondedAt` as timestamps
- `requestReference`, `reference` identifying the request and maintainer reply

Duplicate request/reply references count once per operation. Waiting time is not a response. Operation creation/update timestamps are never substituted for interaction timestamps.

Dispute observations use `evidence.dispute.{verified,status,reference}`; recognized statuses are NONE, OPEN, RESOLVED and DISMISSED. NONE requires an actual verified check. Failed execution uses the existing outcome schema (`completed: true`, `result: FAILED`, `reference`) on an ABANDONED, DO_NOT_HUNT or REJECTED operation. A qualification rejection is not a failed execution. Reliability observations retain their references and do not infer future acceptance or payout rates.

## Bounded discovery, kept separate

`sourceDiscoveryResults` is an array of `{provider, checkedAt, sourceUrl, status, listings, coverage: {bounded: true}}`. `opportunities` is accepted as an alias for `listings`, and `reference` as an alias for `sourceUrl`.

Only identifiable listing records with their own URL count. Identity is `opportunityId`, falling back to URL. Duplicate sightings are deduplicated per provider across the supplied observations; provider-reported total counts are not treated as inspected listings. Duplicate provider/source/time observations count once. Simulation and benchmark listings are excluded.

`discovery.observedListings` is the union actually observed in the supplied bounded results, **not a market total or guaranteed current availability**. `discovery.observations` retains source URLs, timestamps and statuses. Discovery records never increase operational attempts, proofs, submissions, accepted work or income.

## Verification

`node --test test/source-economics.test.js` covers version deduplication; post-merge historical submissions; simulation/benchmark exclusion; separate-currency receipt averages; pending/unverified payments; evidence-free status claims; actual effort; response references and chronology; unknown disputes/reliability; bounded catalogue isolation; generic provider names and input immutability. Fixtures are unit-test inputs only and are never appended to operational records.
