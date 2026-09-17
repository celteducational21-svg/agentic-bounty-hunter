# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Unable to match links ended with `\u001B` rather than `\u0007`.

https://github.com/chalk/ansi-regex/issues/56

`ansi-regex` cannot match link regexes that end in `\u0001B`, as the regex only allows `\u0007`.

Example: `\x1b]8;;http://example.com/\x1b\\This is a link\x1b]8;;\x1b\\ hello`
Reference: https://github.com/nodejs/node/issues/53697

Pre-fix SHA: b630317841f9ceef4a834ee31c70bf82f27ba1e3

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
