const EASY_LABELS = new Set(["good first issue", "beginner", "easy", "first-timers-only"]);
const SCOPE_LABELS = new Set(["bug", "documentation", "docs", "tests", "test", "frontend"]);
const RISK_LABELS = new Set(["security", "critical", "breaking-change", "needs-design"]);

export function moneySignal(issue) {
  const text = `${issue.title ?? ""} ${issue.body ?? ""} ${(issue.labels ?? []).join(" ")}`;
  return /(?:\$|usd\s?|usdc\s?|dai\s?|eth\s?|reward|bounty|paid|prize)\s*\d|\d\s*(?:usd|usdc|dai|eth)|\bbounty\b/i.test(text);
}

export function normalizeIssue(item) {
  const labels = (item.labels ?? []).map((label) =>
    typeof label === "string" ? label.toLowerCase() : String(label.name ?? "").toLowerCase()
  );
  return {
    id: String(item.id),
    source: "github",
    title: item.title,
    url: item.html_url,
    repository: item.repository_url?.split("/repos/")[1] ?? "unknown",
    labels,
    body: item.body ?? "",
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    comments: Number(item.comments ?? 0),
    assignee: item.assignee?.login ?? null,
    isPullRequest: Boolean(item.pull_request)
  };
}

export function qualify(issue, now = new Date()) {
  const reasons = [];
  let score = 35;
  const labels = new Set(issue.labels ?? []);
  const ageDays = Math.max(0, (now - new Date(issue.updatedAt)) / 86_400_000);
  const hasMoney = moneySignal(issue);

  if (!hasMoney) reasons.push("No explicit reward signal");
  else { score += 25; reasons.push("Explicit reward signal"); }

  if ([...labels].some((label) => EASY_LABELS.has(label))) {
    score += 18;
    reasons.push("Beginner-friendly label");
  }
  if ([...labels].some((label) => SCOPE_LABELS.has(label))) {
    score += 10;
    reasons.push("Likely bounded implementation scope");
  }
  if (issue.comments <= 5) score += 5;
  else { score -= 8; reasons.push("High competition/discussion"); }
  if (ageDays <= 14) score += 7;
  else if (ageDays > 90) { score -= 25; reasons.push("Stale opportunity"); }
  if (issue.assignee) { score -= 30; reasons.push("Already assigned"); }
  if ([...labels].some((label) => RISK_LABELS.has(label))) {
    score -= 25;
    reasons.push("High-risk label");
  }

  score = Math.max(0, Math.min(100, score));
  const rejected = issue.isPullRequest || !hasMoney || Boolean(issue.assignee) || ageDays > 180;
  return {
    ...issue,
    score,
    decision: rejected ? "REJECT" : score >= 75 ? "SHORTLIST" : score >= 55 ? "REVIEW" : "REJECT",
    reasons
  };
}

export function deduplicate(items) {
  return [...new Map(items.map((item) => [`${item.source}:${item.id}`, item])).values()];
}
