# Proof — SIMULATION / HISTORICAL REPLAY, NOT PAID
Inspected supplied parser, tests, README and go.mod only. Setup: supplied Go1.27.1, no dependencies. Full pre-fix tests PASS. New Unmarshal tests added before implementation: 8 failing cases show truncation/spurious empty keys or parsing errors for spaces, tabs, multiple lines, CRLF, blank/empty lines, comments/hash and expansion; quoted control passes. Exact commands and output in commands.log.

Root cause: extractVarValue stops at unicode.IsSpace, sending the rest of the value back into key parsing. Candidate/proof sent to root before patch.
