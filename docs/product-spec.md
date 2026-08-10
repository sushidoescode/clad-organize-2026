# Product Spec — Continuity Compass (coverage cut)

Approved 2026-08-10 at the Phase D gate. Build identity: **Shot Coverage Compass**. This spec governs scope; the scope-freeze gate applies after the vertical slice — any later feature enters only by replacing another.

## One primary user
A solo documentary filmmaker planning interview coverage — the builder is this user.

## One real-world moment
Standing in the interview room before the shoot, deciding where the cameras go, and needing to know: *which angles am I still missing?*

## One spatial relationship
The angular positions of camera wedges **around the subject mark** determine which sectors of a floor-level coverage ring are covered. The ring is the organized state of the shoot, computed from real (scene-space) geometry — nothing is a list.

## One state model
```
WedgeState        := { id, position: vec3 }            // scene-space, floor-plane constrained
DerivedCoverage   := sectors[N] each ∈ {COVERED, GAP}  // N = 24 sectors × 15°
                     sector s is COVERED iff ∃ wedge whose bearing angle θ(wedge, subject)
                     lies within ±COVERAGE_HALF_ANGLE of sector s's center
RingState         := { sectors, complete: bool }        // complete = all COVERED
SessionState      := IDLE → DRAGGING(wedgeId) → IDLE    // recompute on every wedge transform change
```
Slice constant: COVERAGE_HALF_ANGLE = 60° (each wedge covers 120° = 8 sectors). MVP later varies this by shot type. One source of truth: `CoverageEngine` owns all derived state; views only render it.

## One critical flow (the vertical slice)
Drag a wedge from the tray onto the floor around the subject → the ring sectors it covers turn green immediately → drag more wedges → when coverage is complete, the entire ring is green (a visible, spatial completion state). Reset returns to the initial state.

## Non-goals (frozen)
1. Continuity/prop/wardrobe/audio state tokens — cut at the decision gate, will not return.
2. Multi-room projects, real-set anchor persistence, or world-mesh queries.
3. Networking, cloud, sync, accounts, or any internet permission.
4. Runtime AI, camera/CV recognition, screenplay/document import.
5. Physics-driven motion (all movement is direct manipulation + deterministic tweens).
6. Cross-session persistence in the slice (MVP adds local save/reload later as a replacement-eligible feature).
7. Mobile/phone companion, voice-only interaction paths.

## Acceptance criteria (slice — each observable in Preview)
- **AC1 Place/drag:** a wedge can be dragged with simulated pinch input and follows on the floor plane; releasing leaves it where dropped.
- **AC2 Live consequence:** within the same frame-visible update after a wedge move, the ring sectors within ±60° of its bearing render covered (green); vacated sectors revert to gap (red).
- **AC3 Completion:** three wedges placed ~120° apart turn all 24 sectors green — the full-ring state is visually unmistakable.
- **AC4 Reset:** the reset control returns wedges to the tray and all sectors to red in one action.
- **AC5 Clean run:** TypeScript compiles clean; a full drag→complete→reset pass produces no new runtime errors in logs.

MVP additions after the slice (in priority order, each verified before the next): 180°-line crossing warning · shot-type coverage angles · save/reload · generated SFX feedback · LEAF scenarios (coverage math + persistence) · measured perf pass · onboarding beat (3-beat method) · demo polish (arc-fill animation, orbit pass).
