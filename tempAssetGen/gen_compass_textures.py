#!/usr/bin/env python3
"""Generate the Etched Light Meter SVG textures for Shot Coverage Compass.

Coordinate contract (must match runtime UV mapping):
- floor_rose: disc mesh UV u=(x/R+1)/2, v=(z/R+1)/2 with R=160cm, texture v=0 at
  image BOTTOM (GL). World front (+z, user side) = v=1 = image TOP.
  px_per_cm = 1024/160 = 6.4.
- ring strips: arc mesh v=0 inner edge, v=1 outer edge -> outer edge = image TOP.
- subject_fade: cylinder v=0 bottom -> image BOTTOM = base (bright).
All line-work is white/ivory; runtime baseColor tints where needed.
"""
import math, os

# Output dir: repo-relative by default (this script lives in <repo>/tempAssetGen/),
# overridable with argv[1].
import sys
_REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(_REPO, "Assets", "Textures", "src")
os.makedirs(OUT, exist_ok=True)
IVORY = "#EFE6D6"

# ---------------------------------------------------------------- floor rose
S = 2048
C = S / 2  # 1024
PPCM = 1024 / 160.0

def world_to_svg(x_cm, z_cm):
    return C + x_cm * PPCM, C - z_cm * PPCM  # +z (front) -> image top

def tick(bearing_deg, r_out_px, length_px, sw, op):
    th = math.radians(bearing_deg)
    dx, dz = math.sin(th), math.cos(th)
    x1, y1 = C + (r_out_px - length_px) * dx, C - (r_out_px - length_px) * dz
    x2, y2 = C + r_out_px * dx, C - r_out_px * dz
    return (f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" '
            f'stroke="{IVORY}" stroke-width="{sw}" stroke-opacity="{op}" stroke-linecap="round"/>')

# Skeleton digits as stroke paths on a local frame (~90px tall), engraved style.
def digit_path(d):
    if d == "0":
        return '<ellipse cx="0" cy="0" rx="26" ry="42" fill="none" STROKE/>'
    if d == "3":
        return ('<path d="M -22 -42 L 22 -42 L 2 -10 A 25 25 0 1 1 -24 28" fill="none" STROKE/>')
    if d == "6":
        return ('<circle cx="0" cy="16" r="25" fill="none" STROKE/>'
                '<path d="M 18 -44 A 58 58 0 0 0 -23 8" fill="none" STROKE/>')
    if d == "9":
        return ('<circle cx="0" cy="-16" r="25" fill="none" STROKE/>'
                '<path d="M -18 44 A 58 58 0 0 0 23 -8" fill="none" STROKE/>')
    raise ValueError(d)

def numeral(text, bearing_deg, r_px, op, fwd_px=0):
    # EMPIRICAL (verified in Preview): the floor texture reaches the viewer's
    # eye vertically FLIPPED (mesh v-mapping + sampling + camera compose to a
    # mirror across the horizontal axis, not a 180 rotation). Authoring each
    # glyph with scale(1,-1) — digit order preserved — reads upright from the
    # front. fwd_px nudges toward the front (+z = image top).
    th = math.radians(bearing_deg)
    cx, cy = C + r_px * math.sin(th), C - r_px * math.cos(th) - fwd_px
    spacing = 64
    x0 = -(len(text) - 1) * spacing / 2
    parts = []
    for i, ch in enumerate(text):
        body = digit_path(ch).replace(
            "STROKE", f'stroke="{IVORY}" stroke-width="9" stroke-opacity="{op}" stroke-linecap="round"')
        parts.append(f'<g transform="translate({x0 + i * spacing:.0f} 0)">{body}</g>')
    return (f'<g transform="translate({cx:.1f} {cy:.1f}) scale(1,-1)">{"".join(parts)}</g>')

