# Independent QA — job-01

PASS for focused documentation correction, first pass. Reviewer `independent_qa_lab`; frozen revision `793425f99da7da72fd30ad42c70925393b61bae5`; completed 2026-09-17T10:33:01.414278+00:00.

The two README examples now match Click's KEY VALUE interface. Independently extracted and executed both actual README commands via the package CLI entrypoint and verified list output. Full suite 132 passed. Source and wheel build (`setup.py sdist bdist_wheel`) passed. Patch is minimal and readable.

Lint is **FAIL_PRE_EXISTING**, F401 at src/dotenv/variables.py:3. The local pre-fix baseline comparison confirms source, tests and lint/typecheck configuration are unchanged. Typecheck is **NOT_RUN**, mypy absent. These are explicit limitations, not successful gates; README-only patch does not introduce implementation or typing changes. Upstream SHA is absent in sanitized repo; comparison used local solver commit's initial parent, never upstream history.

QA initially tried unavailable `python -m dotenv` and modern build module; corrected harness to actual cli entrypoint and historical setup.py build. All initial failures remain in log. Separate QA copy/environment used. No solver patch modification or upstream fix access. Commands and outputs: `qa-commands.log`; independent test: `qa-independent-readme.py`.
