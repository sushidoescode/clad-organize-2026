/**
 * WedgeMeshFactory
 *
 * Pure runtime-mesh factory functions (no component, no scene access).
 * Vertex layout: position (3) + normal (3, normalized) + texture0 (2),
 * compatible with standard material presets (SimplePBR / Unlit).
 * Units: centimeters. Topology: indexed Triangles (UInt16).
 */

const VERTEX_LAYOUT: any[] = [
    { name: "position", components: 3 },
    { name: "normal", components: 3, normalized: true },
    { name: "texture0", components: 2 },
];

function createBuilder(): MeshBuilder {
    const builder = new MeshBuilder(VERTEX_LAYOUT);
    builder.topology = MeshTopology.Triangles;
    builder.indexType = MeshIndexType.UInt16;
    return builder;
}

/** Push one interleaved vertex: position, normal, uv. */
function pushVertex(
    verts: number[],
    px: number, py: number, pz: number,
    nx: number, ny: number, nz: number,
    u: number, v: number
): void {
    verts.push(px, py, pz, nx, ny, nz, u, v);
}

/**
 * Camera-wedge triangular prism.
 *
 * Footprint on the XZ plane: apex at (0, 0, -12), back corners at
 * (-9, 0, +12) and (+9, 0, +12), extruded upward so y spans [0, 6].
 * The apex points toward local -Z.
 *
 * Flat-shaded: every face carries its own 3-4 vertices with the face's
 * outward normal. All triangle windings are CCW viewed from outside
 * (verified via cross-product against the outward normal), so the mesh
 * renders correctly with Lens Studio's default back-face culling.
 */
export function buildWedgeMesh(): RenderMesh {
    const APEX_Z = -12;
    const BACK_Z = 12;
    const HALF_W = 9;
    const TOP_Y = 6;

    // Footprint corners (y = 0): apex A, back-left B, back-right C.
    const ax = 0, az = APEX_Z;
    const bx = -HALF_W, bz = BACK_Z;
    const cx = HALF_W, cz = BACK_Z;

    // Outward normals of the two slanted side faces (in the XZ plane).
    // Left face (A->B edge): direction (-24, 0, -9) normalized.
    // Right face (C->A edge): direction (24, 0, -9) normalized.
    const sideLen = Math.sqrt(24 * 24 + 9 * 9); // sqrt(657)
    const lnx = -24 / sideLen, lnz = -9 / sideLen;
    const rnx = 24 / sideLen, rnz = -9 / sideLen;

    const verts: number[] = [];
    const indices: number[] = [];

    // Planar UV helper for top/bottom: x in [-9,9] -> u, z in [-12,12] -> v.
    const fu = (x: number) => (x + HALF_W) / (2 * HALF_W);
    const fv = (z: number) => (z - APEX_Z) / (BACK_Z - APEX_Z);

    // --- Top face (y = TOP_Y, normal +Y). CCW from above: [A', B', C'].
    pushVertex(verts, ax, TOP_Y, az, 0, 1, 0, fu(ax), fv(az)); // 0
    pushVertex(verts, bx, TOP_Y, bz, 0, 1, 0, fu(bx), fv(bz)); // 1
    pushVertex(verts, cx, TOP_Y, cz, 0, 1, 0, fu(cx), fv(cz)); // 2
    indices.push(0, 1, 2);

    // --- Bottom face (y = 0, normal -Y). CCW from below: [A, C, B].
    pushVertex(verts, ax, 0, az, 0, -1, 0, fu(ax), fv(az)); // 3
    pushVertex(verts, cx, 0, cz, 0, -1, 0, fu(cx), fv(cz)); // 4
    pushVertex(verts, bx, 0, bz, 0, -1, 0, fu(bx), fv(bz)); // 5
    indices.push(3, 4, 5);

    // Side quad helper: bottom-left, bottom-right along the footprint edge,
    // extruded up. Triangles [bl, br, tr] and [bl, tr, tl] are CCW viewed
    // from outside for edges wound counter-clockwise around the footprint
    // (when seen from above).
    const addSideQuad = (
        x0: number, z0: number, x1: number, z1: number,
        nx: number, nz: number
    ) => {
        const base = verts.length / 8;
        pushVertex(verts, x0, 0, z0, nx, 0, nz, 0, 0);         // bl
        pushVertex(verts, x1, 0, z1, nx, 0, nz, 1, 0);         // br
        pushVertex(verts, x1, TOP_Y, z1, nx, 0, nz, 1, 1);     // tr
        pushVertex(verts, x0, TOP_Y, z0, nx, 0, nz, 0, 1);     // tl
        indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    };

    // --- Left slanted face: edge A -> B, outward normal (-24, 0, -9)/|.|
    addSideQuad(ax, az, bx, bz, lnx, lnz);
    // --- Back face: edge B -> C at z = +12, outward normal +Z.
    addSideQuad(bx, bz, cx, cz, 0, 1);
    // --- Right slanted face: edge C -> A, outward normal (24, 0, -9)/|.|
    addSideQuad(cx, cz, ax, az, rnx, rnz);

    const builder = createBuilder();
    builder.appendVerticesInterleaved(verts);
    builder.appendIndices(indices);
    builder.updateMesh();
    return builder.getMesh();
}

