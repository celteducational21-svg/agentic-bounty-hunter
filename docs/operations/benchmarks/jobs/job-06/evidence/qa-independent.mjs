import assert from 'node:assert/strict';
import ansiRegex from './repo/index.js';
let cases=0;
for(const a of ['\x07','\x1b\\'])for(const z of ['\x07','\x1b\\'])for(const uri of ['https://example.com/a?b=c&d=2#tag','http://example.com/','file:///tmp/a']) {
 const opening=`\x1b]8;;${uri}${a}`,closing=`\x1b]8;;${z}`;
 const input=`before${opening}label${closing}after\x1b[31mred\x1b[0m`;
 assert.deepEqual(input.match(ansiRegex()),[opening,closing,'\x1b[31m','\x1b[0m']);
 assert.equal(input.replace(ansiRegex(),''),'beforelabelafterred');
 assert.equal(input.match(ansiRegex({onlyFirst:true}))[0],opening);cases++;
}
assert.equal('ordinary text with \\ and [x]'.replace(ansiRegex(),''),'ordinary text with \\ and [x]');
console.log(`PASS ${cases} independent mixed-terminator hyperlink cases; URL queries/fragments, adjacent ANSI styles, visible text and onlyFirst`);
