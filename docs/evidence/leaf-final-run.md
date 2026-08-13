# LEAF Final Run Record

- **Date/time:** 2026-08-13, ~01:55–02:01 local (America/Los_Angeles)
- **Environment:** Lens Studio 5.23.1.26080420, SPECS 27 interactive preview, LEAF 2.0.2, execution target: preview
- **Build state:** post external-audit hardening (deterministic reset scenario split from the IK probe) — committed as the same commit that updates this file
- **Runner:** `run_leaf_scenario` (Lens Studio MCP LEAF tools), one scenario per call

## Core gate (deterministic — 4 scenarios)

| Scenario ID | Result |
|---|---|
| `compass-engine-math` | `{"status":"succeeded","target":"preview"}` |
| `compass-drag-coverage` | `{"status":"succeeded","target":"preview"}` |
| `compass-persistence` | `{"status":"succeeded","target":"preview"}` |
| `compass-reset` | `{"status":"succeeded","target":"preview"}` — **and 3× consecutively** in the same session (the repetition pattern that exposed the old scenario's flakiness) |

## Reachability probe (environment-sensitive — disclosed)

| Scenario ID | Result |
|---|---|
| `compass-ik-reach` | `{"status":"succeeded","target":"preview"}` after a preview refresh |

**Intermittency disclosure (found by external audit, root-caused 2026-08-13):** the
former `compass-ik-reset` scenario failed ~2/6 runs. Cause: the preview's IK rig
(a physical simulation) can miss a trigger or wedge entirely under repeated
back-to-back runs, and the LEAF runner fails any scenario containing a failed
interaction regardless of its assertions — observed directly: a run whose
fallback path pressed Reset and passed every assertion was still failed by the
runner with `Error: Failed interactions detected`. Reset correctness therefore
now lives in the deterministic `compass-reset` (standard interactor, strict
exact-tray assertions), and the IK reach is a separate labeled probe whose
failure indicates simulator state, not Lens behavior (refresh the preview and
re-run).

## Assertion strength (added E8–E9)

Explicit `halfAngleForType` mapping checks with medium (4-sector) and close
(2-sector) footprints; non-trivial drag displacement (>10 cm) required; all 12
`Sector<i>` markers asserted present (a missing marker fails loudly instead of
reading as a gap); reset precondition asserts the wedge actually left its tray
slot (>5 cm); drag boundary bound `radius < 156.6 cm` (clamp constant 156 cm +
0.6 margin). Post-reset tray positions verified by runtime query: exactly
(−40, 0, 150) / (0, 0, 150) / (40, 0, 150).
