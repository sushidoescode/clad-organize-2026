import { buildDiscMesh } from "./WedgeMeshFactory"

/**
 * The rehearsal floor as an "engraved sight-glass": a runtime disc mesh with
 * planar UVs carrying the compass-rose texture (alpha line-work only — the
 * floor itself is transparent, which is also how it must read on the
 * additive SPECS display).
 */
@component
export class FloorDisc extends BaseScriptComponent {
  @input
  floorMaterial: Material

  @input
  @hint("Disc radius in cm")
  radiusCm: number = 160

  onAwake(): void {
    const rmv = this.sceneObject.createComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    rmv.mesh = buildDiscMesh(this.radiusCm, 72)
    rmv.mainMaterial = this.floorMaterial
  }
}
