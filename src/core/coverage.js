// Evidence completeness is distinct from the opportunity's merit.
export function assessCoverage({ repo, rootEntries, comments, prSearch, expectedComments }) {
  const missing = [];
  if (!repo?.full_name) missing.push('repository metadata');
  if (!Array.isArray(rootEntries)) missing.push('repository root contents');
  if (!Array.isArray(comments)) missing.push('comments unavailable');
  else if (comments.length < expectedComments) missing.push('comments truncated');
  if (!prSearch || !Array.isArray(prSearch.items)) missing.push('PR search unavailable');
  else if (prSearch.incomplete_results || prSearch.total_count > prSearch.items.length) missing.push('PR search truncated');
  return { complete: missing.length === 0, missing };
}
