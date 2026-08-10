import { ARC_START_DEG, SECTOR_COUNT, SECTOR_SIZE_DEG } from "./CoverageEngine"
import { buildSectorMesh } from "./WedgeMeshFactory"

/**
 * Renders the working-arc coverage ring: SECTOR_COUNT flat annular sectors
 * across the front 180°. Pure view — receives boolean[] from CompassRoot.
 * State is never color-alone: covered sectors also raise 2 cm.
 *
 * Deliberately naive first build (one mesh + visual per sector) — this is the
 * measured "before" of the perf pass.
 */
@component
export class RingView extends BaseScriptComponent {
  @input
  baseMaterial: Material

  private sectorVisuals: RenderMeshVisual[] = []
  private sectorObjects: SceneObject[] = []
  private gapMat: Material
  private coveredMat: Material
  private built: boolean = false

  onAwake(): void {
    this.gapMat = this.baseMaterial.clone()
    this.gapMat.mainPass.baseColor = new vec4(0.85, 0.18, 0.15, 1.0)
    this.coveredMat = this.baseMaterial.clone()
    this.coveredMat.mainPass.baseColor = new vec4(0.15, 0.8, 0.35, 1.0)

    const gapDeg = 1.5
    for (let i = 0; i < SECTOR_COUNT; i++) {
      const start = ARC_START_DEG + i * SECTOR_SIZE_DEG
      const obj = global.scene.createSceneObject("Sector" + i)
      obj.setParent(this.sceneObject)
      obj.getTransform().setLocalPosition(new vec3(0, 0, 0))
      const rmv = obj.createComponent(
        "Component.RenderMeshVisual"
      ) as RenderMeshVisual
      rmv.mesh = buildSectorMesh(
        110,
        125,
        start + gapDeg / 2,
        start + SECTOR_SIZE_DEG - gapDeg / 2,
        6
      )
      rmv.mainMaterial = this.gapMat
      this.sectorObjects.push(obj)
      this.sectorVisuals.push(rmv)
    }
    this.built = true
  }

  public apply(sectors: boolean[]): void {
    if (!this.built) {
      return
    }
    const n = Math.min(this.sectorVisuals.length, sectors.length)
    for (let i = 0; i < n; i++) {
      this.sectorVisuals[i].mainMaterial = sectors[i]
        ? this.coveredMat
        : this.gapMat
      this.sectorObjects[i]
        .getTransform()
        .setLocalPosition(new vec3(0, sectors[i] ? 2 : 0, 0))
    }
  }
}
