import { createBudget, discoverOpire } from './pipeline.js';
import { parseOpireListing } from '../providers/opire.js';

// Read-only provider diagnostics: no GitHub search and no opportunity persistence.
export async function checkOpireDiscovery(budget = createBudget({ maxRequests: 31, deadlineMs: 40000 })) {
  const discovery = await discoverOpire(budget);
  const listings = new Array(discovery.listings.length);
  let cursor = 0;
  await Promise.all([0, 1, 2].map(async () => {
    while (cursor < discovery.listings.length) {
      const index = cursor++, entry = discovery.listings[index];
      const result = await budget.request(entry.listingUrl, 'text');
      listings[index] = { ...entry, exactListing: parseOpireListing(result.ok ? result.data : '', entry.listingUrl, entry.canonicalIssueUrl, new Date().toISOString()), failure: result.ok ? null : result.reason };
    }
  }));
  return { mode: 'PROVIDER_CHECK_ONLY', checkedAt: new Date().toISOString(), scanCreated: false,
    discovery: { ...discovery, listings }, entriesParsed: listings.length,
    exactListingsVerified: listings.filter(x => x.exactListing.listingVerified).length,
    activeListings: listings.filter(x => x.exactListing.rewardAvailable === true).length,
    requests: budget.requests };
}
