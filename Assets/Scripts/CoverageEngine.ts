/**
 * Pure coverage math v2 — no scene references, no component state.
 * Single source of truth for the coverage ring; LEAF scenarios target this module.
 *
 * v2 semantics (cinematically true): interview coverage lives on the FRONT
 * 180° working arc — the user's side of the axis line (the "180° line").
 * Bearing convention: signed degrees in (-180, 180], 0° = +Z (user/tray side),
 * positive toward +X. The working arc spans [-90°, +90°]. A wedge placed
 * behind the line (|bearing| > 90°) contributes NO coverage and raises a
 * line violation instead.
 */

export const SECTOR_COUNT = 12
export const ARC_START_DEG = -90
export const SECTOR_SIZE_DEG = 15
/** Wedges farther than this from the subject (cm) are inactive (tray zone). */
export const ACTIVE_RADIUS_CM = 130

export type ShotType = "wide" | "medium" | "close"
export const SHOT_TYPES: ShotType[] = ["wide", "medium", "close"]

export function halfAngleForType(t: ShotType): number {
  if (t === "wide") {
    return 45
  }
  if (t === "medium") {
    return 30
  }
  return 20
}

export interface WedgeInput {
  bearingDeg: number
  halfAngleDeg: number
  distanceCm: number
}

export function bearingSignedDeg(subjectPos: vec3, wedgePos: vec3): number {
  const dx = wedgePos.x - subjectPos.x
  const dz = wedgePos.z - subjectPos.z
  return (Math.atan2(dx, dz) * 180) / Math.PI
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

function isActive(w: WedgeInput): boolean {
  return w.distanceCm <= ACTIVE_RADIUS_CM
}

function isFrontSide(w: WedgeInput): boolean {
  return Math.abs(w.bearingDeg) <= 90
}

/**
 * Which of the 12 working-arc sectors are covered. A sector is covered iff
 * its center lies within ±halfAngle of an ACTIVE, FRONT-side wedge's bearing.
 */
export function computeSectors(wedges: WedgeInput[]): boolean[] {
  const sectors: boolean[] = []
  for (let i = 0; i < SECTOR_COUNT; i++) {
    const center = ARC_START_DEG + (i + 0.5) * SECTOR_SIZE_DEG
    let covered = false
    for (let w = 0; w < wedges.length; w++) {
      const wedge = wedges[w]
      if (!isActive(wedge) || !isFrontSide(wedge)) {
        continue
      }
      if (angularDistanceDeg(center, wedge.bearingDeg) <= wedge.halfAngleDeg) {
        covered = true
        break
      }
    }
    sectors.push(covered)
  }
  return sectors
}

/** Indices of active wedges that crossed the axis line (behind the working arc). */
export function lineViolations(wedges: WedgeInput[]): number[] {
  const out: number[] = []
  for (let i = 0; i < wedges.length; i++) {
    if (isActive(wedges[i]) && !isFrontSide(wedges[i])) {
      out.push(i)
    }
  }
  return out
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
