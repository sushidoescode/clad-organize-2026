import { SECTOR_COUNT } from "./CoverageEngine"
import { buildSectorMesh } from "./WedgeMeshFactory"

/**
 * Renders the coverage ring: SECTOR_COUNT flat annular sector meshes around the
 * subject. Pure view — receives boolean[] from CompassRoot and applies it.
 * State is never encoded by color alone: covered sectors also raise 2 cm.
 *
 * Deliberately naive first build (one mesh + visual per sector) — this is the
 * measured "before" of the later batching perf pass.
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

    const sectorSize = 360 / SECTOR_COUNT
    const gapDeg = 1.5
    for (let i = 0; i < SECTOR_COUNT; i++) {
      const obj = global.scene.createSceneObject("Sector" + i)
      obj.setParent(this.sceneObject)
      obj.getTransform().setLocalPosition(new vec3(0, 0, 0))
      const rmv = obj.createComponent(
        "Component.RenderMeshVisual"
      ) as RenderMeshVisual
      rmv.mesh = buildSectorMesh(
        110,
        125,
        i * sectorSize + gapDeg / 2,
        (i + 1) * sectorSize - gapDeg / 2,
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
