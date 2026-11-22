import type { SpecialDefinition } from '../../content/src/specials';
import type {
  Actor,
  ActorState,
  CombatExtension,
  Content,
  MatchState,
  Rect,
  SimEvent,
  SpecialRun,
  SpecialSnapshot,
} from './types';
export type Hooks = {
  transition: (a: Actor, state: ActorState, ticks?: number) => void;
  emit: (
    s: MatchState,
    kind: SimEvent['kind'],
    actor: number,
    target?: number,
    special?: SimEvent['special'],
  ) => void;
  random: (seed: number) => number;
  hurtbox: (a: Actor, c: Content) => Rect;
  overlaps: (a: Rect, b: Rect) => boolean;
};
export function newSpecialSnapshot(c: Content): SpecialSnapshot {
  const actor = (): CombatExtension => ({
    cringe: 0,
    lastMove: null,
    repeatCount: 0,
    ordinary: null,
    run: null,
  });
  return {
    version: 2,
    contentRevision: c.specials!.revision,
    nextInstance: 0,
    actors: [actor(), actor()],
  };
}
export function assertSpecialSnapshot(s: MatchState, c: Content): void {
  const enabled = !!c.specials?.enabled;
  if (enabled !== (s.version === 2) || enabled !== !!s.specials)
    throw new Error('Incompatible special snapshot/content version');
  if (
    enabled &&
    (s.specials!.version !== 2 || s.specials!.contentRevision !== c.specials!.revision)
  )
    throw new Error('Special content revision mismatch');
}
export const definition = (s: MatchState, i: number, c: Content): SpecialDefinition | undefined => {
  const id = s.specials?.actors[i]?.run?.id;
  return id ? c.specials?.definitions.find((d) => d.id === id && d.enabled) : undefined;
};
export const binding = (
  s: MatchState,
  i: number,
  c: Content,
  finisher = false,
): SpecialDefinition | undefined =>
  c.specials?.enabled
    ? c.specials.definitions.find(
        (d) =>
          d.enabled &&
          d.fighterId === s.actors[i]!.id &&
          (finisher ? d.kind === 'finisher' : d.kind !== 'finisher'),
      )
    : undefined;
