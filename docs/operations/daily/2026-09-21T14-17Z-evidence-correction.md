# Evidence integrity correction — 2026-09-21 14:17Z

The file `2026-09-21T13-05-16.798Z.json.gz` at the prior main revision did not contain a valid gzip stream. Both the repository copy and the retained local copy had the same invalid SHA-256 (`3055805ad09a0804a6d7a93fda49fb30e5049e4d34f1f1e1816c91a9a73b3024`), so the exact raw scan could not be recovered without inventing bytes.

The invalid artifact is removed from the current tree. Its immutable commit history remains available, and the independently written `2026-09-21T13-05-16.798Z-summary.json` plus `2026-09-21T13-13Z-edward-hourly.md` remain the retained evidence for that cycle. No operational count or outcome was reconstructed from the corrupt blob.
