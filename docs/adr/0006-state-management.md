# ADR 0006 — One state owner per domain

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

Per-frame React state, mutable global stores and duplicated network/client health create race conditions and rollback problems.

## Options

One global store for everything; React state for everything; domain-owned state with typed boundaries.

## Decision

Sim owns complete match state; React owns screens/settings; content immutable; platform adapter owns consent/local storage; later server owns outcomes/identities/reward receipts. Publish bounded UI snapshots and typed events. No additional state library until state complexity justifies one.

## Consequences

Explicit adapters/event contracts cost initial work but isolate changes. Local storage is untrusted. Pause/finisher/audio/ads cannot mutate terminal resource snapshot. Replays and migrations must cover each domain correctly.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
