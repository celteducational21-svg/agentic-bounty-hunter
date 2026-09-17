import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeSourceEconomics } from '../src/core/source-economics.js';
const operation = (id, status = 'INVESTIGATING', evidence = {}, extra = {}) => ({ opportunityId: id, provider: 'Opire', status, version: 1, evidence, ...extra });
const proof = { setup: 'PASS', reproduction: 'PASS', focusedTests: 'PASS', reference: 'proof-log' };
const reservation = { confirmed: true, scopeConfirmed: true, bountyActive: true, reference: 'maintainer-confirmation' };
const merge = { reference: 'merged-pr', commit: 'sha' };
const payment = (amount, currency) => ({ confirmed: true, amount, currency, reference: 'receipt' });

test('deduplicates versions, preserves historically verified submission after later review and merge', () => {
  const transitions = [
    { version: 1, to: 'QA', evidence: { solution: { revision: 'first' } } },
    { version: 2, to: 'SUBMITTED', evidence: { submission: { url: 'pr-url', revision: 'first' } } },
    { version: 3, to: 'SOLVING', evidence: { solution: { revision: 'second' } } }
  ];
  const row = operation('real-task', 'MERGED', { proof, reservation, merge }, { version: 4, transitions });
  const result = summarizeSourceEconomics([operation('real-task'), row, row]);
  const stats = result.providers.Opire;
  assert.equal(result.sampleSize, 1);
  assert.equal(stats.observedOpportunities, 1);
  assert.equal(stats.proofs, 1);
  assert.equal(stats.reservationsOrAssignments, 1);
  assert.equal(stats.submissions, 1);
  assert.equal(stats.accepted, 1);
  assert.equal(stats.paid, 0);
});

test('replay markers and benchmark identities cannot create economic wins, even in older versions', () => {
  const success = { merge, payment: payment(500, 'USD') };
  const rows = [
    operation('sim-task', 'PAID', success, { simulation: true }),
    operation('historical-task', 'PAID', success, { mode: 'HISTORICAL_REPLAY' }),
    operation('bench:01', 'PAID', success),
    operation('job-11', 'PAID', success),
    operation('benchmark_001', 'PAID', success),
    operation('old-marker', 'PAID', success, { mode: 'HISTORICAL', version: 1 }),
    operation('old-marker', 'PAID', success, { version: 2 }),
    operation('referenced-replay', 'PAID', { ...success, proof: { ...proof, reference: 'docs/operations/benchmarks/job-01/proof.md' } }),
    operation('real-task', 'WAITING_FOR_MAINTAINER', { proof })
  ];
  const result = summarizeSourceEconomics(rows);
  assert.equal(result.sampleSize, 1);
  assert.equal(result.excludedOperations, 7);
  assert.equal(result.providers.Opire.paid, 0);
  assert.equal(result.providers.Opire.accepted, 0);
});

test('averages realized payments separately by currency and excludes promises and invalid receipts', () => {
  const rows = [operation('usd-1', 'PAID', { payment: payment(100, 'USD') }),
    operation('usd-2', 'PAID', { payment: payment(200, 'usd') }),
    operation('eur-1', 'PAID', { payment: payment(60, 'EUR') }),
    operation('pending', 'MERGED', { merge, payment: payment(999, 'USD') }),
    operation('promise', 'PAID', { payment: { ...payment(999, 'USD'), confirmed: false } }),
    operation('missing-reference', 'PAID', { payment: { ...payment(999, 'USD'), reference: null } }),
    operation('unverified', 'PAID', { payment: { ...payment(999, 'USD'), verified: false } }),
    operation('bad-currency', 'PAID', { payment: payment(999, 'UNKNOWN') }),
    operation('bad-amount', 'PAID', { payment: payment(Infinity, 'USD') })];
  const stats = summarizeSourceEconomics(rows).providers.Opire;
  assert.equal(stats.paid, 3);
  assert.equal(stats.accepted, 4);
  assert.deepEqual(Object.keys(stats.realizedRewardsByCurrency).sort(), ['EUR', 'USD']);
  assert.equal(stats.realizedRewardsByCurrency.USD.average, 150);
  assert.equal(stats.realizedRewardsByCurrency.EUR.average, 60);
  assert.equal(stats.realizedRewardsByCurrency.USD.samples[0].reference, 'receipt');
  assert.equal(stats.disputes.status, 'UNKNOWN');
});

test('status names alone cannot manufacture proofs, assignments, submissions or accepted work', () => {
  const rows = ['PRIVATE_PROOF', 'CLAIMED', 'SUBMITTED', 'MERGED', 'PAID'].map(status => operation(status, status));
  rows.push(operation('false-proof', 'SOLVING', { proof: { ...proof, verified: false }, reservation: { ...reservation, confirmed: false } }));
  rows.push(operation('mismatched-submission', 'SUBMITTED', { solution: { revision: 'a' }, submission: { revision: 'b', url: 'pr-url' } }));
  const stats = summarizeSourceEconomics(rows).providers.Opire;
  for (const metric of ['proofs', 'reservationsOrAssignments', 'submissions', 'accepted', 'paid']) assert.equal(stats[metric], 0);
  assert.equal(stats.reliability.status, 'UNKNOWN');
  assert.equal(stats.disputes.status, 'UNKNOWN');
});

