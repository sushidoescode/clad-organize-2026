import { Scenario } from "Leaf.lspkg/Scenarios/scenario/Scenario"
import { expect } from "Leaf.lspkg/Utils/common/Expect"
import { sleep } from "Leaf.lspkg/Utils/common/Utils"
import { DefaultLeafInteractor } from "Leaf.lspkg/Interactors/interactor/DefaultLeafInteractor"
import { findInteractablesByName } from "Leaf.lspkg/Interactors/InteractableUtils"
import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils"
import { WedgeController } from "./WedgeController"
import { countRaisedSectors, stepDrag, wedgeLocalPos } from "./CompassLeafUtils"

const STORE_KEY = "scc_layout_v1"

/**
 * Persistence round-trip: a wedge move triggers the debounced save; the stored
 * JSON must mirror live wedge state (position + shot type). Reset clears it.
 */
@component
export class CompassPersistenceScenario extends Scenario {
  async run(): Promise<void> {
    await sleep(1000)
    const interactor = new DefaultLeafInteractor()

    // Any real wedge movement fires the debounced save — landing position
    // is irrelevant to this scenario.
    const wedge2 = findInteractablesByName("Wedge2", undefined, true)[0]
    if (!wedge2) {
      throw new Error("Wedge2 interactable not found")
    }
    await stepDrag(interactor, wedge2, new vec3(0.3, 0, -1), 3, sleep)
    // Wait out the 0.5 s save debounce.
    await sleep(1100)

    const raw = global.persistentStorageSystem.store.getString(STORE_KEY)
    expect(raw.length).toBeGreaterThan(2)
    const saved = JSON.parse(raw) as { x: number; z: number; t: string }[]
    expect(saved.length).toBe(3)

    // Stored entry 1 mirrors Wedge2's live local position and shot type.
    const livePos = wedgeLocalPos("Wedge2")
    expect(livePos).not.toBeNull()
    expect(saved[1].x).toBeCloseTo(livePos!.x, 0)
    expect(saved[1].z).toBeCloseTo(livePos!.z, 0)
    const w2 = findSceneObjectByName("Wedge2").getComponent(
      WedgeController.getTypeName()
    ) as WedgeController
    expect(saved[1].t).toBe(w2.shotType)

    // Reset clears the persisted layout and empties the arc.
    const resetBtn = findInteractablesByName("Item", undefined, true)[0]
    await interactor.trigger(resetBtn)
    await sleep(400)
    expect(global.persistentStorageSystem.store.getString(STORE_KEY).length).toBe(0)
    expect(countRaisedSectors()).toBe(0)

    print("[LEAF] CompassPersistenceScenario passed")
  }
}
