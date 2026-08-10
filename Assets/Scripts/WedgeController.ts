import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import { buildWedgeMesh } from "./WedgeMeshFactory"
import { ShotType, SHOT_TYPES, halfAngleForType } from "./CoverageEngine"

const TAP_MAX_TRAVEL_CM = 2.0
/** Wedges may not leave the rehearsal floor. */
const MAX_RADIUS_CM = 155

/**
 * One camera wedge: builds its own mesh, collider, and SIK interaction stack.
 * Drag to place (floor-constrained, yaws to face the subject); a pinch that
 * travels < 2 cm is a TAP and cycles the shot type (wide → medium → close),
 * which changes the wedge's footprint scale and coverage half-angle.
 */
@component
export class WedgeController extends BaseScriptComponent {
  @input
  wedgeMaterial: Material

  @input
  @hint("Initial shot type: wide | medium | close")
  initialType: string = "wide"

  public onChanged: Event<void> = new Event<void>()

  private manipulating: boolean = false
  private grabStartPos: vec3 | null = null
  private shotTypeIndex: number = 0

  onAwake(): void {
    const idx = SHOT_TYPES.indexOf(this.initialType as ShotType)
    this.shotTypeIndex = idx >= 0 ? idx : 0

    const rmv = this.sceneObject.createComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    rmv.mesh = buildWedgeMesh()
    rmv.mainMaterial = this.wedgeMaterial

    const collider = this.sceneObject.createComponent(
      "Physics.ColliderComponent"
    ) as ColliderComponent
    const box = Shape.createBoxShape()
    box.size = new vec3(22, 12, 28)
    collider.shape = box

    this.sceneObject.createComponent(Interactable.getTypeName())
    const manip = this.sceneObject.createComponent(
      InteractableManipulation.getTypeName()
    ) as InteractableManipulation

    this.createEvent("OnStartEvent").bind(() => {
      manip.onManipulationStart.add(() => {
        this.manipulating = true
        this.grabStartPos = this.getTransform().getLocalPosition()
      })
      manip.onManipulationEnd.add(() => {
        this.manipulating = false
        this.constrain()
        const end = this.getTransform().getLocalPosition()
        if (
          this.grabStartPos !== null &&
          end.distance(this.grabStartPos) < TAP_MAX_TRAVEL_CM
        ) {
          this.cycleShotType()
        }
        this.grabStartPos = null
        this.onChanged.invoke()
      })
    })

    this.createEvent("UpdateEvent").bind(() => {
      if (this.manipulating) {
        this.constrain()
        this.onChanged.invoke()
      }
    })

    this.applyTypeVisual()
  }

  public get shotType(): ShotType {
    return SHOT_TYPES[this.shotTypeIndex]
  }

  public get halfAngleDeg(): number {
    return halfAngleForType(this.shotType)
  }

  /** Restore a saved state (persistence). Local position + type. */
  public setState(localPos: vec3, type: string): void {
    const idx = SHOT_TYPES.indexOf(type as ShotType)
    if (idx >= 0) {
      this.shotTypeIndex = idx
    }
    this.getTransform().setLocalPosition(localPos)
    this.applyTypeVisual()
    this.constrain()
  }

  public resetTo(localPos: vec3, type: string): void {
    this.setState(localPos, type)
    this.getTransform().setLocalRotation(quat.quatIdentity())
  }

  private cycleShotType(): void {
    this.shotTypeIndex = (this.shotTypeIndex + 1) % SHOT_TYPES.length
    this.applyTypeVisual()
    console.log("[Wedge] " + this.sceneObject.name + " → " + this.shotType)
  }

  private applyTypeVisual(): void {
    // Footprint scale communicates coverage width without any text.
    const s = this.shotType === "wide" ? 1.25 : this.shotType === "medium" ? 1.0 : 0.72
    this.getTransform().setLocalScale(new vec3(s, 1, s))
  }

  /**
   * Clamp to the compass floor plane, keep the wedge on the rehearsal floor
   * (far-field manipulation can fling objects meters away otherwise), and
   * face the subject at the local origin.
   */
  private constrain(): void {
    const t = this.getTransform()
    let p = t.getLocalPosition()
    let dirty = Math.abs(p.y) > 0.01
    const radius = Math.sqrt(p.x * p.x + p.z * p.z)
    if (radius > MAX_RADIUS_CM) {
      const k = MAX_RADIUS_CM / radius
      p = new vec3(p.x * k, 0, p.z * k)
      dirty = true
    }
    if (dirty) {
      t.setLocalPosition(new vec3(p.x, 0, p.z))
    }
    const yawRad = Math.atan2(p.x, p.z)
    t.setLocalRotation(quat.fromEulerAngles(0, yawRad, 0))
  }
}