test('effort averages only actual finite referenced samples, including legitimate zero', () => {
  const stats = summarizeSourceEconomics([
    operation('a', 'SOLVING', { effort: { minutes: 40, reference: 'worklog' } }),
    operation('b', 'ABANDONED', { outcome: { effortMinutes: 0, reference: 'outcome-log' } }),
    operation('c', 'SOLVING', { effort: { minutes: 500 } }, { effortEstimate: 500 }),
    operation('d', 'SOLVING', { effort: { minutes: -1, reference: 'invalid' } })
  ]).providers.Opire;
  assert.equal(stats.actualEffort.sampleCount, 2);
  assert.equal(stats.actualEffort.averageMinutes, 20);
  assert.equal(stats.reliability.status, 'UNKNOWN');
});

test('maintainer response durations require verified paired references and valid ordered timestamps', () => {
  const response = { verified: true, requestedAt: '2026-09-17T10:00:00Z', respondedAt: '2026-09-17T10:30:00Z', requestReference: 'our-comment', reference: 'maintainer-reply' };
  const stats = summarizeSourceEconomics([operation('a', 'WAITING_FOR_MAINTAINER', {
    maintainerResponses: [response, response, { ...response, verified: false }, { ...response, requestReference: '' },
      { ...response, respondedAt: '2026-09-17T09:00:00Z' }, { ...response, respondedAt: 'invalid' }], maintainerResponse: response
  })]).providers.Opire;
  assert.equal(stats.maintainerResponses.sampleCount, 1);
  assert.equal(stats.maintainerResponses.averageMinutes, 30);
  assert.equal(stats.maintainerResponses.samples[0].requestReference, 'our-comment');
});

test('unknown disputes and reliability remain unknown until actual evidence is present', () => {
  const stats = summarizeSourceEconomics([
    operation('pending', 'REJECTED', { rejection: { reference: 'qualification-rejection' } }),
    operation('unverified', 'SOLVING', { dispute: { status: 'OPEN', reference: 'rumor' } }),
    operation('observed', 'ABANDONED', { outcome: { completed: true, result: 'FAILED', reference: 'execution-log' },
      dispute: { verified: true, status: 'RESOLVED', reference: 'dispute-resolution' } })
  ]).providers.Opire;
  assert.equal(stats.reliability.completedOutcomes, 1);
  assert.equal(stats.reliability.completedFailures, 1);
  assert.equal(stats.disputes.observedOperations, 1);
  assert.equal(stats.disputes.disputedOperations, 1);
  assert.equal(stats.disputes.samples[0].reference, 'dispute-resolution');
});

test('bounded catalogue observations stay separate, deduplicate listings, and preserve source references', () => {
  const discovery = { provider: 'Future source', checkedAt: '2026-09-17T10:00:00Z', sourceUrl: 'https://source.invalid/catalogue',
    status: 'BOUNDED_COMPLETE', coverage: { bounded: true, count: 1000 },
    listings: [{ opportunityId: 'one', url: 'https://source.invalid/one' }, { opportunityId: 'one', url: 'https://source.invalid/one' },
      { opportunityId: 'job-01', url: 'https://source.invalid/replay' }] };
  const result = summarizeSourceEconomics([], [discovery, discovery, { ...discovery, checkedAt: '2026-09-17T11:00:00Z' },
    { ...discovery, provider: 'Unbounded', coverage: { bounded: false } }]);
  const stats = result.providers['Future source'];
  assert.equal(result.sampleSize, 0);
  assert.equal(stats.observedOpportunities, 0);
  assert.equal(stats.discovery.observedListings, 1);
  assert.equal(stats.discovery.observations.length, 2);
  assert.equal(stats.discovery.observations[0].sourceUrl, discovery.sourceUrl);
  assert.equal(result.providers.Unbounded, undefined);
  assert.equal(stats.paid, 0);
});

test('latest timestamp breaks version ties; generic provider keys and input values are safe', () => {
  const rows = [operation('a', 'PAID', { payment: payment(10, 'USD') }, { provider: '__proto__', updatedAt: '2026-09-16' }),
    operation('a', 'INVESTIGATING', {}, { provider: '__proto__', updatedAt: '2026-09-17' }),
    operation('b', 'INVESTIGATING', {}, { provider: 'GitHub maintainer' })];
  const before = structuredClone(rows);
  const result = summarizeSourceEconomics(rows);
  assert.equal(result.providers.__proto__.paid, 0);
  assert.equal(result.providers['GitHub maintainer'].observedOpportunities, 1);
  assert.deepEqual(rows, before);
  assert.equal(summarizeSourceEconomics().sampleSize, 0);
});


test('real historical-data and performance benchmark work is not mistaken for a replay', () => {
  const result = summarizeSourceEconomics([operation('historical-data-task', 'PAID', { payment: payment(100, 'USD') }, {
    title: 'Improve historical-data benchmark', category: 'benchmark performance', source: 'Historical benchmark project',
    sourceUrl: 'https://github.com/example/benchmark/issues/1'
  })]);
  assert.equal(result.sampleSize, 1);
  assert.equal(result.excludedOperations, 0);
  assert.equal(result.providers.Opire.paid, 1);
});
