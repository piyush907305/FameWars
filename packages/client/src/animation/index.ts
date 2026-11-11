import type { Actor } from '@fame/sim';
export function pose(a: Actor, tick: number) {
  const walk = a.state === 'walk' ? Math.sin(tick * 0.25) * 0.5 : 0;
  const strike = a.state === 'attack' ? Math.sin((Math.min(1, a.moveFrame / 8) * Math.PI) / 2) : 0;
  return {
    walk,
    strike,
    crouch: a.state === 'crouch' || (a.state === 'block' && a.previousCrouch) ? -0.4 : 0,
    lean: a.state === 'hitstun' ? -0.25 : a.state === 'finisher' ? 0.12 : 0,
    bob: a.state === 'idle' ? Math.sin(tick * 0.045) * 0.018 : 0,
  };
}
