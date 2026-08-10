/**
 * Pure coverage math — no scene references, no component state.
 * Single source of truth for the coverage ring; LEAF scenarios target this module.
 *
 * Angle convention: bearing on the XZ plane around +Y, 0° = +Z, increasing toward +X,
 * normalized to [0, 360). The ring is quantized into SECTOR_COUNT equal sectors;
 * sector i spans [i * (360/SECTOR_COUNT), (i+1) * (360/SECTOR_COUNT)).
 */

export const SECTOR_COUNT = 24
export const COVERAGE_HALF_ANGLE_DEG = 60
/** Wedges farther than this from the subject (cm) do not contribute coverage (tray zone). */
export const ACTIVE_RADIUS_CM = 130

export function bearingDeg(subjectPos: vec3, wedgePos: vec3): number {
  const dx = wedgePos.x - subjectPos.x
  const dz = wedgePos.z - subjectPos.z
  let deg = (Math.atan2(dx, dz) * 180) / Math.PI
  if (deg < 0) {
    deg += 360
  }
  return deg
}

export function planarDistanceCm(subjectPos: vec3, wedgePos: vec3): number {
  const dx = wedgePos.x - subjectPos.x
  const dz = wedgePos.z - subjectPos.z
  return Math.sqrt(dx * dx + dz * dz)
}

export function angularDistanceDeg(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  return d > 180 ? 360 - d : d
}

/**
 * Core derivation: which sectors are covered by the given wedge bearings.
 * A sector is covered iff its center lies within ±halfAngleDeg of any bearing.
 */
export function computeSectors(
  wedgeBearingsDeg: number[],
  halfAngleDeg: number = COVERAGE_HALF_ANGLE_DEG,
  sectorCount: number = SECTOR_COUNT
): boolean[] {
  const sectors: boolean[] = []
  const sectorSize = 360 / sectorCount
  for (let i = 0; i < sectorCount; i++) {
    const center = (i + 0.5) * sectorSize
    let covered = false
    for (let w = 0; w < wedgeBearingsDeg.length; w++) {
      if (angularDistanceDeg(center, wedgeBearingsDeg[w]) <= halfAngleDeg) {
        covered = true
        break
      }
    }
    sectors.push(covered)
  }
  return sectors
}

export function isComplete(sectors: boolean[]): boolean {
  if (sectors.length === 0) {
    return false
  }
  for (let i = 0; i < sectors.length; i++) {
    if (!sectors[i]) {
      return false
    }
  }
  return true
}

export function coveredCount(sectors: boolean[]): number {
  let n = 0
  for (let i = 0; i < sectors.length; i++) {
    if (sectors[i]) {
      n++
    }
  }
  return n
}
