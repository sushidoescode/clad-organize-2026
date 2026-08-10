# CLAD Prompt Log — Shot Coverage Compass (Continuity Compass, coverage cut)

Format per entry: **Intent → Exact prompt (or reference) → Agents/skills used → Observed result → Verification → Decision → Commit.**
This log is an annotated engineering narrative, maintained continuously during development (not reconstructed). The full kickoff prompt is preserved verbatim in `CLAD_Hackathon_Claude_Code_Start_Here.md` §3 (checked into this repo) and referenced here rather than duplicated.

---

## E0 — Intake, audit, and concept decision (2026-08-10, pre-approval)

- **Intent:** rigorous evidence-backed intake before any build; independently vet the research hypothesis against the full 50-idea Organize catalog.
- **Prompt:** master kickoff prompt (verbatim in `CLAD_Hackathon_Claude_Code_Start_Here.md` §3), preceded by the §4 read-only MCP smoke test.
- **Agents/skills:** lens-studio-router (gate: MCP/project/sign-in) · lens-studio-field-notes · editor-api · ls-clad editor-api-specialist (read-only scene walk) · scene-graphql, ListInstalledPackagesTool, PreviewPanelTool, CapturePanelScreenshotTool, RunAndCollectLogsTool (tail) · two orchestrated verification workflows: 5-agent source audit (3 strategy-doc readers + Lenslist page verifier + CLAD/SPECS ecosystem verifier), 12-agent idea vetting (8 adversarial red-teams, white-space scanner, 3 rubric-mirror judges).
- **Observed:** environment green (LS 5.23.1 current, SIK/UIKit 2.0, MCP healthy, compile clean, pristine base template); official facts verified on lenslist.co (theme Organize, Aug 10–16, 50/25/25 weights, <60 s video from T&C); catalog's Continuity Compass survives red-team **only** in a scoped "coverage cut"; judge panel: O09 7.25 / O01 7.00 as written, O01 ≈7.6 / O09 ≈7.5 cut-adjusted.
- **Verification:** all decision-critical claims labeled Fact/Inference/Unverified in docs/research-audit.md; live captures + logs for environment claims.
- **Decision:** recommend Continuity Compass (coverage cut); Cable Topology Cartographer runner-up; Stage Reset Map fallback. **Human approved: "APPROVE Continuity Compass."**
- **Commits:** `199ebe8` (repo hygiene), `8acfa3a` (research-audit, idea-scorecard, decision-memo, risk-register).

---

## E1 — Vertical slice: wedge drag → live coverage ring (2026-08-10, ~02:30–03:10)

- **Intent:** build ONLY the first action→consequence loop (drag wedge → ring sectors flip) against the five acceptance criteria in product-spec.md; prove the two risky primitives from the 3-hour feasibility gate (pinch-placement, live ring recompute).
- **Prompt:** Phase E of the master kickoff prompt + human approval "APPROVE Continuity Compass".
- **Agents/skills:** specs-project-init (validation: all green) · reset-preview-environment (camera reset, clean preview, log baseline 1,273,622 B) · scene-construction + lens-api + specs-interaction-recipes + materials + mesh-builder-scripting + specs-build-ui (domain guidance) · mesh-builder-scripting fork agent authored WedgeMeshFactory.ts (file-only boundary held) · VirtualScene single-writer for all scene mutations (Phase-1 structure apply: 28 ops/0 errors; two-phase script wiring) · PreviewInteractTool drove all interactions · QueryRuntimeSceneTool verified positions/state · specs-build-ui pattern for CompassUI (BackPlate + UIKit Button + Billboard).
- **Observed results & fixes (all deterministic):**
  1. `baseMaterial` input not found on first wiring → documented recompile-then-retry case; fixed.
  2. Content invisible on first run → runtime diagnosis: sim camera at world origin; content placed 150 cm below at FOV edge. Moved rig to (0,−125,−260), repositioned preview camera. Empirical, not guessed.
  3. `CylinderMeshPreset` is a unit (1 cm) mesh → floor/pillar were centimeter-scale specks. Rescaled ×100.
  4. UIKit `FlexLayout.addItems()` throws pre-init when `autoDiscoverItemsOnStart` is on → removed the call (content built in onAwake is auto-discovered). Reference-helper deviation documented in code comment.
