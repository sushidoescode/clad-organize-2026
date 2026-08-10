import { RingView } from "./RingView"
import { WedgeController } from "./WedgeController"
import { CompassUI } from "./CompassUI"
import {
  ACTIVE_RADIUS_CM,
  bearingDeg,
  computeSectors,
  coveredCount,
  isComplete,
  planarDistanceCm,
} from "./CoverageEngine"

/**
 * The only stateful coordinator. Discovers its children by name
 * (SubjectMark, CoverageRing, Wedges), subscribes to wedge movement,
 * derives coverage via CoverageEngine, and pushes it to RingView.
 */
@component
export class CompassRoot extends BaseScriptComponent {
  private ringView: RingView | null = null
  private subject: SceneObject | null = null
  private wedges: WedgeController[] = []
  private trayPositions: vec3[] = []
  private lastComplete: boolean = false

  onAwake(): void {
    this.createEvent("OnStartEvent").bind(() => this.start())
  }

  private start(): void {
    const ringObj = this.findChild("CoverageRing")
    this.subject = this.findChild("SubjectMark")
    const wedgesParent = this.findChild("Wedges")
    if (!ringObj || !this.subject || !wedgesParent) {
      console.error(
        "[CompassRoot] Missing required children (CoverageRing / SubjectMark / Wedges)"
      )
      return
    }
    this.ringView = ringObj.getComponent(RingView.getTypeName()) as RingView
    if (!this.ringView) {
      console.error("[CompassRoot] CoverageRing has no RingView component")
      return
    }

    const count = wedgesParent.getChildrenCount()
    for (let i = 0; i < count; i++) {
      const child = wedgesParent.getChild(i)
      const wc = child.getComponent(
        WedgeController.getTypeName()
      ) as WedgeController
      if (wc) {
        this.wedges.push(wc)
        this.trayPositions.push(child.getTransform().getLocalPosition())
        wc.onMoved.add(() => this.recompute())
      }
    }
    const uiObj = this.findChild("CompassUI")
    if (uiObj) {
      const ui = uiObj.getComponent(CompassUI.getTypeName()) as CompassUI
      if (ui) {
        ui.onReset.add(() => this.reset())
      }
    }

    console.log(
      "[CompassRoot] Ready. wedges=" +
        this.wedges.length +
        " sectors=" +
        "24"
    )
    this.recompute()
  }

  public recompute(): void {
    if (!this.ringView || !this.subject) {
      return
    }
    const subjectPos = this.subject.getTransform().getWorldPosition()
    const bearings: number[] = []
    for (let i = 0; i < this.wedges.length; i++) {
      const wPos = this.wedges[i].getTransform().getWorldPosition()
      if (planarDistanceCm(subjectPos, wPos) <= ACTIVE_RADIUS_CM) {
        bearings.push(bearingDeg(subjectPos, wPos))
      }
    }
    const sectors = computeSectors(bearings)
    this.ringView.apply(sectors)

    const complete = isComplete(sectors)
    if (complete && !this.lastComplete) {
      console.log("[Coverage] COMPLETE — all sectors covered")
    } else if (!complete && this.lastComplete) {
      console.log(
        "[Coverage] gap opened — covered " + coveredCount(sectors) + "/24"
      )
    }
    this.lastComplete = complete
  }

  public reset(): void {
    for (let i = 0; i < this.wedges.length; i++) {
      this.wedges[i]
        .getTransform()
        .setLocalPosition(this.trayPositions[i])
      this.wedges[i].getTransform().setLocalRotation(quat.quatIdentity())
    }
    this.recompute()
    console.log("[CompassRoot] Reset to tray")
  }

  private findChild(name: string): SceneObject | null {
    const count = this.sceneObject.getChildrenCount()
    for (let i = 0; i < count; i++) {
      const child = this.sceneObject.getChild(i)
      if (child.name === name) {
        return child
      }
    }
    return null
  }
}
