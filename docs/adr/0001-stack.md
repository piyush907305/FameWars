# ADR 0001 — Stack for a browser-first solo project

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

We need small browser downloads, explicit combat control, editable data and a maintainable solo workflow. No team or funds for an opaque custom engine. A09/A23 resource assumptions apply.

## Options

Three.js + TypeScript; Babylon.js full engine; Unity/Godot web export; minimal custom WebGL. Full engines offer tooling but introduce different runtime/build and asset workflows; raw WebGL adds unnecessary engine work.

## Decision

Propose strict TypeScript, Three.js, Vite/pnpm; React/CSS for menus; Vitest/Playwright and GitHub Actions. WebGL2 baseline, renderer behind adapter. Pin versions and licences in Phase 1, not Phase 0. No general rigid-body physics for fighter hit logic.

## Consequences

We own simulation, input and animation integration; Three.js alone is not a fighting engine. Small bundle/performance gates must be measured. If benchmark repeatedly fails, revisit engine via new ADR before expanding content.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
