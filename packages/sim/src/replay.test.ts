import { describe, expect, it } from 'vitest';
import { content } from '../../content/src/index';
import { createMatch, stateHash, step, type Input, type MatchState } from './index';
import recording from '../../../tests/replays/10000-ticks.json';

describe('recorded 10,000-tick headless replay', () => {
  it('matches its golden hash and survives a JSON snapshot at tick 5,000', () => {
    let live = createMatch(content, undefined, recording.seed);
    let restored: MatchState | undefined;
    const before = JSON.stringify(recording);
    let ticks = 0;
    let combatTicks = 0;
    for (const run of recording.runs) {
      expect(Number.isSafeInteger(run.ticks) && run.ticks > 0).toBe(true);
      for (let i = 0; i < run.ticks; i++) {
        const inputs = run.inputs as [Input, Input];
        if (live.phase === 'fight') combatTicks++;
        const previous = JSON.stringify(live);
        const old = live;
        live = step(live, inputs, content);
        expect(JSON.stringify(old)).toBe(previous);
        if (restored) restored = step(restored, inputs, content);
        ticks++;
        if (ticks === 5000) restored = JSON.parse(JSON.stringify(live)) as MatchState;
      }
    }
    expect(ticks).toBe(10000);
    expect(ticks).toBe(recording.ticks);
    expect(live.tick).toBe(10000);
    expect(combatTicks).toBeGreaterThan(500);
    expect(stateHash(live)).toBe(recording.expectedHash);
    expect(restored).toEqual(live);
    expect(stateHash(restored!)).toBe(recording.expectedHash);
    expect(JSON.stringify(recording)).toBe(before);
  });
});
