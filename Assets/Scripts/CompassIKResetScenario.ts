import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario"
import { expect } from "Leaf.lspkg/Utils/common/Expect"
import { sleep } from "Leaf.lspkg/Utils/common/Utils"
import { findInteractablesByName } from "Leaf.lspkg/Interactors/InteractableUtils"
import { createIKInteractor } from "Leaf.lspkg/Interactors/interactor/ik/visualizer/BitmojiAvatar"
import { countRaisedSectors } from "./CompassLeafUtils"

/**
 * UI reachability PROBE (id: compass-ik-reach) — NOT part of the deterministic
 * core gate. A physically-simulated user (IK arm + head) reaches for and
 * presses the Reset button; the trigger converging on it demonstrates the
 * panel is placed within comfortable reach.
 *
 * Environment sensitivity, disclosed: the preview's IK rig has an infra flake
 * — under repeated back-to-back runs it can stop registering triggers
 * entirely, and the LEAF runner fails any scenario containing a failed
 * interaction regardless of assertions (observed and diagnosed 2026-08-13;
 * external audit measured ~4/6 pass under repetition). A failure of THIS
 * scenario on a wedged rig says nothing about the Lens; re-run after a
 * preview refresh. Reset CORRECTNESS is asserted deterministically in
 * compass-reset, which never uses the IK rig.
 */
@component
export class CompassIKResetScenario extends Scenario {
  private readonly _ik = createIKInteractor()

  async run(): Promise<void> {
    await sleep(1200)

    const resetBtn = findInteractablesByName("Item", undefined, true)[0]
    if (!resetBtn) {
      throw new Error("Reset button not found")
    }
    await this._ik.trigger(resetBtn)
    await sleep(700)

    // The reach registering is the probe's result; the arc must be clean
    // afterward (Reset pressed → all gaps).
    expect(countRaisedSectors()).toBe(0)

    print("[LEAF] CompassIKReachScenario passed (Reset physically reached via IK)")
  }
}
