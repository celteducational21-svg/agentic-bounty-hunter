import pLimit = require('./repo');
pLimit.default(1);
pLimit(1)((x: number) => x, 'wrong');
pLimit(1).activeCount = 3;
