# Risks, assumptions and approval questions

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Risk register

| Risk / severity | Trigger and mitigation | Owner / release gate |
|---|---|---|
| AI anatomy/topology/animation fails — critical | Three attempts/8 cleanup hours benchmark stop rule; shared low-poly rig; approved 2D-in-3D fallback only as scope change | Owner; Phase 2 benchmark before roster expansion |
| Unclear/changed commercial rights — critical | Per-file dated plan/terms evidence; no NC/unknown output; regenerate rather than assume upgrades retroactive | Owner; every asset build gate |
| Finisher contradicts KO winner — high | Separate result/performer; approve literal or winner-only rule before code; comprehension test | Owner; Phase 1 blocker Q3 |
| Hindi TTS quality or local compute fails — high | Blind transcription with fluent reviewers; shorter scripts; cleared paid synthesis only after spending approval | Owner; voice gate |
| Ad rejection/no fill/low revenue — high | No monetisation dependency for prototype; provider test-mode validation; retain ad-free path; zero revenue scenario | Owner; Phase 5 business go/no-go |
| Free hosting cold starts/quota — high | Static prototype; room host test only until measured budget; no capacity guarantee, admission caps/CPU option | Owner; Phase 4 host approval |
| Children use adult-marketed game — critical | Actual-audience review, neutral age gate, no targeted SDK before eligibility; child-inclusive redesign if necessary | Owner/legal review; external test/launch |
| DPDP/gaming/log retention obligations missed — critical | Current official texts, corrigendum and operative-date map; provider/processor inventory; entity/contact and qualified review | Owner; public launch gate |
| Takedown/accidental real likeness — high | Originality check, signed per-fighter revoke, cached-content expiry; report contact; remove dependent assets | Owner; every content release |
| Low-end 4G/thermal budget missed — high | Measure actual assets/device first; dynamic resolution, simple lighting, reduce fidelity | Owner; Phase 2/3 |
| Sim divergence or online latency — high | Integer pure sim, golden replay corpus, network spike before auth/ranking; defer rollback decision | Owner; Phase 1/4 |
| Same-phone local 2P unusable — medium | Touch vs CPU; keyboard/two pads local humans; separate online phones later | Owner; Q5 |
| Solo owner overload — high | Sequential gates, no live chat/UGC, realistic roster, release freezes and limited service commitments | Owner; scope review each phase |
| Native “no rewrite” promise fails — medium | Shared core + platform ports; native SDK/store/device spikes; budget store fees | Owner; wrapper gate |
| PWA cache prevents immediate revocation — high | Expiring signed allowlist and fail closed; disclose offline limit | Owner; kill-switch gate |

## Assumption register

All implementation numbers described as proposed budgets/rules are **design choices to accept/test**, not measured product facts. The following uncertain premises/forecasts are explicitly ASSUMPTIONs; no unlisted premise should be treated as agreed.

| ID | ASSUMPTION / validation and consequence |
|---|---|
| A01 | Adults 18+ only initially; owner confirms audience; under-18 inclusion changes privacy/ad scope. |
| A02 | Dynamo + Chalk are the two prototype fighters; Duchess later; names not cleared yet. |
| A03 | Dash included because stamina requirements name it; owner confirms extra action scope. |
| A04 | Same-device touch targets CPU, local human 2P uses keyboard/pads; shared-touch not default. |
| A05 | Three repeated tied sudden-death segments yield drawn replayed round; best-of-three means first to two wins. |
| A06 | Literal stamina-based performer may differ from KO winner; frozen snapshot, winner tiebreak; owner decision required. |
| A07 | 20 adult testers including 10 physical low/mid Android users can be recruited; otherwise usability gate untested. |
| A08 | Desired 3–8 min median session and >=5% share intent are exploratory targets, not forecasts. |
| A09 | Existing computer/internet/test access has no new project cash cost; unavailable devices need borrowing/budget. |
| A10 | ₹90/USD is a budgeting conversion only, not live FX; actual billed currency/tax replaces it. |
| A11 | Later room-host allowance US$7–15/month is affordable; quote/capacity unverified; zero spend means no always-on promise. |
| A12 | Commercially cleared original concept inputs/generation route available; unknown terms block use. |
| A13 | Owner can learn/do mesh/rig cleanup within reasonable effort; benchmark decides feasibility. |
| A14 | Local Kokoro and Hindi/English presets usable on owner hardware; test before committing; no runtime inference. |
| A15 | Two fluent Hindi reviewers and one English reviewer available; translations/voices otherwise provisional. |
| A16 | Named device matrix accessible physically; exact OS/browser support must be recorded. |
| A17 | 8/2 Mbps,150 ms RTT,1% loss is a useful constrained-4G lab profile, not a field claim. |
| A18 | 20-sec quick-match offer / 10-sec reconnect grace appropriate for casual audience; test later. |
| A19 | Ten adult paired online testers available for Phase 4 comfort comparisons. |
| A20 | Entire ₹6.16 revenue example uses hypothetical DAU, sessions, eligibility, impressions/fill and eCPMs; no forecast/market data. |
| A21 | 24-hour manifest expiry and restricted offline play acceptable to owner. |
| A22 | Proposed retention defaults fit operations; legal/provider/CERT-In requirements may override; must review before collecting. |
| A23 | One owner works sequentially with no team; no delivery date committed before benchmark and scope. |
| A24 | Project is an original free social game, no stakes/cash rewards; legal classification and 2026 gaming-rule obligations unconfirmed. |
| A25 | Private GitHub repository preferred, code/asset licence and exact owner/repo name undecided; local scaffold only. |
| A26 | Need a custom domain only at public launch if provider/business requires it; prototype uses free provider subdomain. |
| A27 | Native apps are a later separate deliverable; reuse core does not eliminate platform changes/fees. |

