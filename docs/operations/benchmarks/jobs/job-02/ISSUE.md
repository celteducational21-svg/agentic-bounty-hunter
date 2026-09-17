SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

set_key corrupts values containing backslashes (Windows paths, regexes) on round-trip

https://github.com/theskumar/python-dotenv/issues/661

## Summary

`set_key` (and the `dotenv set` CLI) writes single-quoted values but only escapes single quotes, not backslashes. Since the single-quoted-value parser treats backslash as an escape character, any value containing a backslash is corrupted when read back.

## Reproduction

```python
import dotenv

dotenv.set_key(".env", "PATH", r"C:\Users")
print(dotenv.get_key(".env", "PATH"))   # -> "C:Users"  (backslash lost)

dotenv.set_key(".env", "RE", r"\d+")
print(dotenv.get_key(".env", "RE"))      # -> "d+"
```

The file ends up containing `PATH='C:\Users'`. On read, the single-quote parser decodes `\U` as an escape, so the backslash disappears. Doubling the backslash (`C:\\Users`) collapses to a single one. This affects Windows paths and regular expressions in particular.



Redactions: Removed original issue Root cause and Fix sections to avoid revealing the proposed solution; retained reported symptoms and reproduction.
Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
