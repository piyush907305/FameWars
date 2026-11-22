import { content } from '../packages/content/src/index';
import {
  createMatch,
  step,
  neutral,
  stateHash,
  type MatchState,
  type SimEvent,
} from '../packages/sim/src/index';
const summaries = [];
for (const selected of content.specials!.definitions) {
  const c = structuredClone(content);
  c.specials!.enabled = true;
  const d = c.specials!.definitions.find((x) => x.id === selected.id)!;
  // Test harness uses existing original primitives; no draft roster art or dialogue ships.
  d.enabled = true;
  d.fighterId = c.fighters[0]!.id;
  let s = createMatch(c);
  const events: SimEvent[] = [];
  s.actors[0].x = -320;
  s.actors[1].x = 320;
  s.actors[0].meter = 1000;
  if (d.id === 'latent-talent-round') s.specials!.actors[1].cringe = 1000;
  if (d.kind === 'finisher') {
    s.remaining = 1;
    s.actors[1].stamina = 5000;
  }
  let restored: MatchState | null = null;
  for (let t = 0; t < 240; t++) {
    const a = { ...neutral(), super: t === 0 && d.kind !== 'finisher' };
    const b = { ...neutral(), light: t === 0 && d.kind === 'counter' };
    s = step(s, [a, b], c);
    events.push(...s.events);
    if (t === 50) restored = JSON.parse(JSON.stringify(s)) as MatchState;
    else if (restored) {
      restored = step(restored, [a, b], c);
      if (stateHash(restored) !== stateHash(s)) throw new Error('Restore divergence');
    }
  }
  summaries.push({
    special: d.id,
    damage: 1000 - s.actors[1].health,
    phase: s.phase,
    hash: stateHash(s),
    events: events
      .filter((e) => e.special)
      .map((e) => ({ tick: e.tick, kind: e.kind, ...e.special })),
  });
}
console.log(
  JSON.stringify(
    {
      scope:
        'Headless architecture demonstration, placeholder fighters, not phone or asset performance',
      summaries,
    },
    null,
    2,
  ),
);
