import { Interactable } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Interactable/Interactable"
import { InteractableManipulation } from "SpectaclesInteractionKit.lspkg/Components/Interaction/InteractableManipulation/InteractableManipulation"
import Event from "SpectaclesInteractionKit.lspkg/Utils/Event"
import { buildWedgeMesh } from "./WedgeMeshFactory"

/**
 * One camera wedge: builds its own mesh, collider, and SIK interaction stack.
 * Emits onMoved while being dragged and on release. Constrains itself to the
 * compass floor plane (local y = 0) and yaws to face the subject at local origin.
 */
@component
export class WedgeController extends BaseScriptComponent {
  @input
  wedgeMaterial: Material

  public onMoved: Event<void> = new Event<void>()

  private manipulating: boolean = false

  onAwake(): void {
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
      })
      manip.onManipulationEnd.add(() => {
        this.manipulating = false
        this.constrain()
        this.onMoved.invoke()
      })
    })

    this.createEvent("UpdateEvent").bind(() => {
      if (this.manipulating) {
        this.constrain()
        this.onMoved.invoke()
      }
    })
  }

  /** Clamp to the compass floor plane and face the subject (local origin of the compass root). */
  private constrain(): void {
    const t = this.getTransform()
    const p = t.getLocalPosition()
    if (Math.abs(p.y) > 0.01) {
      t.setLocalPosition(new vec3(p.x, 0, p.z))
    }
    // Wedge apex points local -Z; yaw by the bearing angle so the apex faces the origin.
    const yawRad = Math.atan2(p.x, p.z)
    t.setLocalRotation(quat.fromEulerAngles(0, yawRad, 0))
  }
}
