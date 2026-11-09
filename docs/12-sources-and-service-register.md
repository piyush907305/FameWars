# Sources, licences and service costs

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Evidence protocol

**Checked 2026-11-09** against the primary links below. This is a planning snapshot, not a contract, pricing guarantee or per-asset approval. No accounts/paid plans created. Record exact service plan, model/version, locale, generation date, applicable terms version and an archived evidence hash for every actual output; recheck before use and release. “Commercial candidate” does not grant rights in infringing inputs or real-person likeness. Where account-specific terms/prices are not established, shipping remains blocked until checked. Summaries are brief; linked original terms control.

## Asset and voice candidates

| Provider/tool | Licence / commercial-use finding | Cost and decision | Primary evidence |
|---|---|---|---|
| Meshy | Free-plan output: CC BY 4.0 attribution required; terms reserve output ownership to Meshy for free users. Do not claim exclusive ownership. Paid customer rights differ. | Free candidate within actual credits/download entitlement; availability/limits recheck before batch. Paid not authorized. | [Terms §3](https://www.meshy.ai/terms-of-use), [licence help](https://help.meshy.ai/en/articles/9992001-can-i-use-meshy-assets-commercially-license-copyright-explained) |
| Blender | GPL software; own artwork may be commercially used; imported content/add-ons retain own licences. | Free local cleanup/rig/export. | [Blender licence](https://www.blender.org/about/license/?channel=Organic&medium=Google+-+Search) |
| Adobe Mixamo | Free Adobe ID service; commercial game use of characters/animations described as royalty-free; not an exclusive-asset grant. Keep downloaded source out of public asset packs. | Free rig/animation candidate; unsuitable distorted anatomy may fail. | [Adobe FAQ](https://helpx.adobe.com/creative-cloud/faq/mixamo-faq.html) |
| Kokoro-82M | Model card Apache-2.0; verify actual voice/dependency notices, no real-person imitation. | Local offline AI voice candidate, no API charge; hardware/electricity excluded by A09, quality unproven. | [Model card](https://huggingface.co/hexgrad/Kokoro-82M), [upstream voice inventory and limitations](https://huggingface.co/hexgrad/Kokoro-82M/blob/main/VOICES.md) |
| ElevenLabs | Free: non-commercial with attribution; paid generation grants commercial rights subject to terms/product exclusions. Do not retroactively clear free outputs by upgrading. | Paid stock/designed synthetic voice candidate only after current quote and spend approval; no beta/clone use. | [Official billing/licensing overview](https://elevenlabs.io/docs/overview/administration/billing) |
| Microsoft Azure prebuilt neural TTS | Product terms expressly describe commercial output use for paid tier; do not extrapolate that right to free outputs. | Alternative paid synthesis; obtain selected-region SKU quote; no free commercial assumption. | [Product Terms—TTS](https://www.microsoft.com/licensing/terms/en-US/productoffering/MicrosoftAzure/allprograms), [Speech overview](https://learn.microsoft.com/en-us/azure/ai-services/Speech-Service/text-to-speech) |
| Meta MMS Hindi | CC BY-NC-4.0 displayed; excluded from commercial/advertising game. | Not a shipping candidate even if free. | [Publisher model repository](https://huggingface.co/facebook/mms-tts-hin/tree/1d83b223ec78e30b944f7d96bd117eb3d7023303) |

Hindi and English Kokoro voices are listed upstream; quality, especially short clips/non-English support, requires local tests. Stock preset is not evidence of safe imitation; use original scripts and similarity review. No training/retraining/cloning proposed. Optional model converters, phonemisers, FFmpeg builds, fonts and music require a dependency/asset-level licence inventory before distribution. Tools are not an exemption from underlying data/voice rights.

## Runtime/toolchain licence plan

Proposed packages: TypeScript Apache-2.0; Three.js, Vite, pnpm, React, Vitest, Colyseus and Zod generally MIT; Playwright Apache-2.0; Capacitor MIT. This is a shortlist, **not an installed dependency audit**. Phase 1 pins releases, captures each LICENSE/NOTICE and transitive inventory before use. React/CSS and pnpm are not paid hosting services. Candidate glTF-Transform/Meshoptimizer licences similarly need pinned-release verification; no packages shipped now. Project code remains unlicensed pending owner choice, independent of third-party rights. GitHub public visibility is not the same as an open-source licence.

## Hosting and budget ledger

| Item / stage | Planning cost | Evidence / constraints |
|---|---|---|
| Static client, Phase 1–3 | ₹0 incremental if free quota and provider subdomain suffice | [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/): Free 500 builds/month, single concurrent build; check per-file/site limits before assets. Static hosting is separate from Functions billing. |
| Offline AI/cleanup | ₹0 service spend with cleared free/local route | A09 existing hardware/internet and A13 owner labour; credits/quality may force delay or lower fidelity. |
| Private docs/code repository + CI | ₹0 target within included plan quotas | [GitHub pricing](https://github.com/pricing); account-specific Actions/LFS/storage limits must be checked when remote is chosen; no unlimited private CI promise. |
| Node room experiment | ₹0 possible closed-test host | [Render free limits](https://render.com/docs/free): idle spin-down after 15 min, cold start approximately a minute, ephemeral files/usage limits. Not acceptable as guaranteed responsive production service. |
| Always-on Node production | A11 allowance US$7–15/month, ₹630–1,350 at A10 conversion | Budget only; [Render pricing](https://render.com/pricing) requires actual compute/workspace/region quote. Capacity/egress/backups extra, load-test first. |
| Domain | ₹0 until needed (A26); later obtain registrar quote/renewal cost | No purchase or availability claim. |
| Commercial cloud voices | ₹0 if local approved; otherwise quote selected paid plan for finite offline batch | No automatic subscriptions/upgrade; regenerate affected outputs with proper rights. |
| Native iOS later | Apple lists US$99/year membership, ~₹8,910 at A10 before tax | [Official enrollment](https://developer.apple.com/help/account/membership/program-enrollment); local pricing/waivers may differ; app costs not zero. |
| Android distribution later | Not yet quoted | Store registration/device testing/native SDK costs to verify at wrapper gate. |

Costs exclude labour, legal review, borrowed devices, income tax and internet. Spend ceiling defaults ₹0 until approved, no auto-scaling/paid upgrades. At ₹0, online production and native-store release may have to wait. Data/server backup region, support and egress pricing must be checked with chosen host; no free-tier player count inferred.

## Ads, privacy and platform primary sources

- [Google H5 Games Ads setup](https://support.google.com/adsense/answer/9959170?hl=en) and [programme/eligibility](https://adsense.google.com/start/h5-games-ads/): web-game ad candidate; discretionary approval. Check actual account and current integration before implementing.
- [Google rewarded-ad policy](https://support.google.com/adsense/answer/9121589?hl=en-AG): policy basis for opt-in non-cash cosmetic rewards; product imposes additional stricter caps.
- [AdMob policy index](https://support.google.com/admob/answer/6128543?hl=en): native-stage review and provider settings required. [European regulations overview](https://support.google.com/admob/answer/7666366?hl=en) matters to later regions, not proof that one India banner meets global duties.
- [DPDP Act, official text](https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf), [commencement Gazette G.S.R.843(E)](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf), [MeitY Rules/corrigendum index](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025): legal reviewer must map provisions and dates; this pack does not certify compliance.
- [Promotion and Regulation of Online Gaming Rules 2026, official Gazette](https://www.meity.gov.in/static/uploads/2026/04/7e0b02d37fd07f81fa48578a9996aa85.pdf): dated 22 April 2026, commencement 1 May 2026; applicability/classification/safety/registration review remains a launch gate, not presumed exemption for free games (A24).
- [Capacitor environment](https://capacitorjs.com/docs/getting-started/environment-setup) and [iOS runtime](https://capacitorjs.com/docs/ios): shared web core with native project/toolchain requirements, not automatic store acceptance.
- [Three.js](https://threejs.org/), [Colyseus](https://docs.colyseus.io/), [GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions): stack/platform references; no installed version/capacity claims.

## Evidence limitations

Source pages were read/retrieved for Phase 0; no account-specific contract, actual asset-generation receipt or archived signed licence exists yet. Public links may change. Owner must archive authoritative terms and content-specific rights when generating/purchasing. “Checked” is not “approved to ship”; every actual asset starts pending. Do not rely on search snippets, provider marketing claims of game-readiness, or third-party licence summaries as final evidence.
