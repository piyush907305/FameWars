# Legal, content and privacy policy plan

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Scope and authority

This is an engineering/control plan, **not legal clearance**. Public launch is gated on owner legal/entity decisions and a qualified review of applicable Indian law, provider terms and store rules. No budget does not exempt compliance. Sole owner acts as content reviewer, incident operator and publisher until delegated; lack of availability is a launch risk.

## Originality and licensing release gate

Only new fictional archetypes; no real names, faces, recognisable mannerisms, signature outfits, film/team/party marks, copied slogans or identifiable voices. Avoid stereotypes tied to caste, religion, language, region or community. No election messaging, real political endorsements, hate content, gore or realistic cruelty. The earlier celebrity material is excluded even as a reference. A disclaimer is not permission to imitate someone.

Every fighter `licenseStatus` is original or licensed. Original needs script/design originality review and all underlying asset rights. Licensed needs dated written permission expressly covering name/likeness/voice where relevant, animation/game, ads, languages, India territory, web/native distribution, duration, edits and marketing. Permission outside scope/expiry/missing evidence blocks ship. A real-person licence would also require a deliberate product policy change from original-only launch; enum support is not permission to add them now. Each mesh, texture, animation, voice, font, music and input image has separate provenance; unknown/NC/expired permission blocks build. Do not treat generated output as guaranteed copyrightable, exclusive or non-infringing.

Archive private terms/permission evidence with checksum, generation date and applicable plan; public credits contain required notices without private contracts. Recheck before release and provider plan changes. Per-asset record in [log](13-asset-provenance-log.md). Sole-owner self-review explicitly recorded, not described as independent review.

## Kill switch and takedown

Owner must supply real monitored rights/privacy contact before external testing; placeholder contact blocks release. In-game report opens plain email/form outside battle with fighter ID/build/issue type and optional details; no public accusation feed or evidence uploads initially. Acknowledge within 2 business days, triage credible urgent risks within 24 hours, target resolution/update within 7 days (proposed service commitments, not statutory deadline claims). Preserve minimal evidence and notify reporter of action/appeal path; don't promise removal without assessment.

Authenticated operator publishes signed roster/asset revocation manifest. Stable fighter kill key supports per-fighter disable without a code release; disabled models, voice, thumbnails, dialogue and marketing are all removed from selectable/prefetchable content. Clients fetch network-first at start/resume/selection/between rounds; server enforces before match creation and can abort revoked active rooms as no-contest. Purge CDN/PWA cached references and prevent old save/receipt re-enabling. Balance stays pinned for ordinary updates; urgent revocation overrides availability.

Proposed manifest TTL 24 hours (A21: owner accepts offline expiry tradeoff). If missing/expired/unverifiable, fail closed for roster selection and offer connect/update; bootstrap has no approved fighters. Active local fight can complete its current round with presentation suppressed for newly revoked fighter, then return to menu. Offline copies cannot be remotely erased or instantaneously disabled; document this limitation. PWA readiness does not promise indefinitely offline play. Verify disable/re-enable/expired manifest tests, key rotation and rollback cannot undo revocation. Disable reasons to players are neutral; no confidential allegation details.

## Disclaimer screen draft

English: “Original fictional characters. This cartoon game uses synthetic voices and AI-assisted artwork. It is not affiliated with or endorsed by any real person, team, party or organisation. Cartoon fighting is fictional; do not imitate it.”

Hindi: “सभी पात्र मौलिक और काल्पनिक हैं। इस कार्टून गेम में कृत्रिम आवाज़ों और एआई की सहायता से बनी कला का उपयोग हुआ है। यह किसी वास्तविक व्यक्ति, टीम, दल या संस्था से संबद्ध या समर्थित नहीं है। कार्टून की लड़ाई काल्पनिक है; इसकी नकल न करें।”

Native review required (A15). Show at first start and accessible thereafter; no implication that “parody” defeats rights or privacy obligations. Store content rating and actual age policy must match marketing.

## Moderation and content operations

