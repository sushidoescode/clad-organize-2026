# Submission Description (draft — Lenslist form)

**Lens name:** Shot Coverage Compass

**What it is.** A spatial organizer for interview and documentary coverage, built for SPECS. You place camera wedges around a subject mark on a rehearsal floor; a coverage ring derives — live, from real angular geometry — which sectors of the 180° working arc your setups cover. Gaps read as hatched tally-red lamps, covered sectors as backlit phosphor green; close the arc and the ring completes with a chime. Tap a wedge to cycle its shot type (wide / medium / close — color, floating label, footprint, and coverage angle change together). Drag a wedge behind your subject and the axis line flares amber: the 180° rule, enforced spatially before it costs you the edit. The whole instrument is drawn as luminous engraved line-work — a compass-rose dial with degree numerals under a beacon-lit talent mark — designed for the SPECS additive display, where only light exists. Layouts persist between sessions; Reset returns to the tray.

**How it responds to the theme (Organize).** It organizes the one thing a filmmaker cannot organize on a phone: coverage, which lives in the angular space around a real subject. The ring is a to-do list whose items are literally directions in the room — remove the space and the product ceases to exist.

**Who it is for.** Solo documentary filmmakers and small crews planning interview coverage — built by one, for the moment of standing in the room asking "which angles am I still missing?"

**How CLAD built it.** Everything scene-side was authored and verified through CLAD's closed loop: research-driven concept selection with an auditable decision trail; VirtualScene single-writer scene construction; agent-authored TypeScript (pure coverage engine, SIK interaction, UIKit panel, MeshBuilder geometry); preview-verified iteration after every change (simulated pinch/drag interactions, runtime queries, captures, log diffs); a four-scenario LEAF suite — which caught a real defect (far-field manipulation flinging wedges off the floor, now a clamped, tested invariant); license-clean algorithmically generated SFX; and a measured Perfetto before/after draw-call optimization documented honestly. The complete annotated prompt log (intent → prompt → agents/skills → observed result → verification → decision → commit) ships in the repo at `docs/prompt-log.md`.

**Artifacts.** Public repo (this project, reproducible reviewer instructions in README) · demo video (<60 s) · CLAD prompt log (`docs/prompt-log.md`) · this description.
