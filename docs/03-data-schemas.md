# Data contracts

> Phase 1 changes approved by user: [authoritative amendment](18-phase1-approved-baseline.md). Historical Phase 0 proposals below are superseded where noted.

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Validation policy

This is a schema specification, not gameplay code. Phase 1 will implement strict runtime schemas (Zod candidate), emit JSON Schema for tooling, and reject unknown keys. Files are UTF-8 JSON. Semantic validation follows structural validation: resolve IDs, check bounds/budgets, rights, locale completeness and cross-field invariants. No scripts, dynamic URLs or HTML in content. All sample records below are **illustrative, non-shippable** until assets and evidence exist.

Every content document has `schemaVersion` (integer), `contentVersion` (SemVer), stable `id` (lowercase ASCII slug) and revision hash in the published manifest. Build fails on duplicate IDs, missing refs or unresolved evidence. Content hashes use canonical serialization. Migrations explicit; server and client refuse incompatible hashes.

## Rights and asset contracts

| Field | Type / invariant |
|---|---|
| fighter.licenseStatus | enum `original` or `licensed`; every fighter, no default |
| fighter.permissionEvidenceId | null for original; nonempty private evidence ID for licensed |
| fighter.permissionValidUntil | ISO date or null; licensed scope/territories must cover release |
| fighter.originalityReviewId | required evidence for all fighters; no real-person imitation |
| fighter.killSwitchKey | required unique remote-config key |
| asset.id / kind / sha256 | ID; model/texture/animation/voice/music/font; SHA256 of actual file |
| asset.provider / modelVersion / planAtCreation | required strings; local generation still records model and voice pack |
| asset.generatedAt / licenceCheckedAt | ISO timestamps; licence check cannot precede creation for final review |
| asset.licenceId / licenceUrl / termsEvidenceId | required; dated copy/hash of terms privately retained |
| asset.commercialUseAllowed | boolean; must be true to ship |
| asset.attributionText / attributionRequired | string and boolean; credits must include required wording |
| asset.sourceInputs / transformations | provenance IDs and ordered tool/version/action records |
| asset.realPersonImitation | must be false; includes voice and visual review |
| asset.approvalStatus / reviewer / reviewedAt | pending/approved/rejected; owner and timestamp required for approved |
| asset.costMinorINR / retentionNotes | nonnegative integer incurred cost; handling of provider uploads |

Licence grants and character permissions are distinct: `original` does not override a non-commercial asset licence. Examples referencing future evidence must remain pending. Evidence access is restricted, not committed public contracts. Actual asset log template: [provenance](13-asset-provenance-log.md).

## Fighter and archetype examples

Fighter required fields: common version/ID; `nameKey`; `archetype` enum action-star/cricket-captain/soap-queen; `rosterStage` enum prototype/later; rights fields above; `modelAssetId`; `animationSetId`; `voiceSetId`; `palette` (hex swatches); `body` integer radius/height and shared `hurtboxSetId`; `stats` health/stamina/meter caps; `moveIds`; `finisher` animation/dialogue/duration/skip fields; `enabledRegions`; `status` draft/approved/disabled. No real reference images or names. Default shared collision dimensions prevent visual size from creating accidental advantage.

```json
{
  "schemaVersion": 1,
  "contentVersion": "0.1.0-alpha.1",
  "id": "dhamaal-dynamo",
  "nameKey": "fighter.dynamo.name",
  "archetype": "action-star",
  "rosterStage": "prototype",
  "licenseStatus": "original",
  "permissionEvidenceId": null,
  "permissionValidUntil": null,
  "originalityReviewId": "pending-originality-dynamo",
  "killSwitchKey": "fighters.dhamaal-dynamo.enabled",
  "modelAssetId": "model-dynamo-v1",
  "animationSetId": "anim-humanoid-v1",
  "voiceSetId": "voice-dynamo-v1",
  "palette": ["#14B8A6", "#FB7185", "#172554"],
  "body": {"radiusMm": 260, "heightMm": 1800, "hurtboxSetId": "shared-v1"},
  "stats": {"healthMax": 1000, "staminaMax": 10000, "superMax": 1000},
  "moveIds": ["light-v1", "heavy-v1", "kick-v1", "super-v1"],
  "finisher": {"animationId": "dynamo-pose", "dialogueId": "dynamo-finish", "durationTicks": 240, "skipAfterTicks": 60},
  "enabledRegions": ["IN"],
  "status": "draft"
}
```

