"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pLimit = require("../repo");
const limit = pLimit(1);
const result = limit((value) => value, 'ok');
result.then(console.log);
