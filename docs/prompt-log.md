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
- **Commit:** `e4dee64`; merged to `main` fast-forward.

---

## E3 — Stage 3 (build portion): onboarding, flash, demo assets (2026-08-10, ~13:40–13:46)

- **Intent:** the deferred onboarding beat, an arc-flip flash, demo choreography, hero stills, and the submission-artifact drafts.
- **Prompt:** human: "Let's keep pushing through and build it out."
- **Agents/skills:** inline build (VirtualScene single-writer, PreviewInteractTool drives, LEAF MCP runs).
- **Observed:**
  1. `OnboardingHint.ts` (billboarded one-sentence caption above the tray; CompassRoot dismisses on first manipulation). First render was unreadably small at size 60 → raised to size 90 + repositioned (0, 55, 165); verified legible, verified fading on first drag.
  2. RingView newly-covered flash (brightness pop decaying 0.35 s on the shared covered material) — behaviorally verified via coverage flips; per-frame tween created once, enabled per flash.
  3. Full LEAF suite re-run green after both changes (commit `33957ad`).
  4. One transient PreviewInteractTool timeout after the IK scenario run (stale puppet-hand state) — recovered with a lens refresh + single retry per the skill's error guidance; not a Lens defect (clean logs).
  5. Completion re-verified end-to-end on the polished build (two wides at ±45° → `[Coverage] COMPLETE`); hero stills saved to `docs/media/` (initial red arc, full green completion) for the video edit.
  6. `docs/demo-script.md` (55 s beat sheet, camera choreography incl. verified base view `setPosition (0,70,50) → lookAt (0,-110,-250)`, cold-read gate, evidence-montage capture list) and `docs/submission-description.md` drafted.
- **Decision:** build phase of Stage 3 complete; remaining steps are human-gated (video recording/narration, Lenslist publish question, scope freeze, compliance flip, submission).
- **Commit:** `2229da9`.

---

## E4 — Visual overhaul: "Etched Light Meter" (2026-08-10, evening)

