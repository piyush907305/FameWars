# ADR 0004 — Offline AI generation with a mobile benchmark gate

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

Original archetypes and synthetic non-imitative voices only. AI geometry may be unusable under deformation, and free output may have non-commercial/attribution restrictions. A12–A15 require validation.

## Options

High-detail AI mesh as-is; offline generated mesh + cleanup/shared rig; stylised low-poly; 2D cutout in 3D. As-is model export fails quality/size/rights assumptions.

## Decision

One original AI-generated benchmark → Blender cleanup → shared humanoid rig → approved animation → budgeted GLB. Candidate tools/rights in source register. Offline baked synthetic audio only. Every actual file has dated commercial provenance; licensed characters require written permission. Three-attempt/8-hour stop rule then simplify; 2D-in-3D needs explicit scope approval.

## Consequences

Generation is only one stage; owner cleanup capacity can block the project. Less detail may be necessary to meet <8MB/low-end performance. No importing prior celebrity experiments. Source licences and output rights independently tracked.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
