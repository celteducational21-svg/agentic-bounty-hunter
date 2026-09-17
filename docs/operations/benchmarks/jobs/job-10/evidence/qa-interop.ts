import pLimit from './repo';
const result: Promise<number> = pLimit(1)(async () => 42);
result.then(value => { if(value !== 42) { throw new Error('wrong value'); } console.log('PASS independent default import with esModuleInterop'); });
