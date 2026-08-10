import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario"
import { expect } from "Leaf.lspkg/Utils/common/Expect"
import {
  ACTIVE_RADIUS_CM,
  WedgeInput,
  angularDistanceDeg,
  computeSectors,
  coveredCount,
  isComplete,
  lineViolations,
} from "./CoverageEngine"

function wedge(bearingDeg: number, halfAngleDeg: number, distanceCm: number): WedgeInput {
  return { bearingDeg: bearingDeg, halfAngleDeg: halfAngleDeg, distanceCm: distanceCm }
}

/**
 * Pure-math regression scenario for the coverage engine — the core of the Lens.
 * No scene interaction; deterministic by construction.
 */
@component
export class CompassEngineScenario extends Scenario {
  async run(): Promise<void> {
    // Empty input → all 12 sectors are gaps, not complete.
    const empty = computeSectors([])
    expect(empty.length).toBe(12)
    expect(coveredCount(empty)).toBe(0)
    expect(isComplete(empty)).toBe(false)

    // Single wide (±45°) at bearing 0 covers exactly the 6 central sectors
    // (centers -37.5° … +37.5°), leaving 3 gaps on each flank.
    const oneWide = computeSectors([wedge(0, 45, 100)])
    expect(coveredCount(oneWide)).toBe(6)
    expect(oneWide[2]).toBe(false)
    expect(oneWide[3]).toBe(true)
    expect(oneWide[8]).toBe(true)
    expect(oneWide[9]).toBe(false)
    expect(isComplete(oneWide)).toBe(false)

    // Two wides at ±45° tile the whole working arc → complete.
    const twoWides = computeSectors([wedge(-45, 45, 100), wedge(45, 45, 100)])
    expect(coveredCount(twoWides)).toBe(12)
    expect(isComplete(twoWides)).toBe(true)

    // A wedge BEHIND the axis line contributes nothing and raises a violation.
    const behind = [wedge(135, 45, 100)]
    expect(coveredCount(computeSectors(behind))).toBe(0)
    expect(lineViolations(behind).length).toBe(1)

    // A front-side wedge raises no violation.
    expect(lineViolations([wedge(30, 30, 100)]).length).toBe(0)

    // Tray-distance wedges are inactive: no coverage AND no violation,
    // even behind the line.
    const trayFar = ACTIVE_RADIUS_CM + 20
    expect(coveredCount(computeSectors([wedge(0, 45, trayFar)]))).toBe(0)
    expect(lineViolations([wedge(135, 45, trayFar)]).length).toBe(0)

    // Angular distance wraps correctly.
    expect(angularDistanceDeg(-170, 170)).toBeCloseTo(20, 5)
    expect(angularDistanceDeg(0, 90)).toBeCloseTo(90, 5)

    print("[LEAF] CompassEngineScenario passed")
  }
}
