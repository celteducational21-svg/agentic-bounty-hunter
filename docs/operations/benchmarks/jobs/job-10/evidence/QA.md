# Independent QA — job-10

PASS first pass. Reviewer independent_qa_lab; frozen revision `6473d85e7f87f458b8fdadc1de9336478c0d2cfd`; 2026-09-17T10:45:45.757186+00:00.

XO, 9 AVA tests and tsd pass. Independent consumers compile and execute CommonJS import assignment, existing named Limit type import, argument/return inference and default import with esModuleInterop. Negative consumer correctly rejects a nonexistent default property, wrong argument type and readonly-count mutation. npm packaging dry-run succeeds.

Declaration now models runtime CommonJS callable export through export assignment and merged namespace, retaining Limit API. No runtime source changed. Node18 with project-bundled legacy TypeScript and solver-provisioned Node12 types; minimum Node10 untested. npm11 warns Node18 unsupported although commands pass. Separate QA copy, no upstream access. Exact outputs qa-commands.log; independent consumer sources qa-*.ts.
