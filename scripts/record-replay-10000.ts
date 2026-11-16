import { readFileSync, writeFileSync } from 'node:fs';
import { content } from '../packages/content/src/index';
import { createMatch, stateHash, step, type Input } from '../packages/sim/src/index';
const file = 'tests/replays/10000-ticks.json';
const recording = JSON.parse(readFileSync(file, 'utf8')) as {
  seed: number;
  ticks: number;
  runs: { ticks: number; inputs: [Input, Input] }[];
  expectedHash: string;
};
let state = createMatch(content, undefined, recording.seed);
for (const run of recording.runs)
  for (let tick = 0; tick < run.ticks; tick++) state = step(state, run.inputs, content);
if (state.tick !== recording.ticks) throw new Error('Replay tick count mismatch');
recording.expectedHash = stateHash(state);
writeFileSync(file, JSON.stringify(recording, null, 2) + '\n');
console.log(JSON.stringify({ ticks: state.tick, expectedHash: recording.expectedHash }));
