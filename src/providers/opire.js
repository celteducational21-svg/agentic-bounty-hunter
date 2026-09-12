// Read-only adapter for the public, issue-specific Opire listing summary.
export const OPIRE_MECHANICS = {
  paymentProvider: 'Stripe', fundingStatus: 'PAY_ON_ACCEPTANCE', fundsReserved: false,
  paymentTrigger: 'AFTER_CLAIM_AND_CREATOR_ACCEPTANCE',
  mechanicsSources: ['https://docs.opire.dev/faq', 'https://docs.opire.dev/rewards/lifecycle', 'https://docs.opire.dev/overview/commands']
};
export function opireListingUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && u.hostname === 'app.opire.dev' && /^\/issues\/[A-Za-z0-9]+$/.test(u.pathname) ? u.origin + u.pathname : null; } catch { return null; }
}
// Decode public server-rendered catalogue JSON as DATA, never execute scripts.
// The catalogue's cards use client navigation rather than anchor hrefs.
export function parseOpireCatalogue(html, checkedAt = new Date().toISOString()) {
  let stream = '';
  for (const m of String(html).matchAll(/self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)/g)) {
    try { stream += JSON.parse(m[1]); } catch { /* Changed provider format remains unknown. */ }
  }
  const marker = '"initialRewards":'; const start = stream.indexOf(marker);
  if (start < 0) return [];
  const input = stream.slice(start + marker.length); let depth = 0, quoted = false, escaped = false, end = -1;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; continue; }
    if (c === '"') quoted = true;
    else if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) { end = i + 1; break; } }
  }
  let entries; try { entries = JSON.parse(input.slice(0, end)); } catch { return []; }
  if (!Array.isArray(entries)) return [];
  return entries.filter(x => /^[A-Za-z0-9]+$/.test(x.id) && /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+$/.test(x.url) && x.platform === 'GitHub' && x.project?.isPublic === true).map(x => ({
    provider: 'Opire', listingUrl: `https://app.opire.dev/issues/${x.id}`, canonicalIssueUrl: x.url, repository: x.url.split('/').slice(3,5).join('/'), title: x.title,
    advertisedRewardUsd: x.pendingPrice?.unit === 'USD_CENT' && Number.isFinite(x.pendingPrice.value) ? x.pendingPrice.value / 100 : null,
    tryingSolvers: Array.isArray(x.tryingUsers) ? x.tryingUsers.length : null, claimingSolvers: Array.isArray(x.claimerUsers) ? x.claimerUsers.length : null,
    programmingLanguages: x.programmingLanguages ?? [], botInstalled: x.project.isBotInstalled === true,
    sourceUrl: 'https://app.opire.dev', checkedAt, listingVerified: false,
    providerActivityEvidence: { url: 'https://app.opire.dev', checkedAt, detail: 'Present in current public available-reward catalogue; exact task listing still requires verification' }
  }));
}
export function parseOpireListing(html, url, issueUrl, checkedAt) {
  const text = String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&(?:nbsp|amp);/g, ' ').replace(/\s+/g, ' ');
  // Scope parsing to the canonical summary, never the unrelated reward catalogue below it.
  const match = text.match(/\$([\d,]+\.\d{2}) bounty for ([\s\S]*?)Issue URL:\s*(https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+)\s*Status:\s*(Open|Closed)\s*\.\s*(\d+) available rewards and (\d+) paid rewards\.\s*(\d+) solvers are trying this issue and (\d+) solvers have claimed it\./i);
  const linked = Boolean(opireListingUrl(url) && match && match[3] === issueUrl);
  let programmingLanguages = [];
  for (const m of String(html).matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { const data = JSON.parse(m[1]); if (data.mainEntity?.itemOffered?.url === issueUrl) programmingLanguages = data.mainEntity.itemOffered.programmingLanguage ?? []; } catch { /* Unknown schema is not evidence. */ }
  }
  return { provider: 'Opire', platformVerified: Boolean(opireListingUrl(url)), listingVerified: linked, checkedAt, url,
    canonicalIssueUrl: match?.[3] ?? null, rewardAmount: linked ? Number(match[1].replaceAll(',', '')) : null, rewardCurrency: linked ? 'USD' : null,
    availability: linked ? match[4].toUpperCase() : 'UNKNOWN', availableRewards: linked ? Number(match[5]) : null, paidRewards: linked ? Number(match[6]) : null,
    tryingSolvers: linked ? Number(match[7]) : null, claimingSolvers: linked ? Number(match[8]) : null,
    programmingLanguages, rewardAvailable: linked ? Number(match[5]) > 0 && match[4].toUpperCase() === 'OPEN' : null,
    issuerAuthority: 'UNKNOWN', issuerIdentified: false, rewardCreator: null, paymentConfidence: linked ? 'PARTIAL' : 'UNVERIFIED', ...OPIRE_MECHANICS,
    evidence: [{ url, checkedAt, detail: linked ? match[0] : 'Exact issue summary unavailable or linkage mismatch' }],
    limitations: ['Creator identity and issuer payout history are not exposed by this summary', 'Trying and claiming counts may overlap; do not add them', 'Listing is not proof of secured funds'] };
}
