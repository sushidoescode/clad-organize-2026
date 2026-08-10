import { RingView } from "./RingView"
import { WedgeController } from "./WedgeController"
import { CompassUI } from "./CompassUI"
import {
  WedgeInput,
  bearingSignedDeg,
  computeSectors,
  coveredCount,
  isComplete,
  lineViolations,
  planarDistanceCm,
  SECTOR_COUNT,
} from "./CoverageEngine"

const STORE_KEY = "scc_layout_v1"
const TRAY_TYPES: string[] = ["wide", "medium", "close"]

interface SavedWedge {
  x: number
  z: number
  t: string
}

/**
 * The only stateful coordinator. Discovers children by name (SubjectMark,
 * CoverageRing, Wedges, Line180, CompassUI), derives coverage via
 * CoverageEngine, renders via RingView, warns on axis-line crossings,
 * and persists the layout across sessions.
 */
@component
export class CompassRoot extends BaseScriptComponent {
  private ringView: RingView | null = null
  private subject: SceneObject | null = null
  private wedges: WedgeController[] = []
  private trayPositions: vec3[] = []
  private ui: CompassUI | null = null

  private lineVisual: RenderMeshVisual | null = null
  private lineSlateMat: Material | null = null
  private lineAmberMat: Material | null = null

  private lastComplete: boolean = false
  private lastViolationCount: number = 0
  private lastCovered: number = -1

  private saveEvent: DelayedCallbackEvent | null = null

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

    const lineObj = this.findChild("Line180")
    if (lineObj) {
      this.lineVisual = lineObj.getComponent(
        "Component.RenderMeshVisual"
      ) as RenderMeshVisual
      if (this.lineVisual) {
        this.lineSlateMat = this.lineVisual.mainMaterial.clone()
        this.lineSlateMat.mainPass.baseColor = new vec4(0.42, 0.45, 0.5, 1.0)
        this.lineAmberMat = this.lineSlateMat.clone()
        this.lineAmberMat.mainPass.baseColor = new vec4(0.98, 0.65, 0.12, 1.0)
        this.lineVisual.mainMaterial = this.lineSlateMat
      }
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
        wc.onChanged.add(() => this.onWedgeChanged())
      }
    }

    const uiObj = this.findChild("CompassUI")
    if (uiObj) {
      this.ui = uiObj.getComponent(CompassUI.getTypeName()) as CompassUI
      if (this.ui) {
        this.ui.onReset.add(() => this.reset())
      }
    }

    this.saveEvent = this.createEvent("DelayedCallbackEvent")
    this.saveEvent.bind(() => this.saveLayout())

    this.restoreLayout()

    console.log("[CompassRoot] Ready. wedges=" + this.wedges.length)
    this.recompute()
  }

  private onWedgeChanged(): void {
    this.recompute()
    if (this.saveEvent) {
      this.saveEvent.reset(0.5)
    }
  }

  public recompute(): void {
    if (!this.ringView || !this.subject) {
      return
    }
    const subjectPos = this.subject.getTransform().getWorldPosition()
    const inputs: WedgeInput[] = []
    for (let i = 0; i < this.wedges.length; i++) {
      const wPos = this.wedges[i].getTransform().getWorldPosition()
      inputs.push({
        bearingDeg: bearingSignedDeg(subjectPos, wPos),
        halfAngleDeg: this.wedges[i].halfAngleDeg,
        distanceCm: planarDistanceCm(subjectPos, wPos),
      })
    }

    const sectors = computeSectors(inputs)
    this.ringView.apply(sectors)

    const violations = lineViolations(inputs)
    if (this.lineVisual && this.lineSlateMat && this.lineAmberMat) {
      this.lineVisual.mainMaterial =
        violations.length > 0 ? this.lineAmberMat : this.lineSlateMat
    }
    if (violations.length !== this.lastViolationCount) {
      if (violations.length > this.lastViolationCount) {
        console.log("[Coverage] LINE CROSSED — wedge behind the axis line")
      }
      this.lastViolationCount = violations.length
    }

    const covered = coveredCount(sectors)
    const complete = isComplete(sectors)
    if (this.ui) {
      this.ui.setStatus(covered, SECTOR_COUNT, complete, violations.length > 0)
    }
    if (complete && !this.lastComplete) {
      console.log("[Coverage] COMPLETE — full working arc covered")
    } else if (!complete && this.lastComplete) {
      console.log("[Coverage] gap opened — covered " + covered + "/" + SECTOR_COUNT)
    }
    this.lastComplete = complete
    this.lastCovered = covered
  }

  public reset(): void {
    for (let i = 0; i < this.wedges.length; i++) {
      this.wedges[i].resetTo(
        this.trayPositions[i],
        TRAY_TYPES[i % TRAY_TYPES.length]
      )
    }
    this.clearSaved()
    this.recompute()
    console.log("[CompassRoot] Reset to tray")
  }

  // ---- persistence ----

  private saveLayout(): void {
    const saved: SavedWedge[] = []
    for (let i = 0; i < this.wedges.length; i++) {
      const p = this.wedges[i].getTransform().getLocalPosition()
      saved.push({ x: p.x, z: p.z, t: this.wedges[i].shotType })
    }
    global.persistentStorageSystem.store.putString(
      STORE_KEY,
      JSON.stringify(saved)
    )
    console.log("[CompassRoot] Layout saved")
  }

  private restoreLayout(): void {
    const raw = global.persistentStorageSystem.store.getString(STORE_KEY)
    if (!raw || raw.length === 0) {
      return
    }
    try {
      const saved = JSON.parse(raw) as SavedWedge[]
      const n = Math.min(saved.length, this.wedges.length)
      for (let i = 0; i < n; i++) {
        this.wedges[i].setState(new vec3(saved[i].x, 0, saved[i].z), saved[i].t)
      }
      console.log("[CompassRoot] Layout restored (" + n + " wedges)")
    } catch (e) {
      console.warn("[CompassRoot] Corrupt saved layout ignored")
    }
  }

  private clearSaved(): void {
    global.persistentStorageSystem.store.putString(STORE_KEY, "")
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
