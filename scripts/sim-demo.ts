import { content } from '../packages/content/src/index';
import { createMatch, neutral, step, stateHash } from '../packages/sim/src/index';
let s = createMatch(content);
for (let tick = 0; tick < 10000; tick++) {
  const p = neutral();
  p.axis = tick % 180 < 90 ? 1 : -1;
  p.light = tick % 24 === 0;
  s = step(s, [p, neutral()], content);
}
console.log(
  JSON.stringify({ tick: s.tick, phase: s.phase, wins: s.wins, hash: stateHash(s) }, null, 2),
);
