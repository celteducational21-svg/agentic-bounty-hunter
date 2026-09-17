import assert from 'node:assert/strict';
import ansiRegex from '../repo/index.js';
const input = '\u001B]8;;http://example.com/\u001B\\This is a link\u001B]8;;\u001B\\ hello';
console.log(JSON.stringify({input, matches: input.match(ansiRegex()), stripped: input.replace(ansiRegex(), '')}));
assert.equal(input.replace(ansiRegex(), ''), 'This is a link hello');
