# Phase 0 — one-page decision summary

> Phase 1 changes approved by user: [authoritative amendment](18-phase1-approved-baseline.md). Historical Phase 0 proposals below are superseded where noted.

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

**Deliverable:** definition pack + empty local repository scaffold at v0.0.0. No gameplay code, dependency installs, assets, live ads, remote GitHub repository, paid accounts or deployment. Definitions are proposed, not approved.

**Game:** India-first, Hindi/English browser 2.5D comedy fighter; original fictional action-star and cricket-captain fighters in prototype, soap-opera archetype later. No real-person name, face, voice or imitation, including earlier celebrity experiments. New catchphrases, cartoon non-gory finishers, free core play. A01 proposes adults 18+ initially; wide child-inclusive appeal needs a different privacy/ad plan.

**Core decision:** strict TypeScript + Three.js, Vite/pnpm, React/CSS menus, Vitest/Playwright and GitHub Actions. Independent deterministic 60 Hz integer simulation; no renderer, wall clock or Math.random dependency. Content is validated/versioned data. Signed remote per-fighter disable, dated per-asset commercial rights evidence and release gates. React never drives combat.

**Prototype v0.1.0:** two fighters, one arena, local two-player and CPU, first to two wins; move/jump/crouch/block/light/heavy/kick/super/finisher, proposed dash. Keyboard, gamepad, touch. No online, auth, ranking, live ads or monetisation. Early alpha combat → one benchmark character → complete local prototype. Each phase after Phase 0 includes a playable checkpoint and acceptance evidence.

**Rule requiring approval:** KO winner can differ from the higher-stamina fighter. Literal proposal records winner and finisher performer separately using frozen terminal stamina, equal stamina goes to winner. That can make a defeated fighter perform the flourish; alternative winner-only changes the brief. Resolve Q3 before code. Timeout compares stamina, then health, then sudden death; no random ties.

**Quality and feasibility:** 60 fps target/30 floor, <8,000,000 cold-first-match transferred bytes, budget Android baseline and 20-minute thermal tests. AI meshes must pass topology/rig/deformation and licence review; generating a model is not making a finished game fighter. Stop after benchmark failure and simplify instead of multiplying poor assets. Local Hindi AI TTS is a trial, not a quality promise.

**Later phases:** Phase 4 casual server-authoritative Colyseus rooms, guest-first, friend/quick-match with labelled CPU fallback; rollback only if measurements justify it. Phase 5 approved web H5 ads, consent and launch hardening. Ads only after full matches/optional cosmetics, never in fights or finishers. Native Capacitor/AdMob is a later scoped deliverable sharing core code, with platform-specific work and fees.

**Budget:** ₹0 incremental static prototype only within actual free quotas and existing resources. Online always-on hosting, high-quality paid voices, legal review and native distribution may require money. No service spend authorized. Revenue model deliberately includes ₹0 outcome; hypothetical example yields only ₹6.16/month, not a forecast. No player capacity/latency/revenue promise. Provider licences/policies and Indian DPDP phased commencement plus 2026 gaming rules are recorded for release review.

**GitHub:** local Git snapshot, main branch and v0.0.0 tag; remote owner/name/visibility/source licence await choice. Proposed branches/PRs/issues, docs CI now, build/replay/device gates later; immutable releases, changelog and rollback plan. No existing celebrity work included.

**Before Phase 1:** answer [Q1–Q8](11-risks-and-open-questions.md): approval/title; audience; finisher rule; stamina/round/dash rules; same-device controls; roster/art/fallback; GitHub owner/name/visibility/licence; spend/device/reviewer/cleanup resources. Publisher/contact and legal review are later external-test/launch blockers. **Work stops here pending approval.**
