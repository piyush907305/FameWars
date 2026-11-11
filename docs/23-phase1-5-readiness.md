# Phase 1.5 — release readiness

Phase 2 asset generation/spending is gated on physical Android results. Original fictional fighters only; no real-person likeness or voice. No new assets or paid services in this work.

## Review

Engineering self-review, not independent third-party approval: inspected simulation/state transitions, simultaneous hits, stamina/timeout rules, input sampling and buffer, content validation, renderer separation, browser lifecycle and CI. No blocking gameplay defect identified in this pass. The review found delivery and verification gaps addressed below; passing tests are not a subjective feel endorsement.

- Existing 10,000-tick twin-run determinism test compares hashes every tick. Existing recorded 900-tick golden replay hash: `49fabaf6`. Both existed in Phase 1.
- New recorded 10,000-tick RLE fixture extends the recorded script with neutral input; golden hash `b49be243`. It verifies exact tick count, input immutability, state immutability, and JSON restore at tick 5,000. This is same-engine deterministic replay, not proof of cross-engine/rollback readiness. Some ticks occur after the match ends; original twin-run test and combat rule tests remain.
- The renderer never writes simulation outcomes; browser timing only determines when fixed steps are called. Mobile frame stalls can still make controls feel poor; the device gate remains necessary.
- Full rendered-match browser test previously passed in 7.3 minutes in CI. PRs now run fast headless replay plus settings/controls and touch-layout smoke tests. Full match remains available manually and nightly at 19:30 UTC (01:00 IST next day). Nightly timing is best effort on GitHub, not an exact execution guarantee.
- Deployment uses a static GitHub Pages build under `/FameWars/`. Its two Pages actions were verified against upstream tag refs and pinned. No accounts, ads, analytics or production voices are introduced.
- A checksum-verified bundle and one-time Actions job preserve original Git objects and checkpoint refs, with ordinary non-force pushes. The original `v0.1.0` tag retains its commit ID; later readiness-only work belongs to the main branch history. No published tag is rewritten.

## Evidence status

| Gate | Status |
|---|---|
| 10,000-tick recorded golden replay | Implemented; CI result pending at authoring |
| Fast PR checks / nightly full match | Implemented; CI result pending at authoring |
| Original Git history / remote tags | Preservation workflow prepared; remote verification pending |
| PR review / merge | This self-review recorded; merge waits for successful updated checks |
| Public preview | Pages source configured; deployment pending merge |
| Budget Android | NOT TESTED; device/access pending |
| Mid-range Android | NOT TESTED; device/access pending |
| Physical touch / 4G / thermal | NOT TESTED |

Update this table from actual results, never from estimates.

## Phone protocol

Use the budget and mid-range devices in document 06 when available (Redmi 9A or Samsung Galaxy A14 4G; Redmi Note 12 4G), or record the owner-approved actual substitutes with model/RAM/SoC. Do not buy hardware for this gate. A desktop mobile viewport or emulator does not pass it.

1. Open the public preview in Chrome. Record URL, Git commit/build, exact device model, Android/Chrome versions, RAM, battery %, brightness and connection. Complete the adult/disclaimer gate personally.
2. Cold-load ten times with cache disabled, selecting both fighters and starting a CPU match. Record time to movement/attack, HAR transfer bytes, median/p75/p95. Compare the <8,000,000-byte and document 06 load gates. HTTPS loopback on the developer computer is not a substitute.
3. Run 20 minutes of repeated matches, 50% brightness, audio 30%, unplugged on actual 4G, beginning above 50% battery. Repeat twice. Log background interruptions separately.
4. Use the debug overlay and Chrome remote Performance tooling for a separate timing run. The current canvas `data-frame-intervals` retains at most 3,600 frames; export it at each one-minute segment. Do not mistake its rolling FPS readout for a 20-minute minimum. Capture p95/p99 intervals, any >2-second rolling interval below 30 FPS, draw calls, context losses and crashes.
5. Capture memory in a separate profiling run after warm-up and ten rematches. Report unavailable memory/thermal telemetry as unavailable. Do not use profiler-attached results for the final battery run.
6. Test movement + attack simultaneously, crouch-block, dash, jump, super with full meter, pause, orientation, suspend/resume, audio interruption and Hindi clipping. Use a high-speed camera for input-to-display latency if available; event timings alone do not measure display latency.
7. Write subjective feel notes per device: readability, touch reach, accidental inputs, response, hit feedback, difficulty and fatigue. These are tester observations, not inferred from desktop FPS.

## Results template

| Field | Budget Android | Mid-range Android |
|---|---|---|
| Model / RAM / SoC | Pending | Pending |
| OS / Chrome / build | Pending | Pending |
| First playable p75 / transferred bytes | Pending | Pending |
| 20-minute FPS p95/p99 / worst rolling FPS | Pending | Pending |
| Crashes / context losses | Pending | Pending |
| Battery start/end / temperature warnings | Pending | Pending |
| Memory method/result | Pending | Pending |
| Touch / readability / feel notes | Pending | Pending |
| Evidence files / tester / date | Pending | Pending |
| Pass / fail / follow-up | BLOCKED: no physical test | BLOCKED: no physical test |

## Phase 2 asset gate

No production AI models, voices or asset spending until both phone rows have real evidence, unresolved failures have a mitigation, and the owner approves Phase 2. Placeholder performance is a baseline with headroom, not proof that heavier production assets will fit. Start with one benchmark character and remeasure the same phones before roster expansion.