- **Intent:** close the gap the human correctly called out — the Lens was a verified mechanic wearing programmer art, unacceptable against 25% UX + 25% Creativity judging. Full art-direction pass without touching verified behavior.
- **Prompt (human, verbatim core):** *"Based on this screenshot, is this what you had thought it would look like? The UI and UX seem very rudimentary? Hardly seems polished… Remember the judging criteria is 50% CLAD, and the rest is UX and UI right? We need to nail that, and the visual representation needs to make sense and look very good."* (with a Lens Studio screenshot attached).
- **Agents/skills:** 4-agent design workflow — three independent art-direction proposals under fixed rendering constraints (lenses: precision film instrument / premium spatial glass / theatrical stagecraft), each grounded on the actual screenshot, plus a synthesis judge. Winner: **Etched Light Meter** — everything drawn as luminous ivory line-work, chosen explicitly for SPECS additive-display physics (dark pixels render transparent on device; a "dark UI" would vanish). Implementation inline: VirtualScene single-writer, headless-Chrome SVG rasterization (LS's ConvertSvgToTexture rasterizer timed out; ImageMagick's SVG engine dropped `stop-opacity` — both dead ends documented by pixel-sampling the outputs), PreviewInteractTool drove the full verification pass, LEAF as the regression gate.
- **Observed (chronological, deterministic):**
  1. Four original SVG textures authored programmatically (compass-rose floor dial, hatched gap strip, gradient covered strip, beacon fade); alpha channels verified by pixel sampling after two rasterizer fallbacks.
  2. New runtime meshes: `buildDiscMesh` (floor, planar UVs), `buildTubeMesh` (capless beacon — the preset cylinder's top cap sampled a bright texel); wedge prism lowered 6→4 cm.
  3. Ring re-toned (tally red hatch / phosphor green gradient via textures multiplied by the existing state-tinted materials — flash lerp untouched); wedge shot types triple-coded (cyan/violet/gold materials + footprint scale + floating billboarded labels); UIKit panel restyled as a light-meter readout (COVERAGE / hero count / SECTORS / RESET MARKS); axis line ivory-at-rest.
  4. **Floor-typography defect found by capture and fixed empirically:** the mesh-UV→sampling→camera chain shows the floor texture vertically flipped; `rotate(180)` glyphs produced reversed digit order ("0Ɛ"), `scale(1,-1)` reads correctly. Recorded as the authoring contract in the generator.
  5. A drag landing at radius 130.1 cm read as inactive (threshold 130) — test-coordinate error, engine correct; re-verified at 120 cm.
  6. Full interactive pass: 6/12 partial coverage, tap-cycle (`Wedge3 → wide`), amber 180°-violation, recovery, `[Coverage] COMPLETE` at 12/12, Reset. One puppet-hand retraction artifact (post-pinch ray grabbed a wedge 30 cm) identified as simulation-only; clean re-run + `compass-ik-reset` exact tray assertion green.
  7. Full LEAF suite green against the overhauled build. New hero stills captured to `docs/media/`.
- **Decision:** ship the overhaul; garnish items (ring under-glow quad, endcap chevrons, base reticle) deliberately cut per the judge's own cut-order. The judge's image-generation prompt was delivered to the human for an optional Gemini/ChatGPT concept-frame comparison.
- **Commit:** `dcd0911`.

---

## E5 — Concept-frame gap closure (2026-08-10, late evening)

- **Intent:** the human generated the E4 image prompt through Gemini and ChatGPT and returned both concept frames plus a live screenshot, asking how to take the build "to the next complete level". Both concepts agreed on five concrete elements the build lacked — treat that agreement as a design review and close the gaps.
- **Prompt (human):** *"It looks a whole long better now. Is there a UI panel of some kind? … here are the two generated images I got back … What other ways can we optimize, polish, enhance and evolve this build to the next completel level?"* (three images attached).
- **Agents/skills:** inline gap analysis against both concept frames; VirtualScene single-writer; headless-Chrome SVG rasterization; PreviewInteractTool verification; LEAF regression gate.
- **Observed:**
  1. **Sector tile rims** — full luminous edge frames baked into both ring strip textures (side strokes at u=0/1 land exactly on each span's radial edges; zero new draw calls, ring still 2).
  2. **Under-ring glow restored** — the E4-cut glow annulus re-baked into the floor texture (Chrome, unlike ImageMagick, honors `stop-opacity`); tick/numeral opacities biased up ~1.25× per the additive-display risk note.
  3. **Wedges as luminous outlined markers** — shared etched top-face texture (triangle rim + focal ticks + 0.55-alpha body) on the type-tinted materials, blend Normal; wedges now read as glowing glass, floor rose visible through them.
  4. **Base reticle** under the beacon (from the judge's cut list, reinstated by the concepts' agreement): 20 cm textured FloorDisc, +1 draw call.
  5. **Panel presentation** — scaled 1.5→1.8; two-tone hero implemented as a UIKit flex row (count Text in phosphor green beside ivory "/ 12" — a single Text carries one fill color); verified live showing 9/12 from a restored layout; hero-row spacing tightened once after capture; panel repositioned twice by capture (first spot left it out of the demo frame — final local (64, 60, 95)).
  6. Axis line slimmed (270×0.8×2).
  7. Full pass re-verified: fresh-run opening state, completion via two wides at ±45° (`[Coverage] COMPLETE`), hint-dismiss nudge for the still, Reset; **LEAF 4/4 green**; new hero stills saved.
- **Decision:** the two concept frames are archived as the art-direction reference; remaining deltas (true bloom halos, photoreal room) are out of scope — they are renderer/passthrough properties, not Lens content.
- **Commit:** `99d58c9`.

---

## E6 — Cold-judge comprehension + interaction polish (2026-08-11, ~00:15–00:25)

- **Intent:** close the "would a first-time judge understand this without a tutorial?" gap the human raised, plus the two safe polish items previously deferred (hover affordance, sector raise motion). The Lens must self-identify and self-explain in one glance.
- **Prompt (human, core):** *"…if you were a judge that has never seen this before, do you think you would need some kind of tutorial, guide or understand what this is for and why this is useful for the theme? Having said that, what are the gaps there?"* + latest Lens Studio screenshot.
- **Agents/skills:** inline build; VirtualScene untouched this pass (all changes runtime-script-side); PreviewInteractTool + runtime queries for verification; LEAF regression gate.
- **Observed:**
  1. **In-Lens identity:** panel title is now "SHOT COVERAGE COMPASS" (was "COVERAGE").
  2. **Purpose line:** onboarding hint gained a second smaller line — "PLAN CAMERA SETUPS AROUND YOUR SUBJECT" — so the WHAT (title), the WHY (sub-line), and the HOW (drag instruction) are all on screen in the first second; both lines fade together on first manipulation.
  3. **Metaphor anchor:** quiet billboarded "SUBJECT" caption above the beacon column.
  4. **Hover affordance:** wedges brighten toward white on SIK hover (pre-cloned hover materials, swapped on onHoverEnter/onHoverExit). Verified by held-pinch capture: cyan wedge visibly pales while hovered; no tap-cycle side effect (travel > 2 cm, confirmed via logs).
  5. **Raise-pop motion:** covered arc now physically rises as it flips — the covered mesh is built at y=0 and RAISE_CM moved to the object transform, animated by the existing flash tween (0.45→1.0 × 2 cm). LEAF's per-sector markers still snap instantly (state, not animation). Verified numerically post-flip: RingCovered local y = 2.000 exactly; covered marker y=2, uncovered y=0.
  6. Full loop re-verified (completion logged, reset); **LEAF 4/4 green — sixth full pass**; hero stills refreshed with the comprehension layer visible.
  7. One montage screencapture attempt grabbed the wrong desktop space (an unrelated private window) — file deleted immediately, never committed; the LEAF-panel montage still is human-gated (capture while screen-recording with LS frontmost).
- **Decision:** comprehension gaps closed in-Lens; deliberately NOT built — spatially-positioned tick audio (inaudible in a mono screen recording, the only judged medium) and any further visual passes (diminishing returns vs. regression risk).
- **Commit:** `1708b43` (pushed to origin).

---

## E7 — Originality sweep (2026-08-11, evening)

- **Intent:** answer the human's direct question — "have you researched if something like this already exists for Snap, Lens Studio, or GitHub?" — with fresh evidence rather than relying on the Phase-B/C white-space scan, and convert the findings into defensible submission language.
- **Prompt (human, core):** *"Do you know or have you researched if something like this already exists for SNAP, Lens Studio, or Github?"*
- **Agents/skills:** 5-agent research workflow — four parallel searchers with distinct modalities (Snap ecosystem incl. official samples/Newsroom/Lens Fest; Lenslist + hackathon history incl. all 14 Spectacles Community Challenge winner posts and Snap's 343-project Hackathon Showcase; GitHub; adjacent products on other platforms) + one synthesis judge. ~106 queries, real URLs required, fabrication forbidden.
- **Observed:** no preemption found in any modality. Nearest neighbors identified and audited: KinoPilot (Spectacles script supervisor — its own roadmap lists spatial scene blocking as *unbuilt*), FrAImed (AI single-shot framing coach on Specs), Shot Designer (manual 2D blocking diagrams), nilstaylor/Shot-Planner (2D web app with FOV wedges + 180°-line warnings — nearest feature neighbor, zero AR), film-space (phone-AR blocking sandbox), Pool Assist (the platform's proven surface-anchored angle-instrument pattern, in billiards). Verified negatives: ~120 Spectacles Community Challenge winners, 34 official samples, 343 showcase projects — zero coverage-geometry filmmaking lenses.
- **Verification:** every finding carries a URL; caveats recorded honestly (Lens Explorer not fully web-indexed; current-hackathon entries not public; one FrameForge feature unverifiable).
- **Decision:** claim scoped precisely — "the first live shot-coverage instrument on AR glasses" (high confidence), never "first AR filmmaking tool on Spectacles" (false). Full report committed as `docs/originality-check.md`; differentiation paragraph added to the submission description.
- **Commit:** (recorded on commit of this entry).
