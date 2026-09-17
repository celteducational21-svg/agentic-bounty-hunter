import pLimit = require('./repo');
import {Limit} from './repo';
const limit: Limit = pLimit(2);
const result: Promise<string> = limit((n: number, s: string) => Promise.resolve(s + n), 3, 'answer');
const count: number = limit.activeCount + limit.pendingCount;
result.then(value => { if(value !== 'answer3') { throw new Error(value); } console.log('PASS independent CommonJS generics, named type and runtime'); });
