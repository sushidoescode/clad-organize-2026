import { ARC_START_DEG, SECTOR_COUNT, SECTOR_SIZE_DEG } from "./CoverageEngine"
import { ArcSpan, buildArcSpansMesh } from "./WedgeMeshFactory"

const INNER_R = 110
const OUTER_R = 125
const GAP_DEG = 1.5
const RAISE_CM = 2
const ARC_SEGMENTS = 6

/**
 * Renders the working-arc coverage ring. Pure view — receives boolean[]
 * from CompassRoot.
 *
 * PERF-OPTIMIZED build: all gap sectors share ONE mesh and all covered
 * sectors share ONE mesh (rebuilt only on state change, which is
 * user-paced) — 2 draw calls instead of the naive 12. Covered sectors are
 * baked 2 cm higher in the mesh (state is never color-alone).
 *
 * Twelve empty "Sector<i>" marker children carry the per-sector state on
 * their local y (0 = gap, 2 = covered) — the stable observable that LEAF
 * scenarios and debugging tools read, independent of render batching.
 */
@component
export class RingView extends BaseScriptComponent {
  @input
  baseMaterial: Material

  @input
  @hint("Diagonal-hatch strip for uncovered sectors (white; tinted by baseColor)")
  gapTexture: Texture

  @input
  @hint("Backlit-gradient strip for covered sectors (white; tinted by baseColor)")
  coveredTexture: Texture

  private markers: SceneObject[] = []
  private gapRmv: RenderMeshVisual
  private coveredRmv: RenderMeshVisual
  private coveredMat: Material
  private built: boolean = false
  private lastCoveredCount: number = 0
  private flashElapsed: number = 999
  private flashEvent: SceneEvent | null = null

  // Etched Light Meter palette: tally red (unlit lamp) vs phosphor green
  // (backlit glass). Textures are white strips; baseColor carries the hue,
  // so the flash lerp below keeps working unchanged.
  private static readonly COVERED_BASE = new vec4(0.361, 0.91, 0.561, 1.0)
  private static readonly COVERED_FLASH = new vec4(0.78, 1.0, 0.86, 1.0)

  onAwake(): void {
    const gapMat = this.baseMaterial.clone()
    gapMat.mainPass.baseColor = new vec4(1.0, 0.353, 0.306, 1.0)
    if (this.gapTexture) {
      gapMat.mainPass.baseTex = this.gapTexture
    }
    const coveredMat = this.baseMaterial.clone()
    coveredMat.mainPass.baseColor = RingView.COVERED_BASE
    if (this.coveredTexture) {
      coveredMat.mainPass.baseTex = this.coveredTexture
    }
    this.coveredMat = coveredMat

    // Newly-covered flash: brief brightness pop on the covered arc, decaying
    // back to the base green. Created once; enabled per flash.
    this.flashEvent = this.createEvent("UpdateEvent")
    this.flashEvent.bind(() => {
      this.flashElapsed += getDeltaTime()
      const d = 0.35
      const k = Math.min(1, this.flashElapsed / d)
      const a = RingView.COVERED_FLASH
      const b = RingView.COVERED_BASE
      this.coveredMat.mainPass.baseColor = new vec4(
        a.x + (b.x - a.x) * k,
        a.y + (b.y - a.y) * k,
        a.z + (b.z - a.z) * k,
        1.0
      )
      if (k >= 1 && this.flashEvent) {
        this.flashEvent.enabled = false
      }
    })
    this.flashEvent.enabled = false

    for (let i = 0; i < SECTOR_COUNT; i++) {
      const marker = global.scene.createSceneObject("Sector" + i)
      marker.setParent(this.sceneObject)
      marker.getTransform().setLocalPosition(new vec3(0, 0, 0))
      this.markers.push(marker)
    }

    const gapObj = global.scene.createSceneObject("RingGaps")
    gapObj.setParent(this.sceneObject)
    this.gapRmv = gapObj.createComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    this.gapRmv.mainMaterial = gapMat

    const coveredObj = global.scene.createSceneObject("RingCovered")
    coveredObj.setParent(this.sceneObject)
    this.coveredRmv = coveredObj.createComponent(
      "Component.RenderMeshVisual"
    ) as RenderMeshVisual
    this.coveredRmv.mainMaterial = coveredMat

    this.built = true
    const allGaps: boolean[] = []
    for (let i = 0; i < SECTOR_COUNT; i++) {
      allGaps.push(false)
    }
    this.apply(allGaps)
  }

  public apply(sectors: boolean[]): void {
    if (!this.built) {
      return
    }
    const gapSpans: ArcSpan[] = []
    const coveredSpans: ArcSpan[] = []
    const n = Math.min(SECTOR_COUNT, sectors.length)
    for (let i = 0; i < n; i++) {
      const start = ARC_START_DEG + i * SECTOR_SIZE_DEG
      const span: ArcSpan = {
        startDeg: start + GAP_DEG / 2,
        endDeg: start + SECTOR_SIZE_DEG - GAP_DEG / 2,
      }
      if (sectors[i]) {
        coveredSpans.push(span)
      } else {
        gapSpans.push(span)
      }
      this.markers[i]
        .getTransform()
        .setLocalPosition(new vec3(0, sectors[i] ? RAISE_CM : 0, 0))
    }

    const gapMesh = buildArcSpansMesh(gapSpans, INNER_R, OUTER_R, 0, ARC_SEGMENTS)
    this.gapRmv.enabled = gapMesh !== null
    if (gapMesh !== null) {
      this.gapRmv.mesh = gapMesh
    }
    const coveredMesh = buildArcSpansMesh(
      coveredSpans,
      INNER_R,
      OUTER_R,
      RAISE_CM,
      ARC_SEGMENTS
    )
    this.coveredRmv.enabled = coveredMesh !== null
    if (coveredMesh !== null) {
      this.coveredRmv.mesh = coveredMesh
    }

    if (coveredSpans.length > this.lastCoveredCount && this.flashEvent) {
      this.flashElapsed = 0
      this.flashEvent.enabled = true
    }
    this.lastCoveredCount = coveredSpans.length
  }
}
