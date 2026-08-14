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
  4. **Perf** (this commit): baseline trace of the deliberately-naive 12-RMV ring → batched two-mesh ring (12→2 draw calls, LEAF markers preserved) → parity captures + full LEAF re-run → after trace. Honest result in performance.md: render-path slices −3–4%, frame delta not attributable (preview tracking noise dominates). *[Superseded: the −3–4% slice conclusion was later found invalid — the captures contained unequal work. See E8 and the correction notice in docs/performance.md; the durable result is structural (visuals/frame 22→11).]* No vertex-color package exists in the Asset Library — chose a zero-dependency two-mesh design instead.
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
- **Commit:** `46190d9`.

---

## E8 — External independent review: triage and corrections (2026-08-12)

- **Intent:** the human commissioned an independent read-only review of the entire project from a separate AI session and brought back its ranked report; triage every finding against our constraints, verify each claim against real data before acting, fix what survives, and reject with reasons what doesn't.
- **Prompt (human):** the full external review report, 16 ranked findings (2 CRITICAL / 7 HIGH / 5 MEDIUM / 2 LOW) plus an enhancements table.
- **Agents/skills:** inline triage + fixes; every factual claim re-verified locally before adoption (trace summaries recomputed, tray radius calculated, code paths read); PreviewInteractTool + log-grep + runtime queries for behavioral verification; LEAF as the regression gate.
- **Adopted and fixed (verification per item):**
  1. **CRITICAL — false perf conclusion:** reproduced the reviewer's normalization exactly (355 vs 340 `ProcessFrame`; per-frame render deltas +0.7…+1.5% = noise; `Visual` calls/frame 22→11 = the real, structural result). `docs/performance.md` rewritten with a visible correction notice; sanitized trace summaries committed to `docs/evidence/`.
  2. **CRITICAL — demo choreography couldn't complete:** beat sheet rewritten to an engine-verified sequence (WIDE −45° → MED +30° → tap-cycle to WIDE → violation → return at +45° = first and only completion), timing target 52–55 s.
  3. **Ring rebuilt every held frame:** 12-bit signature guard in `RingView.apply()` — geometry rebuilds only on actual state change (the documented contract).
  4. **Completion masked violations:** celebration now requires full arc AND zero violations; panel caption gives `180° LINE CROSSED` precedence. Verified live with the exact adversarial state: arc filled at ~03:17:58 with a wedge behind the line → no COMPLETE; violation cleared at 03:18:45 → COMPLETE fired precisely on the clean rising edge (log-verified; see `docs/evidence/clad-loop-example.md`).
  5. **Reset clamped the tray:** authored tray radius (155.24 cm) exceeded the 155 cm boundary clamp → raised to 156 cm; runtime query confirms exact restore (−40/0/40, z=150.000).
  6. **Pulse compounding, non-atomic restore, reset/save race, out-and-back taps, two-hand scale:** canonical pulse base + reusable event; whole-payload validation before any restore mutation; pending save canceled on Reset; tap = max travel across the grab; type-owned scale re-asserted every constrain.
  7. **LEAF gaps:** medium/close mapping asserted through `halfAngleForType` (4- and 2-sector footprints), drag displacement >10 cm required, all 12 markers asserted present, IK-reset precondition asserts real displacement; persistence claim narrowed in docs (scenario proves save+reset; startup restore verified interactively).
  8. **Copy:** hint → "DRAG WEDGES INTO THE ARC · GREEN = COVERED" / "PLAN CAMERA ANGLES AROUND YOUR SUBJECT"; captions → ANGLES COVERED / 180° LINE CROSSED; button → RESET CAMERAS; labels → mm-suffixed; hero count neutral at zero.
  9. **Stale docs:** `architecture.md` rewritten to the final v2 system; `product-spec.md` marked historical with the v2 delta; README corrected (wedge colors, module paths, perf claim); anchoring language made precise everywhere ("saves the virtual arrangement between Lens sessions" — no spatial-anchor implication); engine got an inclusive-boundary epsilon; asset generators un-gitignored and committed; `docs/evidence/` bundle created (perf summaries, LEAF final-run record, a reproduced CLAD loop, claim→artifact index).
