# Unpublished PR draft
SIMULATION / HISTORICAL REPLAY — NOT PAID WORK
Branch: fix/unquoted-whitespace
Commit: 25ac173a1af27467018189061e627d28a78432e4
PR title: Preserve spaces in unquoted dotenv values
Issue: https://github.com/joho/godotenv/issues/204

Unquoted values currently stop at the first whitespace, so MY_ENV=foo bar either truncates and creates a spurious key or errors when followed by another line. Read through the line boundary instead, retaining spaces inside the value while preserving trailing whitespace trimming, comments, variable expansion and quoted parsing.

Add nine public Unmarshal regression cases covering whitespace, newline/CRLF, empty lines, inline comments, literal hashes, expansion and quoted controls. Regression cases fail before the change and pass after. Full race suite, vet, build and formatting checks pass. Exact evidence: commands.log, proof.md, solution.md, result.json, solution.patch. No public actions taken.

## Revision 2 correction
Frozen revision: 1cfdfe67a481004d5453a5f474e877b07f4be514
First patch missed CR-only line endings; now LF, CRLF and CR are supported, including empty values and comment lines. Eleven regressions and full race suite/vet/build pass. Aggregate solution.patch covers both commits; attempt-1 preserves original evidence.
