# Performance — Shot Coverage Compass

Methodology: two 8-second steady-state Perfetto captures of the Lens Studio preview (SPECS 27, Interactive), identical scene state (initial red arc, wedges in tray), captured via `preview.profiling.startTrace`. Analyzed with the perfetto-trace-analysis Phase-1 pipeline. Traces + JSON summaries in `performance_traces/` (gitignored; regenerable).

## The deliberate experiment

RingView was **built naive on purpose** (commit `0d1ee2f`): 12 separate sector `RenderMeshVisual`s sharing 2 materials — one draw call per sector. The optimization (commit follows this doc): all gap sectors batched into ONE mesh and all covered sectors into ONE mesh via a multi-span MeshBuilder arc builder. **12 ring draw calls → 2.** Per-sector state markers (empty SceneObjects) were kept so LEAF observables and debuggability survive the batching. *(Timeline note: at the time of these captures, the batched build rebuilt its meshes inside every `apply()` call; the signature guard that limits rebuilds to actual state changes was added later, in E8, and was not re-profiled.)*

## Measured results (baseline → after)

> **Correction (2026-08-12).** An earlier version of this table compared raw slice
> totals between the two captures and claimed a −3–4% render-path improvement.
> That comparison was invalid: the captures contain different amounts of work
> (355 vs 340 `ProcessFrame` calls). Normalized per frame, the timing deltas
> vanish. The error was caught by an independent external review; the corrected
> numbers below are recomputed from the same trace summaries, which are now
> committed under `docs/evidence/` so the calculation is reviewable.

Normalized per `ProcessFrame` (355 baseline frames, 340 after frames):

| Metric | Baseline (12 RMVs) | After (batched) | Delta |
|---|---|---|---|
| `RenderPass` per frame | 0.4570 ms | 0.4609 ms | +0.9% (noise) |
| `RenderFrame` per frame | 0.4899 ms | 0.4932 ms | +0.7% (noise) |
| `Visual` slice time per frame | 0.3727 ms | 0.3782 ms | +1.5% (noise) |
| **`Visual` calls per frame** | **22** | **11** | **−50%** |
| Frame p50 / p90 / p99 / max | 2.85 / 3.77 / 6.15 / 12.23 ms | 3.73 / 5.46 / 7.37 / 9.45 ms | see interpretation |
| Slow frames (over budget) | 0 | 0 | — |

## Honest interpretation

- **The structural optimization is real; the timing improvement is not resolvable in preview.** Ring rendering went from 12 always-on visuals to ONE in the idle all-gap state (the covered RMV is disabled when empty) and at most two in mixed states — confirmed by total `Visual` calls per frame halving (22 → 11). But per-frame render timing shows no measurable improvement at this scene's scale: these are tiny meshes, and batching them saves scheduling overhead too small to resolve.
- **Ambient noise dominates all timing comparisons in preview.** `Track` (simulated tracking) measured +52.6% per frame between two idle captures of the *same scene*, and `FaceDetectPreprocess` +32.3% — run-to-run environment noise far larger than any delta the ring change could produce. Frame percentiles differ between captures for the same reason.
- Both captures have zero over-budget frames; the Lens is nowhere near its frame budget in preview either way.
- On-device measurement would be the next step for a cleaner signal (tracking runs on dedicated hardware there); out of scope without hardware this week.

## Verification of parity

- Visual parity: initial-state and covered-state captures were visually indistinguishable from the naive build in side-by-side review (same sector gaps, colors, 2 cm raise) — spot-checked, not pixel-diffed.
- Behavioral parity: the full 4-scenario LEAF suite passed against the optimized build, including the per-sector view==engine consistency scenario.

## Post-trace changes (E4–E8) — not re-profiled

The captures above predate the visual overhaul. Later passes added: one floor-disc RMV, one beacon tube RMV, a 20 cm reticle RMV, wedge-label and panel Texts, and **four Billboard components (three wedge labels + subject label), which do per-frame orientation work**; four alpha-blended materials render with `depthWrite off`; committed source PNGs total ≈ 1.8 MB. The 22→11 visuals-per-frame result is established for the traced intermediate build, not re-measured on the final build. Rationale for not re-profiling: preview tracking noise (±30–50% run-to-run on ambient slices) dwarfs deltas of this size, so preview timing cannot resolve them — an on-device trace remains the meaningful next measurement. Raw `.pftrace` files are regenerable and not committed; the committed JSON summaries in `docs/evidence/` are the analysis inputs for the table above.
