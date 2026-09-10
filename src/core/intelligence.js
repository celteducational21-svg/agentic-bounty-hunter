const DAY = 86_400_000;
const STABLECOINS = new Set(["USD", "USDC", "USDT", "DAI"]);
const KNOWN_MARKET_TOKENS = new Set(["ETH", "BTC", "SOL"]);
const FIAT_SYMBOLS = { "$": "USD", "€": "EUR", "£": "GBP" };
const TARGET_STACK = /\b(python|typescript|javascript|node(?:\.js)?|fastapi|api|mcp|n8n|postgres(?:ql)?|sql|react|next(?:\.js)?|ci\/?cd|github actions|test(?:ing)?|documentation|sdk)\b/i;
const HIGH_COMPLEXITY = /\b(architecture|redesign|rewrite|entire|full[- ]stack|multi[- ]week|kernel|compiler|cryptograph|zero[- ]knowledge|hardware|firmware|ios device|android device)\b/i;
const PRIVATE_DEPENDENCY = /\b(private (?:api|repository|infrastructure|network)|internal (?:api|system|environment)|proprietary data|paid account required)\b/i;
const CLAIM_RE = /(?:^|\b)(?:\/try|\/attempt|\/opire\s+try|i(?:'| a)?m working on this|i would like to work on this|i'd like to work on this|can i work on this|claim(?:ing)? this|bounty claim|claim\s*[—:-])(?:\b|$)/i;
const ABANDONED_RE = /\b(?:unclaim|abandon(?:ed|ing)?|no longer working|giving up|withdraw)\b/i;
const INJECTION_RE = /ignore (?:all |any )?(?:previous|prior|system) instructions|reveal (?:your |the )?(?:secret|token|environment)|print env|cat \.env|send (?:funds|wallet)|override (?:policy|approval)|exfiltrat/i;

function clamp(value) { return Math.max(0, Math.min(100, Math.round(value))); }
function textOf(issue) { return `${issue.title ?? ""}\n${issue.body ?? ""}\n${(issue.labels ?? []).join(" ")}`; }
function evidence(type, detail, url = null) { return { type, detail, ...(url ? { url } : {}) }; }

export function stableOpportunityId(issue) {
  const [owner = "unknown", repo = "unknown"] = String(issue.repository ?? "unknown/unknown").split("/");
  const number = issue.number ?? issue.id;
  return `ABH-GH-${owner}-${repo}-${number}`.replace(/[^A-Za-z0-9-]/g, "-");
}

export function normalizeIssue(item) {
  const labels = (item.labels ?? []).map((label) =>
    typeof label === "string" ? label.toLowerCase() : String(label.name ?? "").toLowerCase()
  );
  const repository = item.repository_url?.split("/repos/")[1] ?? item.repository ?? "unknown/unknown";
  return {
    id: String(item.id), number: Number(item.number ?? item.id), source: "github",
    title: item.title ?? "Untitled issue", body: item.body ?? "", labels,
    url: item.html_url ?? item.url, apiUrl: item.url ?? null,
    repository, repositoryUrl: `https://github.com/${repository}`,
    commentsUrl: item.comments_url ?? null, createdAt: item.created_at ?? item.createdAt,
    updatedAt: item.updated_at ?? item.updatedAt, closedAt: item.closed_at ?? null,
    state: item.state ?? "open", comments: Number(item.comments ?? 0),
    assignees: (item.assignees ?? (item.assignee ? [item.assignee] : [])).map((x) => x.login ?? x),
    issuer: item.user?.login ?? item.issuer ?? null, authorAssociation: item.author_association ?? "UNKNOWN",
    isPullRequest: Boolean(item.pull_request ?? item.isPullRequest)
  };
}

export function detectPromptInjection(value) {
  const matches = String(value ?? "").split(/\r?\n/).filter((line) => INJECTION_RE.test(line)).slice(0, 5);
  return { detected: matches.length > 0, matches, policy: "UNTRUSTED_DATA_ONLY" };
}

export function extractReward(issue, { tokenPrices = {} } = {}) {
  // Code examples and quoted third-party offers are not this issue's payout offer.
  const cleanBody = String(issue.body ?? "").replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, "").replace(/^\s*>.*$/gm, "").replace(/`[^`]*`/g, "");
  const text = textOf({ ...issue, body: cleanBody }).replace(/[,]/g, "");
  const matches = [];
  const patterns = [
    /([$€£])\s*(\d+(?:\.\d+)?)\s*([kK])?/g,
    /\b(\d+(?:\.\d+)?)\s*([kK])?\s*(USD|USDC|USDT|DAI|ETH|BTC|SOL)\b/gi,
    /\b(?:reward|bounty)[-_ :]*(\d+(?:\.\d+)?)\s*([kK])?[-_ ]*([A-Z]{2,10})\b/gi,
    /\b(\d+(?:\.\d+)?)\s*([kK])?\s*([A-Z]{2,10})\s+bounty\b/gi
  ];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const symbol = FIAT_SYMBOLS[match[1]];
      const amountIndex = symbol ? 2 : 1;
      const suffixIndex = symbol ? 3 : 2;
      const currencyIndex = symbol ? null : 3;
      const amount = Number(match[amountIndex]) * (String(match[suffixIndex] ?? "").toLowerCase() === "k" ? 1000 : 1);
      const currency = symbol ?? String(match[currencyIndex] ?? "USD").toUpperCase();
      if (Number.isFinite(amount) && amount > 0) matches.push({ amount, currency, raw: match[0], position: match.index });
    }
  }
  const unique = [...new Map(matches.sort((a, b) => a.position - b.position).map((x) => [`${x.amount}:${x.currency}`, x])).values()].sort((a, b) => a.position - b.position);
  const selected = unique[0] ?? null;
  const platformMatch = text.match(/\b(gitcoin|grantfox|algora|openq|dework|bountysource|issuehunt|polar)\b/i);
  const triggerMatch = text.match(/\b(?:paid?|payment|payout|reward)(?:ed)?\s+(?:upon|on|after)\s+([^\n.!]{3,80})/i);
  const conditional = /\b(?:maybe rewarded|may be eligible|potential reward|reward not guaranteed)\b/i.test(text);
  if (!selected) return {
    rewardAmount: null, rewardCurrency: null, rewardRange: null, rewardUsdEstimate: null, rewardConfidence: 0,
    paymentMethod: platformMatch?.[1] ?? "UNKNOWN", paymentTrigger: triggerMatch?.[1]?.trim() ?? "UNKNOWN",
    paymentRisk: "HIGH", credibleMarketValue: false,
    evidence: [evidence("reward", "No explicit numeric reward found", issue.url)]
  };
  let usd = null;
  let marketCredible = STABLECOINS.has(selected.currency);
  if (marketCredible) usd = selected.amount;
  else if (KNOWN_MARKET_TOKENS.has(selected.currency) && Number(tokenPrices[selected.currency]) > 0) {
    usd = selected.amount * Number(tokenPrices[selected.currency]); marketCredible = true;
  }
  const confidence = clamp(35 + (usd !== null ? 25 : 0) + (platformMatch ? 20 : 0) + (triggerMatch ? 20 : 0) - (conditional ? 25 : 0));
  return {
    rewardAmount: selected.amount, rewardCurrency: selected.currency,
    rewardRange: (() => { const values = unique.filter((x) => x.currency === selected.currency).map((x) => x.amount); return values.length > 1 ? { min: Math.min(...values), max: Math.max(...values), currency: selected.currency } : null; })(),
    rewardUsdEstimate: usd === null ? null : Math.round(usd * 100) / 100,
    rewardConfidence: confidence, paymentMethod: platformMatch?.[1] ?? "UNKNOWN",
    paymentTrigger: triggerMatch?.[1]?.trim() ?? "UNKNOWN",
    paymentRisk: usd === null || conditional ? "HIGH" : platformMatch && triggerMatch ? "LOW" : "MEDIUM",
    credibleMarketValue: marketCredible,
    evidence: [evidence("reward", `${selected.raw.trim()} extracted from original issue`, issue.url)]
  };
}

export function analyzeLegitimacy(issue, reward, context = {}) {
  const text = textOf(issue);
  const commentText = (context.comments ?? []).filter((x) => ["OWNER", "MEMBER", "COLLABORATOR"].includes(x.author_association)).map((x) => x.body ?? "").join("\n");
  const repo = String(issue.repository ?? "");
  const findings = [];
  let score = 50;
  let rejectionReason = null;
  const reject = (reason) => { rejectionReason ??= reason; findings.push(evidence("legitimacy", reason, issue.url)); };
  const repost = text.match(/Originally posted by[^\n]*?(https:\/\/github\.com\/([^/\s]+\/[^/\s]+)\/issues\/\d+)/i);
  if (repost && repost[2].toLowerCase() !== repo.toLowerCase()) { reject("Explicit repost of another repository's issue"); findings.push(evidence("original_source", "Repost links to original issue; original must be evaluated independently", repost[1])); }
  if (/upwork\.com|\bupwork\b/i.test(text)) reject("Upwork-routed task");
  if (/\bbounty inquiry\b|\bis (?:this|it) still funded\b|\bbounty(?:\s+#\d+)?[^:\n]*:\s*(?:eligibility|question|inquiry)\b/i.test(text)) reject("Bounty inquiry, not an original issuer task");
  if (/\b(?:field|live) (?:run|scan)\b/i.test(issue.title ?? "") && /\bno (?:opportunity|candidate).{0,40}(?:selected|qualified|pass)\b/i.test(text)) reject("Status/report issue rather than a software bounty");
  if (/\b(?:not|hasn'?t) (?:been )?(?:approved|funded)|(?:bounty|reward).{0,30}(?:not (?:been )?approved|not (?:been )?funded|proposed only)\b/i.test(commentText)) reject("Reward is proposed but not approved/funded");
  if (/\bgrant (?:application|proposal|request)|apply for (?:a )?grant\b/i.test(text)) reject("Grant/application rather than delivery bounty");
  if (/\b(?:sweepstake|giveaway|lottery|donation request)\b/i.test(text)) reject("Reward unrelated to software delivery");
  if (/\b(?:bounty[-_ ]?(?:radar|mirror|aggregator|scout|plaza|board|hub)|reward[-_ ]?radar)\b/i.test(repo) || /mirror(?:ed)? from|original (?:bounty|issue):|bounty alert:.*(?:new )?opportunit/i.test(text)) reject("Likely bounty mirror/repost");
  if (/\b(?:send seed phrase|guaranteed profit|pay registration fee|deposit first)\b/i.test(text)) reject("Obvious scam/fraud indicator");
  if (/\b(?:no ai|ai contributions? (?:are )?(?:not allowed|prohibited)|human-written only)\b/i.test(text)) reject("Bounty explicitly disallows AI contributions");
  if (/\b(?:hack|exploit)\b/i.test(text) && !/authorized|security policy|bug bounty/i.test(text)) reject("Security work lacks clear authorization");
  if (context.repo?.archived) reject("Repository is archived");
  if (issue.state !== "open" || issue.closedAt) reject("Issue is closed/completed");
  if (issue.isPullRequest) reject("Search result is a pull request, not a bounty issue");
  if (reward.rewardAmount !== null) { score += 20; findings.push(evidence("legitimacy", "Explicit numeric reward", issue.url)); }
  if (reward.credibleMarketValue) score += 10;
  if (reward.paymentMethod !== "UNKNOWN") score += 10;
  if (context.repo && !context.repo.archived && (context.repo.stargazers_count ?? 0) >= 5) score += 5;
  if (context.repo?.pushed_at && Date.now() - new Date(context.repo.pushed_at) < 90 * DAY) score += 5;
  if (reward.rewardAmount === null) reject("Payout cannot be reasonably established");
  if (context.analysisDepth === "deep" && reward.paymentMethod === "UNKNOWN") reject("Payout mechanism is unverified; advertised amount is not payment evidence");
  if (reward.rewardAmount !== null && !reward.credibleMarketValue) findings.push(evidence("legitimacy", "Token value/liquidity is unverified", issue.url));
  return { legitimacyConfidence: clamp(rejectionReason ? Math.min(score, 25) : score), rejectionReason, evidence: findings };
}

export function analyzeCompetition(issue, comments = [], solutionPRs = []) {
  const claims = new Map();
  const evidenceItems = [];
  const ordered = [...comments].sort((a, b) => (Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0));
  for (const comment of ordered) {
    const body = comment.body ?? ""; const actor = comment.user?.login ?? comment.author ?? "unknown";
    if (ABANDONED_RE.test(body)) { claims.delete(actor); continue; }
    if (CLAIM_RE.test(body)) { claims.set(actor, comment); evidenceItems.push(evidence("claim", `${actor}: ${body.slice(0, 100)}`, comment.html_url)); }
  }
  const uniquePRs = [...new Map(solutionPRs.map((pr) => [pr.html_url, pr])).values()];
  // A reference or an unmerged implementation is not proof the bounty was completed.
  const completed = uniquePRs.filter((pr) => pr.merged_at && pr.closesIssue === true);
  const openPRs = uniquePRs.filter((pr) => pr.state === "open");
  const submittedSolutions = comments.filter((comment) => /\b(?:completed (?:the )?implementation|already fully implemented|implementation (?:is )?complete).{0,120}\b(?:pr|pull request)\b/i.test(comment.body ?? ""));
  const labelClaimed = (issue.labels ?? []).some((x) => /^(?:claimed|assigned|in progress)$/i.test(x));
  const actors = new Set(claims.keys());
  for (const pr of openPRs) actors.add(pr.user?.login ?? pr.author ?? `unknown-pr:${pr.html_url}`);
  for (const comment of submittedSolutions) actors.add(comment.user?.login ?? comment.author ?? `unknown-comment:${comment.html_url}`);
  const activeCompetitors = Math.max(actors.size, labelClaimed ? 1 : 0);
  const repeatable = /\b(?:multi[- ]claim|repeatable bounty|multiple (?:contributors|winners) (?:can|may)|per contributor)\b/i.test(textOf(issue));
  let claimStatus = "AVAILABLE";
  if ((issue.assignees ?? []).length) claimStatus = "ASSIGNED";
  else if (completed.length && !repeatable) claimStatus = "COMPLETED_SOLUTION";
  else if (openPRs.length || submittedSolutions.length) claimStatus = "SUBMITTED";
  else if (activeCompetitors) claimStatus = "CLAIMED";
  const score = claimStatus === "ASSIGNED" || claimStatus === "COMPLETED_SOLUTION" ? 0
    : activeCompetitors === 0 ? 100 : activeCompetitors === 1 ? 78 : activeCompetitors === 2 ? 58 : activeCompetitors <= 4 ? 32 : 10;
  return {
    activeCompetitors, claimStatus, repeatable, existingSolutionPRs: uniquePRs.map((pr) => ({ title: pr.title, url: pr.html_url, state: pr.state, author: pr.user?.login ?? pr.author ?? null, mergedAt: pr.merged_at ?? null, closesIssue: pr.closesIssue ?? null })),
    competitionScore: score,
    competitionEvidence: [
      ...(issue.assignees ?? []).map((x) => evidence("assignment", `Assigned to ${x}`, issue.url)),
      ...evidenceItems, ...submittedSolutions.map((x) => evidence("submitted_solution", x.body.slice(0, 140), x.html_url)),
      ...uniquePRs.map((pr) => evidence("pull_request", `${pr.merged_at ? "merged" : pr.state}: ${pr.title}`, pr.html_url))
    ]
  };
}

export function analyzeRepository(repo = {}, rootEntries = [], details = {}, now = new Date()) {
  const names = new Set(rootEntries.map((x) => String(x.name ?? x).toLowerCase()));
  const pushedDays = repo.pushed_at ? (now - new Date(repo.pushed_at)) / DAY : 9999;
  const hasReadme = [...names].some((x) => /^readme/.test(x));
  const hasContributing = names.has("contributing.md");
  const hasTests = [...names].some((x) => /^(test|tests|spec|__tests__)$/.test(x));
  const hasCI = Array.isArray(details.workflows) ? details.workflows.some((x) => /\.ya?ml$/i.test(x.name ?? "")) : null;
  const hasPackage = ["package.json", "pyproject.toml", "requirements.txt", "cargo.toml", "go.mod"].some((x) => names.has(x));
  const hasLint = ["eslint.config.js", ".eslintrc", "ruff.toml", ".pre-commit-config.yaml"].some((x) => names.has(x));
  const hasTypes = names.has("tsconfig.json") || names.has("mypy.ini");
  let health = 25 + (repo.archived ? -60 : 0) + (pushedDays < 30 ? 25 : pushedDays < 90 ? 15 : pushedDays < 365 ? 0 : -25)
    + (hasReadme ? 10 : 0) + (hasPackage ? 10 : 0) + (hasCI ? 10 : 0) + (hasTests ? 10 : 0);
  const maintainer = clamp(20 + (pushedDays < 30 ? 45 : pushedDays < 90 ? 30 : pushedDays < 365 ? 10 : -10) + Math.min(20, Number(repo.open_issues_count ?? 0) > 0 ? 10 : 0));
  const testability = clamp(20 + (hasTests ? 35 : 0) + (hasCI ? 20 : 0) + (hasPackage ? 15 : 0) + (hasLint ? 5 : 0) + (hasTypes ? 5 : 0));
  const setup = clamp(15 + (hasReadme ? 30 : 0) + (hasContributing ? 20 : 0) + (hasPackage ? 25 : 0) + (hasCI ? 10 : 0));
  return {
    primaryLanguage: repo.language ?? "UNKNOWN", frameworks: [], packageBuildSystem: [...names].filter((x) => ["package.json","pyproject.toml","requirements.txt","cargo.toml","go.mod"].includes(x)),
    approximateRepoSizeKb: repo.size ?? null, recentCommitActivity: pushedDays < 30 ? "ACTIVE" : pushedDays < 90 ? "RECENT" : pushedDays < 365 ? "SLOW" : "STALE",
    hasReadme, hasContributing, hasTests, hasCI, hasLint, hasTypeChecking: hasTypes,
    buildCommands: details.packageJson?.scripts?.build ? ["npm run build"] : [],
    testCommands: details.packageJson?.scripts?.test ? ["npm test"] : [],
    openPRVolume: details.openPRCount ?? null, archived: Boolean(repo.archived),
    repoHealthScore: clamp(health), maintainerActivityScore: maintainer, testabilityScore: testability, developerSetupScore: setup
  };
}

export function parseAcceptanceCriteria(issue) {
  const body = String(issue.body ?? "");
  const lines = body.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  const criteria = lines.filter((line) => /^(?:[-*]|\d+\.|-?\s*\[[ xX]\])\s+/.test(line))
    .map((line) => line.replace(/^(?:[-*]|\d+\.|-?\s*\[[ xX]\])\s+/, "").trim())
    .filter((line) => line.length >= 8 && line.length <= 220 && !INJECTION_RE.test(line)).slice(0, 12);
  const reproductionSteps = lines.filter((x) => /\b(?:steps to reproduce|reproduction|expected behavior|actual behavior)\b/i.test(x)).slice(0, 6);
  const filesMentioned = [...new Set(body.match(/(?:[\w.-]+\/)+[\w.-]+|\b[\w-]+\.(?:js|ts|tsx|py|go|rs|md|json|ya?ml)\b/g) ?? [])].slice(0, 12);
  const testingRequirements = criteria.filter((x) => /\btest|ci|lint|typecheck|build\b/i.test(x));
  const externalRequirements = lines.filter((x) => /\b(?:api key|external account|paid service|private|hardware|device)\b/i.test(x)).slice(0, 6);
  let score = 20 + Math.min(40, criteria.length * 10) + (reproductionSteps.length ? 15 : 0) + (testingRequirements.length ? 15 : 0) + (filesMentioned.length ? 10 : 0);
  if (body.length < 80) score -= 25;
  if (/\b(?:tbd|to be defined|details later|figure it out|build everything)\b/i.test(body)) score -= 30;
  return { criteria, filesMentioned, reproductionSteps, testingRequirements, documentationRequirements: criteria.filter((x) => /\bdoc|readme|example\b/i.test(x)), externalRequirements, scopeClarityScore: clamp(score) };
}

export function estimateSolvability(issue, acceptance, repository) {
  const text = textOf(issue); let score = 45;
  if (TARGET_STACK.test(text) || TARGET_STACK.test(repository.primaryLanguage)) score += 20;
  if (repository.hasTests) score += 12;
  if (repository.developerSetupScore >= 65) score += 10;
  if (acceptance.scopeClarityScore >= 70) score += 12;
  if (HIGH_COMPLEXITY.test(text)) score -= 30;
  if (PRIVATE_DEPENDENCY.test(text)) score -= 45;
  if (/\b(?:hardware|physical device|ios device|android device|gpu cluster)\b/i.test(text)) score -= 35;
  if (acceptance.externalRequirements.length) score -= 15;
  return { aiSolvabilityScore: clamp(score), evidence: [
    evidence("solvability", repository.hasTests ? "Automated tests detected" : "No root test directory detected", issue.repositoryUrl),
    evidence("solvability", `Scope clarity ${acceptance.scopeClarityScore}/100`, issue.url)
  ] };
}

export function estimateEffort(issue, acceptance, repository) {
  const text = textOf(issue); let points = 1;
  points += Math.ceil(acceptance.criteria.length / 3);
  if (HIGH_COMPLEXITY.test(text)) points += 5;
  if (acceptance.externalRequirements.length) points += 3;
  if (!repository.hasTests) points += 1;
  const bucket = points <= 1 ? "<30 min" : points <= 2 ? "30–90 min" : points <= 4 ? "1.5–4 hours" : points <= 6 ? "4–8 hours" : "8+ hours";
  const attractiveness = { "<30 min": 100, "30–90 min": 95, "1.5–4 hours": 85, "4–8 hours": 55, "8+ hours": 20 }[bucket];
  return {
    effortEstimate: bucket, effortAttractivenessScore: attractiveness,
    expectedFilesChanged: acceptance.filesMentioned.length || (points <= 2 ? "1–3" : points <= 4 ? "2–6" : "UNKNOWN"),
    implementationComplexity: points <= 2 ? "LOW" : points <= 4 ? "MEDIUM" : "HIGH",
    verificationComplexity: repository.hasTests ? "LOW" : "MEDIUM",
    blockerProbability: PRIVATE_DEPENDENCY.test(text) ? "HIGH" : acceptance.externalRequirements.length ? "MEDIUM" : "LOW"
  };
}

export function calculateWinScore(parts) {
  return clamp(
    parts.legitimacyConfidence * .20 + parts.aiSolvabilityScore * .20 + parts.scopeClarityScore * .15 +
    parts.competitionScore * .15 + parts.effortAttractivenessScore * .10 + parts.repoHealthScore * .10 +
    parts.maintainerActivityScore * .05 + parts.rewardAttractivenessScore * .05
  );
}

export function rewardAttractiveness(reward) {
  const usd = reward.rewardUsdEstimate;
  if (usd === null) return 5;
  if (usd < 10) return 10;
  if (usd < 50) return 45;
  if (usd <= 300) return 100;
  if (usd <= 750) return 75;
  return 55;
}

export function hardRejectionReasons(issue, context, reward, legitimacy, competition, solvability) {
  const text = textOf(issue); const reasons = [];
  if (legitimacy.rejectionReason) reasons.push(legitimacy.rejectionReason);
  if ((issue.assignees ?? []).length || competition.claimStatus === "ASSIGNED") reasons.push("Already assigned to another contributor");
  if (competition.claimStatus === "COMPLETED_SOLUTION") reasons.push("Existing completed solution detected");
  if (context.repo?.archived) reasons.push("Repository archived");
  if (issue.state !== "open") reasons.push("Issue closed/completed");
  if (PRIVATE_DEPENDENCY.test(text)) reasons.push("Inaccessible private infrastructure required");
  if (/\b(?:impersonat|deceptive action|fake identity)\b/i.test(text)) reasons.push("Prohibited or deceptive action required");
  if (/\b(?:no ai|ai contributions? (?:are )?(?:not allowed|prohibited))\b/i.test(text)) reasons.push("AI contributions explicitly disallowed");
  if (solvability.aiSolvabilityScore < 15 && HIGH_COMPLEXITY.test(text)) reasons.push("Requirements are unrealistic for the accessible environment");
  if (reward.rewardAmount !== null && reward.rewardUsdEstimate === null && !KNOWN_MARKET_TOKENS.has(reward.rewardCurrency)) reasons.push("Reward has no credible verifiable market value");
  return [...new Set(reasons)];
}

export function analyzeOpportunity(issue, context = {}, now = new Date()) {
  const reward = extractReward(issue, context);
  const legitimacy = analyzeLegitimacy(issue, reward, context);
  const competition = analyzeCompetition(issue, context.comments, context.solutionPRs);
  const repository = analyzeRepository(context.repo, context.rootEntries, context.repoDetails, now);
  const acceptance = parseAcceptanceCriteria(issue);
  const solvability = estimateSolvability(issue, acceptance, repository);
  const effort = estimateEffort(issue, acceptance, repository);
  const injection = detectPromptInjection(`${issue.body ?? ""}\n${(context.comments ?? []).map((x) => x.body ?? "").join("\n")}`);
  const rewardScore = rewardAttractiveness(reward);
  let winScore = calculateWinScore({ ...legitimacy, ...competition, ...repository, ...acceptance, ...solvability, ...effort, rewardAttractivenessScore: rewardScore });
  const rejections = hardRejectionReasons(issue, context, reward, legitimacy, competition, solvability);
  const ageDays = Math.max(0, (now - new Date(issue.updatedAt)) / DAY);
  if (ageDays > 365) rejections.push("Stale bounty or inactive issue");
  let decision = rejections.length ? "REJECT" : winScore >= 85 ? "HUNT" : winScore >= 70 ? "WATCH" : winScore >= 50 ? "SKIP" : "REJECT";
  if (context.analysisDepth !== "deep" && decision === "HUNT") { decision = "SKIP"; winScore = Math.min(winScore, 69); }
  if ((reward.paymentRisk !== "LOW" || reward.paymentMethod === "UNKNOWN" || reward.paymentTrigger === "UNKNOWN") && decision === "HUNT") decision = "WATCH";
  if (reward.rewardUsdEstimate !== null && reward.rewardUsdEstimate < 50 && !["<30 min", "30–90 min"].includes(effort.effortEstimate) && ["HUNT", "WATCH"].includes(decision)) decision = "SKIP";
  if ((acceptance.scopeClarityScore < 55 || repository.repoHealthScore < 50) && ["HUNT", "WATCH"].includes(decision)) decision = "SKIP";
  if (competition.activeCompetitors > 4 && decision === "WATCH" && winScore < 90) decision = "SKIP";
  const incomplete = context.analysisDepth !== "deep" || context.coverage?.complete === false;
  if (incomplete && ["HUNT", "WATCH"].includes(decision)) decision = "SKIP";
  // Text extraction is not independent proof of funding or issuer authority.
  if (decision === "HUNT" && context.paymentEvidenceVerified !== true) decision = "WATCH";
  const reason = rejections[0] ?? (incomplete ? "Incomplete evidence; availability and competition are UNKNOWN" : `${reward.rewardUsdEstimate === null ? "Uncertain reward" : `$${reward.rewardUsdEstimate} ${reward.rewardCurrency}`} · ${competition.activeCompetitors} active competitor(s) · ${effort.effortEstimate} · AI solvability ${solvability.aiSolvabilityScore}`);
  return {
    ...issue, opportunityId: stableOpportunityId(issue), retrievalTimestamp: context.retrievalTimestamp ?? new Date().toISOString(),
    originalIssueUrl: issue.url, bountyProviderUrl: context.bountyProviderUrl ?? null,
    evidenceUrls: [...new Set([issue.url, issue.repositoryUrl, ...(context.evidenceUrls ?? [])].filter(Boolean))],
    analysisDepth: context.analysisDepth ?? "shallow", ...reward, ...legitimacy, ...competition, ...repository,
    acceptanceCriteria: acceptance, scopeClarityScore: acceptance.scopeClarityScore,
    ...solvability, ...effort, rewardAttractivenessScore: rewardScore,
    evidence: [...reward.evidence, ...legitimacy.evidence, ...competition.competitionEvidence, ...solvability.evidence],
    winScore, decision, reason, rejectionReasons: [...new Set(rejections)],
    coverage: context.coverage ?? { complete: context.analysisDepth === "deep", missing: [] },
    paymentEvidenceVerified: context.paymentEvidenceVerified === true,
    ...(incomplete ? { activeCompetitors: null, claimStatus: "UNKNOWN" } : {}),
    promptInjection: injection,
    scoreBreakdown: {
      legitimacy: legitimacy.legitimacyConfidence, aiSolvability: solvability.aiSolvabilityScore,
      scopeClarity: acceptance.scopeClarityScore, competition: competition.competitionScore,
      effort: effort.effortAttractivenessScore, repositoryHealth: repository.repoHealthScore,
      maintainerActivity: repository.maintainerActivityScore, rewardAttractiveness: rewardScore
    }
  };
}

export function deduplicate(items) {
  return [...new Map(items.map((item) => [`${item.source}:${item.id}`, item])).values()];
}

export function isApparentBounty(issue) {
  return /\b(?:bounty|reward|paid|usdc|usdt|dai|usd|eth|\$\s*\d)\b/i.test(textOf(issue));
}
