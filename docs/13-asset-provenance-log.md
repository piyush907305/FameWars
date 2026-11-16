# Asset provenance log template

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Current inventory

**No game assets or voices exist in this Phase 0 scaffold.** No celebrity content imported. No row below implies a commercial clearance. Keep machine-readable records in the future content package and detailed private evidence outside the public repository. Public runtime manifest only exposes required attribution and approved asset hashes.

Use one record per file, including derived exports. Source→derived chains must cover concepts, model, rig/animation, texture, voice script, generated WAV and runtime encoding. Shared animations have their own records referenced by both fighters.

| Field | Value to fill for every actual asset |
|---|---|
| assetId / kind / fighterId | stable ID; type; owning fighter or shared |
| filePath / SHA256 / byteSize | actual export file and checksum |
| provider / toolVersion / modelVersion / voicePresetId | exact service/local model; voice ID for clips |
| planAtCreation / account evidence reference | free/paid/local; private receipt reference, not credentials |
| prompt / sourceInputIds / scriptId | original instructions, cleared inputs and script provenance |
| generatedAt / exportedAt | ISO timestamps |
| licenceId / licenceUrl / effectiveDate | applicable terms at creation |
| termsEvidenceId / termsEvidenceHash / licenceCheckedAt | immutable private archive reference and review timestamp |
| commercialUseAllowed / restrictions | explicit yes/no/pending, territory, expiry, attribution, redistribution |
| attributionRequired / attributionText / creditsLocation | actual credits entry |
| transformations | ordered tool/version/operation/parent asset IDs |
| realPersonImitation / originalityReviewId | false plus reviewer evidence; voice separately assessed |
| permissionEvidenceId / expiry | licensed character permission reference if relevant |
| reviewer / reviewedAt / approvalStatus | named owner; pending/approved/rejected |
| costMinorINR / paidCurrency / paidAmountMinor | actual cost and dated conversion if any |
| disabledKey / revokedAt / reasonPrivateRef | revocation linkage; no public allegation detail |

## Illustrative pending entry (not an asset)

`model-dynamo-v1`: provider TBD, generatedAt null, licence pending, commercialUseAllowed pending, approvalStatus pending, disabledKey fighters.dhamaal-dynamo.enabled. This cannot pass a runtime build. Never prefill false certainty from the fighter's `original` label. Public examples in schemas use future IDs only.

Review steps: open exact source terms → archive evidence/hash → verify input and output rights → compare actual export and identity review → record transformations → inspect attribution → approve or reject. Owner cannot approve assets with missing dates/unknown plan merely to meet a deadline. Licence review repeats on changed output/model/provider terms and before shipping.

## Phase 1 actual placeholder assets — 2026-11-09

Primitive geometry/canvas Film City sign: provider project-authored code, licence original project content (no public source grant selected), generated/exported at build, inputs only original fictional briefs, no real-person imitation; runtime no external model/texture files. Fighters carry per-record provider/licence/date/false-imitation data. Procedural oscillator tones: project-authored WebAudio code, no voice recordings, samples or external voice model. Third-party Three.js/React/Zod/tooling licences remain separate; pnpm-lock records exact resolved versions. Screen captures and benchmark evidence are from this prototype, not AI concept art. Owner publication/legal review pending; no polished/AI asset clearance implied.
