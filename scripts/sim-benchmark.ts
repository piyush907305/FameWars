import { performance } from 'node:perf_hooks';
import { writeFileSync } from 'node:fs';
import { content } from '../packages/content/src/index';
import { createMatch, step, neutral } from '../packages/sim/src/index';
import { cpuInput } from '../packages/ai/src/index';
let s = createMatch(content);
const times: number[] = [];
for (let i = 0; i < 10000; i++) {
  if (s.phase === 'matchResult') s = createMatch(content, undefined, s.rng);
  const a = neutral();
  a.axis = s.actors[1].x > s.actors[0].x ? 1 : -1;
  a.light = i % 24 === 0;
  const b = cpuInput(s, 1, 'hard');
  const start = performance.now();
  s = step(s, [a, b], content);
  times.push(performance.now() - start);
}
times.sort((a, b) => a - b);
const result = {
  runtime: process.version,
  platform: process.platform,
  arch: process.arch,
  ticks: 10000,
  medianMs: times[5000],
  p95Ms: times[9500],
  maxMs: times[9999],
};
writeFileSync('docs/evidence/sim-benchmark.json', JSON.stringify(result, null, 2) + '\n');
console.log(result);
