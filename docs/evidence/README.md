# Evidence Index — claim → artifact

Compact bundle so a public reviewer can connect the claims in `docs/` to tool
output without access to the development session. All artifacts here were
produced by the tools named, at the times stated; nothing is reconstructed.

| Claim | Artifact | Where |
|---|---|---|
| Perf: ring visuals 12 → ≤2, no resolvable per-frame timing delta (corrected analysis) | Sanitized Perfetto trace summaries (baseline + after), reviewable numbers | `perf_baseline_summary.json`, `perf_after_summary.json`; analysis in `../performance.md` |
| LEAF suite 4/4 green on the final build (strengthened assertions) | Final run record: scenario IDs, results, environment, timestamp | `leaf-final-run.md` |
| The CLAD loop (mutate → run → interact → query → judge) was real and evidence-driven | One representative loop, reproduced with its actual tool outputs | `clad-loop-example.md` |
| Visual states (opening / completion) | Hero captures from the SPECS 27 interactive preview | `../media/hero_initial_red_arc.png`, `../media/hero_coverage_complete.png` |
| Concept white-space verified before claiming novelty | Four-modality search report with URLs and caveats | `../originality-check.md` |
| All art/SFX original and regenerable | Committed generators | `../../tempAssetGen/gen_compass_textures.py`, `../../tempAssetGen/gen_sfx_compass.js`, SVG sources in `../../Assets/Textures/src/` |

Notes: `docs/prompt-log.md` is a curated annotated development log (intent →
prompt → agents/skills → observed result → verification → decision → commit for
each build iteration), not a complete conversation transcript. Perfetto `.pftrace`
binaries are regenerable and excluded from the repo; the committed JSON summaries
are the analysis inputs.
