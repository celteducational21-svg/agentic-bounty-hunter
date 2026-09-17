import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

test('real control-drill binding refuses missing or nonpassing actual QA checks without replacing reports', () => {
  const script = resolve('scripts/benchmark-control-drills.mjs');
  const dir = mkdtempSync(join(tmpdir(), 'abh-benchmark-binding-'));
  try {
    const evidence = join(dir, 'evidence.json');
    const binding = { solution: { revision: 'frozen', author: 'solver', reference: evidence },
      qa: { result: 'PASS', revision: 'frozen', reviewer: 'qa', reference: evidence } };
    const checks = { acceptanceCriteria: 'PASS', tests: 'PASS', regressions: 'PASS', explainability: 'PASS', prReadiness: 'PASS', build: 'PASS', lint: 'NOT_RUN', typecheck: 'PASS' };
    for (const input of [undefined, checks, { ...checks, lint: 'NOT_APPLICABLE' }]) {
      binding.qa.checks = input;
      writeFileSync(evidence, JSON.stringify(binding));
      const result = spawnSync(process.execPath, [script, evidence], { cwd: dir, encoding: 'utf8' });
      assert.notEqual(result.status, 0);
      assert.match(result.stderr, /Actual QA check/);
      assert.equal(existsSync(join(dir, 'docs/operations/benchmarks/control-drills/report.json')), false);
    }
    binding.qa.notApplicableReasons = { lint: 'Fixture repository has no configured linter' };
    writeFileSync(evidence, JSON.stringify(binding));
    const result = spawnSync(process.execPath, [script, evidence], { cwd: dir, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const report = JSON.parse(readFileSync(join(dir, 'docs/operations/benchmarks/control-drills/report.json'), 'utf8'));
    assert.equal(report.realSolutionEvidence.qa.checks.lint, 'NOT_APPLICABLE');
    const state = JSON.parse(readFileSync(join(dir, 'docs/operations/benchmarks/control-drills/state.json'), 'utf8'));
    assert.equal(state.operations[2].evidence.qa.lint, 'NOT_APPLICABLE');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
