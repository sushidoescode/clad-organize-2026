# Performance — Shot Coverage Compass

Methodology: two 8-second steady-state Perfetto captures of the Lens Studio preview (SPECS 27, Interactive), identical scene state (initial red arc, wedges in tray), captured via `preview.profiling.startTrace`. Analyzed with the perfetto-trace-analysis Phase-1 pipeline. Traces + JSON summaries in `performance_traces/` (gitignored; regenerable).

## The deliberate experiment

RingView was **built naive on purpose** (commit `0d1ee2f`): 12 separate sector `RenderMeshVisual`s sharing 2 materials — one draw call per sector. The optimization (commit follows this doc): all gap sectors batched into ONE mesh and all covered sectors into ONE mesh, rebuilt only on state change (user-paced, not per-frame) via a multi-span MeshBuilder arc builder. **12 ring draw calls → 2.** Per-sector state markers (empty SceneObjects) were kept so LEAF observables and debuggability survive the batching.

## Measured results (baseline → after)

| Metric | Baseline (12 RMVs) | After (2 RMVs) | Delta |
|---|---|---|---|
| `RenderPass` total (8 s) | 162.2 ms | 156.7 ms | **−3.4%** |
| `RenderFrame` total | 173.9 ms | 167.7 ms | **−3.6%** |
| `Visual` slice total | 132.3 ms | 128.6 ms | −2.8% (≈35% fewer Visual slices/frame) |
| Frame p50 / p90 / p99 / max | 2.85 / 3.77 / 6.15 / 12.23 ms | 3.73 / 5.46 / 7.37 / 9.45 ms | see interpretation |
| Slow frames (over budget) | 0 | 0 | — |

## Honest interpretation

- The render-path improvement is real but small at this scene's scale — a 12→2 draw-call reduction on tiny meshes moves render slices by single-digit percent.
- **The apparent frame-time regression is not attributable to the change.** The dominant cost in both captures is the preview's simulated tracking: `Track` measured 1009.7 ms (baseline) vs 1476.0 ms (after) — a +46% swing between two idle captures of the *same scene*, i.e. run-to-run environment noise (`FaceDetectPreprocess` swung +27% the same way). This noise floor is larger than the render delta, so wall-clock frame time cannot resolve the improvement in preview.
- Every render-side slice the change touches moved in the correct direction; both captures have zero over-budget frames; worst frame actually improved (12.2 → 9.5 ms).
- On-device measurement would be the next step for a cleaner signal (tracking runs on dedicated hardware there); out of scope without hardware this week.

## Verification of parity

- Visual parity: initial-state and covered-state captures pixel-match the naive build (same sector gaps, colors, 2 cm raise).
- Behavioral parity: the full 4-scenario LEAF suite passed against the optimized build, including the per-sector view==engine consistency scenario.
