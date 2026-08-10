# Decision Memo — Week 1 "Organize"

2026-08-10. Finalists after full-catalog triage, adversarial red-team, and a rubric-mirror judge panel (see idea-scorecard.md). The research hypothesis (Continuity Compass) was treated as a hypothesis: **as cataloged, it does not survive** (feature overload + jargon gate). A scoped cut of it wins.

## The three finalists

### 1. RECOMMENDED — Continuity Compass, coverage cut (build identity: "Shot Coverage Compass", O01)

One fixed rehearsal floor. One subject mark. Pinch-placed generic camera wedges with FOV cones. A live angular **coverage ring** around the subject — covered sectors green, gaps red — plus a 180°-line crossing warning. Save/reload, reset. That is the whole product.

**Strongest objections (red-team, kept honest):**
- Jargon gate: "coverage" doesn't cold-read in 10 s for non-filmmakers; the raw visuals don't self-explain. *Answer:* the cut collapses the pitch to one plain question — "which angles am I still missing?" — and one plain rule — "green means you have every angle." Video opens with the question; narration by the actual target user.
- Visually quiet: wedges and floor arcs, not spectacle; the arc can read as a 2D pie chart on flat video. *Answer:* arc-fill animation, an orbiting camera pass (MovePreviewCamera), sonified state feedback (generated SFX — the catalog-wide unclaimed CLAD axis), and the 180°-line amber flare as a second beat.
- Anchor drift makes the real-set story unprovable. *Answer:* the demo never claims it — fixed rehearsal-floor placement is the *primary* mode (the red-team concluded this fallback should be the main mode; it makes demo, LEAF, and persistence all cleaner).
- Perf story thinnest of the top tier. *Answer:* wedge/cone/arc meshes built naively per-segment first, then batched/merged with a measured before/after — modest but real; plus the audio garnish widens breadth.

**Why it wins:** the only concept where the builder **is** the target user (documentary filmmaker) — the C&U judge's 9/10 and "the clear originality leader… a domain no LLM-assisted team will converge on." The coverage engine is pure deterministic trigonometry: ideal LEAF material, impossible to fake in the prompt log, zero risky dependencies, and the failure modes are narrative (fixable with framing) rather than technical (not fixable in a week).

### 2. Runner-up — Cable Topology Cartographer, trace-first cut (O09)

Pre-authored JSON cable topology inside a modeled proxy studio; pinch an endpoint → its route glows through the tangle while everything else fades. Authoring demoted to a 5-second cameo.

**Strongest objections:** Preview shows floating tubes between boxes — a 3D network diagram, not cables-behind-a-rack, so the spatial claim is weakened exactly where it must land; data-entry-exceeds-value circularity on usefulness; the proxy studio scene is unbudgeted art direction; spline-tube geometry is the floor risk (mitigated but not erased by the mesh-builder-scripting tube primitives).

**Why it loses to #1 (narrowly):** highest CLAD score on the panel (8/10 — graph rules + procedural tubes + the batch's best measured perf story) and cut-adjusted it ties O01 (≈7.5 vs ≈7.6). But its floor depends on tube geometry landing by Day 3 for a junior-XR solo dev, its usefulness story took the harder judge hit, and O01's authenticity axis is unfakeable. Equal upside, worse tail risk.

### 3. Third — Stage Reset Map, record-scramble-restore cut (O04)

Five characterful props; pinch to record homes; stage scrambles; ghost outlines guide restore with snap satisfaction.

**Strongest objections:** premise collapses in Preview (virtual props snapping to virtual ghosts — "the software could snap them itself"); spike-tape incumbent on usefulness; snap-to-ghost is the most tutorial-worn AR pattern — "solid-but-safe" ambition ceiling on the axis worth 50%.

**Why it's third:** the most certain-to-ship entry with the second-best UX (8/10); kept as the concept-level fallback precisely because nothing in it can fail technically.

**Honorable mention — Tool Shadow Ledger (O02, grabbable-loop cut):** best raw UX in the pool (8.5) and effectively tied with O04 cut-adjusted; excluded from the finalist trio because the C&U kill is structural ("a digital remake of a $5 shadow board whose load-bearing feature is faked in Preview") — a judge-side objection no scope cut fully repairs.

## Minimum winning MVP (recommended concept)

Fixed floor + subject mark + up to 5 pinch-placed wedges (snap-to-socket fallback) + live coverage ring (angular sector math, red/green) + 180°-line crossing warning + save/reload + reset + 2 LEAF scenarios (coverage math from scripted marker sets; persistence round-trip) + one measured perf pass + generated SFX feedback. UI: one compact slate panel (UIKit). Everything else is a non-goal.

**Scope-cut fallback (inside the concept):** if free pinch-placement is unreliable in Preview → 3–5 fixed wedge sockets (tap-to-cycle shot type); the coverage engine, LEAF story, and demo survive intact.

## Technical dependencies

SIK 2.0 (pinch/drag interactables) · UIKit 2.0 (slate panel) · LEAF 2.0.2 (install at build start) · MeshBuilder (wedge cones + dynamic arc-sector mesh) · build-sfx (state chimes) · local JSON persistence · no camera, no location, no mic, no network, no cloud, no physics, no world-query dependency.

## Recommendation

**Approve Continuity Compass (coverage cut).** Feasibility gate: a 3-hour test of the two genuinely uncertain primitives (pinch-place on floor + live procedural arc recompute). Kill criteria and staged fallbacks in risk-register.md.
