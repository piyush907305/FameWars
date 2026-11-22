import { describe, it, expect } from 'vitest';
import { content, parseSpecialContent, type Content } from '../../content/src/index';
import { createMatch, step, neutral, stateHash, type Input, type MatchState } from './index';
import replay from '../../../tests/replays/specials-10000.json';
const input = (x: Partial<Input> = {}): Input => ({ ...neutral(), ...x });
function configured(id = 'shohrat-pehle', slot = 0): Content {
  const c = structuredClone(content);
  c.specials!.enabled = true;
  const d = c.specials!.definitions.find((x) => x.id === id)!;
  d.enabled = true;
  d.fighterId = c.fighters[slot]!.id;
  return c;
}
function close(c: Content) {
  const s = createMatch(c);
  s.actors[0].x = -320;
  s.actors[1].x = 320;
  s.actors[0].meter = 1000;
  s.actors[1].meter = 1000;
  return s;
}
function advance(s: MatchState, c: Content, n: number, a: Input = neutral(), b: Input = neutral()) {
  for (let i = 0; i < n; i++) s = step(s, [a, b], c);
  return s;
}
function counter(c: Content, slot = 0) {
  let s = close(c);
  s = step(
    s,
    slot === 0
      ? [input({ super: true }), input({ light: true })]
      : [input({ light: true }), input({ super: true })],
    c,
  );
  return advance(s, c, 6);
}
describe('versioned optional staged specials', () => {
  it('keeps legacy snapshot shape and refuses incompatible content/snapshot revisions', () => {
    expect(createMatch(content).version).toBe(1);
    expect(createMatch(content)).not.toHaveProperty('specials');
    const c = configured(),
      s = createMatch(c);
    expect(s.version).toBe(2);
    expect(() => step(createMatch(content), [neutral(), neutral()], c)).toThrow('version');
    expect(() => step(s, [neutral(), neutral()], content)).toThrow('version');
    s.specials!.contentRevision = 'wrong';
    expect(() => step(s, [neutral(), neutral()], c)).toThrow('revision');
  });
  it('pays costs once, consumes buffered start once, never falls back to ordinary super', () => {
    const c = configured();
    let s = close(c);
    s.actors[0].meter = 999;
    s = step(s, [input({ super: true }), neutral()], c);
    expect(s.actors[0].move).toBeNull();
    s = close(c);
    s = step(s, [input({ super: true }), neutral()], c);
    expect(s.actors[0].meter).toBe(0);
    expect(s.actors[0].stamina).toBe(7600);
    const instance = s.specials!.actors[0].run!.instance;
    s = advance(s, c, 30, input({ super: true }));
    expect(s.specials!.actors[0].run!.instance).toBe(instance);
    expect(s.actors[0].stamina).toBe(7600);
  });
  it('counter confirms a real eligible hit, cancels it, locks target and hits each stage once', () => {
    const c = configured();
    let s = counter(c);
    expect(s.actors[0].health).toBe(1000);
    expect(s.specials!.actors[0].run!.confirmed).toBe(true);
    expect(s.events.some((e) => e.kind === 'counter')).toBe(true);
    expect(s.actors[1].move).toBeNull();
    s = advance(s, c, 12);
    expect(s.actors[1].health).toBe(880);
    const x = s.specials!.actors[0].run!.targetX;
    s = advance(s, c, 20, neutral(), input({ axis: 1, jump: true, heavy: true }));
    expect(s.actors[1].x).toBe(x);
    s = advance(s, c, 200);
    expect(s.actors[1].health).toBe(700);
    expect(s.specials!.actors[0].run).toBeNull();
  });
  it('a missed counter causes no damage/capture and runs its entire recovery', () => {
    const c = configured();
    let s = step(close(c), [input({ super: true }), neutral()], c);
    s = advance(s, c, 179);
    expect(s.specials!.actors[0].run?.localTick).toBe(179);
    expect(s.actors[1].health).toBe(1000);
    s = advance(s, c, 1);
    expect(s.specials!.actors[0].run).toBeNull();
  });
  it('counter window includes start and excludes its end; lows and supers bypass it', () => {
    for (const [tick, kind, confirmed] of [
      [0, 'light', true],
      [11, 'light', true],
      [12, 'light', false],
      [3, 'kick', false],
      [3, 'super', false],
    ] as const) {
      const c = configured();
      let s = step(close(c), [input({ super: true }), neutral()], c);
      // Arrange an already active incoming intent at the next local counter tick.
      const desired = Math.max(0, tick - 1);
      s.specials!.actors[0].run!.localTick = desired;
      const m = c.moves.find((x) => x.id === kind)!;

      s.actors[1].state = 'attack';
      s.actors[1].move = kind;
      s.actors[1].moveFrame = m.startup - 1;
      if (tick === 0) {
        s = close(c);
        s.actors[1].state = 'attack';
        s.actors[1].move = kind;
        s.actors[1].moveFrame = m.startup - 1;
        s = step(s, [input({ super: true }), neutral()], c);
      } else s = step(s, [neutral(), neutral()], c);
      expect(s.events.some((e) => e.kind === 'counter')).toBe(confirmed);
    }
  });
  it('two counter starts alone miss, and counter confirmation is symmetric by actor slot', () => {
    const c = configured();
    const d = structuredClone(c.specials!.definitions.find((x) => x.id === 'shohrat-pehle')!);
    d.id = 'second-counter';
    d.fighterId = c.fighters[1]!.id;
    c.specials!.definitions.push(d);
    let s = step(close(c), [input({ super: true }), input({ super: true })], c);
    s = advance(s, c, 30);
    expect(s.actors.map((x) => x.health)).toEqual([1000, 1000]);
    expect(s.specials!.actors.map((x) => x.run!.confirmed)).toEqual([false, false]);
    const reverse = configured('shohrat-pehle', 1);
    const r = counter(reverse, 1);
    expect(r.specials!.actors[1].run!.confirmed).toBe(true);
  });
  it('freezes special-local clock/timer during hit stop and cancels damage after timeout', () => {
    const c = configured();
    let s = counter(c);
    s = advance(s, c, 12);
    const local = s.specials!.actors[0].run!.localTick,
      remaining = s.remaining;
    expect(s.hitStop).toBe(3);
    s = advance(s, c, 3);
    expect(s.specials!.actors[0].run!.localTick).toBe(local);
    expect(s.remaining).toBe(remaining);
    s.remaining = 1;
    s.actors[1].stamina = 100;
    s = step(s, [neutral(), neutral()], c);
    expect(s.phase).toBe('finisher');
    expect(s.specials!.actors.every((x) => x.run === null)).toBe(true);
    const health = s.actors[1].health;
    s = advance(s, c, 150);
    expect(s.actors[1].health).toBe(health);
  });
  it('emits stable ordered presentation IDs and JSON snapshots resume mid-stage exactly', () => {
    const c = configured();
    let s = counter(c);
    s = advance(s, c, 50);
    const original = JSON.stringify(s),
      inputs = [neutral(), neutral()] as const;
    let a = s,
      b = JSON.parse(original) as MatchState;
    let previousId = s.eventCounter;
    for (let n = 0; n < 200; n++) {
      a = step(a, inputs, c);
      b = step(b, inputs, c);
      for (const e of a.events) {
        expect(e.id).toBeGreaterThan(previousId);
        previousId = e.id;
      }
      expect(stateHash(a)).toBe(stateHash(b));
    }
    expect(JSON.stringify(s)).toBe(original);
  });
  it('camera skip during combat cannot change state, damage, RNG or duration', () => {
    const c = configured();
    let a = counter(c),
      b = structuredClone(a);
    for (let n = 0; n < 160; n++) {
      a = step(a, [neutral(), neutral()], c);
      b = step(b, [input({ skip: true }), neutral()], c);
      expect(stateHash(b)).toBe(stateHash(a));
    }
  });
  it('post-round enclosure emits only presentation and cannot modify terminal result', () => {
    const c = configured('pinjra-band');
    let s = close(c);
    s.remaining = 1;
    s.actors[1].stamina = 5000;
    s = step(s, [neutral(), neutral()], c);
    expect(s.phase).toBe('finisher');
    expect(s.specials!.actors[0].run!.id).toBe('pinjra-band');
    const terminal = structuredClone(s.terminal),
      wins = [...s.wins];
    s = advance(s, c, 100);
    expect(s.events.some((e) => e.kind === 'hit')).toBe(false);
    expect(s.terminal).toEqual(terminal);
    expect(s.wins).toEqual(wins);
    s = step(s, [input({ skip: true }), neutral()], c);
    expect(s.specials!.actors[0].run).toBeNull();
  });
});
describe('cringe and scripted roast super', () => {
  it('adds once for a complete whiff and repeated move only after the third', () => {
    const c = configured('latent-talent-round');
    let s = createMatch(c);
    for (let n = 0; n < 4; n++) {
      s = step(s, [input({ light: true }), neutral()], c);
      s = advance(s, c, 25);
    }
    expect(s.specials!.actors[0].cringe).toBe(4 * 60 + 80);
  });
  it('counts a block once, clean hit drains/clamps, and interruption-before-active is not whiff', () => {
    const c = configured();
    let s = close(c);
    s = step(s, [input({ light: true }), input({ block: true })], c);
    s = advance(s, c, 40, neutral(), input({ block: true }));
    expect(s.specials!.actors[0].cringe).toBe(40);
    s = close(c);
    s.specials!.actors[0].cringe = 50;
    s = step(s, [input({ light: true }), neutral()], c);
    s = advance(s, c, 6);
    expect(s.specials!.actors[0].cringe).toBe(0);
    s = close(c);
    s = step(s, [input({ heavy: true }), input({ light: true })], c);
    s = advance(s, c, 45);
    expect(s.specials!.actors[0].cringe).toBe(0);
  });
  it('formula uses snapshot and chooses three unique seeded judges only on valid start', () => {
    const c = configured('latent-talent-round');
    const s = close(c);
    s.specials!.actors[1].cringe = 1000;
    const initial = JSON.stringify(s),
      a = step(s, [input({ super: true }), neutral()], c),
      b = step(s, [input({ super: true }), neutral()], c);
    expect(a).toEqual(b);
    expect(JSON.stringify(s)).toBe(initial);
    expect(new Set(a.specials!.actors[0].run!.judges).size).toBe(3);
    a.specials!.actors[1].cringe = 0;
    const end = advance(a, c, 90);
    expect(end.actors[1].health).toBe(680);
  });
  it('roast can miss, be blocked or be interrupted without future ghost damage', () => {
    const c = configured('latent-talent-round');
    let s = step(createMatch(c), [input({ super: true }), neutral()], c);
    // Not enough meter: invalid start emits no special or judge selection.
    expect(s.specials!.actors[0].run).toBeNull();
    s = createMatch(c);
    s.actors[0].meter = 1000;
    s = step(s, [input({ super: true }), neutral()], c);
    s = advance(s, c, 200);
    expect(s.actors[1].health).toBe(1000);
    s = step(close(c), [input({ super: true }), input({ block: true })], c);
    s = advance(s, c, 90, neutral(), input({ block: true }));
    expect(s.actors[1].health).toBe(1000);
    s = step(close(c), [input({ super: true }), input({ light: true })], c);
    s = advance(s, c, 100);
    expect(s.specials!.actors[0].run).toBeNull();
    expect(s.actors[1].health).toBe(1000);
  });
  it('round reset clears cringe, repeat history, run, and costs are never negative', () => {
    const c = configured();
    let s = close(c);
    s.specials!.actors[0].cringe = 1000;
    s.remaining = 1;
    s.actors[1].stamina = 100;
    s = step(s, [neutral(), neutral()], c);
    s = advance(s, c, 270);
    expect(s.specials!.actors[0].cringe).toBe(0);
    expect(s.specials!.actors[0].lastMove).toBeNull();
  });
  it('10,000-tick enabled replay is deterministic across restore and immutable input/state', () => {
    const c = configured(replay.specialId);
    let a = close(c),
      b = structuredClone(a);
    expect(c.specials!.revision).toBe(replay.contentRevision);
    const script = replay.script;
    for (let t = 0; t < replay.ticks; t++) {
      const x = input({
        axis: t % script.axisPeriod < script.axisSwitch ? 1 : -1,
        super: t % script.superEvery === 0,
        light: t % script.lightEvery === 0,
      });
      const y = input({
        axis: t % script.axisPeriod < script.axisSwitch ? -1 : 1,
        kick: t % script.kickEvery === 0,
        block: t % script.blockPeriod > script.blockAfter,
      });
      const before = JSON.stringify(a),
        inputs = JSON.stringify([x, y]);
      const next = step(a, [x, y], c);
      expect(JSON.stringify(a)).toBe(before);
      a = next;
      b = step(b, [x, y], c);
      if (t % 137 === 0) b = JSON.parse(JSON.stringify(b)) as MatchState;
      expect(JSON.stringify([x, y])).toBe(inputs);
      expect(stateHash(a)).toBe(stateHash(b));
    }
    expect(a.tick).toBe(10000);
    expect(stateHash(a)).toBe(replay.expectedHash);
  });
});
it('special content parser rejects unknown keys, bad stages, hit bounds, duplicate bindings and damaging finishers', () => {
  const valid = structuredClone(content.specials!);
  expect(parseSpecialContent(valid)).toEqual(valid);
  const edits = [
    (x: typeof valid) => Object.assign(x, { unknown: 1 }),
    (x: typeof valid) => {
      x.definitions[0]!.durationTicks++;
    },
    (x: typeof valid) => {
      x.definitions[0]!.hits[0]!.tick = 999;
    },
    (x: typeof valid) => {
      const d = x.definitions.find((d) => d.kind === 'finisher')!;
      d.damageCap = 1;
    },
    (x: typeof valid) => {
      x.definitions[0]!.enabled = true;
      x.definitions.push(structuredClone(x.definitions[0]!));
    },
  ];
  for (const edit of edits) {
    const x = structuredClone(valid);
    edit(x);
    expect(() => parseSpecialContent(x)).toThrow();
  }
});

