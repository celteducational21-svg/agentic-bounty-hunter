#!/usr/bin/env node
// Trusted local operator entrypoint. No external action or credential handling.
import { readFile, writeFile, rename, open, unlink } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transitionOperation } from '../src/core/operations.js';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const options = {};
for (let i = 0; i < args.length; i += 2) {
  if (!args[i]?.startsWith('--') || args[i + 1] === undefined) throw new Error('Use --option value pairs');
  const key = args[i].slice(2);
  if (!['state-file', 'id', 'to', 'actor', 'reason', 'expected-version', 'evidence-file', 'at'].includes(key)) throw new Error(`Unknown option: ${key}`);
  options[key] = args[i + 1];
}
for (const key of ['id', 'to', 'actor', 'reason', 'expected-version']) if (!options[key]) throw new Error(`Required: --${key}`);
const stateFile = resolve(options['state-file'] || resolve(root, 'docs/operations/state.json'));
const lockPath = `${stateFile}.lock`;
let lock;
let temporary;
try {
  lock = await open(lockPath, 'wx', 0o600);
  const state = JSON.parse(await readFile(stateFile, 'utf8'));
  if (!Array.isArray(state.operations)) throw new Error('State file must contain operations array');
  const index = state.operations.findIndex(record => record.opportunityId === options.id);
  if (index < 0) throw new Error('Unknown opportunity ID; discover/import it first');
  const evidence = options['evidence-file'] ? JSON.parse(await readFile(resolve(options['evidence-file']), 'utf8')) : {};
  const updated = transitionOperation(state.operations[index], options.to, {
    at: options.at || new Date().toISOString(), actor: options.actor, reason: options.reason,
    expectedVersion: Number(options['expected-version']), evidence
  });
  state.operations[index] = updated;
  state.updatedAt = updated.updatedAt;
  temporary = `${stateFile}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
  await rename(temporary, stateFile);
  temporary = null;
  console.log(JSON.stringify({ opportunityId: updated.opportunityId, status: updated.status, version: updated.version,
    eventId: updated.transitions.at(-1).id, persistence: 'LOCAL_ONLY', next: 'Review diff, fast-forward commit/push state and evidence, then mirror committed snapshot through ABH runtime persistence.' }, null, 2));
} finally {
  if (temporary) await unlink(temporary).catch(() => {});
  if (lock) { await lock.close(); await unlink(lockPath); }
}
