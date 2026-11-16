# Phase 2 — Step 0 report

## Completed software closure

PR #1 is reviewed (engineering self-review, not independent third-party approval) and merged at 82acfc84026082cc38457413ade4496a6a2c3b12. Its original Git graph is linked through the readiness merge and preserved at archive/phase1-local (8891f885a9fd90295adb1a5dbafa5995f998193c). The original v0.1.0 release/tag is published at ba03c3513b1f685cc82ca4a90d11dc1611c6f020. No force push or history rewrite was used.

CI on 70d4cf1bbf0ad452cbf4124c7707f8a8df3a24b8 passed lint, type checks, architecture guard, 25 unit tests, explicit headless replay, production build and two browser smoke tests: https://github.com/piyush907305/FameWars/actions/runs/43868847596 . The unit suite took 1.44 seconds; two browser smoke tests took 24.3 seconds on that runner. These timings are CI measurements, not phone performance.

The corrected recorded 10,000-tick replay explicitly reaches matchResult, wins [2,0], hash d1553867 and restores the identical final state from a tick-5,000 JSON snapshot. The earlier b49be243 fixture ended in fight with 0–0, so it was insufficient as a full-match test. The original 900-tick combat replay (49fabaf6) and per-tick 10,000-tick twin-run determinism test remain. Same-engine determinism does not prove cross-browser rollback readiness.

The slow rendered match remains nightly/manual at 19:30 UTC (01:00 IST next day, best-effort GitHub scheduling). PRs use headless replay plus short UI smoke checks. No simulation timing or combat rule was changed to speed tests.

## Public preview

Public URL: https://piyush907305.github.io/FameWars/

Initial deployment of merged main succeeded in run 43869683351: https://github.com/piyush907305/FameWars/actions/runs/43869683351 . GitHub Pages is the free static-hosting fallback; no paid plan, user credentials or secrets were required. The old private Sites registration is unused. Later diagnostic-report changes are separately reviewed/tested before deployment.

## Phone reporting tool

For opt-in diagnostics, open https://piyush907305.github.io/FameWars/?deviceTest=1 after the device-report update is deployed. Settings contains Start 5-minute screen, Start 20-minute sustained test, and Download device report. Start one capture, then play repeated matches. Menus, pause, settings, results and hidden-tab time do not count toward active gameplay duration; wall-clock time will therefore be longer. Do not reload or close the page before export.

After at least 300 active seconds, Pause → Settings → Download device report. The JSON contains build/browser/viewport, frame count, average FPS, p50/p95/p99/max frame interval, lowest two-second window FPS within uninterrupted active segments, and optional Chromium JS heap samples. It flags incomplete or sample-truncated captures. At most 200,000 frame intervals are retained. Report generation/sorting occurs on user export, outside active gameplay. No report is automatically uploaded.

Synthetic unit tests validate the recorder arithmetic; they are not phone measurements. A short browser test verifies that a menu-only capture exports as incomplete, with no fabricated FPS. Optional heap samples are not total browser/GPU memory, post-GC memory, or a steady-state memory guarantee. Resource/navigation entries can be cached or restricted: their values do not automatically pass the 8 MB or first-playable gates.

Record manually with each JSON: exact phone model/RAM, Android/browser versions, cold-load-to-first-movement time (not time spent selecting a character), connection, battery start/end, heat/throttling observations, touch responsiveness/readability and any crash/context loss. A five-minute frame report does not measure input-to-display latency. Record unavailable memory/thermal telemetry as unavailable.

## Physical results — still NOT TESTED

| Device class | Model / OS / browser | Five-minute screen | Twenty-minute sustained gate |
|---|---|---|---|
| Budget Android | Owner to supply exact model | Pending owner report | Pending |
| Mid-range Android | Owner to supply exact model | Pending owner report | Pending |
| iPhone (if available) | Availability unconfirmed | Not tested | Not tested |

Owner confirmed they will test the public link on their phones. Samsung, OnePlus and Redmi are requested brand coverage, not evidence of specific tested models. No FPS, frame-time, load, memory, thermal or battery result is inferred from a desktop viewport.

Owner approved five-minute Step 0 screening per real device while retaining the separate 20-minute sustained gate before asset spending. If the budget handset misses the sustained 30 FPS floor, stop and propose reductions before asset work. Do not claim Step 0 fully passed until real screening reports are assessed.

## Stop boundary

No Step 1 concept sheets, AI 3D generation, voices, new roster assets, purchases, or Phase 2 gameplay changes have started. After the physical screen, report results and wait for owner approval before Step 1. The 20-minute gate remains required before production asset spending.
