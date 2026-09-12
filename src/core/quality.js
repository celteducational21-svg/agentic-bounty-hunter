const clamp = n => Math.max(0, Math.min(100, Math.round(n)));
const authority = x => ['OWNER', 'MEMBER', 'COLLABORATOR'].includes(x.author_association);
const clean = x => String(x ?? '').replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '').replace(/^\s*>.*$/gm, '');

export function classifyPR(issue, pr) {
  const text = clean(`${pr.title ?? ''}\n${pr.body ?? ''}`);
  const full = issue.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const sameRepo = pr.html_url?.toLowerCase().startsWith(`${issue.repositoryUrl.toLowerCase()}/pull/`);
  // Remove qualified foreign references before considering local #number references.
  const local = text.replace(/https:\/\/github\.com\/[^\s)]+|[\w.-]+\/[\w.-]+#\d+/g, '');
  const reference = new RegExp(`${full}(?!\\d)|${issue.repository.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}#${issue.number}(?!\\d)`, 'i').test(text) || sameRepo && new RegExp(`(?:^|[^\\w])#${issue.number}(?!\\d)`).test(local);
  const closing = new RegExp(`\\b(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)\\s+(?:${full}|#${issue.number})(?!\\d)`, 'i').test(text);
  const related = pr.linkedFromIssue === true || reference;
  return { ...pr, related, closesIssue: pr.closesIssue === true || Boolean(related && closing), relation: !related ? 'UNRELATED' : pr.merged_at && (closing || pr.closesIssue) ? 'MERGED_SOLUTION' : pr.state === 'open' ? 'OPEN_SUBMISSION' : pr.merged_at ? 'MERGED_REFERENCE' : 'CLOSED_UNSUCCESSFUL', evidenceUrl: pr.html_url };
}

