const base = {
  id: "100", number: 10, source: "github", title: "$150 USD bounty: fix parser", body: "## Acceptance criteria\n- Reproduce parser failure\n- Fix src/parser.ts\n- Add regression tests\n- npm test passes\nPayment on approved merge via Algora.",
  labels: ["bounty", "bug", "good first issue"], url: "https://github.com/acme/parser/issues/10", repository: "acme/parser",
  repositoryUrl: "https://github.com/acme/parser", state: "open", updatedAt: "2026-09-08T00:00:00Z", comments: 0, assignees: [], issuer: "maintainer", isPullRequest: false
};
const repo = { archived: false, language: "TypeScript", size: 3200, pushed_at: "2026-09-08T00:00:00Z", stargazers_count: 250, open_issues_count: 12 };
const rootEntries = ["README.md", "CONTRIBUTING.md", "package.json", "tsconfig.json", ".github", "tests"].map((name) => ({ name }));
export const deep = { analysisDepth: "deep", repo, rootEntries, repoDetails: { workflows: [{ name: "test.yml" }], packageJson: { scripts: { test: "node --test" } } }, comments: [], solutionPRs: [], tokenPrices: { ETH: 2500 } };
export const fixtures = {
  excellent: base,
  competitive: { ...base, id: "101", number: 11, title: "$2,000 USD bounty: redesign architecture", body: `${base.body}\nRewrite the entire architecture.` },
  assigned: { ...base, id: "102", number: 12, assignees: ["alice"] },
  fake: { ...base, id: "103", number: 13, title: "Guaranteed $500 bounty", body: "Pay registration fee and send seed phrase to receive work." },
  token: { ...base, id: "104", number: 14, title: "500000 RTC bounty", body: "Reward 500000 RTC after approval." },
  upwork: { ...base, id: "105", number: 15, body: "Apply and get paid through Upwork.com for this task. $150 USD." },
  grant: { ...base, id: "106", number: 16, title: "$500 grant application", body: "Submit a grant proposal requesting funding." },
  mirror: { ...base, id: "107", number: 17, repository: "bot/bounty-radar", repositoryUrl: "https://github.com/bot/bounty-radar", body: "Mirrored from original issue: https://github.com/a/b/issues/1 — $100 USD" },
  stale: { ...base, id: "108", number: 18, updatedAt: "2023-01-01T00:00:00Z" },
  clearBug: { ...base, id: "109", number: 19, title: "$80 USDC: add API timeout test", body: "- Add timeout fixture\n- Update api/client.py\n- pytest passes\nPaid on merge via Gitcoin." },
  inquiry: { ...base, id: "110", number: 20, title: "Bounty inquiry: parser fix ($50)", body: "Is this still funded? Please confirm payout." },
  scanReport: { ...base, id: "111", number: 21, title: "Live scan update", body: "No opportunity has been PASS-qualified or selected. Observed a $20 USD example." }
};
