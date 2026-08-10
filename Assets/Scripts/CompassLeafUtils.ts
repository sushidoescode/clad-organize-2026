import { findSceneObjectByName } from "Leaf.lspkg/Utils/common/Utils"
import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"

/**
 * Shared observables for Compass LEAF scenarios.
 * Covered sectors are raised to local y=2 by RingView (state is never
 * color-alone), so the raised set IS the covered set — an observable
 * assertion that needs no access to view internals.
 */
export function raisedSectorFlags(): boolean[] {
  const flags: boolean[] = []
  for (let i = 0; i < 12; i++) {
    const s = findSceneObjectByName("Sector" + i)
    flags.push(s !== null && s.getTransform().getLocalPosition().y > 1)
  }
  return flags
}

export function countRaisedSectors(): number {
  const flags = raisedSectorFlags()
  let raised = 0
  for (let i = 0; i < flags.length; i++) {
    if (flags[i]) {
      raised++
    }
  }
  return raised
}

export function wedgeLocalPos(name: string): vec3 | null {
  const w = findSceneObjectByName(name)
  return w ? w.getTransform().getLocalPosition() : null
}

/**
 * Apply n small simulated drag steps to a wedge. Where the wedge lands is
 * deliberately NOT predicted — SIK far-field manipulation amplifies hand
 * deltas by ray distance, so scenarios assert invariants that must hold for
 * ANY landing position (floor plane, boundary clamp, view↔engine consistency)
 * instead of a scripted destination.
 */
export async function stepDrag(
  interactor: { drag(i: Interactable, v: vec3, ms: number): Promise<void> },
  wedge: Interactable,
  stepVec: vec3,
  steps: number,
  sleepFn: (ms: number) => Promise<void>
): Promise<void> {
  for (let s = 0; s < steps; s++) {
    await interactor.drag(wedge, stepVec, 150)
    await sleepFn(120)
  }
}
