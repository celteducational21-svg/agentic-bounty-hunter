# Independent QA — job-09

Reviewer: `independent_qa_5`  
Frozen revision: `08745712ad624121cdb9bf4b5343f97fca825a42`  
Verdict: **PASS**  
First pass: **true**

## Provenance and reproduction

I created a fresh worktree at pre-fix revision `5085b257c801507460270b747f645276fbc1d937` and applied only the submitted `solution.patch`. Its staged tree was `af91008cb843eeaa36831e7a67eb7cf8814caaf5`, exactly matching the frozen solver revision's tree.

The independent baseline returned `\\-` for a literal hyphen and `new RegExp(output, "u")` raised `SyntaxError: Invalid escape`, reproducing the issue.

## Acceptance and edge probes

The patched function returns `\\x2d`, compiles with the Unicode flag, and matches the literal hyphen. Independent probes also passed for:

- Anchored Unicode round-trips of `-`, `a-b`, Greek text, emoji mixed with every regex operator, and non-ASCII dash/minus characters.
- A generated escape embedded inside a Unicode character class.
- A generated escape surrounded by grouped and repeated regex syntax.
- Exact literal matching of the full operator set `|\\{}()[]^$+*?.-`.
- Existing exact `TypeError("Expected a string")` behavior for undefined, null, number, object, array, and symbol inputs.

The replacement is narrow and explainable: operators retain their existing backslash escaping, while ASCII hyphen uses a hexadecimal escape that is legal and literal both inside and outside Unicode character classes.

## Checks

| Check | Result | Evidence |
|---|---|---|
| Acceptance criteria | PASS | Unicode compilation and literal matching pass in multiple surrounding contexts. |
| Tests | PASS | Complete AVA suite: 3 passed. |
| Regressions | PASS | Independent metacharacter, Unicode, character-class, grouping, and type-validation probes pass. |
| Explainability | PASS | Two-stage replacement directly isolates the Unicode-invalid identity escape. |
| PR readiness | PASS | Minimal production change, focused test, clean patch, and complete draft. |
| Build | NOT_APPLICABLE | Source-only CommonJS package; syntax checks and package dry-run pass. |
| Lint | PASS | XO passes under the compatible Node 12 runtime. |
| Typecheck | PASS | TSD passes with the historical compatible type package. |

Limitations: Linux only. The old unpinned development stack required Node 12.22.12 and transient `@types/node@12`; production probes also passed on Node 24.19.0. No upstream accepted solution or audit data was accessed, and no public action was taken.
