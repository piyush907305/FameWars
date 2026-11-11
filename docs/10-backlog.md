# Backlog and milestones

> Phase 1 changes approved by user: [authoritative amendment](18-phase1-approved-baseline.md). Historical Phase 0 proposals below are superseded where noted.

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Production conventions

No calendar/revenue/capacity commitment. Each epic has scope, owner (sole project owner with implementation assistance), dependency and evidence. Phase 0 approval precedes all implementation. A23: sequential work by one owner, no parallel team; unknown cleanup/legal/testing effort makes date estimates premature. All public builds pass original-content, licence and privacy gates; early private builds use original silhouettes, not prior celebrity assets.

| Phase / release | Epics and dependencies | Acceptance / playable checkpoint |
|---|---|---|
| 1 — v0.1.0-alpha.1 | Repo toolchain, strict TS, sim/content schemas, input abstraction, placeholder original silhouettes, single arena; requires Q1–Q8 decisions | Two fighters can complete a best-of-three via health/stamina rules. Keyboard local vs CPU and local 2P. Replay hashes match cross-runtime; tests cover resource costs, stagger, timeout, double KO, finisher conflict and pause. Playable private URL/artifact with known placeholder art. |
| 2 — v0.1.0-alpha.2 | One benchmark character, shared rig, essential animations, original voice trial, asset budgets, low preset; depends Phase 1 rules | Actual exported character passes art/provenance/voice/performance gate; compare actual model renders, not AI concept image alone. Playable match with one polished fighter and labelled placeholder opponent. If pipeline fails, stop/reduce fidelity with owner signoff. |
| 3 — v0.1.0 | Second approved fighter, complete move list and super, deterministic CPU, touch/gamepad, settings, bilingual subtitles, accessible menus, consent/disclaimer, remote roster config | Two approved fighters/one arena; local 2P and CPU work; all requested actions and round-finisher flow; best-of-three. Device matrix/under-8MB gate, content validation and disable switch pass. No online/accounts/ranking/ads. Playable prototype release, documentation and acceptance evidence. |
| 4 — v0.2.0-alpha → v0.2.0 | Colyseus spike, room/invite/quick match, server sim, reconnect, labelled CPU fallback; guest first; OAuth providers staged separately; requires host budget and privacy plan | Paired play across agreed network matrix, authoritative outcome/hash consistency, overload/abuse/revocation tests; published measured host results without capacity promise. Playable friends-room beta, then approved online release. Rank remains off until abuse/outcome validation gate. |
| 5 — v0.3.0-beta → v1.0.0 candidate | Harden security/performance, expand test cohort, legal/entity clearance, provider-approved web ads, privacy/consent, analytics, monitoring/recovery, release site | Test ads before live; no fight interruption; denied consent/no-fill flows; idempotent cosmetic reward; publisher approval and legal/content checklist. Playable staged release candidate, then owner-approved production launch. If ad approval fails, launch unmonetised only with explicit owner acceptance. |

## Cross-cutting epic details

- **SIM-01:** specify velocity/jump curve/input-buffer values in BalanceConfig, bounded integers; build golden replays, terminal-state tests and snapshot migration evidence. CPU uses same command interface/resources as human, proposed simple reaction-based policy, no learning model runtime cost.
- **INPUT-01:** two keyboard mappings with rollover warning, remapping and focus capture; two gamepad slot assignment/deadzone/disconnect; multi-touch vs CPU, reduced clutter, super accessible. Shared-screen phone 2P only if explicitly approved; not equated with networked phones.
- **ART-01:** AI output provenance, three-attempt stop rule, deformation benchmark, runtime budget report, complete clip list and credits. Third archetype stays future backlog, not accidental v0.1 scope.
- **AUDIO-01:** local AI trial, Hindi listening evidence, offline-baked clips, captions/mute/skip, audio lifecycle; provider commercial gate before external monetised build.
- **CONTENT-01:** build-time structural and semantic validation; draft cannot ship; canonical content hash and schema version; signed remote allowlist and expiry test.
- **PLATFORM-01:** privacy settings accessible from every menu, delete local data, no unnecessary APIs; PWA manifest/service-worker lifecycle in Phase 3 after cold-load budget; wrapper smoke test via adapter contract later, no native release in prototype.
- **WEB-OPS-01:** immutable deploys and rollback, spend caps, no secrets in client. Manual pilot release before broad launch. GitHub Issues/Projects milestones mirror this file once owner repository is authorized.
- **NET-01:** load/latency spike before OAuth or ranking; guest/server validation required first; protocol version pairing and room draining.
- **ADS-01:** provider/age eligibility, unit config, safe-state lock, rewarded receipts, reconciliation and opt-out. No revenue claim from test ad events.

## Beyond Phase 5 (separately scoped)

Android/iOS Capacitor distribution, native AdMob/consent integration, store fees/rating, login parity, leaderboards/ranking after integrity evidence, spectators/replays, extra original fighters/arenas, cosmetics, global regions. Ranking requires authoritative receipts and abuse policy; social logins require individual vendor setup/review. No implication that all are included in v1.0.

## Definition of done per release

Linked issue and measurable acceptance; reproducible pinned build; code/content/sim/protocol versions; automated relevant checks and physical-device evidence; known limitations; commercial asset evidence; privacy/age/ads review; kill-switch test; changelog and owner approval; staging artifact and rollback pair. v0.0.0 is docs-only and has **no playable build**; subsequent phases must have the specified playable checkpoint. Never check off implementation based on a design document.

## Phase 1 release supersession

User approved shipping the complete placeholder prototype as v0.1.0 in Phase 1. Historical alpha/polished-art sequencing above is superseded by [approved baseline](18-phase1-approved-baseline.md). Checkpoint evidence: [Phase 1 log](19-checkpoints.md); Phase 2 recommendation: [release notes](22-v0.1.0-release-notes.md). Do not start Phase 2 without approval.