el = []
# under-ring glow annulus: the "floats on light" pool beneath the sector band
# (Chrome honors stop-opacity; band center ~122 cm, garnish only)
el.append(f'<circle cx="{C}" cy="{C}" r="983" fill="url(#glow)"/>')
# outer bezel + concentric hairlines (radii in world cm: 60, 90, 110-dashed)
el.append(f'<circle cx="{C}" cy="{C}" r="983" fill="none" stroke="{IVORY}" stroke-width="6" stroke-opacity="0.56"/>')
for r_cm, dash in ((60, None), (90, None), (110, "24 12")):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    el.append(f'<circle cx="{C}" cy="{C}" r="{r_cm * PPCM:.0f}" fill="none" stroke="{IVORY}" '
              f'stroke-width="3" stroke-opacity="0.28"{d}/>')
# focus-ring tick band, outer end at r=983 (opacities biased up ~1.25x for the
# additive display, per the design risk register)
for b in range(0, 360, 3):
    if b % 30 == 0:
        el.append(tick(b, 983, 120, 8, 1.0))
    elif b % 15 == 0:
        el.append(tick(b, 983, 80, 5, 0.69))
    else:
        el.append(tick(b, 983, 40, 3, 0.38))
# degree numerals, front arc only, inside the ring (r=640px = 100cm)
for b, label in ((-90, "90"), (-60, "60"), (-30, "30"), (0, "0"), (30, "30"), (60, "60"), (90, "90")):
    fwd = 70 if abs(b) == 90 else 0  # keep the 90s clear of the 3D axis line
    el.append(numeral(label, b, 640, 0.88, fwd))
# center spike-tape T: bar along x + stub toward front (+z)
el.append(f'<line x1="{C-143}" y1="{C}" x2="{C+143}" y2="{C}" stroke="{IVORY}" stroke-width="16" stroke-opacity="0.9" stroke-linecap="round"/>')
el.append(f'<line x1="{C}" y1="{C}" x2="{C}" y2="{C-143}" stroke="{IVORY}" stroke-width="16" stroke-opacity="0.9" stroke-linecap="round"/>')
# (no baked axis hairline: the 3D Line180 object draws the axis)
# index triangles at axis ends (bearing +-90), pointing inward
for sx in (1, -1):
    x0, y0 = C + sx * 983, C
    el.append(f'<path d="M {x0:.0f} {y0-26:.0f} L {x0:.0f} {y0+26:.0f} L {x0 - sx*44:.0f} {y0:.0f} Z" '
              f'fill="{IVORY}" fill-opacity="0.9"/>')

floor = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{S}" height="{S}" viewBox="0 0 {S} {S}">'
         '<defs><radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">'
         '<stop offset="0.60" stop-color="#BFD4DC" stop-opacity="0"/>'
         '<stop offset="0.765" stop-color="#BFD4DC" stop-opacity="0.14"/>'
         '<stop offset="0.90" stop-color="#BFD4DC" stop-opacity="0"/>'
         '</radialGradient></defs>'
         + "".join(el) + "</svg>")
open(f"{OUT}/floor_rose.svg", "w").write(floor)

# ------------------------------------------------------- ring strip textures
# 512x128. Image TOP = outer edge (v=1); u spans one sector span, so side
# strokes at u=0/u=1 become the slab's radial edges. Full luminous rim frames
# each sector as a tile (per the concept-frame direction). White; baseColor tints.
W, H = 512, 128

def rim(sw_side, sw_inner, sw_outer):
    return (f'<rect x="0" y="0" width="{W}" height="{sw_outer}" fill="#FFFFFF" fill-opacity="1"/>'
            f'<rect x="0" y="{H - sw_inner}" width="{W}" height="{sw_inner}" fill="#FFFFFF" fill-opacity="0.9"/>'
            f'<rect x="0" y="0" width="{sw_side}" height="{H}" fill="#FFFFFF" fill-opacity="0.9"/>'
            f'<rect x="{W - sw_side}" y="0" width="{sw_side}" height="{H}" fill="#FFFFFF" fill-opacity="0.9"/>')

