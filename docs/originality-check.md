# Originality Check — Shot Coverage Compass

**Date:** 2026-08-11 · **Context:** CLAD Summer Hackathon (theme "Organize"), Snap SPECS Lens built in Lens Studio.
**Claim under test:** Is a live, floor-anchored, subject-centric shot-coverage instrument on AR glasses already done — on Snap's platform, in Lens Studio projects, on GitHub, or as an adjacent product elsewhere?

## Methodology

Four independent search modalities (~106 queries total; not exhaustive — see the audit addendum below), then synthesized:

1. **Snap ecosystem** (~29 queries): Spectacles/SPECS lens galleries, the official `Snapchat/Spectacles-Sample` repo, Lens Fest, Lenslist Spectacles Community Challenges, Snap's official Hackathon Showcase, Snap Newsroom, X/YouTube demos, plus exact-name collision checks for "Shot Coverage Compass" / "coverage compass".
2. **Lenslist + Snap hackathon history** (~25 queries): all 14 Spectacles Community Challenge winner announcements (May 2025–Aug 2026) individually fetched (~120 winning lenses), Lens Fest 2025 awards + Lensathon recap, Snap's complete 343-project Hackathon Showcase (~15 hackathons 2024–2026), and Devpost project galleries (ImmerseGT, TigerVerse, MIT Reality Hack 2025/2026).
3. **GitHub** (~26 queries): live github.com search-result fetches plus deep-dives into candidate repos; topics `spectacles` and `lens-studio`; the full 34-sample official Spectacles-Sample listing.
4. **Adjacent products** (~26 queries): director's viewfinder apps, previs/blocking tools, virtual production, headset filmmaking tools (Vision Pro, Quest, HoloLens), and coverage-visualization tools in neighboring domains (photogrammetry, CCTV design, drone mission planning), with feature audits of official product pages.

## Findings

| Finding | Platform / Modality | Similarity | Key gap vs. Shot Coverage Compass | URL |
|---|---|---|---|---|
| KinoPilot (ImmerseGT 2026, Snap AR track winner) | Spectacles | Medium | Script supervisor + take notes; zero spatial geometry. Roadmap lists 3D scene blocking as **unbuilt** future work | https://devpost.com/software/ar-script-supervisor |
| FrAImed (MIT Reality Hack 2026) | Snap Specs | Medium | AI single-shot composition coach; no coverage model, no sectors, no 180-rule | https://devpost.com/software/fraime |
| Scene Blocker (TigerVerse 2026) | Spectacles | Low–medium | Floor-anchored **theater actor** blocking paths; no camera semantics | https://devpost.com/software/scene-blocker |
| Act One (Lensathon 2025) | Spectacles | Low | Actor rehearsal in virtual sets; no camera planning | https://devpost.com/software/act-one-upg62n |
| Pool Assist (Studio ANRK) | Spectacles | Medium | Closest live angular-geometry instrument on a real surface on the platform — but billiards, not film | https://newsroom.snap.com/spectacles-pool-assist-studio-anrk |
| Public Speaker / Path Pioneer (official samples) | Spectacles | Low | Teleprompter; floor-path ingredient with no film semantics | https://github.com/Snapchat/Spectacles-Sample |
| Spectacles Community Challenges #1–#14 winner corpus | Lenslist | **Verified negative** | No filmmaking/coverage lens among ~120 winners | https://lenslist.co/spectacles-community-challenges |
| Snap Hackathon Showcase (343 projects) | Snap official | **Verified negative** | Only 5 filmmaking-adjacent projects, all listed above; none do coverage geometry | https://developers.snap.com/spectacles/spectacles-community/hackathon-showcase |
| maxprokopp/film-space (+ ARCore port) | iOS phone AR | Medium | AR blocking with stand-ins + focal presets (35/50/75/200mm); framing sandbox, no coverage analytics, no rule warnings | https://github.com/maxprokopp/film-space |
| nilstaylor/Shot-Planner | 2D web app | Medium (**nearest feature neighbor**) | FOV wedges + 180-line warnings + shot-size labels — but flat 2D browser, no AR, no coverage ring | https://github.com/nilstaylor/Shot-Planner |
| abi-amandi/CineAR | GitHub (README only) | Medium by pitch, none by substance | 1 commit, no code — "AR cinematography assistant" as a sentence | https://github.com/abi-amandi/CineAR |
| hedachuan/ar-previs | Browser sim | Low | Camera "coverage %" math — for exhibition installs, not film | https://github.com/hedachuan/ar-previs |
| Shot Designer (Hollywood Camera Work) | 2D desktop/mobile | **High (nearest conceptual neighbor)** | Manual top-down blocking diagrams with 180-line drawing; no auto coverage-gap computation, no warnings, no AR (3D is roadmap-only) | https://www.hollywoodcamerawork.com/shot-designer.html |
| Blocker (AfterNow, 2017) / Storyblocker / Previs Pro AR | Phone AR | Medium–high modality | AR shot **composition** at real locations; no coverage instrument, no 180-rule enforcement | https://apps.apple.com/us/app/storyblocker/id6445825105 |
| Artemis Pro / Cadrage / Magic Cinema ViewFinder (incl. visionOS) | iOS / Vision Pro | Medium | Per-shot framing simulation; never aggregates coverage. Cadrage discusses the 180-rule editorially only | https://www.chemicalwedding.tv/app%20Pages/artemisPro.php |
| Unreal Virtual Scouting / Cine Tracer / ShotPro / FrameForge | VR / desktop | Low–medium | Manual camera placement in fully virtual sets; no coverage-completeness instrument. FrameForge line-crossing feature **unverified** (site 404) | https://docs.unrealengine.com/5.3/en-US/virtual-scouting-overview/ |
| Shot Lister | iOS on-set app | Low–medium | The incumbent "what have we shot vs missed" answer — as a **text checklist**, zero spatial representation | https://www.shotlister.com/ |
| RealityScan (Epic) | Mobile photogrammetry | Medium (**nearest interaction analog**) | Live "which angles around a subject are captured vs missing" — for scan quality, not cinematic coverage | https://www.realityscan.com/ |
| CCTV planners / DroneDeploy orbit | Desktop/web | Low | Real FOV-cone coverage-gap math — surveillance and aerial mapping domains | https://cctvplanner.io/features |

