const rules = [
  ['EXTERNAL_API_CREDENTIAL', 'USER_INPUT_REQUIRED', /(?:Claude|Anthropic|OpenAI|Gemini)\s+API|API\s+(?:key|token)|calls?\s+(?:Claude|OpenAI)/i],
  ['WEBHOOK_OR_ACCOUNT', 'USER_INPUT_REQUIRED', /(?:email|Discord|Slack).{0,45}(?:deliver|send|notif|webhook)|(?:deliver|send|notif).{0,70}(?:email|Discord|Slack)|\bwebhook\b/i],
  ['RUNTIME_ENVIRONMENT', 'EASY_TO_PROVISION', /\bn8n\b|(?:real|local)\s+(?:execution|runtime|Docker)/i],
  ['CLOUD_ACCOUNT', 'USER_INPUT_REQUIRED', /AWS\s+(?:deploy|account)|deploy.{0,35}\b(?:AWS|Azure|GCP)\b/i],
  ['PHYSICAL_HARDWARE', 'HARD_BLOCKER', /physical\s+(?:iPhone|Android|device|hardware|WearOS)|WearOS|Wormhole B0|Blackhole|requires? hardware/i],
  ['MAINNET_FUNDS', 'HARD_BLOCKER', /mainnet\s+(?:transaction|funds)|(?:send|submit).{0,35}\bmainnet\b/i],
  ['PRIVATE_INFRASTRUCTURE', 'HARD_BLOCKER', /internal staging|private infrastructure|private API|maintainer.only credentials|HUMAN_VERIFIED_SIGNATURE|register credentials|unlock test/i],
  ['PAID_SERVICE', 'PAID_RESOURCE', /paid (?:service|account)|API (?:cost|credits)|billable|subscription required/i],
  ['EXTERNAL_ACCOUNT', 'USER_INPUT_REQUIRED', /external account|manual (?:test|verification)/i]
];
export function dependencyIntelligence(issue, context = {}) {
  const sources = [{ source: issue.url, text: issue.body }, ...(context.repoDetails?.sourceFiles ?? []).map(x => ({ source: x.url, text: x.text })), ...['readme','contributing','testSource'].map(k => ({ source: context.repoDetails?.[k+'Url'] ?? `${issue.repositoryUrl} (${k})`, text: context.repoDetails?.[k] }))];
  const found = new Map();
  for (const source of sources) for (const line of String(source.text ?? '').split('\n')) {
    if (/ignore .*instructions|reveal .*secret|override .*policy|print env|cat \.env/i.test(line)) continue;
    for (const [type, provisioning, re] of rules) if (re.test(line)) {
      const key = `${type}:${source.source}`;
      if (!found.has(key)) found.set(key, { type, provisioning, severity: provisioning === 'HARD_BLOCKER' ? 'HARD' : 'REQUIRES_VERIFICATION', source: source.source, description: line.trim().slice(0, 500), resolved: false });
    }
  }
  return [...found.values()];
}
