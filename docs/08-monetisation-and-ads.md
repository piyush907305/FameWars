# Monetisation and ads

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Commercial boundary

Prototype v0.1.0 has no ad SDK, monetisation requests or live ad units. Design data is disabled. No purchases, entry fees, cash prizes, transferable value, loot boxes or pay-to-win. Revenue may be zero even after launch. Owner must approve age policy, entity/payout setup, provider eligibility and costs before Phase 5 ad integration.

Current primary evidence: [Google H5 Games Ads](https://support.google.com/adsense/answer/9959170?hl=en) is the web candidate, not a presumed legacy AdSense for Games integration. Participation approval is discretionary. WebView cross-platform claims must be checked: Google's [H5 page](https://adsense.google.com/start/h5-games-ads/) describes Android AdMob integration, not automatic iOS support. Native wrappers should use separately validated native AdMob bridges; iOS UMP/ATT/store requirements reviewed at that phase. No live SDK is loaded just to test eligibility.

## Placement and frequency policy (proposed product caps)

Interstitial only after a full best-of-three match, results/share/finisher have finished and player chooses continue. Never during fighting, countdown, pause, between rounds, finisher/catchphrase, error, permission/consent UI or app exit. No first-match interstitial. Earliest after two completed matches and >=180 foreground seconds since last impression; maximum 3/session and 10/day. Session resets after 30 minutes inactivity, daily cap on India calendar date. On restart/session uncertainty prefer conservative cap; local caps cannot substitute for later server/provider caps. Do not manufacture ad impressions by auto-rematching.

Rewarded ad only explicit optional cosmetic opt-in on results/customisation screen. Deterministic previewed reward: nontransferable palette, victory confetti or profile frame; no damage, meter, extra stamina, continue/life, better fighter or cash. Proposed maximum 5 rewarded/day, >=60 seconds between opt-ins; deny/skip never removes an earned item or blocks basic play. No misleading support/click encouragement. [Rewarded policy](https://support.google.com/adsense/answer/9121589?hl=en-AG) governs allowable rewards and disclosure; ad completion must come from provider verification, not client timer. Grant once with idempotent receipt. Server verification preferred before valuable persistent entitlements; local-only prototype has no rewards service.

Ad state machine outside sim: eligibility → opted-in/requested → provider-ready → presentation → completed/dismissed/error → resume. Mutually exclusive presentation lock; pause local presentation/audio correctly, no active online room ad break until both at safe results state. Proposed request timeout 5 seconds; no fill/adblock/error/offline always continues without forced retry. Reward granted only verified completed event; explain failed reward, allow later retry. Recheck consent/age/region at request and presentation. SDK may impose stricter frequency; use stricter rule. Remote flags may lower caps/disable ads, not override immutable safety boundaries.

## Age/consent and policy gate

A01 adult-only proposal requires neutral age-band gate before optional analytics/ad SDKs. Under 18: do not admit to online/ad-enabled service pending a designed child flow; offer static explanation, no targeted tracking. Self-declaration is not robust age assurance and does not establish legal compliance. If broad child audience is required, get appropriate verifiable-parental-consent design and provider child-directed settings before implementation. No assumption that non-personalised ads mean no personal data.

Hindi/English notice explains purposes, vendors and withdrawal. Separate essential operation from optional analytics and ads; no prechecked consent, consent wall or forced share. Refusal leaves an ad-free playable core where feasible. Country/region configuration prevents unreviewed global monetisation; overseas visits get unmonetised/untracked fallback, not a false compliance claim. See [privacy policy plan](09-legal-and-content-policy.md). Google CMP/UMP requirements are provider/region dependent; India-only launch is not a reason to ignore future EEA/UK/Swiss traffic. No provider call until eligible purpose consent and required regional flags are set.

Approval checklist: owner publisher identity verified; actual game/site ready; privacy/terms/contact/credits visible; original content licence complete; no accidental clicks near controls; provider test mode tested; ads.txt/app-ads.txt if required; valid traffic controls; authorized ad units; app store privacy labels and native SDK policy later. No player capacity or approval date promised.

## Measurement and conservative template

Metrics by platform, region, placement, format and consented age cohort: opportunities → eligible → requests → filled → rendered impression → completion/close; deduplicate event IDs. Report fill = filled/requests, render = impressions/filled, rewarded completion = completed/rewarded impressions, error/timeout rates, finalized revenue and session retention with/without ads. Provider report is authority for impressions/revenue; reconcile daily and monthly adjustments. Do not infer impression from request or reward from click. Never log ad creative, raw DOB or advertising identifiers into game analytics.

A20 is an **illustrative low-volume spreadsheet-free scenario, not forecast**:

| Input | Explicit hypothetical value |
|---|---:|
| DAU × days | 100 × 30 |
| sessions/DAU | 1.2 |
| eligible adult/consented session share | 0.50 |
| interstitial opportunities/eligible session | 0.50 |
| rewarded opt-ins/eligible session | 0.05 |
| fill / successful render | 0.40 / 0.90 |
| hypothetical net publisher eCPM, INR | 15 interstitial / 40 rewarded |

Eligible sessions = 100×30×1.2×.5 = 1,800. Interstitial impressions = 1,800×.5×.4×.9 = 324; rewarded = 1,800×.05×.4×.9 = 32.4 expected-value impressions (actual counts integers). Revenue = 324/1000×15 + 32.4/1000×40 = **₹6.16/month** before taxes/operating costs, using assumed publisher-net rates. Finalization adjustments can reduce it. eCPMs are deliberately hypothetical, **not India market estimates**. No approval/fill = ₹0. Replace every input with measured cohort/provider data; do not double-subtract network share from already net eCPM.

Ad ARPDAU = finalized INR revenue / active-user-days; period ARPU = same-period revenue / distinct eligible active users; denominator definition must be stable and consent-limited. Cost/user and contribution = revenue − hosting − assets/voice amortization − store/domain fees − taxes/support, with no free labour valuation hidden. Scenario above cannot fund even a small paid server. No break-even claim until costs and retention are observed.
