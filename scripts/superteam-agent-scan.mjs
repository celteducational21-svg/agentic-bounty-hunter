import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const base = 'https://superteam.fun';
const allowed = new Set(['AGENT_ALLOWED', 'AGENT_ONLY']);
const safeSlug = value => typeof value === 'string' && /^[a-zA-Z0-9-]{1,160}$/.test(value);
const active = (row, now) => row && allowed.has(row.agentAccess) && row.status === 'OPEN' && row.isWinnersAnnounced === false && (row.deadline === null || Date.parse(row.deadline) > now);

// Credentials remain in the invoked worker. No registration, browser session,
// payout action, or public submission is performed by this discovery command.
export async function scanAgent({apiKey, fetchImpl=fetch, checkedAt=new Date().toISOString()}={}) {
  if (typeof apiKey !== 'string' || !apiKey.trim()) throw new Error('SUPERTEAM_CREDENTIAL_REQUIRED');
  const now=Date.parse(checkedAt);
  if (!Number.isFinite(now)) throw new Error('INVALID_TIMESTAMP');
  async function get(path) {
    let response;
    try {
      response=await fetchImpl(base+path,{method:'GET',redirect:'error',headers:{Accept:'application/json',Authorization:`Bearer ${apiKey}`},signal:AbortSignal.timeout(25000)});
    } catch { throw new Error('SUPERTEAM_NETWORK_FAILED'); }
    if (!response.ok) throw new Error(`SUPERTEAM_HTTP_${response.status}`);
    try {
      const body=await response.text();
      if (body.length>2_000_000) throw new Error();
      return JSON.parse(body);
    } catch { throw new Error('SUPERTEAM_INVALID_RESPONSE'); }
  }
  const rows=await get('/api/agents/listings/live?take=100');
  if (!Array.isArray(rows)) throw new Error('SUPERTEAM_INVALID_CATALOGUE');
  const listings=[], seen=new Set();
  for (const row of rows.slice(0,100)) {
    if (!safeSlug(row?.slug) || !safeSlug(row?.id) || seen.has(row.id) || !active(row,now)) continue;
    seen.add(row.id);
    try {
      const detail=await get('/api/agents/listings/details/'+row.slug);
      if (detail.id!==row.id || detail.slug!==row.slug || !active(detail,now)) {
        listings.push({id:row.id,slug:row.slug,status:'RECHECK_REQUIRED'}); continue;
      }
      listings.push({id:row.id,slug:row.slug,status:'NEEDS_SCOPE_AND_ELIGIBILITY_REVIEW',detail});
    } catch(error) {
      listings.push({id:row.id,slug:row.slug,status:'DETAIL_UNAVAILABLE',reason:error.message});
    }
  }
  return {checkedAt,mode:'AUTHENTICATED_AGENT_API',source:base+'/api/agents/listings/live?take=100',rawCount:rows.length,coverage:rows.length>=100?'BOUNDED_FIRST_100':'RETURNED_LIVE_FEED',listings,submitted:0,workSecured:0};
}

if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  try {
    const [credentialFile,outputFile]=process.argv.slice(2);
    if (!credentialFile || !outputFile || credentialFile===outputFile) throw new Error('USAGE: node scripts/superteam-agent-scan.mjs PRIVATE_CREDENTIAL_FILE OUTPUT_JSON');
    const {apiKey}=JSON.parse(await readFile(credentialFile,'utf8'));
    const result=await scanAgent({apiKey});
    await writeFile(outputFile,JSON.stringify(result,null,2)+'\n',{flag:'wx',mode:0o600});
    console.log(JSON.stringify({checkedAt:result.checkedAt,mode:result.mode,rawCount:result.rawCount,details:result.listings.length,coverage:result.coverage,submitted:0}));
  } catch(error) {
    console.error(error.message.startsWith('SUPERTEAM_') ? error.message : 'SCAN_FAILED_CHECK_LOCAL_INPUT_AND_OUTPUT');
    process.exitCode=1;
  }
}
