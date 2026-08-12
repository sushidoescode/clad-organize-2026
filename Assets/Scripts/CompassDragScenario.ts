import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario"
import { expect } from "Leaf.lspkg/Utils/common/Expect"
import { findSceneObjectByName, sleep } from "Leaf.lspkg/Utils/common/Utils"
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import { findInteractablesByName } from "Leaf.lspkg/Interactors/InteractableUtils"
import { WedgeController } from "./WedgeController"
import {
  WedgeInput,
  bearingSignedDeg,
  computeSectors,
  coveredCount,
  planarDistanceCm,
} from "./CoverageEngine"
import {
  assertAllSectorMarkersPresent,
  countRaisedSectors,
  raisedSectorFlags,
  stepDrag,
  wedgeLocalPos,
} from "./CompassLeafUtils"

const ORIGIN = new vec3(0, 0, 0)
const WEDGE_NAMES = ["Wedge1", "Wedge2", "Wedge3"]

/**
 * Interaction contract: after REAL simulated manipulation lands a wedge
 * wherever SIK far-field amplification puts it, three invariants must hold:
 *  1. the wedge stays on the floor plane (y = 0 local),
 *  2. the wedge stays on the rehearsal floor (boundary clamp <= 155 cm),
 *  3. the ring displays EXACTLY what CoverageEngine derives from the live
 *     wedge positions — per-sector view/engine consistency.
 */
@component
export class CompassDragScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1500)
    const interactor = new DefaultLeafInteractor()

    // Normalize state (the reset control is the only UIKit button).
    const resetBtn = findInteractablesByName("Item", undefined, true)[0]
    if (!resetBtn) {
      throw new Error("Reset button not found")
    }
    await interactor.trigger(resetBtn)
    await sleep(400)
    assertAllSectorMarkersPresent()
    expect(countRaisedSectors()).toBe(0)

    // Real manipulation — landing position deliberately unpredicted, but the
    // drag must MOVE the wedge (a no-op pass must not count as coverage).
    const wedge1 = findInteractablesByName("Wedge1", undefined, true)[0]
    if (!wedge1) {
      throw new Error("Wedge1 interactable not found")
    }
    const startPos = wedgeLocalPos("Wedge1")
    expect(startPos).not.toBeNull()
    await stepDrag(interactor, wedge1, new vec3(0, 0, -1), 6, sleep)
    await sleep(400)

    // Invariant 1 + 2: floor plane and boundary clamp — and real displacement.
    const pos = wedgeLocalPos("Wedge1")
    expect(pos).not.toBeNull()
    expect(pos!.y).toBeCloseTo(0, 1)
    const radius = Math.sqrt(pos!.x * pos!.x + pos!.z * pos!.z)
    expect(radius).toBeLessThan(156.6)
    const displacement = pos!.distance(startPos!)
    expect(displacement).toBeGreaterThan(10)

    // Invariant 3: the ring shows exactly what the engine derives from the
    // live wedge state — for every sector.
    const inputs: WedgeInput[] = []
    for (let i = 0; i < WEDGE_NAMES.length; i++) {
      const obj = findSceneObjectByName(WEDGE_NAMES[i])
      const wc = obj.getComponent(WedgeController.getTypeName()) as WedgeController
      const p = obj.getTransform().getLocalPosition()
      inputs.push({
        bearingDeg: bearingSignedDeg(ORIGIN, p),
        halfAngleDeg: wc.halfAngleDeg,
        distanceCm: planarDistanceCm(ORIGIN, p),
      })
    }
    const expected = computeSectors(inputs)
    const shown = raisedSectorFlags()
    for (let i = 0; i < 12; i++) {
      expect(shown[i]).toBe(expected[i])
    }
    expect(countRaisedSectors()).toBe(coveredCount(expected))

    print(
      "[LEAF] CompassDragScenario passed (view==engine for " +
        coveredCount(expected) +
        " covered sectors)"
    )
  }
}
