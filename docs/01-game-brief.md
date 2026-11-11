# Game brief

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Pitch and pillars

**Fame Wars** is an India-first browser 2.5D comedy fighter. Two original fictional personalities contest short, readable best-of-three matches. Stamina management creates a dramatic signature-finisher moment; synthetic catchphrases and bilingual subtitles make it shareable without gore.

Pillars: readable touch-first combat; funny character-specific reactions; fair mechanics independent of spending; fast cold start on 4G; small, maintainable content pipeline. The reference game is a genre/flow reference, not a source of code, art, recordings or branding.

ASSUMPTION A01: public launch is adults 18+ initially, Hindi and English, India region; confirm before audience/advertising implementation. A younger audience changes privacy, age assurance and ad design. ASSUMPTION A02: prototype roster is original action-star archetype **Dhamaal Dynamo** and cricket-captain archetype **Captain Chalk**; soap-opera queen **Drama Duchess** is schema/art-direction example only, not a third prototype fighter. Names are provisional and require clearance.

## Prototype v0.1.0 boundary

Two fighters; one original Film City street arena; local two-player and vs CPU; first to two round wins; movement, jump, crouch, block, light/heavy attack, kick, super, signature finisher. Dash is explicitly included because the stamina brief names it (ASSUMPTION A03). Keyboard, gamepad and touch supported. Same-device touch defaults to one human vs CPU; local two-human uses keyboard/gamepads, with experimental shared-touch subject to user decision (A04).

Out: online/auth/accounts/rankings, live ads or monetisation, player chat/uploads, cosmetics shop, global distribution, real-person fighters, dynamic AI inference, native binaries, advanced facial animation. Required consent/policy UI and mock ad-flow definitions may be reviewed without loading an SDK. Approved Phase 1 v0.1.0 is the complete placeholder-art prototype. Polished art and AI assets move to Phase 2; no AI assets are required for this release.

## Proposed exact rules (approval required)

All values below are **design decisions proposed for testing**, not claims of balance. 60 simulation ticks/second. Health 1,000, stamina 10,000, super meter 1,000. Full reset each round. Timer 2,700 ticks (45 seconds); intro and finisher do not consume it. Two simultaneous input slots, stable slot order for bookkeeping only. World units are integer millimetres; stage fighting limits -4,000..4,000; root y is ground height. Stage depth does not affect combat.

Attacks pay stamina atomically at valid startup. Insufficient stamina: no attack. Block pays 80 on entry plus 20/tick while held; empty stamina prevents blocking. Dash costs 1,200, lasts 12 ticks, no invulnerability; insufficient stamina denies it. Idle is grounded neutral with no block, movement, stun or attack; regeneration begins after 45 such consecutive ticks at 100/tick. Walking/jumping/crouching do not regenerate. Cap all resources; no negative values. Hitting exactly zero stamina enters 45-tick stagger at the end of the simultaneous resolution step. Interrupt the action; no attacks/block/dash/regen during stagger. Recover to 1,500 after stagger, reset idle delay. If health is zero, KO takes priority over stagger.

Block is an explicit action, facing the opponent. Standing blocks high/mid; crouch-block blocks low/mid; neither blocks attacks from behind. Kick is low; other prototype attacks mid. Jump has fixed arc and landing recovery; no air attacks in v0.1.0. Super gains 60 on a landed normal hit and 30 on a blocked normal, none for super/finisher; super startup requires 1,000 meter and spends it in addition to stamina. No chip damage, grabs or cancels initially. Each move hits an opponent once; hitboxes use logical state, never animated bones.

Round-ending order: resolve all active hits simultaneously, apply health/resource changes, freeze a terminal snapshot, then KO check, then timeout check. Single KO: surviving fighter wins. Double KO: compare stamina, else sudden death. Timeout: higher stamina wins; equal stamina compares health; equal both enters sudden death. Sudden death resets both to health 1, stamina 5,000, meter 0, neutral starting positions; first unilateral damaging hit wins. A trade repeats sudden death with new round segment ID; after three tied segments the round is drawn and replayed, no win awarded (A05). First to two wins; drawn rounds can extend total rounds beyond three. No random tie resolution.

**Approved Phase 1 finisher rule:** the round winner always performs a non-damaging signature flourish. Terminal stamina still decides timeout before health/sudden death, but never selects a different performer. Freeze terminal resources before presentation. Drawn rounds have no finisher. A generated short sound and bilingual original catchphrase captions replace voice synthesis. Sequence lasts 180 presentation ticks and is skippable after 60; reduced motion removes the camera move without changing combat. These changes supersede A06.


## Player flow

Age/region decision → language → short original-content disclaimer → privacy choices → title → input setup → fighter selection → arena → best-of-three rounds → each round snapshot/finisher → match result → optional share/rematch → later eligible ad break → next match. Prototype ads disabled. Hide/reset on tab suspension; local game pauses, later online match uses server ticks and explicit disconnect policy. No fullscreen or audio until user gesture; safe-area aware UI.

## Success measurements

Metrics describe eligible, consented cohorts only; never extrapolate denied users as measured. Prototype uses local/exported QA counters, not tracking SDKs. Proposed evaluation cohort (A07): 20 adult testers, at least 10 on physical low/mid Android; outcome evidence, not population prediction.

| Metric | Definition / collection | Proposed decision gate |
|---|---|---|
| First match completion | match_completed / match_started, excluding QA; event IDs deduplicated | >=80% of test sessions; investigate every early exit |
| D1 / D7 retention | eligible first-play cohort returning on next / seventh India calendar day / eligible installs that day | Report cohort size and confidence interval; establish baseline before numerical growth target |
| Session length | foreground active seconds, pause/background excluded; session ends after 30 min inactivity | Report median/p90 and matches/session; A08 desired median 3–8 min, validate |
| Shares | share_intent, platform-reported completion if available, referral landing separately | Never call intent a successful share; A08 desired >=5% result-screen users initiating |
| Ad revenue/user | finalized INR net publisher revenue / eligible active users in same period | No v0.1 revenue; establish cohort baseline after approved ads |
| Combat comprehension | tester can explain health vs stamina and result without coaching | >=16 of 20; finisher contradiction is explicit test |
| Reliability | fatal error sessions / eligible sessions; match-start cold-load failures | No release-blocking crashes in acceptance matrix |

D1/D7 require lawful return identifiers; without approved storage/consent they are unmeasured, not zero. Minimum aggregation cohort 20 (design privacy threshold). Revenue assumptions and instrumentation: [ads](08-monetisation-and-ads.md). Performance gate: [devices](06-device-and-performance-targets.md).
