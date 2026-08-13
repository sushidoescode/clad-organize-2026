# Demo Video Script — Shot Coverage Compass (target 52–55 s, hard cap <60 s)

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
**Choreography is deterministic and engine-verified — follow it exactly** (wedge types: W1 = cyan WIDE ±45°, W2 = violet MED ±30°, W3 = gold CLOSE ±20°; a wide at −45° + a wide at +45° tile all 12 sectors):

| Time | Screen | Narration (builder voice, first person) |
|---|---|---|
| 0–5 s | Base view: the engraved light-meter dial (ticks + degree numerals), beacon column, hatched red arc, three colored wedges with labels, hint visible | "I shoot documentaries. Standing in the room before an interview, the question is always: **which angles am I still missing?**" |
| 5–12 s | Drag W1 (cyan WIDE) to **−45°** on the arc. Six sectors flip to backlit green + flash + ticks; hint fades | "This is Shot Coverage Compass, on SPECS. Every camera setup I place covers part of a ring around my subject…" |
| 12–19 s | Drag W2 (violet MED) to **+30°**. Four more sectors flip → **10 / 12** | "…derived live from real angular geometry. Green means I have that angle." |
| 19–26 s | Slow orbit while **tapping W2 twice** (MED 50mm → CLOSE 85mm → WIDE 24mm; color + label + footprint all cycle; count goes 10 → 11) | "Tap a wedge to change the shot — wide, medium, close. Coverage math follows." |
| 26–33 s | Drag W2 (now WIDE) across the axis line behind the subject — line flares amber, warning buzz, panel caption "180° LINE CROSSED" | "And if I drift behind my subject — that's the 180° rule breaking, before it costs me the edit." |
| 33–40 s | Drag W2 back to **+45°**: the last gap closes — full green arc, chime, beacon pulse, panel "12 / 12 · COMPLETE" in green (first and only completion of the take) | "When the arc closes, my coverage is complete. It saves my setup between sessions." |
| 40–50 s | Fast cuts: LEAF panel 4/4 green → performance.md corrected table → prompt-log scroll → one VirtualScene/CLAD iteration | "Built with CLAD: agent-authored scene and scripts, verified in preview at every step, a four-scenario LEAF suite — which caught a real bug — and a measured visuals-per-frame reduction. The tool I needed, built in a week I didn't have." |
| 50–53 s | Base view, complete green arc | (beat, no VO) Title card text overlay in edit: "Shot Coverage Compass — built with CLAD for SPECS." |

## Production notes

- **Cold-read gate (risk R3):** show the first 20 s to one non-filmmaker before final edit. If "what does it organize?" isn't answered, add a one-line on-screen caption at 5 s: *"Plan your camera coverage — in the room."*
- The tick/chime/warning SFX are in the Lens — record system audio, mix VO over it.
- Keep every UI/text element inside the frame at 1080p; the status panel should be readable on the right. **Compose and verify the framing at the final 16:9 export aspect before recording** — the preview panel is taller than 16:9 and the tracked hero stills crop the tray.
- Persistence wording: the Lens saves the **virtual arrangement** between Lens sessions (scene-space layout). It does not spatially anchor to a specific physical room — never imply that on camera.
- No brand names anywhere on screen except tool names in the CLAD montage section (README/prompt-log screenshots are fine — the ban applies to the Lens content itself; montage shows development tooling).
- Reset to clean state before the take; persistence is OFF-camera state — clear it (Reset) so the take starts red.

## Evidence-montage capture list (pre-produce as stills/short clips)

1. LEAF panel with 4 green scenarios (run live, screen-record the panel).
2. `docs/performance.md` table + one Perfetto trace open.
3. `docs/prompt-log.md` E1–E3 scroll.
4. A VirtualScene apply + preview-verify loop from the session (screenshot pair).