- **Rejected/deferred, with reasons:** UIKit BackPlate restyle (stock platform component; medium visual risk days before submission — noted as a device consideration), two-hand-reset manipulation termination (multi-user edge outside the demo's interaction model), minimum camera radius (semantics change; boundary epsilon covers the real float risk), hover FOV outline + spatial audio (new visuals/regression surface vs. no video-visible gain).
- **Verification:** compile clean; zero runtime errors; adversarial completion state driven and log-verified; exact tray restore queried; **full LEAF suite 4/4 green on the strengthened assertions (seventh full pass)**; hero stills re-captured with the corrected copy.
- **Commit:** `3820cb1`.

---

## E9 — Second external audit: flaky gate root-caused, claim-audit corrections (2026-08-13)

- **Intent:** the human commissioned a second independent audit (reproducibility test, 20-item hostile claim audit, five-minute judge simulation scoring 7.25/10); triage it, verify each claim against real data, and fix what survives — the top finding being that the advertised regression gate was intermittent (`compass-ik-reset` passed 4/6 for the auditor).
- **Prompt (human):** the full external audit report.
- **Agents/skills:** inline; live-fetch verification of the audit's counter-example before adopting it; LEAF stress runs to reproduce and then root-cause the flake; PreviewInteractTool/log evidence throughout.
- **The flaky gate — reproduced, root-caused, restructured (chronological, all log-verified):**
  1. Reproduced: 3 consecutive `compass-ik-reset` runs → pass, pass, **fail** (all three in-scenario IK reach attempts "did not register").
  2. First fix attempt (retry the IK reach 3×) was insufficient: the rig can wedge entirely under back-to-back runs.
  3. Second fix attempt (fall back to the standard interactor) exposed the true mechanism: the fallback pressed Reset, every assertion passed, the scenario printed success — **and the LEAF runner still failed the run with `Error: Failed interactions detected`**, because the runner fails any scenario containing a failed interaction regardless of assertions. No in-scenario logic can save a run once the IK rig misses.
  4. Honest restructure: reset correctness moved to a new deterministic core-gate scenario `compass-reset` (standard interactor, strict exact-tray assertions) — verified **3× consecutively green** on the very repetition pattern that wedged the old scenario, then a full 4-scenario core-gate pass in README order; the IK reach became `compass-ik-reach`, a clearly-labeled environment-sensitive reachability probe outside the core gate (passed after a preview refresh; its failure mode is documented in the scenario, README, and evidence record).
- **Claim-audit corrections adopted (verification first):** the audit's originality counter-example **Frameline 3D was verified by live fetch** (browser shot designer with "coverage gaps, 180° risks" review and CROSSES-LINE flags) → platform-unqualified originality claims retracted in a dated addendum to `docs/originality-check.md`; the AR-glasses-scoped claim stands. README "Try it"/"Run the tests" rewritten against the full reproducibility table (first-compile wait, preview config incl. Plane/Front, Reset-first, mouse semantics, two-tap completion recipe, ±45° placement guidance, active-radius caveat for the line warning, audio note, per-scenario durations and the probe caveat). Wording made precise across docs: "floor-anchored/real room geometry" → floor-plane/live angular geometry (demo VO re-generated to match); "Built entirely with CLAD" → "Built with CLAD"; evidence-bundle provenance restated (curated transcriptions vs raw exports); post-trace perf changes (incl. per-frame Billboard work) disclosed and the measured-build/rebuild-guard timeline clarified; stale E2 perf sentence annotated as superseded; "cannot organize on a phone" and "enforces the 180° rule" narrowed; texture-payload figure corrected; generators made repo-relative (SFX engine dependency disclosed); montage cards re-rendered to match.
- **Rejected:** none of substance — this audit's findings were either adopted or already-scoped items (BackPlate restyle, device testing) that remain documented limitations.
- **Commit:** `23382c4`.

---

## E10 — Demo video production (2026-08-13/14)

- **Intent:** produce the <60 s submission video end-to-end in the agentic pipeline: real Lens footage driven by simulated SIK input, screen-recorded, edited with ffmpeg, narrated with licensed TTS, per the beat sheet in `docs/demo-script.md`.
- **Prompt (human):** "ROLL" authorization for footage capture and video production, followed by seven iterative review notes (voice overlap, closing-line clarity, pacing, camera framing, music character and level).
- **Process (all verified before use):**
  1. **Footage:** five master takes — each earlier take's defect diagnosed from frames/logs before the next roll: take 1 exposed a transient mid-drag completion (fixed by re-choreographing the violation route through already-covered sectors), take 2 was invalidated by manual camera input mid-recording, take 3 by an unreported preview zoom offset (found empirically), take 4 by interaction-stretch pushing completion past the recording window. **Take 5** (75 s) is the master: locked camera, log-verified state sequence (taps → `LINE CROSSED` → single clean `COMPLETE` at 62 s). Beauty plates at −28°/+27° and a far establishing framing reproduced from the human's reference screenshot; two polluted far plates (wrong frontmost window) were detected by frame inspection, deleted, and re-shot.
  2. **Edit:** ffmpeg pipeline — 16:9 crop of the preview region, 9-segment cut (52→56.3 s across drafts), sub-pixel smooth push-in on the wide hero plate (4× upscale before zoom after a stepped-zoom defect was flagged by the human), 0.5 s crossfades into the three proof cards (`docs/media/montage/`) and title card.
  3. **Audio:** ElevenLabs TTS narration (voice "Chris", paid commercial plan; word-pronunciation of "CLAD" enforced after one take spelled it out), the Lens's own generated SFX placed at their true beats, and a licensed lofi music bed (see credits) mixed with a hand-scripted volume envelope — constant −23 dB bed under narration, one 2.5 s rise after the last line — after sidechain compression was rejected for audible pumping.
  4. **Draft iterations 1–7**, each reviewed by the human; final: **draft 7 (lofi), 56.27 s**, approved "perfect."
- **Provenance/credits:** music "Lofi Relax" by kulakovka (Pixabay, Pixabay Content License — free commercial use, no attribution required); narration ElevenLabs paid plan; all other audio (tick/chime/warning/whoosh) and all visuals generated in-project. Raw footage and drafts live outside the repo (video submitted by file-sharing link per the official requirements).
- **Commit:** (recorded on commit of this entry).
