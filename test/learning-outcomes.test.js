import test from 'node:test';
import assert from 'node:assert/strict';
import { outcomeLearning } from '../src/core/learning.js';
const operation = (id, status, evidence = {}, extra = {}) => ({ opportunityId: id, status, provider: 'Opire', version: 1, evidence, ...extra });
const merge = { reference: 'actual merged PR', commit: 'merge-sha' };
const outcome = { completed: true, result: 'FAILED', reference: 'execution outcome log', effortMinutes: 40 };
test('pending, qualification rejections, and unaudited successes are neutral', () => {
 const result = outcomeLearning([
  operation('1', 'WAITING_FOR_MAINTAINER'), operation('2', 'REJECTED', { rejection: { code: 'CLOSED_COMPLETED' } }),
  operation('3', 'MERGED'), operation('4', 'PAID', { payment: { confirmed: false, amount: 100, reference: 'promised' } }),
  operation('5', 'SOLVING', { outcome })
 ]).providers.Opire;
 assert.equal(result.observed, 5); assert.equal(result.accepted, 0); assert.equal(result.completedFailures, 0);
 assert.equal(result.completedOutcomes, 0); assert.equal(result.rankingAdjustment, 0);
});
test('completed successes count once with latest operation version', () => {
 const evidence = { merge, payment: { confirmed: true, amount: 50, currency: 'USD', reference: 'receipt' } };
 const result = outcomeLearning([
  operation('same', 'MERGED', { merge }), operation('same', 'PAID', evidence, { version: 2 }),
  operation('same', 'MERGED', { merge }), operation('other', 'MERGED', { merge })
 ]);
 assert.equal(result.sampleSize, 2); assert.equal(result.providers.Opire.accepted, 2); assert.equal(result.providers.Opire.paid, 1);
 assert.equal(result.providers.Opire.rankingAdjustment, 0); assert.equal(result.providers.Opire.confidence, 'INSUFFICIENT_OUTCOMES');
});
test('three completed observed outcomes produce bounded provider preference', () => {
 const result = outcomeLearning([operation('1', 'MERGED', { merge }), operation('2', 'MERGED', { merge }), operation('3', 'ABANDONED', { outcome })]);
 assert.equal(result.providers.Opire.completedOutcomes, 3); assert.equal(result.providers.Opire.completedFailures, 1);
 assert.equal(result.providers.Opire.rankingAdjustment, 2);
 assert.equal(result.providers.Opire.actualEffortMinutes, 40); assert.equal(result.providers.Opire.effortSamples, 1);
 const failed = outcomeLearning([1,2,3,4].map(i => operation(String(i), 'ABANDONED', { outcome })));
 assert.equal(failed.providers.Opire.rankingAdjustment, -5);
 const won = outcomeLearning([1,2,3,4].map(i => operation(String(i), 'MERGED', { merge })));
 assert.equal(won.providers.Opire.rankingAdjustment, 5);
 assert.ok(!('paymentConfidence' in won.providers.Opire)); assert.ok(!('reject' in failed.providers.Opire));
});
test('effort requires actual finite nonnegative evidence and does not count estimates', () => {
 const result = outcomeLearning([
  operation('1', 'SOLVING', { effort: { minutes: 20, reference: 'work log' } }),
  operation('2', 'SOLVING', { effort: { minutes: -10, reference: 'bad' } }),
  operation('3', 'SOLVING', { effort: { minutes: 30 } }, { effortEstimate: 500 }),
  operation('4', 'SOLVING', { outcome: { effortMinutes: Infinity, reference: 'invalid' } })
 ]).providers.Opire;
 assert.equal(result.actualEffortMinutes, 20); assert.equal(result.effortSamples, 1);
});
test('outcomes remain isolated by provider and input records stay immutable', () => {
 const records = [operation('1', 'MERGED', { merge }, { provider: 'GitHub' }), operation('2', 'ABANDONED', { outcome }), operation('3', 'DISCOVERED', {}, { provider: '__proto__' })];
 const before = structuredClone(records); const result = outcomeLearning(records);
 assert.equal(result.providers.GitHub.accepted, 1); assert.equal(result.providers.Opire.completedFailures, 1);
 assert.equal(result.providers.__proto__.observed, 1); assert.deepEqual(records, before);
 assert.deepEqual(outcomeLearning().sampleSize, 0);
});
