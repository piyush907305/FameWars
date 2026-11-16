import { describe, it, expect } from 'vitest';
import { content } from '../../content/src/index';
import {
  createMatch,
  step,
  neutral,
  stateHash,
  transition,
  overlaps,
  attackbox,
  transitions,
  type Input,
  type MatchState,
} from './index';
const input = (patch: Partial<Input> = {}): Input => ({ ...neutral(), ...patch });
function close() {
  const s = createMatch(content);
  s.actors[0].x = -320;
  s.actors[1].x = 320;
  return s;
}
function advance(s: MatchState, n: number, a: Input = neutral(), b: Input = neutral()) {
  for (let i = 0; i < n; i++) s = step(s, [a, b], content);
  return s;
}
describe('pure fixed-step combat', () => {
  it('does not mutate inputs/state and serializes through JSON', () => {
    const s = createMatch(content);
    const before = JSON.stringify(s);
    const next = step(s, [input({ axis: 1 }), neutral()], content);
    expect(JSON.stringify(s)).toBe(before);
    expect(JSON.parse(JSON.stringify(next))).toEqual(next);
    expect(next.actors[0].x).toBe(s.actors[0].x + 45);
  });
  it('central transition table rejects invalid transitions', () => {
    const s = createMatch(content);
    transition(s.actors[0], 'jump');
    expect(() => transition(s.actors[0], 'block')).toThrow();
    expect(Object.keys(transitions)).toHaveLength(12);
  });
  it('jumps, lands and crouches', () => {
    let s = step(createMatch(content), [input({ jump: true }), neutral()], content);
    expect(s.actors[0].state).toBe('jump');
    s = advance(s, 40);
    expect(s.actors[0].y).toBe(0);
    s = step(s, [input({ crouch: true }), neutral()], content);
    expect(s.actors[0].state).toBe('crouch');
  });
  it('hitboxes only activate after startup; damage and hitstun apply once', () => {
    let s = step(close(), [input({ light: true }), neutral()], content);
    expect(attackbox(s.actors[0], content)).toBeNull();
    s = advance(s, 6);
    expect(s.actors[1].health).toBe(940);
    expect(s.actors[1].state).toBe('hitstun');
    s = advance(s, 10);
    expect(s.actors[1].health).toBe(940);
  });
  it('AABB separates nonoverlap and overlap', () => {
    expect(overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 10, y: 0, w: 10, h: 10 })).toBe(false);
    expect(overlaps({ x: 0, y: 0, w: 10, h: 10 }, { x: 9, y: 9, w: 10, h: 10 })).toBe(true);
  });
  it('block stops mid damage and applies blockstun, low kick defeats standing block', () => {
    let s = step(close(), [input({ light: true }), input({ block: true })], content);
    s = advance(s, 6, neutral(), input({ block: true }));
    expect(s.actors[1].health).toBe(1000);
    expect(s.actors[1].state).toBe('blockstun');
    s = step(close(), [input({ kick: true }), input({ block: true })], content);
    s = advance(s, 11, neutral(), input({ block: true }));
    expect(s.actors[1].health).toBe(910);
  });
  it('crouch block stops low kick', () => {
    let s = step(close(), [input({ kick: true }), input({ block: true, crouch: true })], content);
    s = advance(s, 11, neutral(), input({ block: true, crouch: true }));
    expect(s.actors[1].health).toBe(1000);
  });
  it('pays attack/dash/block stamina and idles to regenerate', () => {
    let s = step(close(), [input({ heavy: true }), input({ dash: true })], content);
    expect(s.actors.map((a) => a.stamina)).toEqual([8500, 8800]);
    s = advance(s, 120);
    expect(s.actors[0].stamina).toBe(10000);
    const q = step(createMatch(content), [input({ block: true }), neutral()], content);
    expect(q.actors[0].stamina).toBe(9900);
  });
  it('zero stamina staggers and recovers; cannot spend below zero', () => {
    let s = close();
    s.actors[0].stamina = 600;
    s = step(s, [input({ light: true }), neutral()], content);
    expect(s.actors[0].state).toBe('staggered');
    s = advance(s, 45);
    expect(s.actors[0].stamina).toBe(1500);
    s.actors[0].stamina = 50;
    s = step(s, [input({ heavy: true }), neutral()], content);
    expect(s.actors[0].state).not.toBe('attack');
    expect(s.actors[0].stamina).toBeGreaterThanOrEqual(0);
  });
  it('requires and spends super meter', () => {
    let s = step(close(), [input({ super: true }), neutral()], content);
    expect(s.actors[0].state).not.toBe('attack');
    s = close();
    s.actors[0].meter = 1000;
    s = step(s, [input({ super: true }), neutral()], content);
    expect(s.actors[0].move).toBe('super');
    expect(s.actors[0].meter).toBe(0);
  });
  it('uses exactly a 3-frame attack buffer with no held auto-repeat', () => {
    let s = close();
    transition(s.actors[0], 'hitstun', 3);
    s = step(s, [input({ light: true }), neutral()], content);
    s = advance(s, 2);
    expect(s.actors[0].state).toBe('attack');
    s = close();
    transition(s.actors[0], 'hitstun', 4);
    s = step(s, [input({ light: true }), neutral()], content);
    s = advance(s, 3);
    expect(s.actors[0].state).not.toBe('attack');
    s = advance(
      step(close(), [input({ light: true }), neutral()], content),
      80,
      input({ light: true }),
    );
    expect(s.actors[0].state).toBe('idle');
  });
  it('timeout compares stamina, then health, then sudden death', () => {
    let s = createMatch(content);
    s.remaining = 1;
    s.actors[0].stamina = 9000;
    s = step(s, [neutral(), neutral()], content);
    expect(s.winner).toBe(1);
    s = createMatch(content);
    s.remaining = 1;
    s.actors[1].health = 900;
    s = step(s, [neutral(), neutral()], content);
    expect(s.winner).toBe(0);
    s = createMatch(content);
    s.remaining = 1;
    s = step(s, [neutral(), neutral()], content);
    expect(s.suddenDeath).toBe(true);
    expect(s.actors[0].health).toBe(1);
  });
  it('KO winner always performs even with lower stamina', () => {
    let s = close();
    s.actors[1].health = 50;
    s.actors[0].stamina = 3000;
    s = step(s, [input({ light: true }), neutral()], content);
    s = advance(s, 6);
    expect(s.winner).toBe(0);
    expect(s.phase).toBe('finisher');
    expect(s.actors[0].state).toBe('finisher');
    expect(s.terminal!.stamina[0]).toBeLessThan(s.terminal!.stamina[1]);
  });
  it('resolves trades simultaneously and tied double-KO as sudden death', () => {
    let s = close();
    s.actors.forEach((a) => (a.health = 60));
    s = step(s, [input({ light: true }), input({ light: true })], content);
    s = advance(s, 6);
    expect(s.suddenDeath).toBe(true);
  });
  it('best of three ends at two wins', () => {
    let s = createMatch(content);
    for (let r = 0; r < 2; r++) {
      s.remaining = 1;
      s.actors[1].stamina = 9000;
      s = step(s, [neutral(), neutral()], content);
      s = advance(s, 180);
      if (r === 0) s = advance(s, 90);
    }
    expect(s.phase).toBe('matchResult');
    expect(s.wins).toEqual([2, 0]);
  });
  it('same seed and 10,000 tick inputs produce identical state without mutation', () => {
    let a = createMatch(content, undefined, 123),
      b = createMatch(content, undefined, 123);
    for (let t = 0; t < 10000; t++) {
      const x = input({
          axis: t % 180 < 90 ? 1 : -1,
          light: t % 24 === 0,
          jump: t % 93 === 0,
          block: t % 130 > 100,
        }),
        y = input({ axis: t % 170 < 85 ? -1 : 1, kick: t % 31 === 0 });
      a = step(a, [x, y], content);
      b = step(b, [x, y], content);
      expect(stateHash(a)).toBe(stateHash(b));
    }
    expect(a.tick).toBe(10000);
  });
});

import fixture from '../../../tests/replays/scripted.json';
it('replays a recorded input sequence to the checked-in golden hash', () => {
  let s = createMatch(content, undefined, fixture.seed);
  for (const inputs of fixture.inputs) s = step(s, inputs as [Input, Input], content);
  expect(stateHash(s)).toBe(fixture.expectedHash);
  const restored = JSON.parse(JSON.stringify(s)) as MatchState;
  expect(stateHash(restored)).toBe('49fabaf6');
});

// This regression protects the deliberate replay v2 change: held block cannot
// start a move whose allowedStates exclude block, even when an attack is pressed.
it('honors data allowedStates instead of attacking out of held block', () => {
  let s = createMatch(content);
  s = step(s, [{ ...neutral(), block: true }, neutral()], content);
  s = step(s, [{ ...neutral(), block: true, heavy: true }, neutral()], content);
  expect(s.actors[0].state).toBe('block');
  expect(s.actors[0].move).toBeNull();
});
