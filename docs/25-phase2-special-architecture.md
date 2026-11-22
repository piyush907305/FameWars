# Phase 2 special architecture checkpoint
2026-11-22 • Implemented on feat/phase2-staged-specials • No production assets

## Owner decision
Owner approved the staged-special/counter/cringe architecture on2026-11-21. Toolchain previously approved: zero-spend route, Seth V4 benchmark. Approval does not clear likeness/provenance, staged draft dialogue, physical-device gates or paid tools.

## What changed
- Strict Zod stage/counter/hit/cue/finisher schemas and four disabled data records. No new dependency.
- Optional content.specials.enabled activates state version2 and a serialisable specials extension; absent/false keeps exact version1 shape and legacy replay hashes.
- Same pure60Hz step, integer positions/damage, seeded sim RNG, deterministic stage/counter priority, stage-local clock frozen during hit-stop. Both actors' clocks advance before capture checks.
- Normal super input binds via fighterId data; no per-fighter combat branches. Guard/miss/interrupt/KO/timeout end paths cancel future hits. Costs paid once; each impact ID consumed once.
- Per-actor integer cringe0..1000: ordinary whiff+60, blocked+40, fourth/later repeat+80, clean hit-120, round reset. Sum deltas then clamp. Jester snapshots target value and selects three unique fictional judge IDs using exactly three extra seeded draws only on valid start.
- Stable monotonic events specialStart/specialStage/specialCue/counter/specialEnd carry instance/localTick/stage/cue/judge IDs for renderer; combat never waits for an animation/camera/audio callback.
- combatHitbox(state,slot,content) exposes active authoritative stage geometry for future debug/presentation integration. Existing attackbox API remains for ordinary moves.
- Post-round finisher data can only contain cosmetic cues, zero damage/cost/capture. Existing finisher clock/skip policy retained. Online skip synchronisation is future server work, not implemented here.
- Combat cinematic skip inputs are normalised out of version2 fight state; a presentation skip cannot change hash, RNG, damage or recovery. Camera and reduced-motion flags stay outside sim.

## Snapshot compatibility
Version1 snapshots require disabled/absent special config; version2 requires enabled config, extension version2 and matching content revision. Mismatch throws rather than migrating implicitly. Trusted local JSON snapshots tested; this guard is not an adversarial server-input validator. Future network protocol must validate full snapshot/input payloads and pin actual content hash, not rely on revision strings alone.
Definitions currently schemaVersion2/revision phase2-specials-v1; all disabled, global enabled=false. No new selectable fighters or art. The four draft combat profiles must not be enabled for public release until rights/originality/art/performance gates pass. Tests/demo remap profiles onto existing original placeholder fighters in memory only.

## Commands
Use Node24 and pnpm11.25.0.
- pnpm install --frozen-lockfile
- pnpm test
- pnpm test:specials
- pnpm test:replay
- pnpm sim:specials (headless four-profile demonstration, emits JSON event timelines; no graphics)
- pnpm lint && pnpm typecheck && pnpm check:architecture && pnpm build
- pnpm test:e2e:smoke (Chrome locally; bundled Chromium on CI)

## Evidence and limits
49 unit tests passed locally, including21 new special tests. Legacy900-tick hash49fabaf6 and10,000-tick full-match hashd1553867 retained. New10,000-tick version2 scripted replay75cff8bc, with repeated JSON restore and state/input immutability.
Local TypeScript, lint, architecture guard and production Vite build passed. Local Playwright Chrome launch aborted before app interaction; no local browser pass claimed. CI result will be recorded separately when available. No phone metrics newly measured. No heavy/production assets, voice, signature VFX, renderer cinematics, animation set or new arena implemented.
Default build continues to use original primitives/Phase1 combat. Special engine can be exercised with the headless demo/tests now; the next visual integration checkpoint is still pending actual assets and release gates.

## Tuning / adding a profile
Edit packages/content/data/specials.json only: unique IDs, fighterId binding, stage frame totals, impact ticks inside active intervals, integer damage/cringeBonus, counter/capture/invulnerability intervals, cues and costs. Default records stay disabled. Damage formula: damage+trunc(cringeBonus*snapshot/maxCringe); max bounds checked by schema. Hitboxes foot-relative millimetres, mirrored by facing. Finisher duration must match the existing finisher clock in approved content; otherwise request explicit timing change before enabling.
For a fifth compatible profile, add data using existing counter/super/finisher roles and validated cues; no combat-code branch. A genuinely new mechanic needs a deliberate schema/sim change and tests. Do not change sim timing to fit animation. Changed content revision invalidates old version2 snapshots; update golden fixture only after reviewing intentional outcome changes.

## Known follow-ups
- Actual renderer cue-to-camera/VFX/audio/subtitle binding and animation-duration validator wait for asset/animation checkpoints.
- Schemas validate structural/mechanical consistency; appearance rights/content review remain separate release gates.
- Device screenshot still provisional; original JSON/exact phone model, second hardware class and twenty-minute sustained report outstanding.
- Old checkout remains untouched due file-provider stalls. This implementation is in an isolated clean checkout; durable handoff copy is prepared separately.
- No v0.2.0 tag/release or main merge at this checkpoint.

