import { readFileSync, writeFileSync } from 'node:fs';
import { content } from '../packages/content/src/index';
import { createMatch, step, stateHash, type Input } from '../packages/sim/src/index';
const p = 'tests/replays/scripted.json';
const f = JSON.parse(readFileSync(p, 'utf8')) as {
  seed: number;
  inputs: [Input, Input][];
  expectedHash: string;
};
let s = createMatch(content, undefined, f.seed);
for (const i of f.inputs) s = step(s, i, content);
f.expectedHash = stateHash(s);
writeFileSync(p, JSON.stringify(f) + '\n');
console.log(f.expectedHash);
