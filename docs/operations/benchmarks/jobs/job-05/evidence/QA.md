# Independent QA — job-05 repair

PASS after repair. firstPass=false; auditDetectedFalsePositive=true; reviewer independent_qa_lab; frozen revision `1cfdfe67a481004d5453a5f474e877b07f4be514`; 2026-09-17T10:43:15.560806+00:00.

Initial independent QA omitted CR-only separators and missed a regression caught by auditor. Initial PASS and logs retained in qa-attempt-1; one regression recorded, zero remaining in final execution.

Repaired parser recognizes CR and LF in values and comments and preserves empty CR-terminated assignments. New independent tests exercise all 27 combinations of LF/CRLF/CR across line boundaries, including comments, empty and quoted/unquoted values, plus three variants of original auditor reproduction. Original five independent composition tests retained. Full suite, race suite, vet, build and whitespace check all pass. Compiler provides typecheck.

Separate QA copy; no upstream fix access. Linux Go1.27.1 only. Exact outputs qa-commands.log; added regression coverage qa_newlines_test.go.
