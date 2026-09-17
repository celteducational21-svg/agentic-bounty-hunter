# Solution — SIMULATION / HISTORICAL REPLAY — NOT PAID

Declare pLimit as a callable function exported with export =, and merge a namespace containing Limit to retain the public type. Update declaration tests to CommonJS import, verify inferred Limit, and reject nonexistent .default property. Runtime JavaScript unchanged.

On Node18.20.8, XO passes with one existing TODO warning, all9 AVA runtime tests pass, and tsd passes. Original-declaration independent fixture fails TS2349 under same runtime/compiler; patched fixture compiles/runs printing ok. esModuleInterop default-import fixture compiles/runs printing interop-ok on Node24. No build step applies because package ships JavaScript and declarations directly; compilation of consumer fixtures covers emit integration. Git diff check passes. One implementation iteration. Minimum Node10 not tested; runtime18 and24 used. Independent QA pending.