Two additional complete fighter examples are defined by copying this record and applying **only** the following field overrides. This is documentation shorthand; production files must be fully materialized before validation, with no inheritance at runtime.

| Field override | Captain Chalk | Drama Duchess |
|---|---|---|
| id / nameKey | captain-chalk / fighter.chalk.name | drama-duchess / fighter.duchess.name |
| archetype / rosterStage | cricket-captain / prototype | soap-queen / later |
| originalityReviewId | pending-originality-chalk | pending-originality-duchess |
| killSwitchKey | fighters.captain-chalk.enabled | fighters.drama-duchess.enabled |
| modelAssetId / voiceSetId | model-chalk-v1 / voice-chalk-v1 | model-duchess-v1 / voice-duchess-v1 |
| palette | #7C3AED, #FBBF24, #F8FAFC | #BE185D, #22D3EE, #312E81 |
| finisher.animationId / dialogueId | chalk-pose / chalk-finish | duchess-pose / duchess-finish |

All three retain explicit `licenseStatus: original`, null permission fields and draft status. Costume avoids national/club uniforms, real film costumes, signature poses and religious symbols. Colours do not encode party/community affiliation.

## Move

| Field | Type / invariant |
|---|---|
| id / actorAction / animationId | stable IDs; logical action not bone animation |
| startupFrames / activeFrames / recoveryFrames | integers >=0; active >=1 for damaging attacks |
| hitboxes | array; each integer rectangle `{xMm,yMm,wMm,hMm,fromActiveFrame,toActiveFrame}`; width/height >0 |
| damage / staminaCost / meterCost | nonnegative bounded ints; costs paid once on valid startup |
| hitstunFrames / blockstunFrames | nonnegative bounded ints |
| hitLevel | high/mid/low |
| knockbackMmPerTick / pushbackMm | integers; explicit duration if velocity changes |
| hitPolicy / cancelInto | `oncePerTarget` initially; empty cancels initially |
| allowedStates | enum list; no executable predicates |

Local x is forward, y is up, relative to actor's foot/root; mirror x using facing, not world-space animation. Frames zero-based: startup `[0,S)`, active `[S,S+A)`, recovery `[S+A,S+A+R)`. `fromActiveFrame` inclusive, `toActiveFrame` exclusive within active range. During active tick 0 of the sample, world box is actor root + facing-adjusted rectangle. Swept movement collision uses integer AABBs; validate no tunnelling at max dash speed.

```json
{
  "schemaVersion": 1,
  "contentVersion": "0.1.0-alpha.1",
  "id": "light-v1",
  "actorAction": "light",
  "animationId": "shared-light",
  "startupFrames": 6,
  "activeFrames": 3,
  "recoveryFrames": 12,
  "hitboxes": [{"xMm": 180, "yMm": 850, "wMm": 520, "hMm": 320, "fromActiveFrame": 0, "toActiveFrame": 3}],
  "damage": 60,
  "staminaCost": 600,
  "meterCost": 0,
  "hitstunFrames": 14,
  "blockstunFrames": 8,
  "hitLevel": "mid",
  "knockbackMmPerTick": 0,
  "pushbackMm": 120,
  "hitPolicy": "oncePerTarget",
  "cancelInto": [],
  "allowedStates": ["idle", "walk"]
}
```

Proposed baseline move overrides (all fighters share frame data first; visuals differ):

| Move | Startup / active / recovery | Damage | Stamina / meter | Hitstun / blockstun | Level | Hitbox x,y,w,h mm |
|---|---|---:|---|---|---|---|
| light-v1 | 6 / 3 / 12 | 60 | 600 / 0 | 14 / 8 | mid | 180,850,520,320 |
| heavy-v1 | 15 / 4 / 24 | 140 | 1500 / 0 | 26 / 15 | mid | 200,750,680,450 |
| kick-v1 | 11 / 4 / 18 | 90 | 1000 / 0 | 20 / 11 | low | 160,120,800,300 |
| super-v1 | 24 / 6 / 36 | 240 | 2400 / 1000 | 40 / 20 | mid | 100,300,1200,1100 |

