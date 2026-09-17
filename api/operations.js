import { SupabaseSnapshotStore } from '../src/core/durable-history.js';
import { committedOperations, operatingView } from '../src/core/operating-store.js';

// Execution changes are trusted Git commits, never anonymous HTTP mutations.
export default async function handler(request, response) {
  response.setHeader('Cache-Control','no-store');
  if (request.method !== 'GET') return response.status(405).json({error:'Use the authenticated Git workflow to record transitions'});
  const committed = committedOperations();
  try {
    if (!process.env.ABH_SUPABASE_SECRET_KEY) throw new Error('Runtime persistence is not configured');
    const store = new SupabaseSnapshotStore({url:process.env.ABH_SUPABASE_URL,secretKey:process.env.ABH_SUPABASE_SECRET_KEY});
    const scan = await store.latestScan();
    const view = operatingView(scan,committed);
    return response.status(200).json({...view,dailyLogs:[...(scan?.dailyLog ? [scan.dailyLog] : []),...view.dailyLogs],runtime:{durable:true,lastScan:scan?.fetchedAt ?? null}});
  } catch(error) {
    return response.status(200).json({...operatingView(null,committed),runtime:{durable:false,error:'Runtime persistence could not be verified; committed GitHub records remain available.'}});
  }
}
