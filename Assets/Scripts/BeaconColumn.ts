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
  }
}
