# Demo Video Script — Shot Coverage Compass (target 55 s, hard cap <60 s)

Recording method: screen-record the Lens Studio Preview panel (SPECS 27, Interactive) with narration recorded over it. Every interaction is the real Lens — no scripted fakes. Rehearse the full run twice from Reset before recording (contract rule: three clean runs from reset before the final take).

## Camera setup (via MCP or manual right-drag)

Base view — the verified composition:
```
MovePreviewCamera: reset → setPosition (0, 70, 50) → lookAt (0, -110, -250)
```
Orbit beat (sells the 3D geometry, use during 20–35 s):
```
MovePreviewCamera: orbit target (0, -125, -260), yaw 25 → yaw -50 (slow)
```

## Beat sheet

| Time | Screen | Narration (builder voice, first person) |
|---|---|---|
| 0–5 s | Base view: the engraved light-meter dial (ticks + degree numerals), beacon column, hatched red arc, three colored wedges with labels, hint visible | "I shoot documentaries. Standing in the room before an interview, the question is always: **which angles am I still missing?**" |
| 5–13 s | Drag the cyan WIDE wedge to −45°. Sectors flip to backlit green + flash + ticks; hint fades | "This is Shot Coverage Compass, on SPECS. Every camera setup I place covers part of a ring around my subject…" |
| 13–20 s | Drag second wedge to +45°. More green; gap narrowing | "…derived live from the real geometry of the room. Green means I have that angle." |
| 20–27 s | Slow orbit while tapping a wedge twice (color + floating label + footprint all cycle: cyan WIDE 24 → violet MED 50 → gold CLOSE 85) | "Tap a wedge to change the shot — wide, medium, close. Coverage math follows." |
| 27–35 s | Drag a wedge across the axis line — line flares amber, warning buzz, panel caption "CROSSED THE LINE" | "And if I drift behind my subject — that's the 180° rule breaking, before it costs me the edit." |
| 35–42 s | Drag it back; final gap closes: full green arc, chime, beacon pulse, panel "12 / 12 · COMPLETE" in green | "When the arc closes, my coverage is complete. It remembers the layout for tomorrow's shoot." |
| 42–55 s | Fast cuts: LEAF panel 4/4 green → Perfetto trace + performance.md table → prompt-log scroll → one VirtualScene/CLAD iteration | "Built entirely with CLAD: agent-authored scene and scripts, verified in preview at every step, a four-scenario LEAF suite — which caught a real bug — and a measured draw-call optimization. The tool I needed, built in a week I didn't have." |
| 55–58 s | Base view, complete green arc | (beat, no VO) Title card text overlay in edit: "Shot Coverage Compass — built with CLAD for SPECS." |

## Production notes

- **Cold-read gate (risk R3):** show the first 20 s to one non-filmmaker before final edit. If "what does it organize?" isn't answered, add a one-line on-screen caption at 5 s: *"Plan your camera coverage — in the room."*
- The tick/chime/warning SFX are in the Lens — record system audio, mix VO over it.
- Keep every UI/text element inside the frame at 1080p; the status panel should be readable on the right.
- No brand names anywhere on screen except tool names in the CLAD montage section (README/prompt-log screenshots are fine — the ban applies to the Lens content itself; montage shows development tooling).
- Reset to clean state before the take; persistence is OFF-camera state — clear it (Reset) so the take starts red.

## Evidence-montage capture list (pre-produce as stills/short clips)

1. LEAF panel with 4 green scenarios (run live, screen-record the panel).
2. `docs/performance.md` table + one Perfetto trace open.
3. `docs/prompt-log.md` E1–E3 scroll.
4. A VirtualScene apply + preview-verify loop from the session (screenshot pair).
