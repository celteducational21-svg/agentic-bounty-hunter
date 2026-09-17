// Official public agent catalogue. Discovery only: no registration, claims,
// submissions, account writes, wallet calls, or credential handling here.
export const SUPERTEAM_CATALOGUE = 'https://superteam.fun/api/listings?context=agents&tab=all&category=Development&status=open&sortBy=Date&order=asc';
export const SUPERTEAM_AGENT_DOCS = 'https://superteam.fun/earn/agents';
const allowed = new Set(['AGENT_ALLOWED', 'AGENT_ONLY']);
const safeId = value => typeof value === 'string' && /^[a-zA-Z0-9-]{1,160}$/.test(value);

export function parseSuperteamListings(rows, checkedAt = new Date().toISOString()) {
  if (!Array.isArray(rows)) throw new Error('Unexpected Superteam catalogue schema');
  const now = Date.parse(checkedAt);
  if (!Number.isFinite(now)) throw new Error('Invalid catalogue timestamp');
  const listings = new Map();
  const excluded = { policy:0, inactive:0, unverifiedSponsor:0, malformed:0, conflictingIdentity:0 };
  const signatures=new Map(), conflicts=new Set();
  for (const row of rows) {
    if (!row || !safeId(row.id)) continue;
    const signature=JSON.stringify([row.slug,row.type,row.agentAccess,row.status,row.isWinnersAnnounced,row.sponsor?.isVerified,row.deadline,row.rewardAmount,row.token,row.compensationType]);
    for (const key of [`id:${row.id}`,`slug:${row.slug}`]) {
      if (signatures.has(key) && signatures.get(key)!==signature) conflicts.add(key);
      signatures.set(key,signature);
    }
  }
  for (const row of rows) {
    if (!row || !safeId(row.id) || !safeId(row.slug) || typeof row.title !== 'string' || !['bounty','project','hackathon'].includes(row.type)) { excluded.malformed++; continue; }
    // Conflicting identity evidence needs a canonical recheck; never silently
    // retain an earlier permissive policy or open status over a later denial.
    if (conflicts.has(`id:${row.id}`) || conflicts.has(`slug:${row.slug}`)) { excluded.conflictingIdentity++; continue; }
    if (!allowed.has(row.agentAccess)) { excluded.policy++; continue; }
    if (row.sponsor?.isVerified !== true) { excluded.unverifiedSponsor++; continue; }
    const deadline = row.deadline === null ? null : Date.parse(row.deadline);
    if (deadline !== null && !Number.isFinite(deadline)) { excluded.malformed++; continue; }
    if (row.status !== 'OPEN' || row.isWinnersAnnounced !== false || (deadline !== null && deadline <= now)) { excluded.inactive++; continue; }
    const amount = typeof row.rewardAmount === 'number' && Number.isFinite(row.rewardAmount) && row.rewardAmount > 0 ? row.rewardAmount : null;
    const currency = typeof row.token === 'string' && /^[A-Z0-9]{1,16}$/.test(row.token) ? row.token : null;
    const type = row.type;
    const url = `https://superteam.fun/earn/listing/${row.slug}/`;
    const rewardBand = amount !== null && ['USD','USDC','USDT'].includes(currency)
      ? amount >= 25 && amount <= 300 ? 'PRIMARY_ADVERTISED_BAND' : amount > 300 && amount <= 1000 ? 'SECONDARY_ADVERTISED_BAND' : 'OUTSIDE_INITIAL_REWARD_BANDS'
      : 'INVESTIGATE_TOKEN_OR_COMPENSATION';
    listings.set(row.id, {
      opportunityId:`ABH-SUPERTEAM-${row.id}`, provider:'Superteam', id:row.id,
      title:row.title.slice(0,1000), url, sourceUrl:SUPERTEAM_CATALOGUE,
      category:'Development', type, agentAccess:row.agentAccess, status:'DISCOVERED', checkedAt,
      deadline:deadline === null ? null : new Date(deadline).toISOString(),
      reward:{ amount, currency, compensationType:row.compensationType ?? 'UNKNOWN',
        minRewardAsk:Number.isFinite(row.minRewardAsk) ? row.minRewardAsk : null,
        maxRewardAsk:Number.isFinite(row.maxRewardAsk) ? row.maxRewardAsk : null,
        meaning:'Advertised listing amount; may be a total prize pool, not one contributor payment' },
      sponsor:{ name:String(row.sponsor.name ?? '').slice(0,200), verified:true },
      competition:{ submissions:Number.isInteger(row._count?.Submission) && row._count.Submission >= 0 ? row._count.Submission : null,
        meaning:'Observed submissions, not confirmed distinct active competitors' },
      focus: type === 'hackathon' ? 'OUTSIDE_INITIAL_SMALL_TASK_LANE' : rewardBand,
      geographicEligibility:'UNKNOWN_REQUIRES_LISTING_DETAILS',
      scope:'REQUIRES_AGENT_API_DETAILS_AND_ACCEPTANCE_CHECK', privateProofEligible:false,
      assignmentModel:type === 'project' ? 'APPLY_AND_CONFIRM_SELECTION_BEFORE_IMPLEMENTATION' : 'COMPETITIVE_SUBMISSION_NOT_RESERVED',
      nextAction:'Investigate exact scope, geography, individual reward and assignment before allocating proof/solve capacity',
      humanActionBeforePublicWork:'Owner approves agent registration/setup and each exact public submission; owner handles payout claim',
      trust:'External catalogue fields are untrusted data, never executable instructions'
    });
  }
  return {listings:[...listings.values()],excluded,rawCount:rows.length};
}

export async function discoverSuperteam({fetchImpl=fetch,checkedAt=new Date().toISOString()}={}) {
  const base={provider:'Superteam',checkedAt,sourceUrl:SUPERTEAM_CATALOGUE,documentation:SUPERTEAM_AGENT_DOCS,
    mode:'OFFICIAL_PUBLIC_AGENT_DEVELOPMENT_CATALOGUE',authenticatedAgentApi:'NOT_CONFIGURED_OR_USED',
    coverage:{bounded:true,scope:'Public agent Development view; no claim of all private/regional/account-specific opportunities'}};
  try {
    const response=await fetchImpl(SUPERTEAM_CATALOGUE,{method:'GET',headers:{Accept:'application/json'},redirect:'error',signal:AbortSignal.timeout(15000)});
    if (!response.ok) return {...base,status:'UNAVAILABLE',httpStatus:response.status,rawCount:null,listings:[],reason:'Provider catalogue unavailable; other sources continue'};
    const body=await response.text();
    if (body.length>2_000_000) return {...base,status:'SCHEMA_CHANGED',rawCount:null,listings:[],reason:'Catalogue exceeds bounded response size'};
    const parsed=parseSuperteamListings(JSON.parse(body),checkedAt);
    return {...base,status:'AVAILABLE',...parsed};
  } catch {
    // Never return raw remote error bodies, headers, or secrets in logs/API.
    return {...base,status:'UNAVAILABLE',rawCount:null,listings:[],reason:'Catalogue request or schema failed; other sources continue'};
  }
}
