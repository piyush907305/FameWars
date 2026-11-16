import type { Actor, ActorState, Content, Input, MatchState, Rect, Action } from './types';
import { neutral } from './types';
export * from './types';
const activeStates: ActorState[] = [
  'idle',
  'walk',
  'crouch',
  'jump',
  'attack',
  'block',
  'hitstun',
  'blockstun',
  'staggered',
];
export const transitions: Record<ActorState, readonly ActorState[]> = {
  idle: [...activeStates, 'KO', 'finisher', 'win'],
  walk: [...activeStates, 'KO', 'finisher', 'win'],
  crouch: [...activeStates, 'KO', 'finisher', 'win'],
  jump: ['jump', 'idle', 'hitstun', 'staggered', 'KO', 'finisher', 'win'],
  attack: ['attack', 'idle', 'hitstun', 'blockstun', 'staggered', 'KO', 'finisher', 'win'],
  block: [...activeStates, 'KO', 'finisher', 'win'],
  hitstun: ['jump', 'hitstun', 'idle', 'staggered', 'KO', 'finisher', 'win'],
  blockstun: ['blockstun', 'idle', 'hitstun', 'staggered', 'KO', 'finisher', 'win'],
  staggered: ['staggered', 'idle', 'hitstun', 'KO', 'finisher', 'win'],
  KO: ['KO', 'idle', 'win'],
  finisher: ['finisher', 'win', 'idle'],
  win: ['win', 'idle'],
};
export function transition(a: Actor, to: ActorState, ticks = 0): void {
  if (!transitions[a.state].includes(to)) throw new Error(`Invalid transition ${a.state} -> ${to}`);
  a.state = to;
  a.stateTicks = ticks;
}
export function randomStep(seed: number): number {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >>> 17;
  x ^= x << 5;
  return x >>> 0;
}
export function createMatch(
  c: Content,
  ids: [string, string] = [c.fighters[0]!.id, c.fighters[1]!.id],
  seed = 42,
): MatchState {
  const actors = ids.map((id, i) => {
    if (!c.fighters.some((f) => f.id === id)) throw new Error('Unknown fighter');
    return {
      id,
      x: c.arena.spawns[i]!,
      y: 0,
      vy: 0,
      facing: i === 0 ? 1 : -1,
      health: c.balance.health,
      stamina: c.balance.stamina,
      meter: 0,
      state: 'idle',
      stateTicks: 0,
      move: null,
      moveFrame: 0,
      didHit: false,
      dashTicks: 0,
      idleTicks: 0,
      landingTicks: 0,
      buffer: null,
      bufferUntil: 0,
    } as Actor;
  }) as [Actor, Actor];
  return {
    version: 1,
    tick: 0,
    rng: seed >>> 0 || 1,
    phase: 'fight',
    phaseTicks: 0,
    round: 1,
    remaining: c.balance.roundTicks,
    suddenDeath: false,
    drawSegments: 0,
    wins: [0, 0],
    actors,
    previous: [neutral(), neutral()],
    winner: null,
    reason: null,
    events: [],
    eventCounter: 0,
    hitStop: 0,
    terminal: null,
  };
}
export function hurtbox(a: Actor, c: Content): Rect {
  const f = c.fighters.find((f) => f.id === a.id)!;
  return {
    x: a.x - f.body.radius,
    y: a.y,
    w: f.body.radius * 2,
    h:
      a.state === 'crouch' || (a.state === 'block' && a.previousCrouch)
        ? Math.trunc(f.body.height * 0.58)
        : f.body.height,
  };
}
export function attackbox(a: Actor, c: Content): Rect | null {
  if (a.state !== 'attack' || !a.move) return null;
  const m = c.moves.find((m) => m.id === a.move)!;
  if (a.moveFrame < m.startup || a.moveFrame >= m.startup + m.active) return null;
  const b = m.hitbox;
  return { x: a.x + (a.facing === 1 ? b.x : -b.x - b.w), y: a.y + b.y, w: b.w, h: b.h };
}
export function overlaps(a: Rect, b: Rect): boolean {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function emit(
  s: MatchState,
  kind: MatchState['events'][number]['kind'],
  actor: number,
  target = 1 - actor,
) {
  s.events.push({ id: ++s.eventCounter, tick: s.tick, kind, actor, target });
}
function startRound(s: MatchState, c: Content) {
  const ids = s.actors.map((a) => a.id) as [string, string];
  const fresh = createMatch(c, ids, s.rng);
  s.actors = fresh.actors;
  s.previous = fresh.previous;
  s.remaining = c.balance.roundTicks;
  s.suddenDeath = false;
  s.phase = 'fight';
  s.phaseTicks = 0;
  s.winner = null;
  s.reason = null;
  s.terminal = null;
  s.hitStop = 0;
  s.round++;
  s.drawSegments = 0;
  emit(s, 'roundStart', 0);
}
function sudden(s: MatchState, c: Content) {
  s.drawSegments++;
  if (s.drawSegments > c.balance.maxSuddenDeathDraws) {
    s.phase = 'roundResult';
    s.phaseTicks = 0;
    s.winner = null;
    s.reason = 'draw';
    return;
  }
  const fresh = createMatch(c, s.actors.map((a) => a.id) as [string, string], s.rng);
  s.actors = fresh.actors;
  for (const a of s.actors) {
    a.health = c.balance.suddenDeathHealth;
    a.stamina = c.balance.suddenDeathStamina;
  }
  s.previous = [neutral(), neutral()];
  s.suddenDeath = true;
  s.remaining = c.balance.suddenDeathTicks;
  s.hitStop = 0;
}
function finish(s: MatchState, winner: 0 | 1, c: Content, reason: MatchState['reason']) {
  s.winner = winner;
  s.reason = reason;
  s.wins[winner]++;
  s.terminal = {
    health: [s.actors[0].health, s.actors[1].health],
    stamina: [s.actors[0].stamina, s.actors[1].stamina],
  };
  s.phase = 'finisher';
  s.phaseTicks = 0;
  transition(s.actors[winner], 'finisher');
  s.actors[winner].move = null;
  s.actors[winner].dashTicks = 0;
  transition(s.actors[1 - winner]!, 'KO');
  emit(s, 'roundEnd', winner);
  emit(s, 'finisher', winner);
  void c;
}
const canAct = (a: Actor) =>
  ['idle', 'walk', 'crouch', 'block'].includes(a.state) && a.y === 0 && a.landingTicks === 0;
function actionEdge(input: Input, previous: Input): Action | null {
  for (const k of ['super', 'heavy', 'kick', 'light', 'dash'] as const)
    if (input[k] && !previous[k]) return k;
  return null;
}
export function step(state: MatchState, inputs: readonly [Input, Input], c: Content): MatchState {
  const s: MatchState = structuredClone(state);
  s.tick++;
  s.events = [];
  s.rng = randomStep(s.rng);
  s.phaseTicks++;
  const b = c.balance;
  if (s.phase === 'matchResult') return s;
  if (s.phase === 'roundResult') {
    if (s.phaseTicks >= b.roundResultTicks || inputs.some((i) => i.skip)) startRound(s, c);
    return s;
  }
  if (s.phase === 'finisher') {
    if (
      s.phaseTicks >= b.finisherTicks ||
      (s.phaseTicks >= b.finisherSkipAfter && inputs.some((i) => i.skip))
    ) {
      if (s.winner !== null) transition(s.actors[s.winner], 'win');
      s.phase = s.wins.some((w) => w >= 2) ? 'matchResult' : 'roundResult';
      s.phaseTicks = 0;
    }
    return s;
  }
  // Register attack edges during hit stop too; the three-frame buffer is sim-tick based.
  s.actors.forEach((a, i) => {
    const edge = actionEdge(inputs[i]!, s.previous[i]!);
    if (edge) {
      a.buffer = edge;
      a.bufferUntil = s.tick + b.bufferFrames - 1;
    }
    if (a.bufferUntil < s.tick) a.buffer = null;
  });
  if (s.hitStop > 0) {
    s.hitStop--;
    s.previous = structuredClone(inputs) as [Input, Input];
    return s;
  }
  s.remaining--;
  s.actors.forEach((a, i) => {
    const input = inputs[i]!;
    const other = s.actors[1 - i]!;
    if (a.y > 0 && a.state !== 'jump') {
      a.vy -= b.gravity;
      a.y = Math.max(0, a.y + a.vy);
      if (a.y === 0) a.vy = 0;
    }
    if (a.state !== 'attack') a.facing = other.x >= a.x ? 1 : -1;
    a.previousCrouch = input.crouch;
    if (a.landingTicks > 0) a.landingTicks--;
    if (['hitstun', 'blockstun', 'staggered'].includes(a.state)) {
      if (--a.stateTicks <= 0) {
        if (a.state === 'staggered') a.stamina = b.staggerRecovery;
        transition(a, a.y > 0 ? 'jump' : 'idle');
      } else return;
    }
    if (a.state === 'attack') {
      const m = c.moves.find((m) => m.id === a.move)!;
      a.moveFrame++;
      if (a.moveFrame >= m.startup + m.active + m.recovery) {
        a.move = null;
        transition(a, 'idle');
      } else return;
    }
    if (a.state === 'jump') {
      a.vy -= b.gravity;
      a.y += a.vy;
      if (a.y <= 0) {
        a.y = 0;
        a.vy = 0;
        a.landingTicks = b.landingTicks;
        transition(a, 'idle');
      }
      return;
    }
    if (a.dashTicks > 0) {
      a.x += a.facing * b.dashSpeed;
      a.dashTicks--;
      transition(a, 'walk');
      return;
    }
    if (canAct(a) && a.buffer) {
      const action = a.buffer;
      if (action === 'dash' && a.stamina >= b.dashCost) {
        a.stamina -= b.dashCost;
        a.dashTicks = b.dashTicks;
        a.buffer = null;
        transition(a, 'walk');
        a.idleTicks = 0;
        return;
      }
      const m = c.moves.find((m) => m.id === action);
      if (
        m &&
        m.allowedStates.some((allowed) => allowed === a.state) &&
        c.fighters.find((f) => f.id === a.id)!.moves.includes(m.id) &&
        a.stamina >= m.staminaCost &&
        a.meter >= m.meterCost
      ) {
        a.stamina -= m.staminaCost;
        a.meter -= m.meterCost;
        a.move = m.id;
        a.moveFrame = 0;
        a.didHit = false;
        a.buffer = null;
        a.idleTicks = 0;
        transition(a, 'attack');
        return;
      }
    }
    if (input.jump && !s.previous[i]!.jump && a.y === 0 && a.landingTicks === 0) {
      a.vy = b.jumpVelocity;
      a.y = a.vy;
      transition(a, 'jump');
      a.idleTicks = 0;
      return;
    }
    if (input.block && a.stamina > 0) {
      const cost = b.blockPerTick + (a.state === 'block' ? 0 : b.blockEntryCost);
      a.stamina = Math.max(0, a.stamina - cost);
      transition(a, 'block');
      a.idleTicks = 0;
      return;
    }
    if (input.crouch) {
      transition(a, 'crouch');
      a.idleTicks = 0;
      return;
    }
    if (input.axis) {
      a.x += input.axis * b.walkSpeed;
      transition(a, 'walk');
      a.idleTicks = 0;
      return;
    }
    transition(a, 'idle');
    a.idleTicks++;
    if (a.idleTicks >= b.regenDelay) a.stamina = Math.min(b.stamina, a.stamina + b.regenPerTick);
  });
  // Stage/pushbox resolution uses integer coordinates with a stable tie rule.
  const radius = (a: Actor) => c.fighters.find((f) => f.id === a.id)!.body.radius;
  for (const a of s.actors)
    a.x = Math.max(c.arena.minX + radius(a), Math.min(c.arena.maxX - radius(a), a.x));
  const [a0, a1] = s.actors;
  const gap = radius(a0) + radius(a1);
  if (Math.abs(a1.x - a0.x) < gap && Math.abs(a0.y - a1.y) < 1000) {
    const sign = a1.x >= a0.x ? 1 : -1;
    const mid = Math.trunc((a0.x + a1.x) / 2);
    a0.x = mid - sign * Math.trunc(gap / 2);
    a1.x = a0.x + sign * gap;
    const shift =
      Math.max(0, c.arena.minX + radius(a0) - Math.min(a0.x, a1.x)) -
      Math.max(0, Math.max(a0.x, a1.x) - (c.arena.maxX - radius(a0)));
    a0.x += shift;
    a1.x += shift;
  }
  const hits = s.actors.map((a, i) => {
    const box = attackbox(a, c);
    const target = s.actors[1 - i]!;
    if (!box || a.didHit || !overlaps(box, hurtbox(target, c))) return null;
    const m = c.moves.find((m) => m.id === a.move)!;
    const defended =
      target.state === 'block' &&
      (m.hitLevel === 'mid' ||
        (m.hitLevel === 'low' ? inputs[1 - i]!.crouch : !inputs[1 - i]!.crouch)) &&
      target.facing === -a.facing;
    return { i, m, defended, facing: a.facing };
  });
  for (const hit of hits) {
    if (!hit) continue;
    const { i, m, defended, facing } = hit;
    const attacker = s.actors[i]!,
      target = s.actors[1 - i]!;
    attacker.didHit = true;
    if (defended) {
      transition(target, 'blockstun', m.blockstun);
      emit(s, 'block', i);
    } else {
      target.health = Math.max(0, target.health - m.damage);
      target.x += facing * m.knockback;
      target.move = null;
      target.dashTicks = 0;
      transition(target, 'hitstun', m.hitstun);
      emit(s, 'hit', i);
    }
    if (m.id !== 'super')
      attacker.meter = Math.min(b.meter, attacker.meter + (defended ? b.blockMeter : b.hitMeter));
    s.hitStop = b.hitStopTicks;
  }
  for (const a of s.actors) {
    a.x = Math.max(c.arena.minX + radius(a), Math.min(c.arena.maxX - radius(a), a.x));
    if (a.health === 0) transition(a, 'KO');
    else if (a.stamina === 0 && a.state !== 'staggered') {
      a.move = null;
      a.dashTicks = 0;
      a.idleTicks = 0;
      transition(a, 'staggered', b.staggerTicks);
      emit(s, 'stagger', s.actors.indexOf(a));
    }
  }
  const [a, d] = s.actors;
  if (a.health === 0 && d.health === 0) {
    if (a.stamina !== d.stamina) finish(s, a.stamina > d.stamina ? 0 : 1, c, 'KO');
    else sudden(s, c);
  } else if (a.health === 0 || d.health === 0)
    finish(s, a.health > 0 ? 0 : 1, c, s.suddenDeath ? 'sudden-death' : 'KO');
  else if (s.remaining <= 0) {
    if (a.stamina !== d.stamina) finish(s, a.stamina > d.stamina ? 0 : 1, c, 'timeout');
    else if (a.health !== d.health) finish(s, a.health > d.health ? 0 : 1, c, 'timeout');
    else sudden(s, c);
  }
  s.previous = structuredClone(inputs) as [Input, Input];
  return s;
}
export function stateHash(state: MatchState): string {
  const text = JSON.stringify(state);
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, '0');
}
