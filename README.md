# Shot Coverage Compass

A spatial organizer for documentary filmmakers, built for **SPECS** with **Lens Studio + CLAD** for the CLAD Summer Hackathon, Week 1 — theme **Organize**.

Standing in the room before a shoot, the question is always the same: *which angles am I still missing?* Shot Coverage Compass answers it in place. Drop camera wedges around your subject on a rehearsal floor; a coverage ring derives, live, which sectors of the 180° working arc your setups cover — gaps red, covered green, complete when the arc closes. Drag a wedge across the axis line and the line flares amber: you've crossed the 180° rule. Tap a wedge to cycle its shot type (wide / medium / close — footprint and coverage angle change together). Your layout persists between sessions. Reset returns everything to the tray.

The organizing value is spatial by construction: the tool reasons about real angular geometry around a physical subject position — remove the space and there is nothing left to organize.

## Try it (Lens Studio 5.23.1+, no hardware needed)

1. Open `Organize-2026.esproj` in Lens Studio 5.23+ (project pins SIK 2.0.0, UI Kit 2.0.0, LEAF 2.0.2). **First open takes a minute** — packages import and TypeScript compiles before the Preview renders; wait for "TypeScript compilation succeeded".
2. Preview panel settings: device **SPECS 27**, input **Interactive**, environment **Plane**, camera **Front**. If the compass isn't framed, right-drag in the Preview to orbit / scroll to zoom until you see the floor dial (the content sits ~1.7 m in front of and below the start pose).
3. **Press the RESET CAMERAS button first** (floating panel, right side) — the Lens restores your previous layout on startup, and Reset guarantees the clean tray: cyan **WIDE 24mm**, violet **MED 50mm**, gold **CLOSE 85mm**.
4. **Drag** a wedge: click-and-hold it, move, release (this simulates the pinch; a plain quick click without movement is a **tap**, which cycles the shot type WIDE → MED → CLOSE → WIDE). Sectors inside the dial flip green with a tick as you cover their angle.
5. **Complete the arc:** tap the violet MED wedge **twice** (making it a second WIDE), then place the two WIDE wedges at roughly **−45° and +45°** — midway between the floor dial's 30 and 60 numerals on each side, inside the ring band. Full green arc → chime + beacon pulse + panel `12 / 12 · COMPLETE`.
6. **Break the 180° line:** drag any wedge past the horizontal axis line to the subject's far side, keeping it **within the dial** (a wedge parked far away is inactive by design — tray distance ≥ 130 cm from the subject doesn't count). The axis flares amber, panel shows `180° LINE CROSSED`, warning tone plays.
7. Audio: the tick/chime/warning/whoosh are generated WAVs (`Assets/GeneratedSFX/`) played through system audio — if you hear nothing, check the Preview panel's audio toggle and system volume; the visual states carry all information regardless.

## Run the tests

**Via the LEAF panel:** open the LEAF panel (LEAF plugin; execution target = **Preview**, not device), then run the **four core scenarios** in any order: `compass-engine-math` (~2 s), `compass-drag-coverage` (~15 s), `compass-persistence` (~10 s), `compass-reset` (~10 s). These are deterministic — expected result: all four report `succeeded`, repeatably.

**Via the Lens Studio MCP tools:** `open_leaf_panel` → `run_leaf_scenario` per scenario id with `onDevice: false`.

A fifth scenario, `compass-ik-reach`, is a **UI-reachability probe**, not part of the core gate: it spawns a physically-simulated IK user (arm + head) who reaches for and presses the Reset button. It is environment-sensitive — the preview's IK rig can stop registering triggers under repeated back-to-back runs (a simulator-infrastructure flake, diagnosed and documented in `docs/prompt-log.md` E9), and the LEAF runner fails any scenario containing a failed interaction regardless of assertions. If it fails, refresh the Preview and re-run; a failure here says nothing about the Lens (reset correctness is asserted deterministically by `compass-reset`).

Note for a fair read of the drag scenario: it asserts floor/clamp invariants plus per-sector view↔engine consistency **for whatever state the simulated manipulation lands** — landing spots are deliberately unscripted, so it proves consistency for the landed state on each run, not for all possible states.

## How it's built

- `Assets/Scripts/CoverageEngine.ts` — pure angular-sector math (single source of truth; LEAF target).
- `Assets/Scripts/WedgeController.ts` — SIK Interactable/Manipulation wedges: floor-plane constraint, rehearsal-floor boundary clamp (a defect LEAF surfaced — far-field manipulation could fling wedges meters away), face-subject yaw, tap-to-cycle shot types, hover glow.
- `Assets/Scripts/RingView.ts` — batched two-mesh arc rendering (ring visuals 12 → ≤2, structural; see the corrected analysis in `docs/performance.md`) with per-sector state markers and a rebuild-on-change guard.
- `Assets/Scripts/CompassRoot.ts` — the one stateful coordinator: derive → render → warn → persist (debounced, validated) → SFX.
- `Assets/Scripts/CompassUI.ts` — SpectaclesUIKit panel (live status + Reset), billboarded.
- `Assets/Textures/src/` + `tempAssetGen/` — all art is original generated SVG→PNG (committed generators).
- `Assets/GeneratedSFX/` — license-clean algorithmic SFX (tick / chime / warning / whoosh).

Everything scene-side was authored through CLAD (VirtualScene single-writer, preview-verified at every step). The full engineering narrative — prompts, agents/skills, observed results, verification evidence, decisions, commit hashes — is in `docs/prompt-log.md` (a curated annotated development log of the build iterations); supporting docs: `docs/architecture.md` (final system), `product-spec.md` (historical slice spec), `research-audit.md`, `idea-scorecard.md`, `decision-memo.md`, `risk-register.md`, `performance.md`, `test-evidence.md`, `originality-check.md`, and the claim→artifact map in `docs/evidence/`.