export function competitionIntelligence(issue, context = {}, now = new Date()) {
  const actors = new Map();
  const comments = [...(context.comments ?? [])].sort((a, b) => (Date.parse(a.created_at) || 0) - (Date.parse(b.created_at) || 0));
  for (const c of comments) {
    const name = c.user?.login ?? c.author;
    if (!name) continue;
    const body = clean(c.body);
    let state;
    if (/\b(?:i (?:withdraw|abandon)|no longer working|giving up|unclaim|i am withdrawing)\b/i.test(body)) state = 'ABANDONED';
    else if (/\b(?:completed (?:the )?implementation|implementation (?:is )?complete|submitted (?:a |the )?(?:pr|pull request))\b/i.test(body)) state = 'SUBMITTED_PR';
    else if (/\b(?:i(?:'m| am) working|proposed patch|patch (?:is )?ready|implemented|implementation in progress)\b/i.test(body)) state = 'ACTIVE_IMPLEMENTATION';
    else if (/(?:^|\s)\/(?:try|attempt|opire\s+try)\b|\b(?:claiming this|i claim this)\b/i.test(body)) state = 'CLAIMED';
    else if (/\b(?:i'd like to|i would like to|can i work|interested in|i am ready)\b/i.test(body)) state = 'INTEREST_ONLY';
    if (state) {
      const previous = actors.get(name);
      if (state === 'INTEREST_ONLY' && previous && previous.state !== 'ABANDONED') continue;
      actors.set(name, { actor: name, state, lastActivity: c.created_at ?? null, evidenceUrls: [...new Set([...(previous?.evidenceUrls ?? []), c.html_url].filter(Boolean))] });
    }
    if (authority(c)) {
      const assigned = body.match(/\b(?:assigned to|assigning (?:this to )?)\s*@([\w-]+)/i);
      if (assigned) actors.set(assigned[1], { actor: assigned[1], state: 'CLAIMED', maintainerAssigned: true, evidenceUrls: [c.html_url].filter(Boolean) });
    }
  }
  const prs = [...new Map((context.solutionPRs ?? []).map(pr => [pr.html_url, classifyPR(issue, pr)])).values()].filter(pr => pr.related);
  for (const pr of prs) {
    const name = pr.user?.login ?? pr.author ?? `UNKNOWN:${pr.html_url}`;
    if (pr.state !== 'open' && pr.relation !== 'MERGED_SOLUTION') continue;
    const previous = actors.get(name);
    actors.set(name, { actor: name, state: pr.relation === 'MERGED_SOLUTION' ? 'MERGED' : 'SUBMITTED_PR', lastActivity: pr.updated_at ?? previous?.lastActivity ?? null, evidenceUrls: [...new Set([...(previous?.evidenceUrls ?? []), pr.html_url])] });
  }
  for (const value of actors.values()) {
    // Age alone never proves abandonment. Old unresolved claims stay UNKNOWN.
    if (value.state === 'CLAIMED' && value.lastActivity && new Date(now) - new Date(value.lastActivity) > 30 * 86400000) value.state = 'UNKNOWN';
  }
  const complete = context.analysisDepth === 'deep' && context.coverage?.complete !== false && context.solutionSearchCompleteness !== 'PARTIAL';
  const unresolved = [...actors.values()].some(x => x.state === 'UNKNOWN');
  const unresolvedLabel = (issue.labels ?? []).some(x => /^(?:claimed|assigned|in progress)$/i.test(x)) && actors.size === 0;
  const observed = [...actors.values()].filter(x => ['CLAIMED', 'ACTIVE_IMPLEMENTATION', 'SUBMITTED_PR'].includes(x.state)).length;
  const count = complete && !unresolved && !unresolvedLabel ? observed : null;
  const assigned = (issue.assignees ?? []).length > 0 || [...actors.values()].some(x => x.maintainerAssigned);
  const merged = prs.some(x => x.relation === 'MERGED_SOLUTION');
  const submitted = prs.filter(x => x.relation === 'OPEN_SUBMISSION').length;
  const status = assigned ? 'ASSIGNED' : merged ? 'COMPLETED_SOLUTION' : count === null ? 'UNKNOWN' : submitted ? 'SUBMITTED' : observed ? 'CLAIMED' : 'AVAILABLE';
  const score = assigned || merged ? 0 : count === null ? 25 : count === 0 ? 100 : count === 1 ? 85 : count === 2 ? 70 : count <= 4 ? 30 : 5;
  return { contributorStates: [...actors.values()], activeCompetitorCount: count, activeCompetitors: count, observedActiveCompetitors: observed, interestedContributorCount: [...actors.values()].filter(x => x.state === 'INTEREST_ONLY').length, submittedSolutionCount: complete ? submitted : null, competitionConfidence: complete && !unresolved ? 'HIGH' : 'UNKNOWN', solutionSearchCompleteness: complete ? 'BOUNDED_COMPLETE' : 'PARTIAL', claimStatus: status, competitionScore: score, existingSolutionPRs: prs.map(pr => ({ url: pr.html_url, title: pr.title, author: pr.user?.login ?? null, state: pr.state, mergedAt: pr.merged_at ?? null, closesIssue: pr.closesIssue, relation: pr.relation })), competitionEvidence: [...actors.values()].flatMap(a => a.evidenceUrls.map(url => ({ type: 'competition', url, detail: `${a.actor}: ${a.state}` }))) };
}

export function executionReadiness(repo = {}, entries = [], details = {}, comments = [], now = new Date()) {
  const names = entries.map(x => x.name ?? x);
  const scripts = details.packageJson?.scripts ?? {};
  const docs = clean(`${details.readme ?? ''}\n${details.contributing ?? ''}`);
  const manager = names.includes('pnpm-lock.yaml') ? 'pnpm' : names.includes('yarn.lock') ? 'yarn' : names.includes('package-lock.json') ? 'npm' : null;
  const usable = name => typeof scripts[name] === 'string' && !/no test specified|exit 1|echo ["']?todo/i.test(scripts[name]);
  const testCommand = usable('test') ? `${manager ?? 'npm'} test` : /\bpytest\b/.test(docs) ? 'pytest' : null;
  const buildCommand = usable('build') ? `${manager ?? 'npm'} run build` : null;
  const setupCommand = manager ? manager === 'npm' ? 'npm ci' : `${manager} install --frozen-lockfile` : null;
  const recent = repo.pushed_at && new Date(now) - new Date(repo.pushed_at) < 90 * 86400000;
  const workflows = Array.isArray(details.workflows) && details.workflows.some(x => /\.ya?ml$/.test(x.name ?? ''));
  const setupDocs = /\b(?:install|development|getting started|setup)\b/i.test(docs);
  const deps = Object.keys({ ...details.packageJson?.dependencies, ...details.packageJson?.devDependencies });
  const framework = deps.filter(x => ['next', 'react', 'vue', 'express', 'fastify', 'svelte', 'vite', 'vitest', 'jest'].includes(x));
  const responses = comments.filter(x => authority(x) && x.created_at);
  const recentResponse = responses.some(x => new Date(now) - new Date(x.created_at) < 90 * 86400000);
  const maintainerResponsivenessScore = responses.length ? recentResponse ? 80 : 25 : null;
  const credentialGate = /process\.env\.[A-Z_]*(?:SIGNATURE|CREDENTIAL)|unlock test|register credentials/i.test(details.testSource ?? '');
  const knownBuildFailure = details.buildStatus === 'FAILED' || credentialGate;
  const score = knownBuildFailure ? 15 : clamp((testCommand ? 25 : 0) + (setupCommand ? 20 : 0) + (setupDocs ? 20 : 0) + (workflows ? 15 : 0) + (recent ? 10 : 0) + (buildCommand ? 10 : 0));
  return { stack: repo.language ?? 'UNKNOWN', framework: framework.length ? framework : ['UNKNOWN'], setupCommand: setupCommand ?? 'UNKNOWN', testCommand: testCommand ?? 'UNKNOWN', buildCommand: buildCommand ?? 'UNKNOWN', lintCommand: usable('lint') ? `${manager ?? 'npm'} run lint` : 'UNKNOWN', typecheckCommand: usable('typecheck') ? `${manager ?? 'npm'} run typecheck` : 'UNKNOWN', executionReadinessScore: score, setupDifficulty: !setupDocs || !setupCommand ? 'UNKNOWN' : score >= 75 ? 'LOW' : 'MEDIUM', maintainerResponsivenessScore, executionVerified: false, buildStatus: credentialGate ? 'BLOCKED_BY_CREDENTIALS' : knownBuildFailure ? 'FAILED' : 'NOT_RUN', testabilityScore: credentialGate ? 0 : testCommand ? workflows ? 80 : 55 : 15, developerSetupScore: score, readinessEvidence: [{ type: 'readiness', url: repo.html_url, detail: `Manifest scripts and documentation inspected; build/test execution NOT RUN. Setup: ${setupCommand ?? 'UNKNOWN'}; tests: ${testCommand ?? 'UNKNOWN'}` }] };
}

export function scopeIntelligence(issue) {
  const lines = clean(issue.body).split(/\n/).map(x => x.trim()).filter(Boolean);
  const safe = lines.filter(x => !/ignore .*instructions|secret|override .*policy|print env|cat \.env/i.test(x));
  const actionable = safe.filter(x => /^(?:[-*]\s*(?:\[[ xX]\]\s*)?|\d+\.\s+)(?:add|fix|implement|define|accept|update|remove|ensure|reproduce|write|test|run|document|support|return|preserve|npm|pytest|all tests)\b/i.test(x)).map(x => x.replace(/^(?:[-*]\s*(?:\[[ xX]\]\s*)?|\d+\.\s+)/, ''));
  const dependencies = safe.filter(x => /\b(?:physical|wearos|hardware|wormhole b0|blackhole|mainnet funds|internal staging|private api|maintainer.only credentials|api key|external account|paid service|manual testing|screenshot|deployment|external api)\b/i.test(x));
  const inaccessible = dependencies.filter(x => /physical|wearos|hardware|wormhole b0|blackhole|mainnet funds|internal staging|private api|maintainer.only credentials/i.test(x));
  const tests = actionable.filter(x => /test|lint|typecheck|build/i.test(x));
  const files = [...new Set(safe.join('\n').match(/\b(?:[\w.-]+\/)*[\w.-]+\.(?:tsx?|jsx?|py|go|rs|md|json|ya?ml)\b/g) ?? [])];
  const clarity = clamp(15 + Math.min(40, actionable.length * 10) + (tests.length ? 20 : 0) + (files.length ? 10 : 0) + (/expected behavior|reproduc/i.test(safe.join('\n')) ? 15 : 0) - (/tbd|details later|build everything/i.test(safe.join('\n')) ? 35 : 0));
  return { criteria: actionable, codeChanges: actionable.filter(x => !/test|document|readme/i.test(x)), requiredTests: tests, requiredDocumentation: actionable.filter(x => /document|readme|example/i.test(x)), acceptanceCriteriaList: actionable, externalDependencies: dependencies, verificationRequirements: [...tests, ...dependencies], filesMentioned: files, inaccessibleDependencies: inaccessible, scopeClarityScore: clarity, hiddenBlockerRisk: inaccessible.length ? 'HIGH' : dependencies.length ? 'MEDIUM' : actionable.length ? 'LOW' : 'UNKNOWN' };
}