const inRange = (tick: number, r: [number, number] | null) => !!r && tick >= r[0] && tick < r[1];
export function capturedBy(s: MatchState, i: number, c: Content): SpecialRun | undefined {
  return (
    s.specials?.actors
      .map((a, j) => ({ run: a.run, def: definition(s, j, c) }))
      .find(
        (x) =>
          x.run?.confirmed &&
          x.run.target === i &&
          inRange(x.run.localTick, x.def?.capture ?? null),
      )?.run ?? undefined
  );
}
export function invulnerable(s: MatchState, i: number, c: Content): boolean {
  const run = s.specials?.actors[i]?.run;
  return !!run?.confirmed && inRange(run.localTick, definition(s, i, c)?.invulnerability ?? null);
}
function payload(run: SpecialRun): NonNullable<SimEvent['special']> {
  return { instance: run.instance, id: run.id, localTick: run.localTick, stage: run.stage };
}
function present(s: MatchState, i: number, d: SpecialDefinition, h: Hooks): void {
  const run = s.specials!.actors[i]!.run!;
  let end = 0,
    stage = 0;
  for (let n = 0; n < d.stages.length; n++) {
    const st = d.stages[n]!;
    end += st.startup + st.active + st.recovery;
    if (run.localTick < end) {
      stage = n;
      break;
    }
  }
  if (stage !== run.stage) {
    run.stage = stage;
    h.emit(s, 'specialStage', i, 1 - i, payload(run));
  }
  for (const cue of d.cues)
    if (cue.tick === run.localTick) {
      // Failed counters do not emit opponent/cinematic cues after their ready pose.
      if (d.kind === 'counter' && !run.confirmed && run.localTick > 0) continue;
      h.emit(s, 'specialCue', i, 1 - i, { ...payload(run), cue: cue.key, cueKind: cue.kind });
    }
}
export function beginSpecial(
  s: MatchState,
  i: number,
  d: SpecialDefinition,
  c: Content,
  h: Hooks,
  finisher = false,
): boolean {
  const a = s.actors[i]!,
    ext = s.specials?.actors[i];
  if (
    !ext ||
    (!finisher &&
      (!d.allowedStates.some((x) => x === a.state) ||
        a.stamina < d.staminaCost ||
        a.meter < d.meterCost))
  )
    return false;
  if (!finisher) {
    a.stamina -= d.staminaCost;
    a.meter -= d.meterCost;
    a.move = 'super';
    a.moveFrame = 0;
    a.didHit = false;
    a.idleTicks = 0;
    a.dashTicks = 0;
    a.buffer = null;
    h.transition(a, 'attack');
  }
  const judges = [...d.judges],
    chosen: string[] = [];
  for (let n = 0; n < d.judgeCount; n++) {
    s.rng = h.random(s.rng);
    const pick = n + (s.rng % (judges.length - n));
    [judges[n], judges[pick]] = [judges[pick]!, judges[n]!];
    chosen.push(judges[n]!);
  }
  ext.run = {
    instance: ++s.specials!.nextInstance,
    id: d.id,
    localTick: 0,
    stage: 0,
    confirmed: false,
    target: null,
    consumedHits: [],
    targetX: 0,
    targetY: 0,
    cringeAtStart: s.specials!.actors[1 - i]!.cringe,
    judges: chosen,
  };
  h.emit(s, 'specialStart', i, 1 - i, { ...payload(ext.run), judges: chosen });
  h.emit(s, 'specialStage', i, 1 - i, payload(ext.run));
  present(s, i, d, h);
  return true;
}
export function cancelSpecial(s: MatchState, i: number, h: Hooks): void {
  const ext = s.specials?.actors[i];
  if (!ext?.run) return;
  h.emit(s, 'specialEnd', i, 1 - i, payload(ext.run));
  ext.run = null;
}
export function advanceSpecial(s: MatchState, i: number, c: Content, h: Hooks): boolean {
  const ext = s.specials?.actors[i],
    d = definition(s, i, c);
  if (!ext?.run || !d) return false;
  ext.run.localTick++;
  s.actors[i]!.moveFrame = ext.run.localTick;
  if (ext.run.localTick >= d.durationTicks) {
    cancelSpecial(s, i, h);
    s.actors[i]!.move = null;
    h.transition(s.actors[i]!, 'idle');
    return false;
  }
  present(s, i, d, h);
  return true;
}
export function counterIncoming(
  s: MatchState,
  target: number,
  attacker: number,
  hitLevel: string,
  isSuper: boolean,
  c: Content,
  h: Hooks,
): boolean {
  const ext = s.specials?.actors[target],
    d = definition(s, target, c),
    run = ext?.run;
  if (
    !d ||
    d.kind !== 'counter' ||
    !run ||
    run.confirmed ||
    isSuper ||
    hitLevel === 'low' ||
    !inRange(run.localTick, d.counterWindow)
  )
    return false;
  run.confirmed = true;
  run.target = attacker;
  run.targetX = s.actors[attacker]!.x;
  run.targetY = s.actors[attacker]!.y;
  const a = s.actors[attacker]!;
  a.move = null;
  a.dashTicks = 0;
  a.buffer = null;
  h.transition(a, 'idle');
  const ordinary = s.specials!.actors[attacker]!.ordinary;
  if (ordinary) ordinary.contacted = true;
  h.emit(s, 'counter', target, attacker, payload(run));
  return true;
}
export function specialHitbox(s: MatchState, i: number, c: Content): Rect | null {
  const run = s.specials?.actors[i]?.run,
    d = definition(s, i, c);
  if (!run || !d || d.kind === 'finisher' || (d.kind === 'counter' && !run.confirmed)) return null;
  const hit = d.hits.find((x) => x.tick === run.localTick && !run.consumedHits.includes(x.id));
  if (!hit) return null;
  const a = s.actors[i]!,
    b = hit.box;
  return { x: a.x + (a.facing === 1 ? b.x : -b.x - b.w), y: a.y + b.y, w: b.w, h: b.h };
}
export function resolveSpecialHits(
  s: MatchState,
  inputs: readonly { block: boolean; crouch: boolean }[],
  c: Content,
  h: Hooks,
): void {
  // Gather from pre-impact state so simultaneous staged hits trade.
  const hits = s.actors.map((a, i) => {
    const d = definition(s, i, c),
      run = s.specials?.actors[i]?.run,
      box = specialHitbox(s, i, c),
      target = s.actors[1 - i]!;
    if (
      !d ||
      !run ||
      !box ||
      target.health === 0 ||
      invulnerable(s, 1 - i, c) ||
      !h.overlaps(box, h.hurtbox(target, c))
    )
      return null;
    const hit = d.hits.find((x) => x.tick === run.localTick && !run.consumedHits.includes(x.id))!;
    const defended =
      hit.blockable &&
      target.state === 'block' &&
      inputs[1 - i]!.block &&
      target.facing === -a.facing;
    return { i, d, run, hit, defended, facing: a.facing };
  });
  for (const hit of hits) {
    if (!hit) continue;
    const { i, d, run, hit: m, defended, facing } = hit,
      target = s.actors[1 - i]!;
    run.consumedHits.push(m.id);
    // A queued intent still resolves if its attacker was simultaneously interrupted.
    if (defended) {
      h.transition(target, 'blockstun', m.blockstun);
      h.emit(s, 'block', i);
    } else {
      const damage =
        m.damage + Math.trunc((m.cringeBonus * run.cringeAtStart) / c.specials!.cringe.max);
      target.health = Math.max(0, target.health - damage);
      target.x += facing * m.knockback;
      // A capture holds the latest authoritative impact position, not the original
      // point: otherwise the next tick would undo knockback and visibly teleport.
      if (run.confirmed && run.target === 1 - i) {
        const radius = c.fighters.find((f) => f.id === target.id)!.body.radius;
        target.x = Math.max(c.arena.minX + radius, Math.min(c.arena.maxX - radius, target.x));
        run.targetX = target.x;
      }
      target.move = null;
      target.dashTicks = 0;
      target.buffer = null;
      cancelSpecial(s, 1 - i, h);
      if (s.specials!.actors[1 - i]!.ordinary) s.specials!.actors[1 - i]!.ordinary = null;
      h.transition(target, 'hitstun', m.hitstun);
      h.emit(s, 'hit', i);
    }
    s.hitStop = Math.max(s.hitStop, d.hitStop);
  }
}
export function startOrdinary(
  s: MatchState,
  i: number,
  move: Actor['move'],
  c: Content,
  deltas: number[],
): void {
  const ext = s.specials?.actors[i];
  if (!ext || !move || move === 'super') return;
  ext.repeatCount = ext.lastMove === move ? ext.repeatCount + 1 : 1;
  ext.lastMove = move;
  if (ext.repeatCount > c.specials!.cringe.repeatAfter) deltas[i]! += c.specials!.cringe.repeat;
  ext.ordinary = { id: ++s.specials!.nextInstance, move, reachedActive: false, contacted: false };
}
export function endOrdinary(s: MatchState, i: number, c: Content, deltas: number[]): void {
  const ext = s.specials?.actors[i];
  if (!ext?.ordinary) return;
  if (ext.ordinary.reachedActive && !ext.ordinary.contacted) deltas[i]! += c.specials!.cringe.whiff;
  ext.ordinary = null;
}
export function ordinaryContact(
  s: MatchState,
  i: number,
  defended: boolean,
  c: Content,
  deltas: number[],
): void {
  const ext = s.specials?.actors[i];
  if (!ext?.ordinary) return;
  ext.ordinary.contacted = true;
  deltas[i]! += defended ? c.specials!.cringe.blocked : -c.specials!.cringe.cleanHit;
}
export function applyCringe(s: MatchState, c: Content, deltas: number[]): void {
  s.specials?.actors.forEach((a, i) => {
    a.cringe = Math.max(0, Math.min(c.specials!.cringe.max, a.cringe + deltas[i]!));
  });
}
export function cancelAll(s: MatchState, h: Hooks): void {
  s.specials?.actors.forEach((a, i) => {
    cancelSpecial(s, i, h);
    a.ordinary = null;
  });
}
export function stepFinisher(s: MatchState, c: Content, h: Hooks): void {
  if (s.winner === null) return;
  const run = s.specials?.actors[s.winner]?.run,
    d = definition(s, s.winner, c);
  if (!run || d?.kind !== 'finisher') return;
  run.localTick = s.phaseTicks;
  if (run.localTick < d.durationTicks) present(s, s.winner, d, h);
}
