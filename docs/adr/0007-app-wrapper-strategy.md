# ADR 0007 — Shared browser core with later native adapters

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

Website/PWA first, then Android/iOS without a core rewrite. Native ads, lifecycle, stores and privacy are materially different. A27 defers native distribution and costs.

## Options

Rewrite in native engine; embed remote website; Capacitor with packaged web build and native adapters; PWA only.

## Decision

Design platform ports now; defer actual Capacitor projects/SDKs to later deliverable. Reuse sim/render/content and React screens; package versioned build, bridge native ads/consent/sharing/storage, handle safe areas/audio/background. PWA cache public hashed assets only with expiring roster allowlist. No promise of zero platform code or store acceptance.

## Consequences

Native QA/signing/store fees and Mac/Xcode toolchain remain required. Verify WKWebView/WebGL/codec support and privacy settings per platform. Existing H5 web ad integration cannot be assumed to work unchanged on iOS. Store policy may limit remote code/content updates; review before implementing.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
