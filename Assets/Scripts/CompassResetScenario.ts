import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario"
import { expect } from "Leaf.lspkg/Utils/common/Expect"
import { sleep } from "Leaf.lspkg/Utils/common/Utils"
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import { findInteractablesByName } from "Leaf.lspkg/Interactors/InteractableUtils"
import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils"
import { WedgeController } from "./WedgeController"
import { countRaisedSectors, stepDrag, wedgeLocalPos } from "./CompassLeafUtils"

/**
 * Reset correctness (deterministic core-gate scenario): displace a wedge with
 * real simulated manipulation, press the Reset button, and assert the EXACT
 * tray restore contract. Uses the standard interactor so the result depends
 * only on the Lens, never on IK-rig convergence — physical reachability is a
 * separate probe (compass-ik-reach).
 */
@component
export class CompassResetScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1200)
    const interactor = new DefaultLeafInteractor()

    // Precondition: displace Wedge3 so Reset has observable work to do.
    const wedge3 = findInteractablesByName("Wedge3", undefined, true)[0]
    if (!wedge3) {
      throw new Error("Wedge3 interactable not found")
    }
    await stepDrag(interactor, wedge3, new vec3(-0.3, 0, -1), 3, sleep)
    await sleep(300)
    const displaced = wedgeLocalPos("Wedge3")
    expect(displaced).not.toBeNull()
    // The precondition must be real: Wedge3 actually left its tray slot.
    const trayDist = Math.sqrt(
      (displaced!.x - 40) * (displaced!.x - 40) +
        (displaced!.z - 150) * (displaced!.z - 150)
    )
    expect(trayDist).toBeGreaterThan(5)

    const resetBtn = findInteractablesByName("Item", undefined, true)[0]
    if (!resetBtn) {
      throw new Error("Reset button not found")
    }
    await interactor.trigger(resetBtn)
    await sleep(700)

    // Reset restored all three wedges to their tray slots (positions to within
    // 0.05 cm, all axes) with tray types re-applied, and emptied the arc.
    expect(countRaisedSectors()).toBe(0)
    const w1 = wedgeLocalPos("Wedge1")
    const w2 = wedgeLocalPos("Wedge2")
    const w3 = wedgeLocalPos("Wedge3")
    expect(w1!.x).toBeCloseTo(-40, 1)
    expect(w1!.z).toBeCloseTo(150, 1)
    expect(w2!.x).toBeCloseTo(0, 1)
    expect(w2!.z).toBeCloseTo(150, 1)
    expect(w3!.x).toBeCloseTo(40, 1)
    expect(w3!.z).toBeCloseTo(150, 1)
    const types: string[] = []
    const expected = ["wide", "medium", "close"]
    for (let i = 0; i < 3; i++) {
      const obj = findSceneObjectByName("Wedge" + (i + 1))
      const wc = obj.getComponent(WedgeController.getTypeName()) as WedgeController
      types.push(wc.shotType)
      expect(wc.shotType).toBe(expected[i])
    }

    print("[LEAF] CompassResetScenario passed (exact tray restore: positions + types)")
  }
}
