# ADR 0002 — Deterministic simulation independent of presentation

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

Combat must unit-test identically in browser/server and retain future rollback option. Mobile render frame rate and audio timing vary.

## Options

Animation-driven hits; variable-delta physics; fixed-step pure integer sim. First two are easier initially but couple outcomes to device/presentation.

## Decision

Require pure 60 Hz tick transition with bounded integer math, stable event order, simultaneous-hit resolution, explicit seeded PRNG, immutable versioned data and serialized complete state. No render/DOM/clock/Math.random imports. Scheduler and input quantization outside sim. Hash golden replays across Node and browsers.

## Consequences

Extra up-front replay/snapshot tooling; animation must conform to move frames. 30 fps presentation still simulates 60 Hz. Determinism is tested behavior, not guaranteed by TypeScript. Future rollback also needs event dedupe and CPU budgets.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
