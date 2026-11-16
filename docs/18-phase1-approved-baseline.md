# Approved Phase 1 baseline — Fame Wars

Tagline: Fight for the spotlight.

The user authorized the following changes on 2026-11-09 after an explicit conflict review: 45-second rounds; round winner performs finisher; three-frame attack buffer; packages/client layout; Film City street arena; Phase 1 placeholder-art/audio v0.1.0; separate AI module consuming human input interface. This file supersedes inconsistent Phase 0 proposals and old milestone descriptions. Phase 0 remains preserved at tag v0.0.0.

Scope: two original fictional fighters (Dynamo and Chalk), one arena, local keyboard/two gamepad and touch-vs-CPU, three CPU levels, data-driven moves, health/stamina/meter, best-of-three, debug overlay, accessible bilingual menus. No online/auth/ads/AI generation. Placeholder generated tone only, no celebrity likeness or voice.

Simulation owns match outcome and serializable state. Client scheduler samples inputs and calls AI module; renderer only reads snapshots. Sim stores/advances seeded RNG; AI reads it without clocks/randomness. Packages: sim, content, ai, client (input/render/animation/audio/ui modules).

ASSUMPTION A28: existing repository folder name game-phase0 is retained to preserve history; product name Fame Wars appears in UI/docs.
ASSUMPTION A29: private hosted preview through available Sites hosting is acceptable; no paid service or public production launch. GitHub owner/name remain unknown, so local branches/commits and Git bundle are delivered without claiming a GitHub remote.
ASSUMPTION A30: no physical test phone/gamepad is accessible to the agent; browser automation and host-browser measurements supplement, not replace physical acceptance.
ASSUMPTION A31: first-launch 18+ self-declaration/disclaimer is a provisional test gate, not age verification or legal clearance. No telemetry, ad or auth SDK. Private preview, not approved public launch.

Stop before Phase 2. Remaining operational/legal gates in prior documents continue to apply to a public launch, not to offline sim tests.
