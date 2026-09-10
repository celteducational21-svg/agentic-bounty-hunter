import test from "node:test";
import assert from "node:assert/strict";
import { deduplicate, moneySignal, qualify } from "../src/core/scoring.js";

const now = new Date("2026-09-09T00:00:00Z");
const base = {id:"1",source:"github",title:"$150 bounty: fix parser",body:"",labels:["bounty","good first issue","bug"],updatedAt:"2026-09-08T00:00:00Z",comments:1,assignee:null,isPullRequest:false};

test("recognizes explicit reward signals",()=>assert.equal(moneySignal(base),true));
test("shortlists a fresh beginner paid issue",()=>assert.equal(qualify(base,now).decision,"SHORTLIST"));
test("rejects unpaid issues",()=>assert.equal(qualify({...base,title:"Fix parser",labels:["bug"]},now).decision,"REJECT"));
test("rejects assigned work",()=>assert.equal(qualify({...base,assignee:"someone"},now).decision,"REJECT"));
test("deduplicates by source and id",()=>assert.equal(deduplicate([base,base]).length,1));
