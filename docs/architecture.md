# Architecture — Shot Coverage Compass (final, as shipped)

Lens Studio 5.23.1 · SPECS 27 · SIK · UIKit · LEAF · TypeScript. Runtime Lens code and editor automation are strictly separated: scene structure is authored via VirtualScene (single writer); all runtime behavior lives in `Assets/Scripts/*.ts`.

> The original vertical-slice architecture (24 sectors, ±60° fixed half-angle, per-sector meshes) is preserved in git history and summarized in `docs/product-spec.md`; this document describes the final v2 system.

## Scene graph (authored)
```
Camera Object (Perspective + DeviceTracking World)   — base template, untouched
Lighting / SpectaclesInteractionKit                  — base template, untouched
CoverageCompass  (0, −125, −260)
├── RehearsalFloor    FloorDisc.ts — runtime disc mesh (r=160), compass-rose texture
├── BaseReticle       FloorDisc.ts — 20 cm reticle disc under the beacon
├── SubjectMark       BeaconColumn.ts — capless tube + vertical alpha fade + SUBJECT label
├── CoverageRing      RingView.ts — 2 batched arc meshes + 12 Sector<i> state markers
├── Wedges/Wedge1..3  WedgeController.ts — SIK Interactable + Manipulation each
├── Line180           box mesh, ivory at rest / amber on violation (material swap)
├── CompassUI         CompassUI.ts — UIKit BackPlate panel (billboarded)
└── OnboardingHint    OnboardingHint.ts — two-line billboarded hint, fades on first drag
LeafIndex             LEAF scenario registry (4 scenarios)
```

## Modules (one source of truth)
- **`CoverageEngine.ts`** — pure, stateless math; no scene references; the LEAF target. Constants: 12 sectors × 15° over the front arc [−90°, +90°]; `ACTIVE_RADIUS_CM = 130`; shot-type half-angles wide 45° / medium 30° / close 20°; inclusive boundaries with `BOUNDARY_EPS`. Signed bearing in (−180°, 180°], 0° = +Z (user side). Exports `computeSectors`, `lineViolations` (active wedge with |bearing| > 90°), `isComplete`, `coveredCount`, bearing/distance helpers.
- **`WedgeController.ts`** — per-wedge: builds its own prism mesh, collider, SIK Interactable + Manipulation. Constraints every held frame: floor plane (y=0), rehearsal-floor clamp (156 cm — above the 155.24 cm tray radius so Reset restores exact tray coordinates), face-subject yaw, type-owned footprint scale. Tap = max travel during the whole grab < 2 cm → cycles shot type (color, floating `WIDE 24mm`-style label, footprint, and half-angle all derive from one index). Hover swaps to a brightened material.
- **`RingView.ts`** — pure view. All gap sectors in ONE mesh, all covered sectors in ONE mesh (≤2 draw calls; 1 in the all-gap state). A 12-bit signature guard rebuilds geometry only on actual state change. Covered mesh rides an object transform at +2 cm; the newly-covered flash animates brightness and a small physical rise on that transform. Twelve empty `Sector<i>` markers carry per-sector state on local y (0 gap / 2 covered) — the LEAF observable, independent of batching. State is never color-alone.
- **`CompassRoot.ts`** — the only stateful coordinator. On wedge change: engine derive → `RingView.apply` → axis-line material swap → panel status → edge-triggered SFX/logs → debounced persistence (0.5 s; canceled by Reset before the store is cleared). Completion celebration requires full arc AND zero violations. Restore validates the entire saved payload before mutating anything. Subject pulse uses one canonical base scale + one reusable event.
- **`CompassUI.ts`** — UIKit panel: title, two-tone hero count (flex row: green count / ivory total), caption with warning precedence (`180° LINE CROSSED` outranks `COMPLETE`), RESET CAMERAS button. Content restyle only — stock BackPlate/Button structure.
- **`WedgeMeshFactory.ts`** — MeshBuilder geometry: wedge prism, multi-span arc mesh, disc (planar UVs), capless tube. All meshes code-authored.
- **`FloorDisc.ts` / `BeaconColumn.ts` / `OnboardingHint.ts`** — presentation components.
- **Textures** — all original, generated SVG→PNG (`Assets/Textures/src/*.svg`, generator in `tempAssetGen/`). Authoring contract: the floor texture reaches the eye vertically flipped, so floor glyphs are authored `scale(1,-1)`.

## Event flow
```
SIK manipulation (start/update/end per wedge)
  → WedgeController.constrain (floor, clamp, yaw, scale) [+ max-travel tap tracking]
  → CompassRoot.recompute
      → CoverageEngine.computeSectors / lineViolations     (pure)
      → RingView.apply (signature-guarded rebuild)          (render)
      → line material · panel status · SFX · persistence    (effects)
```
Recompute runs on every held-manipulation frame; geometry rebuild is guarded by the sector signature, so per-frame cost while holding still is derivation only.

## Design rules that shipped
- **Additive-display physics**: SPECS renders dark pixels as transparent — the entire look is luminous line-work and alpha falloff (Etched Light Meter direction; see `docs/prompt-log.md` E4).
- **State is never color-alone**: covered sectors are raised 2 cm; violations are a line flare + caption, not a fill.
- **No spatial anchoring**: geometry is scene-space on a fixed rehearsal floor; persistence saves the virtual arrangement (`{x, z, type}` per wedge), not physical-room coordinates.
- **Perf discipline**: static content only; the one measured claim is structural (ring visuals 12 → ≤2, total Visual calls/frame 22 → 11) — see `docs/performance.md` for the corrected analysis.

## Verification loop
Every meaningful change: RecompileTypeScriptTool → RunAndCollectLogsTool (refresh) → capture → judge pixels → drive interactions (PreviewInteractTool) → runtime queries → full LEAF suite as the regression gate. Evidence index: `docs/evidence/`.
