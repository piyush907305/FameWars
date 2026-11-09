# Fame Wars — Phase 0

Version **v0.0.0**. Definition documents and empty future module directories only. No gameplay, runtime dependencies, executable app, network server or paid service has been created. Nothing has been published to GitHub or deployed.

Start with [the one-page decision summary](docs/00-phase0-summary.md), [game brief](docs/01-game-brief.md), [architecture](docs/02-architecture.md), then [questions requiring approval](docs/11-risks-and-open-questions.md).

## Document index

1. [Brief and exact round rules](docs/01-game-brief.md)
2. [Architecture and seven ADRs](docs/02-architecture.md)
3. [Validated data contracts and examples](docs/03-data-schemas.md)
4. [Art and AI assets](docs/04-art-and-ai-asset-pipeline.md)
5. [Synthetic voices](docs/05-voice-pipeline.md)
6. [Devices and performance](docs/06-device-and-performance-targets.md)
7. [Networking](docs/07-networking-strategy.md)
8. [Ads and revenue model](docs/08-monetisation-and-ads.md)
9. [Legal, privacy, moderation and takedowns](docs/09-legal-and-content-policy.md)
10. [Phased backlog](docs/10-backlog.md)
11. [Risks, assumptions and approval questions](docs/11-risks-and-open-questions.md)

Verification: [Phase 0 check record](docs/17-phase0-verification.md).

Supporting records: [source/licence register](docs/12-sources-and-service-register.md), [provenance template](docs/13-asset-provenance-log.md), [release gates](docs/14-release-checklist.md), [privacy notice draft](docs/15-privacy-notice-draft.md), [terms draft](docs/16-terms-draft.md).

## Planned layout

```text
packages/client/       browser game and React menus (empty)
apps/rooms/        later Node/Colyseus host (empty)
packages/sim/      deterministic combat, no renderer dependency (empty)
packages/content/  later schemas, validation and manifests (empty)
packages/platform/ web/native adapters (empty)
assets/source/     future editable originals; large files via LFS
assets/runtime/    future optimized exports
tests/replays/    future deterministic fixtures (empty)
docs/adr/          architecture decisions
.github/           documentation CI and contribution templates
```

Prior celebrity experiments are deliberately excluded. GitHub repository name, visibility and owner remain approval questions. Local Git initialization records no remote. Project source licence remains undecided: no open-source grant is implied; third-party rights remain separate.

Phase 1 will pin supported Node LTS and pnpm versions, create the package manifest/lockfile, and install approved dependencies. No install/start commands exist at Phase 0. To inspect now, open the Markdown files. CI currently checks document completeness and local links only; it does not claim gameplay checks.
