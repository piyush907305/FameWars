# Fame Wars

**Fight for the spotlight.** Browser 2.5D combat prototype, **v0.1.0**. Original fictional fighters, primitive art, generated sound effects. No real-person name, likeness or voice; no AI-generated assets, online play, accounts, ads or analytics.

## Run locally

Use **Node 24.22.1** (`.nvmrc`) and **pnpm 11.25.0** (`packageManager`). Install that pnpm version using your normal Node/package-manager setup; do not disable signature checking to work around an outdated Corepack.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the printed Local URL, normally `http://localhost:5173/`. Rotate phones to landscape. First launch presents a bilingual original-content disclaimer and provisional 18+ self-declaration for private testing, not robust age verification/legal clearance. No third-party tracking SDK.

For a production build:

```sh
pnpm build
pnpm preview
```

Open `http://localhost:4173/`. Static output is `dist/`; do not open index.html directly from disk. A matching private hosted preview uses the Sites configuration in `.openai/hosting.json`; GitHub target is https://github.com/piyush907305/FameWars (public source publication approved by owner). This is not a public production launch or approved Phase 2.

## Play

Select **Dhamaal Dynamo** (fictional action-star archetype) and **Captain Chalk** (fictional cricket-captain archetype). Mirror matches allowed. One original Film City street arena; first to two round wins; 45-second combat timer. Keyboard shared local two-player or one player vs easy/normal/hard CPU. Two connected pads can control local players; P1 touch controls appear on coarse-pointer devices. Two separate phones cannot play together yet.

| Action | P1 | P2 default | Standard gamepad |
|---|---|---|---|
| Move | A / D | Left / Right | Left stick / D-pad |
| Jump / crouch | W / S | Up / Down | A / Down |
| Block | F | Numpad 0 | LB |
| Light / heavy / kick | J / K / L | Numpad 1 / 2 / 3 | X / Y / B |
| Dash / super | Left Shift / U | Numpad 4 / 5 | RB / RT |
| Pause / debug | Escape / backtick | Shared | On-screen buttons |

Remap keys under Settings (needed for keyboards without numpads); keyboard hardware rollover may limit simultaneous presses. Input sampled every 60 Hz sim tick; attacks edge-triggered with a 3-tick buffer, not hold-to-repeat. Stamina pays for attacks, block and dash; regenerate by standing idle. Zero stamina staggers. Standing block loses to low kick; crouch-block stops low/mid. Super needs full meter. Timeout compares stamina, then health, then sudden death. Round **winner** performs the non-damaging captioned flourish with a generated tone; skip after one second. Subtitles always on; reduced-motion/flash and volume controls available.

## Verify

```sh
pnpm lint
pnpm typecheck
pnpm check:architecture
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Local Playwright config defaults to installed Chrome; CI downloads Chromium. To use downloaded Chromium locally, run with `CI=1 pnpm test:e2e` after stopping an existing dev server (CI starts its own). No real data/accounts used in tests. On this workspace the standalone Chrome launch is sandbox-blocked; see [test report](docs/21-v0.1.0-test-report.md) for verified embedded-browser results and limits. Never call an unrun CI workflow green.

Combat lab (dev server only): `/debug.html` for boxes; `/debug.html?art=3d` for 3D; append `&cpu=1` for normal CPU. The main game also accepts `?view=boxes`; toggle debug in-game with backtick or the debug button. [Checkpoint log](docs/19-checkpoints.md) records what works/doesn't and commands for all eight stages.

## Architecture and content

```text
packages/content/  strict Zod schemas + fighter/move/arena/dialogue/balance JSON
packages/sim/      pure step(state, inputs, content) → new state; serializable integer state
packages/ai/       seeded difficulty policies → same Input interface
packages/client/   input, render, animation, audio, ui modules
scripts/           boundary check, sim demo/benchmark, explicit golden replay recording
tests/browser/    Playwright match/menu/mobile acceptance scenarios
tests/replays/    recorded commands + reviewed golden hash
 docs/             design, approved amendments, reports, guides and evidence
```

The validated content is passed explicitly to sim instead of imported as mutable global data. Renderer consumes snapshots; audio/camera never decide hits. No sim clock, DOM, Three.js or Math.random. State transition table is in one place. The seeded PRNG is stored in state; CPU reads it. Resources and damage use integers; events have IDs. Hash is noncryptographic regression evidence, not security validation.

- [Approved Phase 1 baseline / prior conflicts](docs/18-phase1-approved-baseline.md)
- [Architecture and ADRs](docs/02-architecture.md)
- [Add a fighter / tune a move](docs/20-content-authoring.md)
- [Test report and limitations](docs/21-v0.1.0-test-report.md)
- [Release notes and proposed Phase 2](docs/22-v0.1.0-release-notes.md)
- [Legal/content and provenance policy](docs/09-legal-and-content-policy.md)

## Git and ownership

Small checkpoint commits are on named feature branches, integrated into main for release; v0.0.0 preserves Phase 0, v0.1.0 marks this prototype. Owner supplied https://github.com/piyush907305/FameWars. Access is verified and public source publication was approved by the owner (A34). A Git bundle in the handoff preserves all commits/branches/tags and can be cloned normally. Sites' source store is separate from GitHub. The remote has an initial README commit; integration will preserve that history. No open-source licence is granted by default; original project code/content and third-party dependencies retain their respective rights. Exact dependency versions and lockfile committed; future updates deliberate.

## Publication status

Public GitHub source publication is authorized, but upload is blocked by missing Git credentials and connector write access (403). The owner-private hosted preview is not deployed because execution approval rejected the supported credential-transfer step. See the test report for exact limitations. The source ZIP and Git bundle provide the complete local handoff; Phase 1 external acceptance is pending.
