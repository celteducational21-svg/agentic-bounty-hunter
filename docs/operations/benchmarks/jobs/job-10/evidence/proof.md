# job-10 proof — SIMULATION / HISTORICAL REPLAY — NOT PAID

Started 2026-09-17T10:35:43Z. Only supplied packet/source inspected. package.json runs xo && ava && tsd; no custom build/install scripts. npm install with scripts disabled/no lockfile. Runtime inspection confirms require(.) is function and .default is undefined.

Changed type regression to import pLimit = require('.'), mirroring runtime module.exports. Baseline tsd produces eight errors, headed by TS2349 not callable / no call signatures. Independent compiler fixture with the original declaration copied from supplied baseline produces the same TS2349 on Node24 and compatible Node18. Exact commands/output logged. Proof completed 2026-09-17T10:38:19Z.

Root cause: index.js exports the function directly using module.exports; index.d.ts describes an ES default-export module. A CommonJS import therefore becomes a non-callable module namespace in the type system.

Environment issues distinguished from reproduction: initial tsc path absent; used tsd bundled TypeScript. Initial latest transitive @types/node incompatible with bundled compiler; installed @types/node12.20.55 no-save. Legacy XO crashes on Node24 removed util.isDate; provisioned node-linux-x64@18.20.8 after inspecting scripts metadata, with lifecycle scripts disabled. No project dependency changes or runtime polyfills introduced.
