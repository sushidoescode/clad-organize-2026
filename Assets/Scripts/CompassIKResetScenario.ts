import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario"
import { expect } from "Leaf.lspkg/Utils/common/Expect"
import { sleep } from "Leaf.lspkg/Utils/common/Utils"
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import { findInteractablesByName } from "Leaf.lspkg/Interactors/InteractableUtils"
import { createIKInteractor } from "Leaf.lspkg/Interactors/interactor/ik/visualizer/BitmojiAvatar"
import { countRaisedSectors, stepDrag, wedgeLocalPos } from "./CompassLeafUtils"

/**
 * Reachability check: a physically-simulated user (IK arm + head) must be able
 * to reach and press the Reset button. A trigger that fails to converge is a
 * real UI-placement finding, not a test bug.
 */
@component
export class CompassIKResetScenario extends Scenario {
  private readonly _ik = createIKInteractor()

  async run(): Promise<void> {
    await sleep(1200)

    // Precondition: displace Wedge3 so Reset has observable work to do.
    const setup = new DefaultLeafInteractor()
    const wedge3 = findInteractablesByName("Wedge3", undefined, true)[0]
    if (!wedge3) {
      throw new Error("Wedge3 interactable not found")
    }
    await stepDrag(setup, wedge3, new vec3(-0.3, 0, -1), 3, sleep)
    await sleep(300)
    const displaced = wedgeLocalPos("Wedge3")
    expect(displaced).not.toBeNull()
    // The precondition must be real: Wedge3 actually left its tray slot.
    const trayDist = Math.sqrt(
      (displaced!.x - 40) * (displaced!.x - 40) +
        (displaced!.z - 150) * (displaced!.z - 150)
    )
    expect(trayDist).toBeGreaterThan(5)

    // IK-reach the Reset button the way a real user would — the trigger
    // converging on it IS the reachability check.
    const resetBtn = findInteractablesByName("Item", undefined, true)[0]
    if (!resetBtn) {
      throw new Error("Reset button not found")
    }
    await this._ik.trigger(resetBtn)
    await sleep(500)

    // Reset restored all three wedges to their tray slots and emptied the arc.
    expect(countRaisedSectors()).toBe(0)
    const w1 = wedgeLocalPos("Wedge1")
    const w2 = wedgeLocalPos("Wedge2")
    const w3 = wedgeLocalPos("Wedge3")
    expect(w1!.z).toBeCloseTo(150, 0)
    expect(w2!.z).toBeCloseTo(150, 0)
    expect(w3!.z).toBeCloseTo(150, 0)
    expect(w1!.x).toBeCloseTo(-40, 0)
    expect(w3!.x).toBeCloseTo(40, 0)

    print("[LEAF] CompassIKResetScenario passed (reached Reset via IK)")
  }
}