Override `actorAction` and animation IDs accordingly; all active frames covered, same once-per-target, no knockback velocity. Dash/block are action-state configuration, not damaging Move records; put their costs/durations in BalanceConfig. Finisher is presentation metadata and cannot instantiate a damaging move. BalanceConfig also holds regen/stagger, timer, sudden-death, CPU reaction ticks, input buffer, jump arc and movement. Proposed movement/action defaults: walk 45 mm/tick; dash 100 mm/tick; jump velocity initially 140 mm/tick, gravity 10 mm/tick², integrate velocity then position and clamp to ground; no air steering/attacks. Body pushboxes cannot overlap or leave arena. Input buffer 3 ticks, one action consumed per tick, priority super > heavy > kick > light > dash; conflicting left/right neutral, edge-trigger attack buttons, explicit block hold. Crouch transitions 3 ticks; landing recovery 6. CPU reaction interval 18 ticks, seeded choices only, never future-input access. These proposed BalanceConfig values need Phase 1 acceptance/tests; no implicit renderer defaults.

## Arena / dialogue / region

Arena required: versions/ID/nameKey, `modelAssetId`, `provenanceId`, `combatBounds` integers, `spawnMm` two separated points, camera distance limits, light preset, `musicAssetId` nullable, supported regions, budgets, disabled key. Example: `film-city-street`, bounds x -4000..4000, groundY 0, spawns -1600/+1600; abstract backdrop, no actual building, signage or event. Hazards disabled. Rendering bounds must include all allowed jumps and finisher animation.

Dialogue required: versions/ID/fighterId, `trigger` intro/super/finisher/win, localized `text` map (`hi-IN`,`en-IN`), `audioAssetIds` per locale, `subtitleCues` per locale with `{startMs,endMs,textKey}`, `voiceProvider`, `voicePresetId`, `provenanceIds`, `realPersonImitation:false`, status. Audio/subtitle durations refer to presentation time, not sim. Require cues within audio duration, no overlap unless explicitly marked, readable line length.

| Dialogue ID | English original text | Hindi original text |
|---|---|---|
| dynamo-finish | Cut! Now bring the snacks. | कट! अब नाश्ता लाओ। |
| chalk-finish | The scoreboard needs a tea break. | स्कोरबोर्ड को चाय की छुट्टी चाहिए। |
| duchess-finish | This twist needs another episode! | इस मोड़ के लिए एक और एपिसोड चाहिए! |

These are new draft lines, not quotations or famous catchphrases. Audio IDs/evidence remain unassigned; validation forbids missing required locale assets at release, but can allow explicitly caption-only development content.

RegionConfig: ID `IN`; `currency: INR`, integer money minor units, `locales:[hi-IN,en-IN]`; default locale chosen by user; `agePolicyId`, consent-policy version, enabled authentication/ad adapters, privacy URLs, legal entity/contact IDs and content allowlist. Provider geolocation restrictions are separate from language. No IP recorded by application merely to format currency.

## Ad placement config (disabled prototype example)

```json
{
  "schemaVersion": 1,
  "contentVersion": "0.1.0-alpha.1",
  "id": "match-break-v1",
  "enabled": false,
  "regions": ["IN"],
  "platforms": ["web"],
  "provider": "google-h5-candidate",
  "format": "interstitial",
  "trigger": "afterMatchResultsDismissed",
  "minCompletedMatches": 2,
  "cooldownSeconds": 180,
  "maxInterstitialsPerSession": 3,
  "maxInterstitialsPerDay": 10,
  "requiresAdultEligibility": true,
  "requiresAdConsent": true,
  "reward": null,
  "failureBehavior": "continueWithoutAd"
}
```

Optional rewarded config uses `format: rewarded`, `trigger: cosmeticOptIn`, reward `{id,kind:cosmetic,transferable:false,cashValueMinorINR:0}`, explicit disclosure locale keys, completion verification and idempotent reward receipt. No random or gameplay-advantage rewards. Schema rejects `duringFight`, finisher and between-round placements; remote config cannot bypass local consent or increase release-approved caps. Ad timers are platform time outside sim. Reward limits/cooldowns in [ads](08-monetisation-and-ads.md).