it('simultaneous ordinary and staged impacts trade, and presentation flags cannot change a combat hash', () => {
  const c = configured('latent-talent-round');
  let s = step(close(c), [input({ super: true }), neutral()], c);
  s.specials!.actors[0].run!.localTick = 83;
  s.actors[0].moveFrame = 83;
  s.actors[1].state = 'attack';
  s.actors[1].move = 'light';
  s.actors[1].moveFrame = 5;
  s = step(s, [neutral(), neutral()], c);
  expect(s.actors.map((a) => a.health)).toEqual([940, 840]);
  expect(s.specials!.actors[0].run).toBeNull();
});
it('cringe caps at the configured maximum and differing moves reset the repeat chain', () => {
  const c = configured();
  let s = createMatch(c);
  s.specials!.actors[0].cringe = 990;
  s = step(s, [input({ light: true }), neutral()], c);
  s = advance(s, c, 25);
  expect(s.specials!.actors[0].cringe).toBe(1000);
  s = step(s, [input({ heavy: true }), neutral()], c);
  expect(s.specials!.actors[0].repeatCount).toBe(1);
  expect(s.specials!.actors[0].lastMove).toBe('heavy');
});
it('counter-confirm invulnerability protects only its declared half-open range', () => {
  const c = configured();
  let s = counter(c);
  s = advance(s, c, 6);
  expect(s.specials!.actors[0].run!.localTick).toBe(12);
  s.actors[1].state = 'attack';
  s.actors[1].move = 'light';
  s.actors[1].moveFrame = 6;
  s = step(s, [neutral(), neutral()], c);
  expect(s.actors[0].health).toBe(1000);
  s.specials!.actors[0].run!.localTick = 155;
  s.hitStop = 0;
  s.actors[1].state = 'attack';
  s.actors[1].move = 'light';
  s.actors[1].moveFrame = 5;
  s.actors[1].didHit = false;
  s = step(s, [neutral(), neutral()], c);
  expect(s.actors[0].health).toBe(940);
  expect(s.specials!.actors[0].run).toBeNull();
});

it('captured targets retain impact knockback rather than snapping back on the next tick', () => {
  const c = configured('mic-drop');
  let s = counter(c);
  s = advance(s, c, 54);
  const x = s.actors[1].x;
  expect(s.actors[1].health).toBe(740);
  s = advance(s, c, 10);
  expect(s.actors[1].x).toBe(x);
  expect(s.specials!.actors[0].run!.targetX).toBe(x);
});
