import pLimit from '../repo';
const result: Promise<string> = pLimit(1)(() => 'interop-ok');
result.then(console.log);
