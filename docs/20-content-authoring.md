# Content authoring — add a fighter and tune a move

## Data and validation

Actual Phase 1 JSON contracts live in `packages/content/src/index.ts`, with strict Zod schemas and semantic reference checks. Historical Phase 0 examples are design references, not the exact v0.1 file shape. `loadContent()` validates on module load; invalid files fail boot/build tests rather than silently dropping fields. Run `pnpm test` and `pnpm typecheck` after each edit. All fighters must be original fictional designs, `licenseStatus: original`, no real-name/face/voice references. Primitive provenance is project-authored; future imported assets need per-file commercial evidence and review.

## Add the soap-opera archetype without combat code

1. Copy a fighter in `packages/content/data/fighters.json`, assign unique ID such as `duchess`, bilingual original name, `archetype: soap-queen`, `licenseStatus: original`, distinct `killSwitchKey`, three hex palette colours, shared collision dimensions, and `visual: {style: primitive, prop: queen}`. The placeholder renderer uses the generic body; unique polished silhouette is Phase 2 work, not a combat-code requirement.
2. Use the existing move IDs or add a new move definition within the supported generic move schema. No fighter-specific conditions in sim. Sharing existing move IDs shares their tuning; duplicate IDs are forbidden. Current logical move action IDs are light/heavy/kick/super; adding new action categories is a future schema/input change, not merely adding a fighter.
3. Create `duchess-finish` in `dialogue.json`, `fighterId: duchess`, trigger finisher, original Hindi/English text, `audio: procedural-tone`, matching original provenance. Set fighter `dialogueIds` to that ID. No celebrity catchphrases.
4. All selection cards are generated from data. Start a mirror/normal match with the new fighter, verify palette/name/caption and every move. Keep 2-fighter prototype scope unless owner approves adding the third to release. Shared numeric hurtbox dimensions are recommended to avoid accidental balance differences.
5. Record provenance and content review. Metadata kill key is reserved; live signed remote revocation is still a public-release gate, not implemented in this private placeholder prototype. Do not describe local JSON edits as a live remote kill switch.

Future non-primitive models need a renderer asset-loading adapter and rig mapping; the current data-only promise covers existing primitive visual style and generic combat actions. Adding a new renderer style or action is a scoped extension, not a new fighter subclass.

## Tune a move — data only

Open `packages/content/data/moves.json`. Each move specifies integer ticks at 60 Hz, damage, stamina/meter cost, stun, logical hitbox and pushback. For example:

```json
{"id":"light","startup":6,"active":3,"recovery":12,"damage":60,"staminaCost":600,"meterCost":0,"hitstun":14,"blockstun":8,"hitLevel":"mid","hitbox":{"x":180,"y":850,"w":520,"h":320},"knockback":120,"allowedStates":["idle","walk","crouch"]}
```

- Startup 6 means six ticks before active collision; active 3 stays hittable for three ticks, one hit per target; recovery 12 locks further actions. Total 21 ticks. Reducing recovery increases safety; increasing hitstun improves follow-up opportunities. No cancels/air attacks in v0.1.0.
- Coordinates are mm relative to actor foot, +x forward mirrored by facing, +y upward. `knockback` is **instant pushback mm**, not an unlabelled velocity; fixed integer push is the Phase 1 implementation. Collision never reads rendered bones.
- `damage` is health units (max 1000); stamina max 10000; meter max 1000. Super requires/spends its meter cost. A stamina spend to zero causes immediate stagger; consider this when increasing costs.
- `hitLevel: low` defeats standing block; crouch-block handles low/mid. Mid is blockable in both. `allowedStates` are actually enforced; do not add unsupported state strings.
- To make heavy slower/stronger, edit startup/damage/staminaCost in JSON only. Begin with one variable, compare spacing and punishability in `/debug.html?art=3d`, then run tests. Input buffer, regen, dash/jump and round/presentation durations are in `balance.json`, not hidden in character classes.

A balance change can intentionally alter the golden replay hash. First inspect the changed outcomes and add a targeted behavior test; then explicitly run `pnpm record:replay`, review fixture diff and update the literal hash assertion. Do not automatically rebaseline tests in CI. Record the reason in CHANGELOG and bump content/replay compatibility before future online use. Hash is a regression checksum, not cryptographic proof.

## Architecture extension boundaries

Client input → sim; AI → sim types/Input; sim → content types; render/animation/audio/UI → snapshots/events. Sim must not import client or call wall clocks, DOM, Three.js or Math.random. `pnpm check:architecture` provides a lightweight prohibited-API guard; code review still required for arithmetic/order/serialisation changes. Shader/mesh/camera changes cannot modify state. Each step returns a new JSON-serialisable state, with RNG and previous inputs included for edge/buffer reproducibility.
