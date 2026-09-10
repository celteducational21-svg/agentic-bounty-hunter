import test from 'node:test';
import assert from 'node:assert/strict';
import { assessCoverage } from '../src/core/coverage.js';
import { analyzeOpportunity } from '../src/core/intelligence.js';
import { deep, fixtures } from './fixtures.js';
const full = { repo: { full_name: 'acme/parser' }, rootEntries: [], comments: [], expectedComments: 0, prSearch: { items: [], total_count: 0, incomplete_results: false } };
test('successful empty requests establish coverage', () => assert.equal(assessCoverage(full).complete, true));
test('failed comments are not empty comments', () => assert.equal(assessCoverage({ ...full, comments: null }).complete, false));
test('truncated comments do not establish availability', () => assert.equal(assessCoverage({ ...full, expectedComments: 60 }).complete, false));
test('failed PR search is not zero competitors', () => assert.equal(assessCoverage({ ...full, prSearch: null }).complete, false));
test('incomplete PR search fails coverage', () => assert.equal(assessCoverage({ ...full, prSearch: { items: [], total_count: 1 } }).complete, false));
test('partial evidence cannot recommend work', () => {
  const result = analyzeOpportunity(fixtures.excellent, { ...deep, coverage: { complete: false, missing: ['comments'] } }, new Date('2026-09-10'));
  assert.ok(!['HUNT', 'WATCH'].includes(result.decision));
  assert.equal(result.activeCompetitors, null);
  assert.equal(result.claimStatus, 'UNKNOWN');
});
