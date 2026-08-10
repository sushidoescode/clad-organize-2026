# Architecture — Shot Coverage Compass

Lens Studio 5.23.1 · SPECS 27 · SIK 2.0 · UIKit 2.0 · TypeScript. Runtime Lens code and editor automation are strictly separated: scene structure is authored via VirtualScene (single writer); all runtime behavior lives in `Assets/Scripts/*.ts`.

## Scene graph (authored)
```
Camera Object (Perspective + DeviceTracking World)      — from base template, untouched
Lighting                                                 — from base template, untouched
SpectaclesInteractionKit                                 — from base template, untouched
CoverageCompass/
├── RehearsalFloor        disc mesh, radius ~150 cm, y=0, neutral charcoal
├── SubjectMark           low cylinder + idle marker at origin, warm accent
├── CoverageRing          RingView.ts — 24 sector meshes, radius ~120 cm, floor-level
├── Wedges/
│   ├── Wedge1..Wedge3    wedge prism mesh + SIK Interactable + WedgeController.ts
│   └── (tray origin: row at floor edge, z ≈ +130 cm)
└── UI/ResetButton        UIKit button, small slate panel, below eye line
```

## Modules (runtime, one source of truth)
- **`CoverageEngine.ts`** — pure, stateless functions; no scene references. `computeSectors(wedgeAngles: number[], halfAngleDeg: number, sectorCount: number): boolean[]` and `bearingDeg(subjectPos, wedgePos): number`. All math in degrees internally converted to radians at trig boundaries; angle convention: atan2 on XZ plane around +Y, 0° = +Z (toward default camera). This module is the LEAF target later — deliberately importable without any component.
- **`WedgeController.ts`** — per-wedge component. Wraps the SIK Interactable manipulation events (bound in `OnStartEvent`, never `onAwake`, per SIK init-order rule); constrains Y to floor height during drag; emits `onWedgeMoved(id, position)` through `CompassRoot`.
- **`RingView.ts`** — owns the 24 sector RenderMeshVisuals; builds sector meshes once at start via MeshBuilder (annular sector, 15° each, small gap); exposes `apply(sectors: boolean[])` — flips each sector's material color GAP red → COVERED green. Naive-first on purpose: 24 separate meshes/materials is the "before" of the later measured perf pass.
- **`CompassRoot.ts`** — the only stateful coordinator. Registry of wedges, subject reference, ring reference; on any wedge move: `RingView.apply(CoverageEngine.computeSectors(...))`. Handles Reset (tween wedges to tray slots, ring recompute). Explicit state: `IDLE | DRAGGING`.
- **`WedgeMeshFactory.ts`** — MeshBuilder wedge prism (triangular FOV wedge: apex toward subject, ~30 cm) + the ring-sector builder shared with RingView. Code-authored geometry, no imported/generated assets.

## Event flow
```
SIK ManipulateStart/End (per wedge)
  → WedgeController (floor-plane constraint)
  → CompassRoot.onWedgeMoved
  → CoverageEngine.computeSectors        (pure)
  → RingView.apply                        (render only)
```
No polling `UpdateEvent` for coverage; recompute is event-driven on manipulation updates. Reset button → CompassRoot.reset() → same pipeline.

## Deterministic choices (and why)
- **Sector-quantized ring (24 × 15°)** instead of a freeform dynamic arc: same visual thesis, dramatically lower geometry risk (risk R2), naturally LEAF-assertable (`boolean[24]`), and gives the perf pass a real before/after (24 draw calls → merged).
- **Fixed floor plane** (y=0) — no world-query dependency (risk R1); placement is SIK drag constrained to the plane.
- **Tray of 3 pre-spawned wedges** — no spawn UI in the slice; "add wedge" palette is a post-slice replacement-eligible feature.
- **Colors carry state but never alone**: covered sectors also raise slightly (few cm) vs gaps flat — accessibility rule (never color alone) and it reads on flat video.

## Verification hooks
- Every meaningful change: RecompileTypeScriptTool → RunAndCollectLogsTool (refresh) → capture → judge pixels (see-and-fix loop).
- Slice ACs map to observable checks: AC2/AC3 assertable later by LEAF against `CoverageEngine` with scripted wedge sets; in the slice they're verified by driven Preview interaction + capture.
- Perf: naive ring is the deliberate baseline; merge/batch pass is a later milestone with Perfetto before/after.