- **Verification (evidence per AC):** AC1 drag lands where dropped, floor-constrained (runtime query: world y = −125.000 exactly) ✓ · AC2 sectors within ±60° flip green live (captures, two runs) ✓ · AC3 three wedges ≈120° apart → all 24 green + `[Coverage] COMPLETE` log (verified on two independent runs) ✓ · AC4 one Reset pinch → wedges tray-tweened, ring fully red, `[CompassRoot] Reset to tray` log ✓ · AC5 TypeScript clean; zero runtime errors across full drag→complete→reset pass ✓. See-and-fix loop (recompile → log-diff → capture → judge → fix) executed inline per field-notes at every step; formal /verify-preview skill not separately invoked since its exact loop was already performed with evidence — noted per the no-theatrical-invocation rule.
- **Decision:** slice accepted; naive 24-mesh ring deliberately kept as the perf-pass baseline; UI panel legibility (small at 1.7 m) deferred to polish.
- **Commit:** `9fa6fb1` on `vertical-slice`.

---

## E2 — Stage 2: Evolve / Enhance / Optimize / Polish (2026-08-10, ~03:40–04:15)

- **Intent:** evolve the mechanic to cinematic truth (front 180° working arc + axis line + shot types), add persistence, generated SFX, status UI, a passing LEAF suite, and a measured perf pass — the full minimum-winning-MVP from decision-memo.md.
- **Prompt:** human: "Please continue building. Optimize, Enhance, Polish and Evolve it to the next stage, and after that, plan for the following one after that."
- **Agents/skills:** build-sfx (4 license-clean WAVs via offline synthesis) · specs-leaf-install-packages (LEAF 2.0.2 already present) · specs-leaf-write-scenarios + specs-leaf-run-in-preview (4 scenarios via LEAF MCP tools) · specs-capture-perf-trace (2× 8 s Perfetto captures via EEC) · perfetto-trace-analysis (Phase-1 JSON comparison) · VirtualScene single-writer for all scene changes · PreviewInteractTool + QueryRuntimeSceneTool + captures for every verification.
- **Observed / decisions (chronological):**
  1. **v2 mechanic** (commit `0d1ee2f`): CoverageEngine rewritten to signed-bearing front-arc semantics — a considered design change grounded in the 180°-rule (all within the gate-approved MVP list). Tap-vs-drag discrimination via manipulation travel < 2 cm. Verified: mid-state capture showing green left arc + red right arc + amber line simultaneously; tap-cycle and LINE CROSSED in logs; persistence restore re-derived the violation on load (ideal round-trip proof).
  2. **SFX** (commit `2ff83fe`): presets + custom bell synthesis; LowLatency playback; edge-triggered with throttle; restore-time audio suppressed.
  3. **LEAF** (commit `a5e1859`): first drag scenario run FAILED — investigation per the run-in-preview skill (DEBUG re-run + log slice) revealed the drag moved Wedge1 to local z −1711: far-field manipulation amplifies hand deltas ~31×. Product fix: rehearsal-floor boundary clamp. Test fix: invariant-based assertions (floor plane, clamp, per-sector view==engine) instead of scripted destinations — per the LEAF reference's own loop/invariant guidance. All 4 scenarios green.
  4. **Perf** (this commit): baseline trace of the deliberately-naive 12-RMV ring → batched two-mesh rebuild-on-change ring (12→2 draw calls, LEAF markers preserved) → parity captures + full LEAF re-run → after trace. Honest result in performance.md: render-path slices −3–4%, frame delta not attributable (preview tracking noise +46% run-to-run dominates). No vertex-color package exists in the Asset Library — chose a zero-dependency two-mesh design instead.
  5. **Polish:** UI panel enlarged with live color-coded status text (M4, in `0d1ee2f`); completion scale pulse (this commit). Onboarding ghost-hint beat deferred to Stage 3 (deadline discipline — smallest scope cut).
- **Verification:** every change compiled, log-diffed, and preview-verified; full LEAF suite green twice; parity captures for the perf refactor; docs/test-evidence.md is the consolidated matrix.
- **Commit:** (recorded on commit of this entry).
