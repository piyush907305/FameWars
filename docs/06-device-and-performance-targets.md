# Device and performance targets

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Test matrix

ASSUMPTION A16: owner can borrow/access the following physical devices; availability is unconfirmed. Emulator results supplement, never substitute for thermal, GPU memory and real touch tests. Capture exact model/SKU, RAM, SoC, OS/browser versions, battery health, resolution, network and preset in each run.

| Class | Named baseline | Required scenarios |
|---|---|---|
| Budget Android | Redmi 9A, 2 GB RAM, Helio G25 | Chrome supported by installed OS; low preset, touch + CPU, cold load; if browser no longer supported, log and decide minimum OS rather than claim support |
| Budget alternative | Samsung Galaxy A14 4G, 4 GB | Chrome current supported release, low/medium, touch |
| Mid Android | Redmi Note 12 4G, 4 GB, Snapdragon 685 | Chrome current, medium, Bluetooth controller |
| Apple floor | iPhone 11, 4 GB | current supported iOS Safari plus native WKWebView later; low/medium, audio interruptions/safe areas |
| Apple newer | iPhone 13 | Safari, PWA installed, lock/resume |
| Desktop Windows | Intel i5-8250U / UHD 620 / 8 GB reference laptop | current Chrome and Edge; keyboard rollover, USB pad |
| Desktop macOS | MacBook Air M1 / 8 GB | current Safari and Chrome; WebKit lifecycle |

Version support policy proposed: latest two supported major browsers where platform allows; old device failures openly documented. WebGL2 baseline with a friendly unsupported-device screen; WebGPU optional future enhancement, never a baseline requirement. Exact capability probe and browser/version floor decided against physical results, not marketing specs. Landscape fight UI; portrait explanatory rotate screen and accessible menu navigation.

## Transfer and load gate

**Under 8 MB** means <8,000,000 transferred response-body bytes for a cold first playable match with two fighters, first arena, one locale, essential audio, fonts, decoder/WASM and service-worker install traffic. No prefetch outside accounting. TLS/header transport overhead reported separately; compressed network transfer, not uncompressed source size. Clear cache/storage/service workers; record HAR and Resource Timing (proper Timing-Allow-Origin for asset CDN). First playable = input enabled after both fighters can move/attack, not title shown. No placeholder substitution to pass a production asset test.

Proposed allocation: app JS/CSS 1.2 MB; models 2.2 MB; shared animations .7 MB; arena 1.1 MB; audio .65 MB; fonts/UI .3 MB; decoders .35 MB; manifest/overhead .1 MB = **6.6 MB**, leaving 1.4 MB headroom. These are acceptance allocations, not measured builds. Never fetch both language packs/audio codecs before first fight. Cache by content hash after consent implications considered; later matches can stream extra arenas outside cold-start metric and report totals.

ASSUMPTION A17: reproducible constrained-4G lab profile = 8 Mbps down / 2 Mbps up / 150 ms RTT / 1% packet loss. Measure real India 4G traces separately with consent; do not equate DevTools throttling with field results. Lab cold first-play p75 <=15 sec over 10 runs per baseline device; report median/p75/p95, bytes and decode time. At different throughput compute expected floor and report failure rather than changing target silently.

## Runtime budgets and procedures

| Measure | Proposed gate | Method |
|---|---|---|
| Frame rate | 60 target; sustained 30 floor | 20-min match loop, low preset; per-device p95 frame interval <=33.3 ms and no >2-sec interval below 30 rolling fps outside loading/background; also report p99 and dropped frames |
| Simulation cost | p95 <=2 ms/tick on budget phone | timed outside sim using profiler, fixed 60 Hz unchanged; include CPU opponent |
| Main-thread long tasks | no >200 ms task during active combat; report >50 ms counts | PerformanceObserver where available + Chrome/Safari traces |
| Renderer memory | textures <=48 MiB; geometry <=16 MiB logical resident | sum decoded mip chains, buffer sizes, renderer counters; estimate labelled, not claimed OS GPU measurement |
| JS heap | <=96 MiB steady where observable | DevTools allocation/heap snapshots outside timing run, 10 rematches; <=10% post-GC growth after warm-up |
| Total process | <=250 MiB incremental browser process footprint if observable | isolated browser baseline and platform tools; Safari/Android method differs; no unsupported browser memory API claims |
| Thermal/battery | <=8 percentage-point drain/20 min; no thermal warning or loss of 30 fps floor | 50% brightness, audio 30%, unplugged, 4G, >=50% initial battery, ambient recorded; compare idle baseline, repeat twice |
| Stability | zero crash/context-loss in acceptance loop; recovery path tested | 10 rematches + suspend/resume + artificial context loss; releases blocked by repeated unhandled crash |
| Touch/control response | p95 input-to-visible change <=100 ms locally | high-frame-rate video where possible; event/render marks are diagnostic only, not full display latency |

Battery gates are design targets sensitive to device age; failing them triggers quality reduction, not a universal battery guarantee. Record unsupported observability and use alternate evidence; do not mark unmeasured pass.

Dynamic resolution cap 1.0 device pixel ratio low, up to 1.5 medium; low removes real-time shadows/post effects and uses fewer particles. Reduce render quality when frame interval trends worsen; never reduce sim frequency or change move timing. No developer tool profiling during final battery run. Test mute, reduced motion, bilingual clipping, minimum 44 CSS-pixel touch targets, safe areas, keyboard focus, and controller disconnect. Multiple simultaneous touch points and browser gestures require physical verification; no claim of comfortable same-phone two-player play.
