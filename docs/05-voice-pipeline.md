# Synthetic voice pipeline

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Policy and sourcing

Voices are original synthetic character performances, never clones or deliberate imitations. Do not upload real-person voice samples, name celebrities in prompts, or use famous catchphrases. Every clip has exact provider/model/voice-preset/plan, synthesis and licence-review timestamps, terms evidence, script rights, checksum and reviewer. `licenseStatus` of the fighter does not by itself clear a voice. [Provenance record](13-asset-provenance-log.md).

## Candidate decisions

| Option | Decision | Commercial gate |
|---|---|---|
| Local Kokoro-82M | Preferred zero-service-fee AI TTS trial, pre-render Hindi and English | Apache-2.0 weight licence observed; pin model/voice files and audit dependent phonemiser/voice licences; not a personality/likeness warranty |
| ElevenLabs stock/designed synthetic voices | Low-cost candidate if Hindi tests fail and spend approved | Free outputs blocked from commercial build; generate commercial clips while eligible paid plan active; review selected voice/product terms |
| Azure prebuilt neural TTS | Alternative paid-tier Hindi/English trial | Do not assume free tier output is commercially cleared; paid-tier output right in current product terms; account/product quote required |
| Meta MMS Hindi | Excluded for monetised build | Model is CC BY-NC; free availability does not equal commercial permission |

Primary sources and checked dates: [register](12-sources-and-service-register.md). ASSUMPTION A14: local model can run acceptably on the owner's computer and its Hindi/English stock voices pass review. Synthesis speed has no gameplay impact because clips are baked. The upstream voice inventory lists Hindi presets, but warns about non-English and short-utterance quality. Verify the exact Hindi preset files and dependencies during trial; no hosted unofficial demo scraping. If unavailable or inadequate, prototype uses captions and a clearly marked silent audio slot; commercial voice delivery remains blocked pending a cleared paid route, not secretly filled with non-commercial audio. Robotic non-AI synthesis would change the all-AI requirement and needs approval.

## Production and audio budgets

Prepare scripts in Devanagari Hindi and en-IN English, short lines 1–3 seconds (finisher up to 4), no new generated lines during play. Define original personalities: energetic theatrical Dynamo, dry strategic Chalk, exaggerated melodramatic Duchess. Human review must reject similarity to any recognisable performer. Test stock synthetic voices before adjusting pitch/rate; pitch shifting is not a legal clearance.

Prototype maximum 6 spoken lines/fighter/locale, 24 total (two fighters × two locales × six); one active locale downloaded. Keep lossless 48 kHz mono WAV masters offline; runtime Opus where supported with AAC fallback chosen by capability probe, not both downloaded. <=350 KB all first-play voice clips for selected locale, <=1 MB full prototype voice set per locale; individual line <=64 KB. Combined decoded first-match audio <=12 MB. Dialogue integrated loudness target -18 LUFS, true peak <=-1 dBTP, mix voice above effects without clipping; test quieter phone speakers. SFX/music have separate provenance. Missing clip is caption-only; no synthesis key in browser.

Pipeline: approved original script → voice preset trial → offline render → pronunciation corrections → loudness/trim → manual subtitle timing → compress → browser decode test → content hash/provenance → review. Regenerate after licence plan change if earlier output not cleared; paid upgrade does not retroactively fix a free clip.

## Voice acceptance test

Use 20 lines/locale across numbers, names, Hindi aspirates, English loanwords and code-switching, including all actual prototype lines. Two fluent Hindi reviewers and one English reviewer (ASSUMPTION A15: available adult volunteers) transcribe without text. >=95% intended words recognised; no severe meaning-changing errors; median personality rating >=4/5; no clip flagged as real-person imitation. Rate pronunciation, distortion, emotional clarity and consistency on phone speakers and headphones. Log model/preset and every correction. Without reviewers, quality gate is untested.

Subtitles default on, independent language selector for text/audio, scalable high contrast with Devanagari-capable commercially cleared font. Proposed 2 lines, <=32 English characters/line; Hindi wraps by grapheme and rendered width, never code-unit slicing. Reading-speed target <=15 graphemes/sec Hindi and <=17 chars/sec English; lengthen display or shorten text. Subtitle timing within +/-100 ms of speech onset, end no earlier than speech end. Basic jaw/amplitude animation acceptable, no phoneme-perfect lip-sync promise. If visibly off by >150 ms, use closed-mouth pose/expressive body rather than false lip sync. Captions survive mute/skip, audio resumes only with permitted user gesture; finisher presentation event cannot affect sim timing.
