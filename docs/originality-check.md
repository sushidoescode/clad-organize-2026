# Originality Check — Shot Coverage Compass

**Date:** 2026-08-11 · **Context:** CLAD Summer Hackathon (theme "Organize"), Snap SPECS Lens built in Lens Studio.
**Claim under test:** Is a live, floor-anchored, subject-centric shot-coverage instrument on AR glasses already done — on Snap's platform, in Lens Studio projects, on GitHub, or as an adjacent product elsewhere?

## Methodology

Four independent search modalities were run to exhaustion, then synthesized:

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

**Not preempted; novelty lies in the synthesis, and the synthesis is unclaimed.** Across all four modalities, no product on any AR glasses/headset renders a floor-anchored live coverage instrument for cinematic shot planning, and no product anywhere spatially and automatically tracks covered-vs-missing angles of dramatic coverage or enforces the 180-degree rule geometrically in real time. The precise, defensible claim is: **the first live shot-coverage instrument on AR glasses — and, as far as public sources show, the first tool on any platform to compute cinematic coverage completeness and 180-degree-rule violations live from real spatial geometry.** Confidence: high for the glasses-scoped claim; moderate-high beyond it.

**Known caveats (state these honestly):**
1. Snap's on-device Lens Explorer catalog is not fully web-indexed; an unpublicized lens could exist below the search surface.
2. Entries to the current CLAD Summer Hackathon (and earlier theme weeks) are not yet public — same-competition duplicates could not be ruled out.
3. FrameForge's possible crossing-the-line indicator could not be conclusively ruled out (features page unreachable).
4. Blocker's (2017) current App Store availability was not verified.

## Differentiation language (for submission)

> Filmmakers already plan coverage — but only on paper, in 2D diagram apps like Shot Designer, or as text checklists like Shot Lister; AR filmmaking tools to date (KinoPilot's script supervisor, FrAImed's AI framing coach, phone blocking apps like film-space and Storyblocker) compose or annotate one shot at a time. Shot Coverage Compass is, to the best of our research across the Snap ecosystem, GitHub, and adjacent products, the first live coverage instrument on AR glasses: a floor-anchored dial that computes covered-vs-missing angles around your subject from real spatial geometry as you drag wide/medium/close camera wedges, and flares the axis the moment a placement breaks the 180-degree rule. Coverage planning stops being a diagram you draw and becomes an instrument you read — at 1:1 scale, hands-free, on the actual floor where you'll shoot.

**Framing rules:** never claim "first AR filmmaking tool on Spectacles" (false — KinoPilot, FrAImed, Act One precede us); never make a platform-unqualified "first to combine wedges + 180 warnings" claim (a 2D web app already does); own the Pool Assist analogy rather than hiding it — the instrument pattern is proven on-platform, the domain and semantics are new.
