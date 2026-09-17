# Unpublished PR draft — SIMULATION / HISTORICAL REPLAY — NOT PAID
Title: Align p-limit type declarations with its CommonJS export
Branch: solver-b/job-10-commonjs-types
Commit: 6473d85e7f87f458b8fdadc1de9336478c0d2cfd
Issue: sindresorhus/p-limit#29

The implementation exports a callable function with module.exports, but the declaration describes an ES default export. CommonJS TypeScript consumers therefore cannot call the imported module. Declare the function with export = and retain Limit in a merged namespace.

Change type tests to CommonJS import, verify the public Limit type and reject a nonexistent .default property. Runtime implementation stays unchanged. Baseline type consumer fails TS2349; fixed consumer compiles/runs, including interoperable default imports.

Validation: Node18 compatible-toolchain XO,9 AVA tests,and tsd all pass; consumer compile/run and diff check pass. Development-only @types/node12 pin resolves old bundled compiler compatibility; Node24 cannot run legacy XO, recorded in evidence. No package manifest/lockfile changes. No PR published; independent QA pending.
