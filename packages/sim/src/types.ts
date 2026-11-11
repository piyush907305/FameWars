import type { Content, MoveId } from '../../content/src/index';
export type { Content, MoveId };
export type ActorState =
  | 'idle'
  | 'walk'
  | 'crouch'
  | 'jump'
  | 'attack'
  | 'block'
  | 'hitstun'
  | 'blockstun'
  | 'staggered'
  | 'KO'
  | 'finisher'
  | 'win';
export type Action = MoveId | 'dash';
export type Input = {
  axis: -1 | 0 | 1;
  jump: boolean;
  crouch: boolean;
  block: boolean;
  light: boolean;
  heavy: boolean;
  kick: boolean;
  dash: boolean;
  super: boolean;
  skip: boolean;
};
export const neutral = (): Input => ({
  axis: 0,
  jump: false,
  crouch: false,
  block: false,
  light: false,
  heavy: false,
  kick: false,
  dash: false,
  super: false,
  skip: false,
});
export type Actor = {
  id: string;
  previousCrouch?: boolean;
  x: number;
  y: number;
  vy: number;
  facing: -1 | 1;
  health: number;
  stamina: number;
  meter: number;
  state: ActorState;
  stateTicks: number;
  move: MoveId | null;
  moveFrame: number;
  didHit: boolean;
  dashTicks: number;
  idleTicks: number;
  landingTicks: number;
  buffer: Action | null;
  bufferUntil: number;
};
export type Phase = 'fight' | 'finisher' | 'roundResult' | 'matchResult';
export type SimEvent = {
  id: number;
  tick: number;
  kind: 'hit' | 'block' | 'stagger' | 'roundEnd' | 'finisher' | 'roundStart';
  actor: number;
  target: number;
};
export type MatchState = {
  version: 1;
  tick: number;
  rng: number;
  phase: Phase;
  phaseTicks: number;
  round: number;
  remaining: number;
  suddenDeath: boolean;
  drawSegments: number;
  wins: [number, number];
  actors: [Actor, Actor];
  previous: [Input, Input];
  winner: 0 | 1 | null;
  reason: 'KO' | 'timeout' | 'sudden-death' | 'draw' | null;
  events: SimEvent[];
  eventCounter: number;
  hitStop: number;
  terminal: { health: [number, number]; stamina: [number, number] } | null;
};
export type Rect = { x: number; y: number; w: number; h: number };