## Questions that must be answered before Phase 1

1. **Approval and title:** approve this Phase 0 baseline? What working title should replace `Fame Wars`, or may it remain a placeholder? Approval is for Phase 1 only, not spending or launch.
2. **Audience:** accept provisional India-only **18+** audience, or must under-18s be included? Child-inclusive design must be revised before building consent/ad-facing flow.
3. **Finisher conflict:** use literal higher-stamina performer even when that fighter loses by KO, or change to **round winner performs**? Confirm equal-stamina tiebreak (winner) and non-damaging flourish.
4. **Round rules:** approve the proposed stamina/regen/stagger, 45-sec timer, double-KO and sudden-death rules, including drawn-round replay? Include dash?
5. **Local players:** is keyboard/two-gamepad local 2P plus touch-vs-CPU sufficient, or do you require two humans on one phone? Two separate phones is later online scope.
6. **Roster and art:** approve Dynamo + Chalk, Duchess later, strictly original visuals/voices? Choose preferred look: stylised low-poly 3D or more detailed cartoon with benchmark gate; is owner-approved 2D-in-3D fallback acceptable if needed?
7. **GitHub:** which account/organisation, repository name and visibility? Private recommended. What source licence policy should apply? No remote created/pushed until these are known; asset licences remain independent.
8. **Resources and spend:** strict ₹0, or a maximum separately approved one-off/monthly amount? Can you provide physical Android/iPhone access and Hindi reviewers? Are you willing to do guided Blender cleanup? No paid generation/host subscriptions assumed authorized.

## Needed later, before corresponding gates

9. Who is legal publisher/operator, with monitored privacy/rights contact and access to qualified India legal review? Required before external data-collecting pilot/public launch, not to code offline logic.
10. Which devices/OS versions are non-negotiable? Approve the matrix and cold-load/thermal gates; replacement devices must be documented.
11. Desired launch date and owner weekly time availability? Benchmark first, then estimate; no fixed schedule inferred.
12. Confirm later online-first guest flow, optional Google/Facebook/Apple staging, cosmetic-only ads rewards and no paid/cash-prize mechanics; choose room-host budget at Phase 4.
13. Approve kill-switch TTL/offline limitation and privacy-retention proposal after legal review? Supply vendor/processor choices before data collection.
14. Which scope/quality tradeoff wins if the 8 MB budget, high-detail art and zero budget conflict? Default proposal: reduce visual complexity, preserve combat and loading.

**Stop gate:** no gameplay implementation, dependency installation, remote repository creation, paid service or deployment until explicit Phase 1 approval and answers to questions 1–8 (or recorded owner-approved deferrals). No answers or elapsed time do not imply approval.

## Approved Phase 1 amendments

User approved the conflict resolutions in [baseline amendment](18-phase1-approved-baseline.md). A06 is superseded: winner performs. A28: retain repository folder; A29: private hosted preview/local Git until remote specified; A30: physical devices/pads unavailable; A31: provisional adult self-declaration for private testing. These are ASSUMPTIONs; no spending or public launch authorized.

ASSUMPTION A32: data-controlled 4-tick hit stop freezes combat/timer during a hit; it does not consume extra stamina. This is a proposed feel parameter, not wall-clock-dependent sim logic. ASSUMPTION A33: four-digit build/timer/readout language labels and gamepad button names may retain conventional English abbreviations; full copy/native proofreading remains Phase 2.

ASSUMPTION A34: GitHub account supplied by owner is piyush907305; infer private repository name fame-wars unless corrected. Remote creation/push requires an actual authenticated connection; plugin suggested, connection not yet confirmed.

A34 update: GitHub connection verified as piyush907305. Native connector lacks repository creation; separate browser is signed out. Owner asked to create/access-grant empty private fame-wars and provide URL. No remote created or pushed yet.

A34 update: Owner provided https://github.com/piyush907305/FameWars; access verified. It has an initial README commit and public visibility. Publication awaits explicit public approval or a change to private.

A34 resolved: owner explicitly approved public source publication to https://github.com/piyush907305/FameWars. Hosted preview remains owner-private.

## Phase 1.5 amendments

User explicitly requested a public prototype, PR review/merge, real history preservation, tags and a faster PR test split. Earlier private-preview-only descriptions are superseded for the prototype; production monetisation/legal launch remains out of scope.

ASSUMPTION A35: GitHub Pages is the zero-cost static-hosting fallback after the Sites helper credential transfer remains denied. No new backend, paid account, ads or analytics.
ASSUMPTION A36: nightly full-match run at 19:30 UTC (01:00 IST next day) is suitable; GitHub schedules may be delayed. Manual dispatch is available.
ASSUMPTION A37: physical Android hardware and USB access must be supplied/confirmed by the owner; existing document 06 devices remain provisional targets. No device measurements are inferred from emulation.
ASSUMPTION A38: original v0.1.0 tag is preserved at ba03c3513b1f685cc82ca4a90d11dc1611c6f020; readiness changes do not rewrite that tag. Main integrates their commits separately.
