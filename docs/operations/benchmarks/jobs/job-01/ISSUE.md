# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

CLI set method is not working as documented

https://github.com/theskumar/python-dotenv/issues/345

Hi,

Thanks for creating such a useful library in Python.

I was exploring the full potential of the library and that is when I came across its [CLI doc](https://github.com/theskumar/python-dotenv#command-line-interface). 

I am currently using version `0.18.0` and there is a `dotenv set` method that is not working as documented.

When I run,
```bash
dotenv set USER=foo
```
I get the following error,
```
Usage: dotenv set [OPTIONS] KEY VALUE
Try 'dotenv set --help' for help.

Error: Missing argument 'VALUE'.
```

However when I run the following,
```bash
dotenv set USER foo
```
then it correctly updates the `.env`  file in current directory.

In other words, **NOT using "=" works**

Pre-fix SHA: b8fdfba09957c6c4872f98c721b185a4ba1711ec

Use only this packet and the supplied pre-fix repository. No upstream lookup, remote git, accepted fixes, post-fix source or discussions. Ground truth is withheld until independent QA is frozen.
