# Art and AI asset pipeline

**Status:** proposed Phase 0 specification, v0.0.0 • 2026-11-09 • Owner: project owner (sole producer). No approval or production readiness implied.

**Content rule:** original fictional archetypes only; no real-person names, likenesses, imitations or voice clones. Every fighter requires `licenseStatus`, provenance and a remote disable key. Licensed additions cannot ship without written permission. See [content and privacy policy](09-legal-and-content-policy.md). All ASSUMPTION IDs resolve in [the register](11-risks-and-open-questions.md).

## Visual direction

Original stylised caricatures, exaggerated occupation and attitude, not identifiable people. Large readable head/hands, rounded forms, clean broad colour blocks, 2.5–3.5 heads tall as an art-direction proposal. No gore, realistic injury, celebrity faces, cloned costumes or photoreal face textures. Original arena: abstract Film City street with foam props and skyline shapes. References must be owned/licensed generic design studies; earlier Samay images/models must not enter this repository.

Dynamo: wide triangular jacket silhouette; teal/coral/navy; oversized foam wrist guards. Chalk: compact square silhouette, purple training vest, yellow accents, chalkboard motif; no team kit/real batting stance. Duchess: tall bell silhouette, magenta/cyan/indigo, geometric cape panels, theatrical fan; no actual actor styling or religious clothing cues. Shared body collision prevents visual silhouette from dictating unfair reach.

## Proposed runtime budgets (release gates, measured after export)

| Per fighter, highest mobile LOD | Budget |
|---|---|
| Triangles / lower LOD | <=12,000 / <=6,000; both fighters combined <=24,000 visible triangles |
| Deform bones / vertex influences | <=55 / <=4; remove unused bones |
| Materials / draw calls | <=2 / <=3 per fighter including shadow approximation |
| Textures | one <=1024² base colour + optional <=512² packed material map; no normal map initially |
| Compressed fighter model + mesh/texture payload | <=1.1 MB each; shared animations <=0.7 MB total |
| Decoded texture GPU budget | <=8 MB/fighter incl mipmaps; verify actual format, not download size |
| Facial blendshapes | 0 baseline; one jaw bone optional within bone budget |
| Arena | <=20,000 triangles, <=15 draw calls; <=1.1 MB first-arena payload |

Full-scene draw calls <=60 and visible triangles <=60,000 on low preset. Use blob/capsule shadows, baked lighting/vertex colours; no cloth/hair simulation, SSAO or dynamic shadow maps on low. KTX2/Basis where supported, PNG/WebP fallback cost measured; Meshopt candidate for geometry/animations. Decoder cost counts toward first playable. Do not ship both texture encodings initially. Reference performance is [device gate](06-device-and-performance-targets.md), not triangle counts alone.

## Step-by-step production, offline only

1. Write a fighter brief from archetype, silhouette, palette and three new expressions; review against accidental real-person resemblance. Generate front/side/back neutral A-pose concept with a tool whose actual output licence is logged. ASSUMPTION A12: owned concept inputs or a commercially cleared generation route will be available; otherwise block generation, no scraped celebrity images.
2. Generate one textured neutral model in Meshy candidate; save prompt, input, seed if exposed, exact model version/plan, date, export and terms evidence. Do not batch a roster before the benchmark passes. An image is not a 3D mesh.
3. Inspect all angles in Blender: disconnected fingers, fused limbs, back details, asymmetry, undercuts. Clean geometry, apply scale, correct normals, merge only intentional seams; no blind decimation. Retopologise shoulder/elbow/knee loops. Preserve editable source and transforms.
4. Standardise shared humanoid skeleton/rest pose and naming. Blender rigging first; optional Mixamo auto-rig only for compatible biped. Check rights for each downloaded animation. Keep hair and clothes rigid/skinned, not simulated.
5. Retarget/create poses: idle, walk forward/back, jump start/air/land, crouch in/hold/out, standing/crouching block, light/heavy/kick, dash, super windup/action/recover, hit high/low, stagger, KO, win/lose and each signature flourish. Blend visual movement while logical ticks remain authoritative. No root motion changes simulation position.
6. Bake/reduce keys, remove unused clips, atlas materials, create LOD, compress export; validate glTF and texture sizes. Export logical socket IDs for effects only, not hurtboxes.
7. Test 1,000 automated animation transitions plus manual extreme poses, mirrored facing, outfit clipping and repeated loops; inspect front/side/rear and both phone presets. Run memory and 20-minute thermal test.
8. Approve provenance/credits and originality, sign content manifest, archive evidence. No runtime generation or per-player API bill.

## Tool choices and rights

Full checked evidence and dates in [service register](12-sources-and-service-register.md). Meshy free is a commercial-use-with-attribution candidate, not guaranteed exclusive ownership; its terms control over simplified help text. Blender is free and permits commercial output; its software GPL is distinct from imported assets. Mixamo is a free commercial animation/rig candidate; do not redistribute library source assets as an asset pack. glTF-Transform/Meshoptimizer candidates require pinned MIT licence notices in Phase 1 dependency inventory. No unverified Tripo/other service output can ship merely because it has a free download.

## Benchmark approval gate

ASSUMPTION A13: one owner can perform/learn cleanup and retargeting; this is the biggest production constraint. AI output is not assumed fighting-game ready. Approved benchmark requires: all budgets met; complete move set; no visible broken deformation at 1× phone view; distinct silhouette recognised by >=16/20 adult testers without labels; no reviewer identifies an intended real-person imitation; clear facial expression at match camera; required licences/credits; performance matrix passed. Record before/after renders and actual GLB side by side. Owner signs art and commercial provenance separately.

After three generation/cleanup attempts or 8 owner work-hours without a passing shoulder/knee benchmark (proposed stop rule), simplify: shared low-poly body, AI-generated stylised head/texture and rigid clothing. If still failing, use original AI-generated 2D sprite cutouts in the 3D arena, explicitly label this a **2D-in-3D scope change** for owner approval. Cannot quietly claim that fallback is a fully 3D fighter. If zero budget and no cleanup skill persist, reduce fidelity before expanding roster; do not substitute procedural spheres as final art.
