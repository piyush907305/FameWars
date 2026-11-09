import { it, expect } from 'vitest';
import { content } from '../../content/src/index';
import { createMatch, step, neutral } from '../../sim/src/index';
import { cpuInput, type Difficulty } from './index';
it('all CPU levels are deterministic and consume legal shared inputs', () => {
  for (const difficulty of ['easy', 'normal', 'hard'] as Difficulty[]) {
    let s = createMatch(content);
    for (let t = 0; t < 500; t++) {
      const before = JSON.stringify(s),
        a = cpuInput(s, 1, difficulty),
        b = cpuInput(s, 1, difficulty);
      expect(a).toEqual(b);
      expect(JSON.stringify(s)).toBe(before);
      expect([-1, 0, 1]).toContain(a.axis);
      s = step(s, [neutral(), a], content);
      expect(s.actors[1].stamina).toBeGreaterThanOrEqual(0);
    }
  }
});
it('CPU has different reaction schedules and never acts after the match', () => {
  const s = createMatch(content);
  s.actors[0].x = -300;
  s.actors[1].x = 300;
  s.tick = 9;
  s.rng = 1;
  expect(cpuInput(s, 1, 'easy').light).toBe(false);
  expect(cpuInput(s, 1, 'hard').light).toBe(true);
  s.phase = 'matchResult';
  expect(cpuInput(s, 1, 'hard')).toEqual(neutral());
});
