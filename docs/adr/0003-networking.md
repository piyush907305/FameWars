# ADR 0003 — Casual authoritative rooms; defer rollback decision

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

Audience values quick casual matches over esports precision. v0.1 is local-only; no hosting budget or India network field measurements. A11/A18/A19 are unverified.

## Options

Colyseus server-authority with prediction; input-delay lockstep; rollback; client-authoritative peer state. Reject peer-owned damage/results. Framework sync alone does not decide fighting netcode.

## Decision

No online implementation until Phase 4. Run Colyseus rooms spike with shared authoritative sim and compare delay/prediction on device/network matrix. Friend links and guest first; labelled optional CPU fallback. Decide rollback only after published responsiveness/correction/CPU evidence.

## Consequences

Cannot promise player capacity/latency or free always-on host. Server authority costs money/operations and does not eliminate cheats. Need compatible protocol/content hashes, resync, disconnect policy and load tests before ranking.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