/**
 * Flat annular sector on the XZ plane at y = 0, normal +Y.
 *
 * Angle convention (matches the caller): angle theta in degrees maps to
 * direction (sin(theta), 0, cos(theta)) — 0 deg = +Z, increasing toward +X.
 *
 * The arc is tessellated with `arcSegments` quads (two triangles each)
 * between innerRadiusCm and outerRadiusCm. Winding is chosen so faces are
 * visible from ABOVE (+Y looking down) under default back-face culling;
 * a decreasing sweep (endDeg < startDeg) is handled by flipping winding.
 *
 * UVs: u follows the arc [0..1], v goes inner (0) to outer (1).
 */
export interface ArcSpan {
    startDeg: number;
    endDeg: number;
}

/**
 * Many annular sectors in ONE mesh (one draw call) at a fixed height.
 * Same angle convention and CCW-from-above winding as buildSectorMesh.
 * Returns null for an empty span list (caller should disable the visual).
 */
export function buildArcSpansMesh(
    spans: ArcSpan[],
    innerRadiusCm: number,
    outerRadiusCm: number,
    yCm: number,
    arcSegments: number
): RenderMesh | null {
    if (spans.length === 0) {
        return null;
    }
    const segments = Math.max(1, Math.floor(arcSegments));
    const DEG2RAD = Math.PI / 180;
    const verts: number[] = [];
    const indices: number[] = [];

    for (let s = 0; s < spans.length; s++) {
        const span = spans[s];
        const base = verts.length / 8;
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const theta = (span.startDeg + (span.endDeg - span.startDeg) * t) * DEG2RAD;
            const dx = Math.sin(theta);
            const dz = Math.cos(theta);
            pushVertex(verts, innerRadiusCm * dx, yCm, innerRadiusCm * dz, 0, 1, 0, t, 0);
            pushVertex(verts, outerRadiusCm * dx, yCm, outerRadiusCm * dz, 0, 1, 0, t, 1);
        }
        for (let i = 0; i < segments; i++) {
            const innerA = base + 2 * i;
            const outerA = base + 2 * i + 1;
            const innerB = base + 2 * i + 2;
            const outerB = base + 2 * i + 3;
            indices.push(innerA, outerA, outerB, innerA, outerB, innerB);
        }
    }

    const builder = createBuilder();
    builder.appendVerticesInterleaved(verts);
    builder.appendIndices(indices);
    builder.updateMesh();
    return builder.getMesh();
}

export function buildSectorMesh(
    innerRadiusCm: number,
    outerRadiusCm: number,
    startDeg: number,
    endDeg: number,
    arcSegments: number
): RenderMesh {
    const segments = Math.max(1, Math.floor(arcSegments));
    const DEG2RAD = Math.PI / 180;
    const sweepIncreasing = endDeg >= startDeg;

    const verts: number[] = [];
    const indices: number[] = [];

    // Ring vertices: for each of (segments + 1) angular steps, push the
    // inner vertex then the outer vertex. All normals are +Y.
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const theta = (startDeg + (endDeg - startDeg) * t) * DEG2RAD;
        const dx = Math.sin(theta);
        const dz = Math.cos(theta);
        pushVertex(verts, innerRadiusCm * dx, 0, innerRadiusCm * dz, 0, 1, 0, t, 0);
        pushVertex(verts, outerRadiusCm * dx, 0, outerRadiusCm * dz, 0, 1, 0, t, 1);
    }

    for (let i = 0; i < segments; i++) {
        const innerA = 2 * i;
        const outerA = 2 * i + 1;
        const innerB = 2 * i + 2;
        const outerB = 2 * i + 3;
        if (sweepIncreasing) {
            // CCW viewed from +Y looking down (verified by cross-product).
            indices.push(innerA, outerA, outerB, innerA, outerB, innerB);
        } else {
            indices.push(innerA, outerB, outerA, innerA, innerB, outerB);
        }
    }

    const builder = createBuilder();
    builder.appendVerticesInterleaved(verts);
    builder.appendIndices(indices);
    builder.updateMesh();
    return builder.getMesh();
}