No player uploads, free-text names/chat or user voice at launch. Curated content checklist rejects hate, community/religion targeting, electoral content, sexual material, real allegations, defamatory insinuations and celebrity imitation. Bug reports with abuse/personal data are access restricted and redacted. Later social features need separate reporting/blocking/rate-limit/moderator plan before enabling. Appeal route to owner; do not silently reintroduce removed material via legacy bundles. Share output only uses original assets/text and no usernames by default.

## DPDP current-law basis and proposed controls

The [DPDP Act](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf) covers digital personal data and defines a child as under 18. Its consent, rights and child-processing provisions require a concrete design review. [G.S.R. 843(E)](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf) commences provisions in stages: immediate, one year and eighteen months after Gazette publication. As of 2026-11-09, do not represent all substantive obligations as already commenced or ignore upcoming stages. The [MeitY rules index](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025) includes notified rules and corrigendum; launch counsel must map exact operative dates, amendments and provider roles. The following are **proposed product safeguards**, not an exhaustive statement of law.

- Prefer no accounts/optional telemetry in v0.1.0; processor/CDN access logs can still be personal data. Inventory hosts, ad/auth/analytics vendors and cross-border processing locations/retention.
- Separate language/essential storage from optional analytics/ad purposes. Plain Hindi/English itemised notice, purposes, data types, vendor list and contact; no bundled/preselected consent. Withdrawal as easy as consent; new purposes require new notice/choice.
- A01 adult-only service proposed. Neutral age band, no full DOB retained; under-18 access to online/ad service blocked pending review. Self-report is weak; must not be the sole claimed compliance mechanism if actual use/targeting includes children. Child-inclusive launch requires designed verifiable parental consent, appropriate safeguards and prohibitions on child tracking/targeted ads; don't collect government IDs casually to solve this.
- Data minimisation: local input settings and locale; later pseudonymous guest/account IDs, consent receipts and security logs only for specific purposes. No voice input, contact list, precise location, biometric collection or player photos.
- Purpose-bound event allowlist, no arbitrary text/URL payloads. Consent receipt holds notice version, purposes, region, timestamp and pseudonymous receipt ID; do not link rejected users with fingerprinting.
- User access/correction/erasure/grievance/nomination request process where applicable; verify requester proportionately, track response dates and processor propagation. No false promise to erase mandatory evidence immediately.
- Security: TLS, least privilege, secret management, encrypted provider storage, restricted logs, backups with retention schedule. Incident owner investigates, contains, preserves scoped evidence and follows applicable notification duties; do not hard-code guessed legal deadlines.
- Contracts/processor terms, deletion capabilities and hosting geography reviewed before collection; India-only audience is not an automatic India-only storage requirement or a global-law exemption.

### Proposed retention schedule (A22, owner/legal approval needed)

Local preferences until user reset; optional analytics raw events 30 days then aggregate/deidentify; security logs 30 days initially unless applicable law/provider obligations require otherwise; invite tokens expire within 24 hours; room input replays 7 days only if needed for defects/abuse and covered by notice; account data until deletion request/account closure plus documented backup expiry <=30 days where lawful; support/takedown records 90 days after resolution unless required evidence retention. Consent receipts retention is purpose/statute dependent: owner counsel must set exact duration before collection. No “anonymous forever” claim. Check applicable CERT-In/logging duties before selecting log region/duration; legal retention overrides proposed defaults transparently.

Privacy notice and terms drafts are [separate](15-privacy-notice-draft.md), [editable documents](16-terms-draft.md), not publish-ready policies. Actual legal entity/contact, service providers and approved ages are blockers.

## Other India launch gate

A free ad-supported game is intended as an online social game, **not a guaranteed legal classification**. The [official 2026 gaming-rules Gazette](https://www.meity.gov.in/static/uploads/2026/04/7e0b02d37fd07f81fa48578a9996aa85.pdf) must be reviewed for applicability, classification/registration, safety and grievance requirements before public release. No entry stakes, money rewards or cashable cosmetics; future tournaments/prizes/payments trigger fresh review. Do not assume DPDP is the only applicable framework. Global expansion, native-store policies and advertising platform contractual duties are independent release gates.
