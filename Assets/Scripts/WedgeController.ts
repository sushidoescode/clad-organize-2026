import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import { buildWedgeMesh } from "./WedgeMeshFactory"
import { ShotType, SHOT_TYPES, halfAngleForType } from "./CoverageEngine"

const TAP_MAX_TRAVEL_CM = 2.0
/**
 * Wedges may not leave the rehearsal floor. Must exceed the tray radius
 * (|(±40, 150)| = 155.24 cm) so Reset restores the authored tray coordinates
 * EXACTLY instead of clamping them.
 */
const MAX_RADIUS_CM = 156

// Etched Light Meter: shot type is triple-coded — luminous per-type color,
// footprint scale, and a floating label. Indexed in SHOT_TYPES order.
const TYPE_COLORS: vec4[] = [
  new vec4(0.271, 0.839, 1.0, 1.0), // wide   — optics cyan
  new vec4(0.616, 0.545, 1.0, 1.0), // medium — viewfinder violet
  new vec4(1.0, 0.788, 0.302, 1.0), // close  — tungsten gold
]
const TYPE_LABELS: string[] = ["WIDE 24mm", "MED 50mm", "CLOSE 85mm"]
const LABEL_IVORY = new vec4(0.937, 0.902, 0.839, 0.95)

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
  private maxTravelCm: number = 0
  private shotTypeIndex: number = 0
  private rmv: RenderMeshVisual | null = null
  private typeMats: Material[] = []
  private hoverMats: Material[] = []
  private hovered: boolean = false
  private label: Text | null = null
  private labelTransform: Transform | null = null

  onAwake(): void {
    const idx = SHOT_TYPES.indexOf(this.initialType as ShotType)
    this.shotTypeIndex = idx >= 0 ? idx : 0

    const rmv = this.sceneObject.createComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    rmv.mesh = buildWedgeMesh()
    for (let i = 0; i < SHOT_TYPES.length; i++) {
      const m = this.wedgeMaterial.clone()
      m.mainPass.baseColor = TYPE_COLORS[i]
      this.typeMats.push(m)
      // Hover affordance: same hue pushed toward white.
      const h = this.wedgeMaterial.clone()
      const c = TYPE_COLORS[i]
      h.mainPass.baseColor = new vec4(
        c.x + (1 - c.x) * 0.45,
        c.y + (1 - c.y) * 0.45,
        c.z + (1 - c.z) * 0.45,
        c.w
      )
      this.hoverMats.push(h)
    }
    rmv.mainMaterial = this.typeMats[this.shotTypeIndex]
    this.rmv = rmv

    const labelObj = global.scene.createSceneObject("TypeLabel")
    labelObj.setParent(this.sceneObject)
    labelObj.getTransform().setLocalPosition(new vec3(0, 16, 0))
    const labelText = labelObj.createComponent("Component.Text") as Text
    labelText.text = TYPE_LABELS[this.shotTypeIndex]
    labelText.size = 60
    labelText.depthTest = true
    labelText.horizontalOverflow = HorizontalOverflow.Overflow
    labelText.textFill.color = LABEL_IVORY
    labelObj.createComponent(Billboard.getTypeName())
    this.label = labelText
    this.labelTransform = labelObj.getTransform()

    const collider = this.sceneObject.createComponent(
      "Physics.ColliderComponent"
    ) as ColliderComponent
    const box = Shape.createBoxShape()
    box.size = new vec3(22, 12, 28)
    collider.shape = box

    const interactable = this.sceneObject.createComponent(
      Interactable.getTypeName()
    ) as Interactable
    const manip = this.sceneObject.createComponent(
      InteractableManipulation.getTypeName()
    ) as InteractableManipulation

    this.createEvent("OnStartEvent").bind(() => {
      interactable.onHoverEnter.add(() => {
        this.hovered = true
        this.refreshMaterial()
      })
      interactable.onHoverExit.add(() => {
        this.hovered = false
        this.refreshMaterial()
      })
      manip.onManipulationStart.add(() => {
        this.manipulating = true
        this.grabStartPos = this.getTransform().getLocalPosition()
        this.maxTravelCm = 0
      })
      manip.onManipulationEnd.add(() => {
        this.manipulating = false
        this.constrain()
        // Tap = the wedge never traveled meaningfully at ANY point during the
        // grab — an out-and-back or clamped drag is a drag, not a tap.
        if (this.grabStartPos !== null && this.maxTravelCm < TAP_MAX_TRAVEL_CM) {
          this.cycleShotType()
        }
        this.grabStartPos = null
        this.onChanged.invoke()
      })
    })

    this.createEvent("UpdateEvent").bind(() => {
      if (this.manipulating) {
        this.constrain()
        if (this.grabStartPos !== null) {
          const p = this.getTransform().getLocalPosition()
          const travel = p.distance(this.grabStartPos)
          if (travel > this.maxTravelCm) {
            this.maxTravelCm = travel
          }
        }
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

  private refreshMaterial(): void {
    if (this.rmv) {
      this.rmv.mainMaterial = (this.hovered ? this.hoverMats : this.typeMats)[
        this.shotTypeIndex
      ]
    }
  }

  private applyTypeVisual(): void {
    // Footprint scale + per-type color + label all derive from one index.
    const s = this.shotType === "wide" ? 1.25 : this.shotType === "medium" ? 1.0 : 0.72
    this.getTransform().setLocalScale(new vec3(s, 1, s))
    this.refreshMaterial()
    if (this.label) {
      this.label.text = TYPE_LABELS[this.shotTypeIndex]
    }
    if (this.labelTransform) {
      // Counter-scale so the billboarded label never stretches with footprint.
      this.labelTransform.setLocalScale(new vec3(1 / s, 1, 1 / s))
    }
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
    // Defensive: SIK two-hand gestures could scale the wedge; footprint scale
    // is owned by the shot type and nothing else.
    const s = this.shotType === "wide" ? 1.25 : this.shotType === "medium" ? 1.0 : 0.72
    t.setLocalScale(new vec3(s, 1, s))
  }
}
