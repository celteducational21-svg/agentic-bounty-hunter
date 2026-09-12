// Pure analysis of untrusted source data. No source instructions are executed.
const STABLE = new Set(['USD', 'USDC', 'USDT', 'DAI']);
const LIQUID = new Set(['ETH', 'BTC', 'SOL']);
const AUTHORITY = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);
const PROVIDERS = { 'algora.io': 'Algora', 'app.opire.dev': 'Opire', 'opire.dev': 'Opire', 'gitcoin.co': 'Gitcoin' };
export function providerLinks(text) {
  return [...new Set(String(text).match(/https:\/\/[^\s<>"\])]+/g) ?? [])].flatMap(url => {
    try { const host = new URL(url).hostname.replace(/^www\./, ''); return PROVIDERS[host] ? [{ url, provider: PROVIDERS[host] }] : []; } catch { return []; }
  });
}
const clean = text => String(text ?? '').replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, '').replace(/^\s*>.*$/gm, '').replace(/`[^`]*`/g, '');
const excluded = /\b(previous|historical|example|sample|quoted?|raised|budget|grant|save[sd]?|market price|price of|worth|equivalent|inquiry)\b/i;
const direct = /\b(?:bounty|reward|this (?:issue|task) pays|we (?:will )?pay|payment for (?:this|the) (?:issue|task))\b/i;
export function extractReward(issue, { tokenPrices = {}, now = new Date() } = {}) {
  const offers = [];
  const linkedTasks = [...new Set(String(issue.body).match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+/g) ?? [])];
  const aggregationReport = /BountyScout|bounty[-_ ]?(?:radar|aggregator|plaza)|bounty alert:.*opportunit/i.test(`${issue.repository}\n${issue.title}`) && linkedTasks.filter(url => url !== issue.url).length > 1;
  for (const [location, raw] of [['title', issue.title], ['body', issue.body]]) {
    if (aggregationReport) continue; // Linked tasks do not pay for this report record.
    for (const line of clean(raw).split(/\n/)) {
      const links = line.match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/issues\/\d+/g) ?? [];
      if (links.length && links.every(url => url !== issue.url)) continue;
      const taskTitle = location === 'title' && (issue.labels ?? []).includes('bounty') && /\$|\b(?:USD|USDC|USDT|DAI|ETH)\b/.test(line);
      if ((!direct.test(line) && !taskTitle) || excluded.test(line.split(/\s*\((?:worth|approximately|~)/i)[0])) continue;
      // Issuer-stated token equivalents are not independently priced rewards.
      const text = line.split(/\s*\((?:worth|approximately|~)|\s+(?:worth|equivalent to)\s/i)[0];
      const malformed = /(?:^|[\s:])[,\.]\d|\d,\d{1,2}(?:\D|$)/.test(text);
      const amounts = [...text.matchAll(/([$€£])\s*(\d[\d,]*(?:\.\d+)?)|\b(\d[\d,]*(?:\.\d+)?)\s*(USDC|USDT|USD|DAI|ETH|BTC|SOL|[A-Z]{2,10})\b/g)].map(m => ({ amount: Number((m[2] ?? m[3]).replaceAll(',', '')), currency: m[1] ? ({ '$': 'USD', '€': 'EUR', '£': 'GBP' }[m[1]]) : m[4] }));
      // $80 USDC is one stablecoin offer, not a separate USD offer.
      if (amounts.length === 1 && /\$[\d,.]+\s*(USDC|USDT|DAI)\b/.test(text)) amounts[0].currency = text.match(/\$[\d,.]+\s*(USDC|USDT|DAI)\b/)[1];
      const unique = [...new Map(amounts.filter(x => x.amount > 0).map(x => [`${x.amount}:${x.currency}`, x])).values()];
      if (malformed) { offers.push({ amount: null, currency: unique[0]?.currency ?? null, ambiguous: true, evidenceText: line.trim(), evidenceSourceUrl: issue.url, evidenceLocation: location }); continue; }
      if (!unique.length) continue;
      const range = unique.length === 2 && /(?:\d|USD|USDC|USDT|DAI)\s*(?:–|-|to)\s*\$?\d/.test(text) && unique[0].currency === unique[1].currency;
      offers.push({ ...unique[0], range: range ? { min: Math.min(...unique.map(x => x.amount)), max: Math.max(...unique.map(x => x.amount)), currency: unique[0].currency } : null, ambiguous: unique.length > 1 && !range, evidenceText: line.trim(), evidenceSourceUrl: issue.url, evidenceLocation: location });
    }
  }
  // An explicit body offer outranks stale title advertising, with conflict retained.
  const selected = offers.find(x => x.evidenceLocation === 'body') ?? offers[0];
  const conflicts = selected ? offers.filter(x => x.amount !== selected.amount || x.currency !== selected.currency) : [];
  const ambiguous = Boolean(selected?.ambiguous || conflicts.some(x => x.evidenceLocation === 'body'));
  const currency = selected?.currency ?? null;
  const price = tokenPrices[currency];
  const priced = price && typeof price === 'object' && /^https:\/\//.test(price.sourceUrl ?? '') && Number(price.usd) > 0 && price.liquidityConfidence === 'HIGH' && price.exchangeable === true && Number.isFinite(Date.parse(price.timestamp)) && new Date(now) - new Date(price.timestamp) >= 0 && new Date(now) - new Date(price.timestamp) < 86400000;
  const usd = selected && !ambiguous ? STABLE.has(currency) ? selected.amount : priced ? selected.amount * price.usd : null : null;
  const trigger = clean(issue.body).match(/\b(?:paid?|payment|payout|reward)(?:ed)?\s+(?:upon|on|after)\s+([^\n.!]{3,100})/i)?.[1]?.trim() ?? 'UNKNOWN';
  const links = providerLinks(issue.body);
  const named = clean(issue.body).match(/\b(?:via|through)\s+(Algora|Opire|Gitcoin|GrantFox)\b/i)?.[1];
  const conditional = /maybe rewarded|may be eligible|not guaranteed|proposed (?:bounty|reward)/i.test(clean(issue.body));
  const confidence = !selected ? 0 : ambiguous ? 15 : usd === null ? 30 : conflicts.length ? 70 : 90;
  const reward = { amount: selected?.amount ?? null, currency, usdEstimate: usd, rewardType: !selected ? 'unknown' : selected.range ? 'range' : !STABLE.has(currency) ? 'token' : /milestone/i.test(selected.evidenceText) ? 'milestone' : 'fixed', evidenceText: selected?.evidenceText ?? '', evidenceSourceUrl: selected?.evidenceSourceUrl ?? issue.url, evidenceLocation: selected?.evidenceLocation ?? 'UNKNOWN', confidence, isDirectTaskReward: Boolean(selected && !ambiguous), conflicts };
  return { reward, rewardAmount: reward.amount, rewardCurrency: currency, rewardUsdEstimate: usd, rewardRange: selected?.range ?? null, rewardConfidence: confidence, isDirectTaskReward: reward.isDirectTaskReward, credibleMarketValue: usd !== null,
    paymentMethod: links[0]?.provider ?? named ?? 'UNKNOWN', paymentTrigger: trigger, paymentRisk: usd === null || conditional ? 'HIGH' : 'MEDIUM',
    tokenEvidence: { symbol: currency, category: STABLE.has(currency) ? 'STABLE_VALUE' : LIQUID.has(currency) ? 'VOLATILE_LIQUID' : 'UNKNOWN_OR_NATIVE', priceSourceUrl: priced ? price.sourceUrl : null, priceTimestamp: priced ? price.timestamp : null, liquidityConfidence: STABLE.has(currency) ? 'ASSUMED_PEG' : priced ? 'HIGH' : 'UNKNOWN', exchangeable: STABLE.has(currency) ? null : priced ? true : null, uncertainty: usd === null ? 'USD value UNKNOWN; issuer equivalents are not market evidence' : STABLE.has(currency) ? 'Nominal USD peg; redemption and depeg risks remain' : 'Timestamped external market estimate' },
    evidence: [{ type: 'reward', detail: selected ? `${reward.evidenceLocation}: ${reward.evidenceText}${conflicts.length ? ' (conflicting offer retained)' : ''}` : 'No direct task reward established', url: issue.url }] };
}

export function verifyPayment(issue, reward, context = {}) {
  const establishedProject = context.repo?.created_at && new Date(context.retrievalTimestamp ?? Date.now()) - new Date(context.repo.created_at) > 180 * 86400000 && (context.repo.stargazers_count ?? 0) >= 5;
  const comments = (context.comments ?? []).filter(x => AUTHORITY.has(x.author_association));
  const authoritative = AUTHORITY.has(issue.authorAssociation);
  const confirmations = comments.filter(x => /\b(?:we (?:will )?pay|bounty (?:is )?(?:funded|approved)|payment on|paid on)\b/i.test(clean(x.body)));
  const denials = comments.filter(x => /(?:not|hasn't) (?:been )?(?:approved|funded)|reward (?:is )?cancelled/i.test(clean(x.body)));
  const identity = authoritative ? issue.issuer : confirmations[0]?.user?.login ?? issue.issuer ?? 'UNKNOWN';
  const authority = authoritative ? 85 : confirmations.length ? 80 : 20;
  const conditional = /maybe rewarded|may be eligible|not guaranteed|proposed (?:bounty|reward)/i.test(clean(issue.body));
  const links = providerLinks(issue.body);
  // Only collector-supplied provider records with exact canonical linkage can verify funding.
  // A link/name/escrow badge in repository text does not create such a record.
  const listing = (context.providerEvidence ?? []).find(x => x.issueUrl === issue.url && x.status === 'ACTIVE' && x.funded === true && providerLinks(x.url).length && x.retrievedAt && x.amount === reward.rewardAmount && x.currency === reward.rewardCurrency);
  const suspicious = denials.length || /guaranteed profit|deposit first|send seed phrase/i.test(clean(issue.body));
  let level = suspicious ? 'SUSPICIOUS' : listing && reward.isDirectTaskReward ? 'VERIFIED' : establishedProject && (authoritative || confirmations.length) && reward.isDirectTaskReward && reward.credibleMarketValue && reward.paymentTrigger !== 'UNKNOWN' && !conditional ? 'STRONG' : reward.isDirectTaskReward && (authoritative || links.length || confirmations.length) ? 'PARTIAL' : 'UNVERIFIED';
  if (reward.reward.conflicts.length && level === 'VERIFIED') level = 'STRONG';
  const fundingConfidence = listing ? 95 : level === 'STRONG' ? 65 : level === 'PARTIAL' ? 30 : 0;
  const paymentEvidence = [
    { type: 'issuer', url: issue.url, detail: `Issue author ${issue.issuer ?? 'UNKNOWN'}; GitHub association ${issue.authorAssociation ?? 'UNKNOWN'}` },
    ...confirmations.map(x => ({ type: 'maintainer_confirmation', url: x.html_url, detail: clean(x.body).slice(0, 400) })),
    ...denials.map(x => ({ type: 'funding_denial', url: x.html_url, detail: clean(x.body).slice(0, 400) })),
    ...links.map(x => ({ type: 'provider_link', url: x.url, detail: 'Link found; active status and exact task funding not independently verified' })),
    ...(listing ? [{ type: 'funded_listing', url: listing.url, detail: 'Collector verified active funded listing tied to exact issue and reward' }] : [])
  ];
  return { payer: identity, payerRole: authoritative ? 'PROJECT_MAINTAINER' : confirmations.length ? 'MAINTAINER' : 'UNKNOWN_PARTY', issuerAuthorityScore: authority, fundingConfidence, paymentConfidence: level, paymentLegitimacyScore: { VERIFIED: 100, STRONG: 85, PARTIAL: 40, UNVERIFIED: 10, SUSPICIOUS: 0 }[level], paymentProvider: links[0]?.provider ?? reward.paymentMethod, paymentTrigger: reward.paymentTrigger, paymentEvidence, paymentEvidenceVerified: level === 'VERIFIED' };
}
