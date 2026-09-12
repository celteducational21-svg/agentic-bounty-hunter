// Read-only adapter for the public, issue-specific Opire listing summary.
export const OPIRE_MECHANICS = {
  paymentProvider: 'Stripe', fundingStatus: 'PAY_ON_ACCEPTANCE', fundsReserved: false,
  paymentTrigger: 'AFTER_CLAIM_AND_CREATOR_ACCEPTANCE',
  mechanicsSources: ['https://docs.opire.dev/faq', 'https://docs.opire.dev/rewards/lifecycle', 'https://docs.opire.dev/overview/commands']
};
export function opireListingUrl(value) {
  try { const u = new URL(value); return u.protocol === 'https:' && u.hostname === 'app.opire.dev' && /^\/issues\/[A-Za-z0-9]+$/.test(u.pathname) ? u.origin + u.pathname : null; } catch { return null; }
}
export function parseOpireListing(html, url, issueUrl, checkedAt) {
  const text = String(html).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&(?:nbsp|amp);/g, ' ').replace(/\s+/g, ' ');
  // Scope parsing to the canonical summary, never the unrelated reward catalogue below it.
  const match = text.match(/\$([\d,]+\.\d{2}) bounty for ([\s\S]*?)Issue URL:\s*(https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+)\s*Status:\s*(Open|Closed)\.\s*(\d+) available rewards and (\d+) paid rewards\.\s*(\d+) solvers are trying this issue and (\d+) solvers have claimed it\./i);
  const linked = Boolean(opireListingUrl(url) && match && match[3] === issueUrl);
  return { provider: 'Opire', platformVerified: Boolean(opireListingUrl(url)), listingVerified: linked, checkedAt, url,
    canonicalIssueUrl: match?.[3] ?? null, rewardAmount: linked ? Number(match[1].replaceAll(',', '')) : null, rewardCurrency: linked ? 'USD' : null,
    availability: linked ? match[4].toUpperCase() : 'UNKNOWN', availableRewards: linked ? Number(match[5]) : null, paidRewards: linked ? Number(match[6]) : null,
    tryingSolvers: linked ? Number(match[7]) : null, claimingSolvers: linked ? Number(match[8]) : null,
    issuerAuthority: 'UNKNOWN', rewardCreator: null, paymentConfidence: linked ? 'PARTIAL' : 'UNVERIFIED', ...OPIRE_MECHANICS,
    evidence: [{ url, checkedAt, detail: linked ? match[0] : 'Exact issue summary unavailable or linkage mismatch' }],
    limitations: ['Creator identity and issuer payout history are not exposed by this summary', 'Trying and claiming counts may overlap; do not add them', 'Listing is not proof of secured funds'] };
}
