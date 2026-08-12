# Test Evidence — Shot Coverage Compass

## LEAF suite (authoritative regression gate)

| Scenario | What it proves | Status |
|---|---|---|
| `compass-engine-math` | Coverage engine: 12-sector derivation, wide/medium/close half-angle mapping asserted through `halfAngleForType` (6/4/2-sector footprints), completion, behind-line contributes nothing + raises violation, tray-distance inactivity, angular wrap | ✅ passing |
| `compass-drag-coverage` | After REAL simulated SIK manipulation with asserted non-trivial displacement (>10 cm): floor-plane invariant (y=0), rehearsal-floor clamp (≤156 cm), all 12 sector markers present, and per-sector **view == engine** consistency for the actual landing state | ✅ passing |
| `compass-persistence` | Wedge movement triggers debounced save; stored JSON mirrors live positions + shot types; Reset clears store and arc. (Startup **restore** is verified interactively across a Lens reset — see the v2 round-trip note below — not by this scenario.) | ✅ passing |
| `compass-ik-reset` | An IK-simulated user (full arm + head) physically reaches and presses Reset; tray restore verified per-wedge | ✅ passing |

Suite ran green four times: after authoring (commit `a5e1859`), against the batched-ring perf refactor, against the Stage-3 polish (`33957ad`), and in full against the E4 visual overhaul (Etched Light Meter — new floor/beacon meshes, retextured ring, per-type wedge materials). One real defect found by the suite and fixed: SIK far-field manipulation amplified drags ~31×, flinging wedges off the floor → rehearsal-floor boundary clamp in `WedgeController.constrain()` (now itself a tested invariant).

## Interactive preview verification (driven via simulated SIK input, captures + logs)

- **AC1/AC2** — pinch-drag wedge from tray; lands where dropped, world y exactly −125.000 (floor constraint during drag); sectors within the wedge's half-angle flip green live. Verified on naive and batched builds.
- **AC3** — completion: two independent runs reached full-arc green with `[Coverage] COMPLETE` logged (24-sector v1 and 12-sector v2 mechanics).
- **AC4** — Reset via UIKit button: wedges return to the tray immediately, arc reverts red, store cleared, `Reset to tray` logged. Also exercised through the LEAF IK scenario.
- **AC5** — zero runtime errors across every verified pass (refresh-mode log capture after each change; adb-polling warnings are environmental editor noise, not Lens output).
- **v2 mechanic** — tap-to-cycle logged (`Wedge2 → close`), axis-line crossing flares line amber + `LINE CROSSED` logged + status text "Crossed the line!" (framed panel capture); persistence round-trip across a Lens reset restored 3 wedges and correctly re-derived the violation state on load.
- **SFX** — all four `play()` paths exercised clean (tick during drag, chime on completion, warning on crossing, whoosh on reset). Audio is not capturable in screenshots; WAVs verified non-empty on disk, playback verified error-free.
- **Completion pulse** — cosmetic scale pulse added after the perf pass; compile + clean-run verified; guarded by the LEAF suite for behavioral regressions (animation is self-terminating, display-only).

## E4 — Visual overhaul verification (Etched Light Meter)

Every element of the art-direction pass was verified in preview with captures + logs before commit:

- **Floor compass rose** — engraved-dial texture (ticks, concentric hairlines, degree numerals, spike-tape T, index triangles) renders on a runtime disc mesh; degree numerals verified **upright and unmirrored from the demo camera** after an empirical fix: the mesh-UV → texture-sampling → camera chain displays the floor texture vertically flipped, so glyphs are authored `scale(1,-1)` (first attempt `rotate(180)` produced reversed digit order — caught by capture, corrected, re-verified).
- **Ring re-tone** — gap sectors: tally-red diagonal-hatch texture with bright outer-edge stroke; covered sectors: phosphor-green gradient with baked near-white top hairline. Verified live: wide wedge at −45° flipped exactly sectors 0–5 (6/12 on the panel), engine↔view consistent.
- **Threshold behavior re-confirmed incidentally**: a drag landing at planar radius 130.1 cm (just past ACTIVE_RADIUS 130) correctly counted as inactive.
- **Wedge type coding** — per-type materials (WIDE cyan / MED violet / CLOSE gold) + floating billboarded labels ("WIDE 24 / MED 50 / CLOSE 85"); tap-cycle verified (`[Wedge] Wedge3 → wide` + color and label swap in capture); labels counter-scaled so footprint scaling never stretches them (close-up capture legible).
- **Beacon subject** — capless MeshBuilder tube with vertical alpha fade (bright base → dissolved top); replaced the preset cylinder whose top cap sampled a bright texel ellipse.
- **Violation beat** — wedge dragged behind subject: axis flared amber, `LINE CROSSED` logged, coverage preserved (behind-line wedge contributes violation, not coverage).
- **Completion** — two wide wedges at ±45°: full green arc, `[Coverage] COMPLETE` logged, panel hero `12 / 12` green + `COMPLETE` caption (capture = `docs/media/hero_coverage_complete.png`).
- **Reset** — Reset button pinch restores tray (runtime query at E5: ±0.06 cm of nominal). *Root cause identified later by external review:* the authored tray radius (155.24 cm) exceeded the then-155 cm boundary clamp, so `resetTo` was clamped — fixed by raising the clamp to 156 cm; Reset now restores exact tray coordinates. A separately observed 30 cm post-pinch wedge displacement was a PreviewInteractTool puppet-hand retraction-ray artifact (absent with real hands), confirmed by a clean re-run + LEAF.
- **Zero runtime errors** across all E4 passes; full LEAF suite green as the final gate.