covered = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
           '<defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0">'
           '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.55"/>'
           '<stop offset="0.75" stop-color="#FFFFFF" stop-opacity="0.92"/>'
           '<stop offset="1" stop-color="#FFFFFF" stop-opacity="1"/>'
           '</linearGradient></defs>'
           f'<rect x="0" y="0" width="{W}" height="{H}" fill="url(#g)"/>'
           + rim(10, 6, 7) + '</svg>')
open(f"{OUT}/ring_covered_strip.svg", "w").write(covered)

hatch = []
for x in range(-H, W + H, 26):
    hatch.append(f'<line x1="{x}" y1="{H}" x2="{x + H}" y2="0" stroke="#FFFFFF" '
                 'stroke-width="3.5" stroke-opacity="0.55"/>')
gap = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
       f'<rect x="0" y="0" width="{W}" height="{H}" fill="#FFFFFF" fill-opacity="0.38"/>'
       + "".join(hatch) + rim(10, 6, 8) + '</svg>')
open(f"{OUT}/ring_gap_strip.svg", "w").write(gap)

# ---------------------------------------------------------- beacon reticle
# 512x512 disc texture (mapped to a 20 cm FloorDisc): double circle + stubs.
ret = []
ret.append('<circle cx="256" cy="256" r="218" fill="none" stroke="#EFE6D6" stroke-width="14" stroke-opacity="0.95"/>')
ret.append('<circle cx="256" cy="256" r="140" fill="none" stroke="#EFE6D6" stroke-width="7" stroke-opacity="0.75"/>')
for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
    x1, y1 = 256 + dx * 218, 256 + dy * 218
    x2, y2 = 256 + dx * 252, 256 + dy * 252
    ret.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="#EFE6D6" stroke-width="14" stroke-opacity="0.95" stroke-linecap="round"/>')
reticle = ('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'
           + "".join(ret) + '</svg>')
open(f"{OUT}/base_reticle.svg", "w").write(reticle)

# ---------------------------------------------------------- wedge top etch
# 512x512 on the wedge top face: fu=(x+9)/18 -> image x, fv=(z+12)/24 with
# v=1 = image TOP = back edge; apex at image-bottom center. Whole square
# carries a 0.55-alpha body (sides sample it too, staying uniform); the
# triangle perimeter gets a full-alpha rim; focal ticks along the back edge.
wt = []
wt.append('<rect x="0" y="0" width="512" height="512" fill="#FFFFFF" fill-opacity="0.55"/>')
wt.append('<path d="M 256 500 L 8 12 L 504 12 Z" fill="none" stroke="#FFFFFF" stroke-width="16" stroke-opacity="1" stroke-linejoin="round"/>')
for i in range(1, 6):
    x = 8 + i * (496 / 6)
    wt.append(f'<line x1="{x:.0f}" y1="12" x2="{x:.0f}" y2="44" stroke="#FFFFFF" stroke-width="6" stroke-opacity="0.9"/>')
wedge_top = ('<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">'
             + "".join(wt) + '</svg>')
open(f"{OUT}/wedge_top.svg", "w").write(wedge_top)

# ------------------------------------------------------------- subject fade
# 128x512. Image BOTTOM = cylinder base (bright), fading to nothing at top.
fade = ('<svg xmlns="http://www.w3.org/2000/svg" width="128" height="512" viewBox="0 0 128 512">'
        '<defs><linearGradient id="f" x1="0" y1="1" x2="0" y2="0">'
        '<stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/>'
        '<stop offset="0.45" stop-color="#FFFFFF" stop-opacity="0.55"/>'
        '<stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>'
        '</linearGradient></defs>'
        '<rect x="0" y="0" width="128" height="512" fill="url(#f)"/>'
        '</svg>')
open(f"{OUT}/subject_fade.svg", "w").write(fade)

print("wrote:", sorted(os.listdir(OUT)))
