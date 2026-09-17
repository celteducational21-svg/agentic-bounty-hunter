# SIMULATION / HISTORICAL REPLAY — NOT PAID WORK

**PASS**, frozen revision `33f394fa3e87365d9d6a31214e9af424f8826258`.

Compared after QA freeze against accepted [more-itertools PR659](https://github.com/more-itertools/more-itertools/pull/659), fix `fc1f9acf1b7e11bbc64b54f8385f2e87ecd87452`. Both guard the materialized remainder before yielding it at the final split boundary. The only implementation distinction is replay's clearer `remainder` variable versus historical buffer reuse.

Replay adds eight boundary combinations rather than the single historical regression. Independent QA passes 693 suite tests and 762 boundary cases plus source-laziness and predicate-budget assertions. Scope is minimal and behavior matches.

Wheel build passes. Historical lint/format/stubtest failures were independently reproduced on unchanged baseline; no clean lint/typecheck claim is made. Runtime validation is Python3.12 only. Ready for simulated owner approval only.