## E5 — Concept-frame gap closure verification

- **Sector rims / glow / brighter dial** — verified in captures from the demo camera: each red/green sector reads as a rimmed tile, glow band floats the ring, numerals and ticks noticeably brighter.
- **Translucent etched wedges** — rim + focal ticks visible through the tinted glass body on all three types; labels unaffected.
- **Base reticle** — double circle + stubs rendered at the beacon base, aligned with the floor crosshair.
- **Two-tone panel hero** — live count verified: showed green `9 / 12` against a restored 9-sector layout (count derived, not hard-coded), then `12 / 12 · COMPLETE` all-green at completion; `CROSSED THE LINE` caption logic unchanged.
- **Full loop re-verified on the upgraded build** — fresh run → completion (two wides at ±45°, `[Coverage] COMPLETE`) → Reset; zero runtime errors; **full LEAF suite green (fifth full pass)**.

## E6 — Cold-judge comprehension + interaction polish verification

- **Identity/purpose layer** — opening-state capture shows, simultaneously: panel title SHOT COVERAGE COMPASS, two-line hint (action + "PLAN CAMERA SETUPS AROUND YOUR SUBJECT"), per-wedge shot labels, SUBJECT caption at the beacon — a cold viewer gets what/why/how in one frame.
- **Hover glow** — held-pinch capture shows the cyan wedge paled toward white while hovered; released without a tap-cycle (no `[Wedge] →` log; travel exceeded the 2 cm tap threshold).
- **Raise-pop** — after a coverage flip: `RingCovered` local y = 2.000 exactly (tween settled at RAISE_CM); covered marker y=2 / uncovered y=0 (LEAF observable unchanged — animation lives on the render object only).
- **Full loop** — fresh run → completion (`[Coverage] COMPLETE`) → reset; zero runtime errors; **LEAF 4/4 green (sixth full pass)**; hero stills refreshed.

## E8 — External-review corrections verification

- **Completion gating** — driven adversarially: full arc covered WHILE a wedge sat behind the axis line → no `COMPLETE` log, panel caption `180° LINE CROSSED` (amber) with green `12 / 12` hero; violation cleared → `[Coverage] COMPLETE` fired exactly on the clean rising edge (log timestamps 03:17:50 / 03:18:45, see `docs/evidence/clad-loop-example.md`).
- **Exact tray restore** — post-Reset runtime query: (−40, 0, 150) / (0, 0, 150) / (40, 0, 150) — the 156 cm clamp fix removed the former ±0.06–0.24 cm clamp drift.
- **Rebuild guard, pulse reuse, validated restore, save-cancel, max-travel tap** — compile clean, zero runtime errors across the full pass; behavior covered by the interaction pass + LEAF.
- **LEAF suite green on strengthened assertions (seventh full pass)** — mapping (6/4/2-sector footprints via `halfAngleForType`), >10 cm displacement, 12-marker presence, real IK-reset precondition, 156 cm bound. Final-run record: `docs/evidence/leaf-final-run.md`.

## Perf evidence

See `docs/performance.md` — deliberate naive-first ring, measured Perfetto before/after. **Corrected conclusion (external review, 2026-08-12):** the improvement is structural — ring visuals 12 → ≤2 (1 in the all-gap state), total `Visual` calls/frame 22 → 11 — with **no resolvable per-frame timing improvement** once captures are normalized per `ProcessFrame`; preview tracking noise dominates all timing comparisons. Sanitized trace summaries are committed under `docs/evidence/`. Visual + behavioral parity verified.
