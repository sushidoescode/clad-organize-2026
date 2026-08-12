# One CLAD Loop, End to End (representative example)

A single verification loop from the development session, with the actual tool
outputs — the pattern every change in `docs/prompt-log.md` went through:
**edit → compile → run → drive interaction → query runtime → judge → commit.**

## The change under test (2026-08-12)

External review found that completion could mask an active 180°-rule violation:
`isComplete` ignored `lineViolations`, so 12/12 coverage with a wedge behind the
axis line still fired the green COMPLETE caption, chime, and pulse.
Fix in `CompassRoot.recompute()`: celebration requires full arc **and** zero
violations; `CompassUI.setStatus()` gives the warning caption precedence.

## The loop, as executed

1. **Edit + compile** — `RecompileTypeScriptTool` → `{"status":"succeeded"}`.
2. **Run** — `RunAndCollectLogsTool (refresh)` → clean start, zero Lens runtime errors.
3. **Drive the adversarial state** — `PreviewInteractTool` batch (simulated SIK
   pinch/drag): Wedge2 dragged behind the subject (violation), then Wedge1 wide
   to −45°, Wedge3 tap-cycled to wide and dragged to +45° → full arc covered
   while the violation is active.
4. **Judge by evidence** —
   - Log shows the violation edge, and **no completion** while it is active:
     ```
     03:17:50.578 [Coverage] LINE CROSSED — wedge behind the axis line
     (arc fully covered ~03:17:58 — no COMPLETE line fires)
     ```
   - Preview capture: full green arc + amber axis line + panel caption
     `180° LINE CROSSED` with green `12 / 12` hero — warning outranks COMPLETE.
   - Wedge2 dragged back to the tray → the violation clears, and the clean
     completion rising-edge fires exactly then:
     ```
     03:18:45.113 [Coverage] COMPLETE — full working arc covered
     ```
5. **Regression gate** — full LEAF suite re-run: 4/4 green (`leaf-final-run.md`).
6. **Commit** — this file ships in the same commit as the fix.

## A second, numeric example (same pattern, earlier the same week)

The covered-arc raise animation was moved onto the object transform so LEAF
observables stay instant. Post-change runtime query (`QueryRuntimeSceneTool`,
GraphQL against the live preview) returned:

```json
{"covered": {"matches": [{"transform": {"localPosition": {"x": 0, "y": 2, "z": 0}}}]},
 "sector2": {"matches": [{"transform": {"localPosition": {"x": 0, "y": 2, "z": 0}}}]},
 "sector8": {"matches": [{"transform": {"localPosition": {"x": 0, "y": 0, "z": 0}}}]}}
```

— the animated object settled at exactly the 2 cm contract; the covered marker
reads 2, the uncovered marker 0. Verified, then committed (`1708b43`).
