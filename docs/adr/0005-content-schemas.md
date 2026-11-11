# ADR 0005 — Versioned validated content instead of fighter code copies

Status: **Proposed; awaiting Phase 0 approval**. Date: 2026-11-09. Owner: project owner.

## Context

Roster/moves/arena/voices/ad placements/balance will change in phases. Invalid references or rights metadata could ship broken or infringing content.

## Options

Hard-coded per-fighter classes; loose JSON; strict schemas + semantic validation. Loose JSON is easy to author but silently accepts errors.

## Decision

Propose strict runtime schemas with generated JSON Schema and canonical content hashes. Validate frame intervals, bounds, references, budgets, rights, locales, safe ad triggers and revocation keys. No arbitrary scripts/URLs in content. Server/client pin same approved content; remote disable cannot override consent or patch balance mid-match.

## Consequences

More authoring validation and migrations. Examples remain draft, never evidence of assets existing. Separate schema/content/sim/protocol versions; refuse incompatible versions rather than silently coerce data.

## Validation and policy boundaries

See [architecture](../02-architecture.md), [performance](../06-device-and-performance-targets.md), [source/licence register](../12-sources-and-service-register.md) and [assumptions/questions](../11-risks-and-open-questions.md). Original fictional content only; every fighter has original/licensed status, commercial provenance and remote disable key; licensed content requires written permission. No real-person visuals, voice imitation or gameplay implementation authorized by this ADR alone. A new superseding ADR records later changes rather than rewriting decision history silently.