## Nearest neighbors (synthesized)

- **Same platform + audience:** KinoPilot — filmmaker tool on Spectacles, but script/notes, not geometry; its own roadmap names our niche as unbuilt.
- **Same concept, different modality:** Shot Designer — subject-centric camera blocking with 180-line awareness, as a manual 2D diagram.
- **Same feature set, different modality:** nilstaylor/Shot-Planner — wedges + 180 warnings + shot labels in a flat web page.
- **Same modality, different concept:** film-space / Storyblocker / Previs Pro AR — phone-AR blocking of individual shots.
- **Same interaction pattern, different domain:** Pool Assist (live surface-anchored angle instrument), RealityScan (live angular capture-coverage feedback).

## Verdict

**Not preempted on AR glasses; novelty lies in the synthesis on that platform.** Across all four modalities, no product on any AR glasses/headset was found that renders a floor-plane live coverage instrument for cinematic shot planning. The original broader claim ("no product anywhere computes coverage gaps / 180° warnings") was **refuted post-audit** — browser shot designers do this on desktop screens (see addendum: Frameline 3D). The precise, defensible claim is: **the first live shot-coverage instrument on AR glasses** — spatial, hand-tracked, at 1:1 scale on the floor plane in front of the user. Confidence: high for the glasses-scoped claim; do not make platform-unqualified claims.

**Known caveats (state these honestly):**
1. Snap's on-device Lens Explorer catalog is not fully web-indexed; an unpublicized lens could exist below the search surface.
2. Entries to the current CLAD Summer Hackathon (and earlier theme weeks) are not yet public — same-competition duplicates could not be ruled out.
3. FrameForge's possible crossing-the-line indicator could not be conclusively ruled out (features page unreachable).
4. Blocker's (2017) current App Store availability was not verified.

## Differentiation language (for submission)

> Filmmakers already plan coverage — on paper, in diagram tools like Shot Designer, in browser shot designers like Frameline 3D (coverage gaps and line-crossing flags on a desktop screen), or as text checklists like Shot Lister; AR filmmaking tools to date center on composing and annotating individual shots. Shot Coverage Compass is, to the best of our research, the first live coverage instrument on AR glasses: a dial drawn on the floor plane in front of you that computes covered-vs-missing angles around your subject from live angular geometry as you drag wide/medium/close camera wedges, and flares the axis the moment a placement crosses the line. Coverage planning stops being a diagram you draw at a desk and becomes an instrument you read standing where you'll shoot — 1:1 scale, hands-free.

**Framing rules:** never claim "first AR filmmaking tool on Spectacles" (false — KinoPilot, FrAImed, Act One precede us); never make a platform-unqualified "first to combine wedges + 180 warnings" claim (a 2D web app already does); own the Pool Assist analogy rather than hiding it — the instrument pattern is proven on-platform, the domain and semantics are new.


## Post-audit addendum (2026-08-13)

An independent external audit challenged the breadth of this report. Corrections, verified before adoption:

- **Frameline 3D** (TTI Labs, browser-based 3D shot designer) — VERIFIED via live fetch: its "Shot Doctor" reviews "coverage gaps, 180° risks"; it has an "AXIS — 180° RULE" panel with a user-set line of action and CROSSES LINE flags; its "coverage math" places suggested setups spatially. Desktop browser, no AR/headset mode found. **This refutes any platform-unqualified "first to compute coverage gaps / 180° warnings" claim.** The AR-glasses-scoped claim stands.
- **Reported but not independently verified here:** StoryboardCanvas (geometric safe-side/crossing feedback), Artemis XR (in-room AR blocking on phone), CAMPLOT, Back-to-One, and prior real-time cinematography research handling line-of-action continuity. Treated as additional evidence that the *ingredients* are widespread; none was reported to run a live coverage instrument on AR glasses.
- **Methodology honesty:** the four-modality sweep (~106 queries) was broad, not exhaustive — no raw query ledger or result export is committed, and at least the tools above were missed. All claims in this document are therefore scoped to "found in the corpora searched", and product claims are platform-qualified.
- The phrase "compose or annotate one shot at a time" was overbroad for some AR tools (Previs Pro AR sequences multiple shots; Artemis XR supports in-room blocking) — the differentiation language above has been narrowed accordingly.
