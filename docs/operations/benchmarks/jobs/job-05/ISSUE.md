# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

Bugs in parser around unquoted whitespace and newlines in v1.5.0

https://github.com/joho/godotenv/issues/204

Hi there!

I'd just like to let you know that the following, which worked on v1.4.0, now breaks in v1.5.0:

```
MY_ENV=foo bar
```

It's possible to fix by wrapping into quotes, though:

```
MY_ENV="foo bar"
```

As there isn't any official dotenv specification (AFAIK), I'm not sure if the former is supposed to work in the first place, but it caught my attention and I decided to wait until at least we have a decision if this is going to be addressed or not before upgrading, because it can end up breaking for my users.

Pre-fix SHA: b311b2657d7c3f549674adf6080d032437caa68c

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
