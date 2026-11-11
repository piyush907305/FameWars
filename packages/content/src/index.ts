import { z } from 'zod';
import fighterData from '../data/fighters.json';
import moveData from '../data/moves.json';
import arenaData from '../data/arena.json';
import balanceData from '../data/balance.json';
import dialogueData from '../data/dialogue.json';
const integer = z.number().int().nonnegative().max(100000);
const localized = z.object({ en: z.string().min(1), hi: z.string().min(1) }).strict();
const provenance = z
  .object({
    provider: z.string(),
    licence: z.literal('original'),
    date: z.string(),
    realPersonImitation: z.literal(false),
  })
  .strict();
export const FighterSchema = z
  .object({
    id: z.string().regex(/^[a-z-]+$/),
    name: localized,
    archetype: z.enum(['action-star', 'cricket-captain', 'soap-queen']),
    licenseStatus: z.literal('original'),
    killSwitchKey: z.string().min(1),
    palette: z.array(z.string().regex(/^#[0-9a-fA-F]{6}$/)).length(3),
    body: z.object({ radius: integer.positive(), height: integer.positive() }).strict(),
    moves: z.array(z.string()).min(1),
    visual: z
      .object({ style: z.literal('primitive'), prop: z.enum(['star', 'captain', 'queen']) })
      .strict(),
    dialogueIds: z.array(z.string()).min(1),
    provenance,
  })
  .strict();
export const MoveSchema = z
  .object({
    id: z.enum(['light', 'heavy', 'kick', 'super']),
    startup: integer,
    active: integer.positive(),
    recovery: integer,
    damage: integer,
    staminaCost: integer,
    meterCost: integer,
    hitstun: integer,
    blockstun: integer,
    hitLevel: z.enum(['high', 'mid', 'low']),
    hitbox: z
      .object({ x: z.number().int(), y: integer, w: integer.positive(), h: integer.positive() })
      .strict(),
    knockback: integer,
    allowedStates: z.array(z.enum(['idle', 'walk', 'crouch'])),
  })
  .strict();
export const ArenaSchema = z
  .object({
    id: z.string(),
    name: localized,
    minX: z.number().int(),
    maxX: z.number().int(),
    spawns: z.tuple([z.number().int(), z.number().int()]),
    ground: z.number().int(),
    palette: z.array(z.string()).length(3),
    provenance,
  })
  .strict()
  .refine(
    (a) => a.minX < a.spawns[0] && a.spawns[0] < a.spawns[1] && a.spawns[1] < a.maxX,
    'Invalid bounds/spawns',
  );
export const BalanceSchema = z
  .object({
    schemaVersion: z.literal(1),
    tickRate: z.literal(60),
    roundTicks: integer.positive(),
    health: integer.positive(),
    stamina: integer.positive(),
    meter: integer.positive(),
    walkSpeed: integer,
    dashSpeed: integer,
    dashTicks: integer,
    dashCost: integer,
    jumpVelocity: integer,
    gravity: integer.positive(),
    landingTicks: integer,
    regenDelay: integer,
    regenPerTick: integer,
    blockEntryCost: integer,
    blockPerTick: integer,
    staggerTicks: integer.positive(),
    staggerRecovery: integer,
    bufferFrames: integer.positive(),
    finisherTicks: integer,
    finisherSkipAfter: integer,
    hitMeter: integer,
    blockMeter: integer,
    hitStopTicks: integer,
    suddenDeathTicks: integer.positive(),
    roundResultTicks: integer,
    suddenDeathHealth: integer.positive(),
    suddenDeathStamina: integer,
    maxSuddenDeathDraws: integer,
  })
  .strict();
export const DialogueSchema = z
  .object({
    id: z.string(),
    fighterId: z.string(),
    trigger: z.literal('finisher'),
    text: localized,
    audio: z.literal('procedural-tone'),
    provenance,
  })
  .strict();
export type FighterDef = z.infer<typeof FighterSchema>;
export type Move = z.infer<typeof MoveSchema>;
export type MoveId = Move['id'];
export type Content = {
  fighters: FighterDef[];
  dialogue: z.infer<typeof DialogueSchema>[];
  moves: Move[];
  arena: z.infer<typeof ArenaSchema>;
  balance: z.infer<typeof BalanceSchema>;
};
export function loadContent(): Content {
  const fighters = z.array(FighterSchema).min(2).parse(fighterData),
    moves = z.array(MoveSchema).parse(moveData),
    arena = ArenaSchema.parse(arenaData),
    balance = BalanceSchema.parse(balanceData),
    dialogue = z.array(DialogueSchema).parse(dialogueData);
  for (const group of [fighters, moves, dialogue])
    if (new Set(group.map((x) => x.id)).size !== group.length)
      throw new Error('Duplicate content ID');
  for (const f of fighters)
    for (const id of f.moves)
      if (!moves.some((m) => m.id === id)) throw new Error('Missing move ' + id);
  if (
    balance.finisherSkipAfter > balance.finisherTicks ||
    balance.staggerRecovery > balance.stamina
  )
    throw new Error('Invalid balance bounds');
  for (const f of fighters)
    for (const id of f.dialogueIds)
      if (!dialogue.some((d) => d.id === id && d.fighterId === f.id))
        throw new Error('Missing dialogue ' + id);
  return { fighters, moves, arena, balance, dialogue };
}
export const content = loadContent();

export const lineFor = (fighterId: string, lang: 'en' | 'hi'): string =>
  content.dialogue.find((d) => d.fighterId === fighterId && d.trigger === 'finisher')?.text[lang] ??
  '';
