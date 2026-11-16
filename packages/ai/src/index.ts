import type { Input, MatchState } from '../../sim/src/index';
import { neutral } from '../../sim/src/index';
export type Difficulty = 'easy' | 'normal' | 'hard';
export function cpuInput(s: MatchState, slot: 0 | 1, difficulty: Difficulty): Input {
  const a = s.actors[slot],
    other = s.actors[1 - slot]!;
  const n = neutral();
  const settings = {
    easy: { reaction: 28, attack: 45, block: 15 },
    normal: { reaction: 16, attack: 72, block: 40 },
    hard: { reaction: 9, attack: 90, block: 70 },
  }[difficulty];
  if (s.phase !== 'fight') return n;
  const distance = Math.abs(a.x - other.x),
    toward: 1 | -1 = other.x > a.x ? 1 : -1;
  if (distance > 720) n.axis = toward;
  const decision = s.tick % settings.reaction === 0;
  if (!decision) return n;
  const roll = s.rng % 100;
  if (other.state === 'attack' && distance < 1300 && roll < settings.block) {
    n.block = true;
    n.crouch = other.move === 'kick';
    return n;
  }
  if (a.stamina < 1800) {
    n.axis = 0;
    return n;
  }
  if (distance < 1000 && roll < settings.attack) {
    if (a.meter >= 1000 && distance < 1200) n.super = true;
    else if (distance < 650 && roll < 35) n.light = true;
    else if (roll < 65) n.kick = true;
    else n.heavy = true;
  }
  if (distance > 1800 && roll < 20) n.dash = true;
  if (other.move === 'kick' && distance < 1200 && roll > 80) n.jump = true;
  return n;
}
