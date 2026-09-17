# Superteam Earn and Gitpay qualification — 2026-09-17

Research began only after the Stage1 report and freeze existed. All checks were read-only. No account, agent registration, claim, public comment, submission, terms acceptance, wallet action or spending occurred. Machine-readable evidence and sanitized listing samples are in `superteam-gitpay.json`.

## Superteam Earn — ADD_NOW, discovery only

The official agent interface is active and explicitly permits agent work for `AGENT_ALLOWED` and `AGENT_ONLY`. The canonical host is now `https://superteam.fun`; the old earn subdomain redirects. Agent submissions use a bearer key, and a human claims any award through a claim code after completing a talent profile. Registration itself creates a profile/key/code, so it remains owner controlled. Agents do not perform OAuth, wallet signing or KYC. Projects additionally require the human's Telegram URL. [Official agent guide](https://superteam.fun/earn/agents)

An intentionally public catalogue is used by the [agent listings page](https://superteam.fun/earn/agents/listings):

```text
GET https://superteam.fun/api/listings?context=agents&tab=all&category=All&status=open&sortBy=Date&order=asc
```

Observed HTTP200: **2 listings**, both allowed agents and verified sponsors. `category=Development` returns **1 technical listing**. The public handler and query builder explicitly support this agent context without authentication; this is not a workaround for the authenticated Agent API. There is no pagination parameter in this public schema. Client validation must still check access policy, open status, deadline, winners and sponsor. [Official handler](https://github.com/SuperteamDAO/earn/blob/721bb5f06838e27b2643e8ad224775e1cd5e9c3a/src/app/api/listings/route.ts), [query rules](https://github.com/SuperteamDAO/earn/blob/721bb5f06838e27b2643e8ad224775e1cd5e9c3a/src/features/listings/utils/query-builder.ts)

The technical listing is a **10,000 USDG hackathon prize pool**, deadline October13, not a guaranteed individual reward or a $25–$300 early win. Its public page describes frontend/backend/mobile work and labels the listing Global; detailed eligibility still needs confirmation. The other listing is a $1,000 content bounty. **Zero primary-lane opportunities or new proofs were promoted.** [Technical listing](https://superteam.fun/earn/listing/colosseum-crypto-worlds-fair-hackathon-superteam-vietnam-track/)

`GET /api/agents/listings/live?take=20` correctly returned401 without a key. Its configured mode supports take1–50, type, deadline lower bound, and repeated `excludeIds[]`; details use `/api/agents/listings/details/{slug}`. Neither key nor claim code was created. Public response fields include reward/token, agentAccess, status, deadline, sponsor verification and submission count. [Official endpoint implementation](https://github.com/SuperteamDAO/earn/blob/721bb5f06838e27b2643e8ad224775e1cd5e9c3a/src/pages/api/agents/listings/live.ts)

Bounties/hackathons are competitive selections; projects need their own assignment terms. Sponsor terms control payment; escrow and payment are not guaranteed. Tokens vary. Platform terms exclude sanctioned or legally prohibited participation and leave tax/payment obligations with participants. Kuwait-specific token payout eligibility was **not established**: do not assume it or create a payout claim. Discovery can proceed while the owner reviews an actual prospective engagement. [Terms effective June24,2026](https://superteam.fun/earn/terms-of-use.pdf)

Owner setup when useful: approve registration; securely configure its key; sign in and complete the human talent profile; verify permissible payout/wallet and any identity requirements; supply Telegram only for projects that require it. After a genuine win, the owner personally reviews and confirms the claim. GitHub OAuth is not required by the documented agent interface.

## Gitpay — MONITOR

The platform and public technical catalogue are active. `GET https://gitpay.me/tasks/list?status=open` returned **87 open task records**, all with displayed reward value0. `status=open&hasBounty=true&limit=50&offset=0` returned `{"data":[],"totalCount":0}`. One old integration task has a20USD order marked succeeded but capturefalse and taskvalue0; that is not treated as a confirmed bounty. **Zero current $25–$300 funded opportunities verified.** [Live catalogue](https://gitpay.me/tasks/list?status=open), [funded filter](https://gitpay.me/tasks/list?status=open&hasBounty=true&limit=50&offset=0)

The stable public route supports discovery; paginated results use `{data,totalCount}`. Nevertheless, no adapter is justified yet: current payable work and AI participation remain unverified. Reviewed official rules do not explicitly permit or prohibit autonomous engineering. Unknown means investigate, not reject. [Official public route](https://github.com/worknenjoy/gitpay/blob/ab2f9489f01cb4e1c744af9230cc7a4c4462d99c/src/app/routes/tasks.ts)

Gitpay requires applying and **waiting for assignment before delivery**. Claims verify the underlying GitHub assignee; delivery acceptance precedes payment. Assigned/Assigns metadata plus canonical issue/PR checks help assess competition. [Contributor workflow](https://docs.gitpay.me/docs/en/contributor/), [claim rules](https://docs.gitpay.me/docs/en/claims/)

Human setup, if later added: verify account/email, complete profile, link GitHub and personally accept terms. Payouts use Stripe Connect, Whop or some PayPal accounts depending on funding/configuration; country eligibility and identity/bank checks are not assumed. Whop's hosted flow determines available withdrawal methods. No Kuwait payout support was confirmed. [Account setup](https://docs.gitpay.me/docs/en/getting-started-contributor/), [payout methods](https://docs.gitpay.me/docs/en/payouts/), [Whop setup](https://docs.gitpay.me/docs/en/whop-payout-setup/)

Keep realized performance separate: both sources currently have **0 ABH assignments, submissions, accepted work and payments**. Public raw Gitpay responses contain unnecessary payment/user identifiers; only sanitized task summaries and aggregates are retained.
