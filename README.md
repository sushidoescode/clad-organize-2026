# Shot Coverage Compass

A spatial organizer for documentary filmmakers, built for **SPECS** with **Lens Studio + CLAD** for the CLAD Summer Hackathon, Week 1 — theme **Organize**.

Standing in the room before a shoot, the question is always the same: *which angles am I still missing?* Shot Coverage Compass answers it in place. Drop camera wedges around your subject on a rehearsal floor; a coverage ring derives, live, which sectors of the 180° working arc your setups cover — gaps red, covered green, complete when the arc closes. Drag a wedge across the axis line and the line flares amber: you've crossed the 180° rule. Tap a wedge to cycle its shot type (wide / medium / close — footprint and coverage angle change together). Your layout persists between sessions. Reset returns everything to the tray.

The organizing value is spatial by construction: the tool reasons about real angular geometry around a physical subject position — remove the space and there is nothing left to organize.

## Try it (Lens Studio 5.23.1+, no hardware needed)

1. Open `Organize-2026.esproj` in Lens Studio 5.23+ (project pins SIK 2.0.0, UI Kit 2.0.0, LEAF 2.0.2).
2. Preview panel → SPECS 27, Interactive.
3. Drag the cyan wedges from the tray into the ring (mouse in preview / pinch on device). Watch sectors flip green with a tick; complete the arc for the chime + pulse.
4. Tap (pinch without moving) a wedge to cycle wide → medium → close.
5. Drag a wedge behind the subject to see the axis-line warning.
6. The Reset button on the floating panel returns to a clean tray.

## Run the tests

Window → LEAF panel → run the four scenarios (`compass-engine-math`, `compass-drag-coverage`, `compass-persistence`, `compass-ik-reset`), or via the Lens Studio MCP LEAF tools. All four pass at the submission commit; the drag scenario asserts per-sector view↔engine consistency for arbitrary manipulation outcomes, and the IK scenario physically reaches the Reset button (reachability check).

## How it's built

- `Assets/Scripts/CoverageEngine.ts` — pure angular-sector math (single source of truth; LEAF target).
- `WedgeController.ts` — SIK Interactable/Manipulation wedges: floor-plane constraint, rehearsal-floor boundary clamp (a defect LEAF surfaced — far-field manipulation could fling wedges meters away), face-subject yaw, tap-to-cycle shot types.
- `RingView.ts` — batched two-mesh arc rendering (12→2 draw calls, measured — see `docs/performance.md`) with per-sector state markers.
- `CompassRoot.ts` — the one stateful coordinator: derive → render → warn → persist (debounced) → SFX.
- `CompassUI.ts` — SpectaclesUIKit panel (live status + Reset), billboarded.
- `Assets/GeneratedSFX/` — license-clean algorithmic SFX (tick / chime / warning / whoosh).

Everything scene-side was authored through CLAD (VirtualScene single-writer, preview-verified at every step). The full engineering narrative — prompts, agents/skills, observed results, verification evidence, decisions, commit hashes — is in `docs/prompt-log.md`; supporting docs: `docs/product-spec.md`, `architecture.md`, `research-audit.md`, `idea-scorecard.md`, `decision-memo.md`, `risk-register.md`, `performance.md`, `test-evidence.md`.
