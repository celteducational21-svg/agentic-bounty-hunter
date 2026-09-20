# Benchmark audit — job-02

Auditor: `benchmark_auditor_5`  
Compared solver revision: `ffe99a75429ad4038cf2922863300c74d53dd2b3`  
Accepted fix: [cattrs PR #419](https://github.com/python-attrs/cattrs/pull/419), squash `acf92d2b790b57273a1c5a835bf164e873554adc`  
Verdict: **PASS**  
Readiness: **READY**

## Accepted-fix comparison

The solver and accepted fix have the same root-cause model and executable change. `gen_structure_annotated` dispatches using the underlying Annotated origin, captures that handler, and returns an adapter that invokes it with the same origin. Their only production-code differences are local names plus the accepted patch's `Callable` return annotation and docstring.

Direct probes produced equivalent results in both trees for:

- `Annotated[str | None, ...]` with a string and `None`, including JSON round trips;
- registered structure and unstructure hooks for `str | int`, including delivery of the exact underlying union to the structure hook;
- `Annotated[Union[Inner, None], ...]` where `Inner` is an attrs class, with both an object value and `None`.

The accepted patch extends an existing attrs-oriented Annotated test. The solver adds standalone optional round-trip and registered-hook tests, and independent QA adds scalar, collection, and nested cases. That is a different test organization but stronger coverage of the same adapter contract.

The solver omits the accepted history entry, return annotation, and docstring. Those are polish differences and do not require behavioral repair. No direct counterexample or regression was found.

`qaFalsePositive: false`  
`requiresRepair: false`
