# Fame Wars
Fight for the spotlight.

A browser-first 2.5D combat prototype with two original fictional placeholder fighters, local/CPU play, a best-of-three match flow and a deterministic 60 Hz simulation.

**Public prototype:** https://piyush907305.github.io/FameWars/

**Phone screening:** https://piyush907305.github.io/FameWars/?deviceTest=1 — diagnostic controls become available in Settings after the device-report deployment.

Physical-phone performance is not yet verified. Phase 2 concepts/assets are stopped at Step 0 until the owner reviews the real-device screening report. Five-minute screening and the separate twenty-minute sustained gate are distinct.

## Run locally
Use Node 24 (the tested pin is in .nvmrc) and pnpm 11.25.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Vite, normally http://localhost:5173/. For a static build, run `pnpm build` then `pnpm preview`; do not open index.html directly from disk.

## What is playable
Dhamaal Dynamo and Captain Chalk fight in Film City street. Choose solo CPU (three difficulties) or local two-player. Rounds last 45 simulation seconds; first to two wins. Health, stamina and super meter; walk, jump, crouch, block, light/heavy/kick, dash, super and placeholder finisher. Timeout compares stamina, then health, then sudden death. No online play, accounts, ads or production assets.

| P1 action | Default |
|---|---|
| Move | A / D |
| Jump / crouch | W / S |
| Block | F |
| Light / heavy / kick | J / K / L |
| Dash / super | Left Shift / U |
| Pause / debug | Escape / backtick |

P2 uses arrows and Numpad 0–5; remap both players in Settings. Gamepad and landscape touch input are implemented; physical controller testing remains pending. Touch operates P1. Subtitles stay on; volume and reduced motion are available. Hindi/English supported, with some secondary diagnostic/control labels in English.

## Verify
```sh
pnpm lint
pnpm typecheck
pnpm check:architecture
pnpm test
pnpm test:replay
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e:smoke
```

`pnpm test:replay` runs a recorded 10,000-tick complete match without rendering, checks golden hash d1553867, score 2–0, immutability and JSON restore. The original 900-tick combat replay (49fabaf6) and per-tick 10,000-tick twin-run test remain. Same-engine determinism is not proof of cross-engine rollback readiness.

`pnpm test:e2e:full` runs the slow rendered match. CI keeps that nightly/manual; short UI smoke tests remain on PRs. `pnpm test:e2e` runs all browser tests on demand. The earlier full-match CI test passed in 7.3 minutes, not a phone FPS measurement.

## Architecture and authoring
- packages/sim: pure serialisable fixed-step integer combat state; no DOM, rendering, wall clock or Math.random.
- packages/content: validated fighter/move/balance/arena/dialogue data.
- packages/ai: CPU consumes/emits the same input interface as people.
- packages/client: input, Three.js presentation, audio and React UI. Diagnostic timing stays outside the simulation.

See [content authoring](docs/20-content-authoring.md), [architecture](docs/02-architecture.md), [Step 0 report](docs/24-phase2-step0-report.md), [phone protocol](docs/23-phase1-5-readiness.md) and [performance targets](docs/06-device-and-performance-targets.md).

## History and releases
PR #1 is merged into main. The original local checkpoint graph is reachable through the readiness merge and archive/phase1-local. The original v0.1.0 release/tag points to ba03c3513b1f685cc82ca4a90d11dc1611c6f020; later readiness/diagnostic commits do not rewrite it. No force push was used.

Public static hosting uses GitHub Pages. The prior private Sites registration remains unused after its credential-helper approval was denied. Pages uses GitHub's deployment identity; no secrets belong in source.

## Rights and scope
All runtime fighters are original fictional characters with original licence status. No real-person likeness or cloned voice is included. Placeholder sound is procedural. No open-source licence is granted by default; third-party dependencies retain their own terms. See [content policy](docs/09-legal-and-content-policy.md) and [provenance](docs/13-asset-provenance-log.md).

No Phase 2 concept generation, production models/voices, paid plans or Phase 3 work has begun.
