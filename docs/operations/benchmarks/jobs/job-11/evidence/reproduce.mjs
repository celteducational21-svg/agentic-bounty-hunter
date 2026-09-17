import {getEventListeners} from 'node:events';
import pMap from '../repo/index.js';
const {signal} = new AbortController();
console.log('before:', getEventListeners(signal, 'abort').length);
console.log('result:', await pMap([1], value => value, {signal}));
console.log('after:', getEventListeners(signal, 'abort').length);
