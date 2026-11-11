# Phase 1 checkpoints — v0.1.0

All eight checkpoints belong to one approved Phase 1 delivery. Feature branches preserve the sequence; earlier stages are development checkpoints, not separate production releases. User did not request approval pauses between checkpoints. Every step below assumes repository root, Node 24.22.1, pnpm 11.25.0 and `pnpm install --frozen-lockfile`.

| Checkpoint | Works / evidence | Not included at that checkpoint | Exact run steps |
|---|---|---|---|
| 1 · sim core | Pure integer sim, 60 Hz input commands, resource and outcome rules, 10k determinism, golden recorded replay; initial 19 tests passed | No graphics or human interface; command-driven playable simulation | `pnpm test`; `pnpm sim` |
| 2 · debug renderer | Read-only box/hitbox view and keyboard input; embedded-browser render inspected | No finished UI, CPU, touch or gamepad verification | `pnpm dev` → `/debug.html` |
| 3 · placeholder stage | Primitive original two-fighter puppets, Film City street, camera and interpolation; actual landscape screenshot inspected | No polished/AI art, skeletal assets or native platform | `pnpm dev` → `/debug.html?art=3d` |
| 4 · combat rules | All attacks/dash/super, block/regen/stagger, timeout priority, KO/trades, sudden death and first-to-two; covered by sim tests | No ranking/online; tuning provisional | Same 3D lab URL, P1/P2 key mapping shown there |
| 5 · CPU | Separate deterministic easy/normal/hard policies using human Input; additional two AI tests | Not adaptive/learning AI or online bots disguised as humans | `pnpm dev` → `/debug.html?art=3d&cpu=1`; choose all levels in final main UI |
| 6 · UI and controls | Bilingual title/select/HUD/pause/results/settings, key remap, gamepad sampling and touch controls, landscape prompt and safe areas | Physical pads/multi-touch/low-end phone testing not performed | `pnpm dev` → `/`; accept private-test disclaimer, choose mode and fighters |
| 7 · finisher | Winner-only flourish, camera adjustment, bilingual captions, generated sound, skip/reduced motion; CPU match reached correct 0–2 result | No TTS/real-person voices, AI assets or polished animations | Same main URL → CPU hard → play or observe to round result; volume/subtitles/skip controls |
| 8 · performance/bugs | Final lint/typecheck/boundary/unit/build checks, workspace links, resource/camera fixes, static size and host browser frame evidence | Playwright launch sandbox-blocked; physical device, thermal, battery and cross-browser gates still unverified | `pnpm lint && pnpm typecheck && pnpm check:architecture && pnpm test && pnpm build`; `pnpm preview` → port 4173; `pnpm test:e2e` on supported host/CI |

See [test report](21-v0.1.0-test-report.md). Known failures are explicit, not hidden by checkpoint completion. Initial golden hash b8841007 was deliberately superseded to 49fabaf6 after fixing sim to enforce each move's data-defined allowedStates: attacks cannot start directly from held block. Regression test added; no automatic golden updating in tests or CI. Visuals and tests were updated before release. Commands do not use any gameplay win/health shortcuts.
