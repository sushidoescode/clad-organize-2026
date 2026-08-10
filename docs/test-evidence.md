# Test Evidence — Shot Coverage Compass

## LEAF suite (authoritative regression gate)

| Scenario | What it proves | Status |
|---|---|---|
| `compass-engine-math` | Coverage engine: 12-sector derivation, wide/medium/close half-angles, completion, behind-line contributes nothing + raises violation, tray-distance inactivity, angular wrap | ✅ passing |
| `compass-drag-coverage` | After REAL simulated SIK manipulation: floor-plane invariant (y=0), rehearsal-floor clamp (≤155 cm), and per-sector **view == engine** consistency for the actual landing state | ✅ passing |
| `compass-persistence` | Wedge movement triggers debounced save; stored JSON mirrors live positions + shot types; Reset clears store and arc | ✅ passing |
| `compass-ik-reset` | An IK-simulated user (full arm + head) physically reaches and presses Reset; tray restore verified per-wedge | ✅ passing |

Suite ran green twice: after authoring (commit `a5e1859`) and re-run in full against the batched-ring perf refactor (regression gate). One real defect found by the suite and fixed: SIK far-field manipulation amplified drags ~31×, flinging wedges off the floor → rehearsal-floor boundary clamp in `WedgeController.constrain()` (now itself a tested invariant).

## Interactive preview verification (driven via simulated SIK input, captures + logs)

- **AC1/AC2** — pinch-drag wedge from tray; lands where dropped, world y exactly −125.000 (floor constraint during drag); sectors within the wedge's half-angle flip green live. Verified on naive and batched builds.
- **AC3** — completion: two independent runs reached full-arc green with `[Coverage] COMPLETE` logged (24-sector v1 and 12-sector v2 mechanics).
- **AC4** — Reset via UIKit button: wedges tween to tray, arc reverts red, store cleared, `Reset to tray` logged. Also exercised through the LEAF IK scenario.
- **AC5** — zero runtime errors across every verified pass (refresh-mode log capture after each change; adb-polling warnings are environmental editor noise, not Lens output).
- **v2 mechanic** — tap-to-cycle logged (`Wedge2 → close`), axis-line crossing flares line amber + `LINE CROSSED` logged + status text "Crossed the line!" (framed panel capture); persistence round-trip across a Lens reset restored 3 wedges and correctly re-derived the violation state on load.
- **SFX** — all four `play()` paths exercised clean (tick during drag, chime on completion, warning on crossing, whoosh on reset). Audio is not capturable in screenshots; WAVs verified non-empty on disk, playback verified error-free.
- **Completion pulse** — cosmetic scale pulse added after the perf pass; compile + clean-run verified; guarded by the LEAF suite for behavioral regressions (animation is self-terminating, display-only).

## Perf evidence

See `docs/performance.md` — deliberate naive-first ring, measured Perfetto before/after (12→2 draw calls; render-path slices −3–4%; frame-time delta swamped by preview tracking noise, stated honestly), visual + behavioral parity verified.
