import {getEventListeners} from 'node:events';
import pMap, {pMapSkip} from '../repo/index.js';
for (const [name, input, mapper, options] of [
 ['success', [1], x => x, {}],
 ['empty', [], x => x, {}],
 ['skip', [1], () => pMapSkip, {}],
 ['mapper error', [1], () => {throw new Error('mapper');}, {}],
 ['aggregate error', [1], () => {throw new Error('mapper');}, {stopOnError:false}],
 ['iterator error', {[Symbol.iterator]() {return {next() {throw new Error('iterator');}};}}, x => x, {}],
]) {
 const {signal} = new AbortController();
 try {await pMap(input,mapper,{signal,...options});}catch{}
 console.log(name, 'listeners:', getEventListeners(signal,'abort').length);
}
const controller=new AbortController();
controller.abort(new Error('stop'));
try {await pMap([1],x=>x,{signal:controller.signal});}catch{}
console.log('pre-aborted listeners:',getEventListeners(controller.signal,'abort').length);
