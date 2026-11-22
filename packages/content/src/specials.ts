import { z } from 'zod';
const n = z.number().int().min(0).max(100000);
const range = z.tuple([n, n]).refine(([a, b]) => a < b, 'Empty/reversed range');
const rect = z
  .object({ x: z.number().int().min(-100000).max(100000), y: n, w: n.positive(), h: n.positive() })
  .strict();
export const SpecialSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    fighterId: z.string().min(1),
    enabled: z.boolean(),
    licenseStatus: z.literal('original'),
    kind: z.enum(['counter', 'super', 'finisher']),
    allowedStates: z.array(z.enum(['idle', 'walk', 'crouch'])).min(1),
    meterCost: n,
    staminaCost: n,
    durationTicks: n.positive(),
    stages: z
      .array(
        z.object({ id: z.string().min(1), startup: n, active: n.positive(), recovery: n }).strict(),
      )
      .min(1),
    counterWindow: range.nullable(),
    capture: range.nullable(),
    invulnerability: range.nullable(),
    hitStop: n,
    damageCap: n,
    hits: z.array(
      z
        .object({
          id: z.string().min(1),
          tick: n,
          damage: n,
          cringeBonus: n,
          box: rect,
          hitstun: n,
          blockstun: n,
          knockback: n,
          blockable: z.boolean(),
        })
        .strict(),
    ),
    cues: z.array(
      z
        .object({
          tick: n,
          kind: z.enum(['pose', 'camera', 'vfx', 'audio', 'subtitle']),
          key: z.string().min(1),
        })
        .strict(),
    ),
    judges: z.array(z.string().min(1)),
    judgeCount: n,
  })
  .strict()
  .superRefine((s, ctx) => {
    const fail = (message: string) => ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    let offset = 0;
    const active = s.stages.map((stage) => {
      const start = offset + stage.startup;
      offset += stage.startup + stage.active + stage.recovery;
      return [start, start + stage.active] as const;
    });
    if (offset !== s.durationTicks) fail('Stage durations do not equal durationTicks');
    if (new Set(s.stages.map((x) => x.id)).size !== s.stages.length) fail('Duplicate stage ID');
    if (new Set(s.hits.map((x) => x.id)).size !== s.hits.length) fail('Duplicate hit ID');
    if (s.hits.some((h) => !active.some(([a, b]) => h.tick >= a && h.tick < b)))
      fail('Hit outside active interval');
    if (s.hits.reduce((sum, h) => sum + h.damage + h.cringeBonus, 0) > s.damageCap)
      fail('Damage cap exceeded');
    for (const r of [s.counterWindow, s.capture, s.invulnerability])
      if (r && r[1] > s.durationTicks) fail('Range beyond duration');
    if (s.kind === 'counter' && !s.counterWindow) fail('Counter window required');
    if (s.kind !== 'counter' && (s.counterWindow || s.capture || s.invulnerability))
      fail('Only confirmed counters may capture/invulnerable');
    if (s.capture && s.counterWindow && s.capture[0] < s.counterWindow[1])
      fail('Capture must begin after counter window');
    if (s.invulnerability && s.counterWindow && s.invulnerability[0] < s.counterWindow[1])
      fail('Invulnerability must begin after counter window');
    if (
      s.kind === 'finisher' &&
      (s.hits.length || s.meterCost || s.staminaCost || s.damageCap || s.hitStop)
    )
      fail('Finisher must be cosmetic');
    if (s.cues.some((c, i) => c.tick >= s.durationTicks || (i > 0 && c.tick < s.cues[i - 1]!.tick)))
      fail('Cues must be ordered and inside duration');
    if (new Set(s.judges).size !== s.judges.length || s.judgeCount > s.judges.length)
      fail('Invalid judges');
  });
export const SpecialContentSchema = z
  .object({
    schemaVersion: z.literal(2),
    revision: z.string().min(1),
    enabled: z.boolean(),
    cringe: z
      .object({
        max: n.positive(),
        whiff: n,
        blocked: n,
        repeat: n,
        repeatAfter: n.positive(),
        cleanHit: n,
      })
      .strict(),
    definitions: z.array(SpecialSchema),
  })
  .strict()
  .superRefine((c, ctx) => {
    const ids = c.definitions.map((d) => d.id);
    if (new Set(ids).size !== ids.length)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Duplicate special ID' });
    const bindings = c.definitions
      .filter((d) => d.enabled)
      .map((d) => d.fighterId + ':' + (d.kind === 'finisher' ? 'finisher' : 'super'));
    if (new Set(bindings).size !== bindings.length)
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Ambiguous special binding' });
  });
export type SpecialDefinition = z.infer<typeof SpecialSchema>;
export type SpecialContent = z.infer<typeof SpecialContentSchema>;
export const parseSpecialContent = (value: unknown): SpecialContent =>
  SpecialContentSchema.parse(value);
