# Architecture

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Stack decisions

| Direction | Decision / challenge |
|---|---|
| TypeScript strict | Confirm; no `any` in sim. Integer ranges and overflow checks remain necessary; types alone do not guarantee determinism. |
| Three.js | Confirm provisionally: direct control and glTF ecosystem; it is a rendering library, so collision/state/input are our responsibility. No general physics engine for combat. |
| Vite + pnpm | Confirm; pin supported Node LTS and exact pnpm in Phase 1, commit lockfile. No guessed package versions installed in Phase 0. |
| React + CSS | Confirm for screens/HUD accessibility; do not reconcile React every simulation tick. DOM HUD publishes at bounded frequency. |
| Vitest + Playwright | Confirm for pure replay/logic tests and browser flows; real touch/GPU/thermal tests require physical devices. |
| GitHub Actions | Confirm; current skeleton validates docs only. Protect main after remote setup; pin action SHAs before implementation. |
| GLB/glTF | Confirm for runtime exchange; keep editable sources and offline compression pipeline. Format does not guarantee good topology or rights. |
| Cloudflare Pages | Confirm for static client candidate; Functions/Workers are not a drop-in always-running Node/Colyseus host. |
| Node rooms host | Defer to Phase 4. Free sleeping host is test-only; no zero-cost production reliability promise. |
| No-rewrite wrapper | Challenge absolute claim: share sim/render/content, but native lifecycle, ads, privacy and store work is unavoidable. |

## Module boundaries and data flow

```text
keyboard / touch / pad / future network
             ↓ quantized tick-indexed InputFrame
validated immutable content → sim.step(state, inputs) → nextState + events
                                     ↓                    ↓
                               renderer snapshots     audio/subtitles/UI
                                     ↓
                              Three.js interpolation
```

`packages/sim`: deterministic state, integer geometry, seeded PRNG state, replay serialization/hash, round outcomes. Cannot import DOM, React, Three.js, clocks, audio, network, platform storage or floating physics. `packages/client`: fixed-step scheduler, presentation, React routes/settings, WebAudio. `packages/content`: schema definitions and immutable versioned manifests. `packages/platform`: interfaces for storage, region/consent, sharing, audio lifecycle and later ads/auth. `apps/rooms`: later imports the same sim, authoritative match host. No code is created now.

## Determinism contract

Proposed 60 Hz tick. Sim is a pure transition from `(simVersion, contentHash, state, inputFrames)` to `(state, events)`. Input order is player-slot order; resolve attacks against pre-tick snapshots, accumulate then apply effects simultaneously. Positions/velocities integer mm and mm/tick, durations integer ticks, ratios integer basis points. Clamp and explicitly round with signed integer rules; avoid trig/sqrt/time/locale functions in sim. Bound multiplication below JS safe-integer limits and test intermediate bounds; use `Math.imul` only with documented uint32 semantics. Stable sorted IDs; no iteration over unspecified map insertion/network arrival order. Explicit uint32 seeded generator for CPU decisions only; store generator state, never `Math.random`. Fixed seed set at match start; no cryptography claim.

All gameplay state serializes: positions, facing, resources, move IDs/frame indices, hit registry, input buffer, jump phase, timers, stagger state, winner/performer snapshot, CPU seed/state and round number. Events use match/round/tick/event index IDs for replay dedupe. Gamepad axes quantized before sim, controller deadzone outside it. No animation callbacks decide hits. Render can be 30 fps while sim stays 60 Hz; interpolate visual snapshots only.

Acceptance: 10,000-tick seeded replay fixtures agree on every tick hash in Node, Chromium, Firefox and WebKit; snapshot round-trip/resume matches uninterrupted replay; shuffled delivery is normalized to tick order. Property checks for resource bounds and simultaneous KOs. If overloaded, cap catch-up work (proposed 5 ticks/render), retain remaining accumulator, report degradation; do not skip simulation ticks. Local hidden tab pauses; future server never trusts client elapsed time. These are future tests, not performed Phase 0.

## State, persistence and trust

React owns screens, selected language and settings. Sim owns match state. Immutable content references by ID/hash. Platform adapter stores only consented settings/unlocks; no localStorage value is proof of ownership, age, reward or match result. Later server owns identity, scores and reward grants. Versioned replay and save migrations; unsupported saves reset with explanation, no silent reinterpretation. Typed events connect systems without a global unstructured event bus.

Remote content manifest is separate from balance: schema version, content version, enabled fighter IDs, revoked asset IDs, expiry, minimum client version, signature/key ID. Fetch network-first before selection and online room join, recheck on resume and between rounds; active online revocation aborts affected matches as no-contest. Do not change balance mid-match. Verification key public, signing key private. Offline cached manifest cannot provide instant revocation: expiry disables blocked/unknown content and shows connect-to-update. PWA caches public assets by hash; never auth/consent/ad responses. Detailed gate in [policy](09-legal-and-content-policy.md).

## Costs and deployment

See [service register](12-sources-and-service-register.md). Static prototype can target ₹0 incremental hosting on a provider subdomain within quota; no custom domain needed. ASSUMPTION A09: owner has machine, internet and test-device access. A10: planning conversion ₹90/USD, not a current FX quote; taxes/card conversion extra. A11: later always-on room host allowance US$7–15/month (₹630–1,350) is a budgeting allowance, not a quoted Render plan or capacity claim. Obtain a current quote and owner spend limit at Phase 4; otherwise remain local/closed test. Free-tier limits, licence availability and sleeping-service behavior are operational risks.

Deploy immutable client build + asset manifest + compatible sim/content versions. Keep previous build and manifests for rollback, except revoked assets must stay revoked. Staging uses test ads only, separate keys and synthetic accounts. Monitor transferred bytes, sim tick time, room event-loop delay, disconnections and spend. Set quota alerts; no automatic paid upgrades. No remote accounts, branch protections, DNS or hosting are configured in Phase 0.

## ADR index

- [0001 Stack](adr/0001-stack.md)
- [0002 Simulation/render split](adr/0002-simulation-render-split.md)
- [0003 Networking](adr/0003-networking.md)
- [0004 Asset pipeline](adr/0004-asset-pipeline.md)
- [0005 Content schemas](adr/0005-content-schemas.md)
- [0006 State management](adr/0006-state-management.md)
- [0007 Wrapper strategy](adr/0007-app-wrapper-strategy.md)

## Phase 1 implementation notes

See [approved amendment](18-phase1-approved-baseline.md). `packages/ai` consumes a MatchState and emits the same Input as humans; sim never imports AI or rendering. `packages/client/src` contains input, render, animation, audio and ui modules. Schema code and JSON live in packages/content. The private v0.1.0 placeholder prototype has no accounts/telemetry/ad calls; future public content revocation/privacy gates remain pending. Tests currently demonstrate Node replay determinism, not cross-engine rollback correctness. No general physics engine. Node 24.22.1 and pnpm 11.25.0 pinned for this checkout.
