# Networking strategy

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Scope and choice

v0.1.0 has **no multiplayer code, auth SDK or room host**. Local combat needs no server simulation, but public builds still fetch HTTPS roster-revocation configuration; offline access expires with that manifest. Phase 4 plans casual two-player Colyseus rooms, authoritative server simulation with sequenced inputs, friend links and quick match. Casual does not mean client-authoritative health. The [Colyseus documentation](https://docs.colyseus.io/) describes rooms and state synchronisation; rollback is a separate engineering decision, not an automatic framework feature.

Proposed alternatives: (1) server authority + client prediction/interpolation, moderate complexity; (2) deterministic input delay, simple but delay-sensitive; (3) rollback with snapshot/prediction/resimulation, best potential response but harder debugging; (4) peer-authoritative positions/results, rejected for cheating and divergence. Start comparison spike with (1)/(2), use actual device/network evidence; add rollback only if necessary. Never promise a latency number or simultaneous-player count without a tested region/host/build/workload.

## Guarantees built into Phase 1

Sim tick/input normalization, integer arithmetic, canonical hash, versioned immutable content, deterministic CPU seed, snapshot save/restore, simultaneous resolution and event IDs per [architecture](02-architecture.md). Inputs express actions, not positions, damage, health, elapsed time or rewards. Store logical replay stream, exclude personal identity. Rendering/audio events deduplicate on replay. CPU makes deterministic decisions at bounded reaction intervals, not by reading future inputs.

## Proposed Phase 4 flow

Guest token first; invite has opaque unguessable room secret, expiration and max two slots. No personal info in shared URL. Friend room never silently replaces absent human with a bot; offer an explicit CPU practice option. Quick match waits 20 seconds then offers labelled CPU match (ASSUMPTION A18), never presents bots as people; no ranked score from bots. Guest is default; Google/Facebook/Apple sign-in introduced individually only after data/legal/SDK review and platform requirements, not bundled into prototype. Store credentials server-side using vetted auth, no home-grown password scheme.

Server assigns slot/tick/version, bounds input lead/lag, applies neutral after missing-input grace, rejects incompatible manifests and disabled fighters. Proposed start experiment: sim 60 Hz, snapshots 15–20 Hz, delta/binary transport if measurements justify. Server validates all transitions; client smooths visual positions and predicts own actions only with reconciliation. Round winner/finisher snapshot comes from server. Connections use TLS, origin allowlist and rate limits. Reconnect grace provisional 10 sec (A18); no freeze exploitable by disconnect. Resume from authoritative snapshot and tick ID; after grace no-contest for casual initial release, later forfeit policy requires approval. Resync must not duplicate finishers or grants. Background mobile disconnect is explicit, not local pause applied to server.

## Measured decision gate

Network emulation profiles are experiment conditions, not expected India performance: RTT 50/100/150/250 ms, jitter 0/30/60 ms, loss 0/1/3%, interrupted connectivity and cold-host startup. Log median/p95 input acknowledgement, perceived response (video), reconciliation count/magnitude, full resyncs, server tick lag, bytes/sec/player and disconnect/complete ratio. Run at least 100 scripted matches per profile plus adult playtests (A19 availability: ten paired testers). Compare against local baseline, device frame budget and owner comfort ratings.

Proposed decision thresholds: >=95% scripted match completion on RTT <=150 ms, 30 ms jitter, 1% loss; zero mismatched terminal hashes; p95 correction <=150 mm; >=8/10 pairs rate responsiveness >=4/5. If delay harms comprehension or corrections repeatedly exceed limit, prototype rollback using retained snapshots with bounded resimulation; measure extra CPU/memory on Redmi floor. If no option passes, reduce online scope or defer release. These are gates, not performance promises.

Load test room count in increasing steps until p95 tick cost consumes >50% tick interval, event-loop lag breaches 20 ms, or memory stops stabilising; repeat with p95 network profile. Publish measured safe operating point with reserve and exact host/region. Queues cap room admission; quota/overload shows retry/CPU option, never automatic paid scaling. Cloudflare client hosting does not fund Node simulation capacity.

## Abuse and operations

Schema/length/rate check inputs, replay nonce/sequence protection, maximum per-tick changes, server-owned outcome and unlocks. No chat, custom names or uploaded content at launch reduces moderation burden. Configurable input spam limits with false-positive logs; disconnect flooders, do not auto-ban on one bad mobile connection. Short-lived guest credentials, replay attack checks, secrets rotation, private telemetry, incident runbook and remote roster disable. Cheats remain possible; server validation mitigates them, it is not an anti-cheat guarantee. Cross-version deployments drain rooms before retiring protocol; rollback client/server compatibility pairs, never re-enable revoked content.
