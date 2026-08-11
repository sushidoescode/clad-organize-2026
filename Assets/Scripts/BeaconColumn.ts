import { Billboard } from "SpectaclesInteractionKit.lspkg/Components/Interaction/Billboard/Billboard"
import { buildTubeMesh } from "./WedgeMeshFactory"

/**
 * The talent-mark beacon: an open (capless) cylinder wearing a vertical
 * alpha-fade texture, so it reads as a shaft of stage light dissolving into
 * air. A capped preset cylinder would show a bright top-cap ellipse — the
 * open tube is the point of this component.
 */
@component
export class BeaconColumn extends BaseScriptComponent {
  @input
  beaconMaterial: Material

  @input
  radiusCm: number = 4.5

  @input
  heightCm: number = 90

  onAwake(): void {
    const rmv = this.sceneObject.createComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    rmv.mesh = buildTubeMesh(this.radiusCm, this.heightCm, 24)
    rmv.mainMaterial = this.beaconMaterial

    // Cold-viewer anchor: name the metaphor. Quiet caption above the beam.
    const labelObj = global.scene.createSceneObject("SubjectLabel")
    labelObj.setParent(this.sceneObject)
    labelObj.getTransform().setLocalPosition(new vec3(0, this.heightCm + 10, 0))
    const t = labelObj.createComponent("Component.Text") as Text
    t.text = "SUBJECT"
    t.size = 40
    t.depthTest = true
    t.horizontalOverflow = HorizontalOverflow.Overflow
    t.textFill.color = new vec4(0.937, 0.902, 0.839, 0.72)
    labelObj.createComponent(Billboard.getTypeName())
  }
}
