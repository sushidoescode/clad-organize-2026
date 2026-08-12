# LEAF Final Run Record

- **Date/time:** 2026-08-12, 03:19–03:20 local (America/Los_Angeles)
- **Environment:** Lens Studio 5.23.1.26080420, SPECS 27 interactive preview, LEAF 2.0.2, execution target: preview
- **Build state:** post external-review corrections (boundary epsilon, rebuild guard, completion gating, restore validation, save-cancel, 156 cm clamp, max-travel tap) — committed as the same commit that adds this file
- **Runner:** `run_leaf_scenario` (Lens Studio MCP LEAF tools), one scenario per call

| Scenario ID | Result |
|---|---|
| `compass-engine-math` | `{"status":"succeeded","target":"preview"}` |
| `compass-drag-coverage` | `{"status":"succeeded","target":"preview"}` |
| `compass-persistence` | `{"status":"succeeded","target":"preview"}` |
| `compass-ik-reset` | `{"status":"succeeded","target":"preview"}` |

This run executed the **strengthened** assertions added the same day: explicit
`halfAngleForType` mapping checks with medium (4-sector) and close (2-sector)
footprints; non-trivial drag displacement (>10 cm) required; all 12 `Sector<i>`
markers asserted present (a missing marker fails loudly instead of reading as a
gap); IK-reset precondition asserts the wedge actually left its tray slot
(>5 cm); boundary-clamp bound tightened to the 156 cm constant.

Post-reset tray positions verified by runtime query in the same session:
Wedge1 (−40, 0, 150), Wedge2 (0, 0, 150), Wedge3 (40, 0, 150) — exact, after the
clamp fix (previously clamped to ±39.94/149.77 because the authored tray radius
155.24 cm exceeded the old 155 cm clamp).
