import pLimit = require('../repo');
const limit: pLimit.Limit = pLimit(1);
const result: Promise<string> = limit((value: string) => value, 'ok');
result.then(console.log);
