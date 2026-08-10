# Research Audit — CLAD Summer Hackathon, Week 1 "Organize"

Audited 2026-08-10 (day 1 of the submission window). Method: full read of the local Terms & Conditions PDF (extracted with pdftotext, 530 lines, clean parse), full read of all 50 Organize catalog entries, sectioned distillation of the 4,655-line strategy document by three parallel readers, and live web verification of the official Lenslist page and the CLAD/SPECS/Lens Studio ecosystem against current official sources. Labels: **Fact** (verified against a primary source), **Inference** (reasoned, plausible, unproven), **Unverified** (asserted without source), **Conflict** (sources disagree).

## 1. Verified challenge parameters

| Parameter | Value | Label / source |
|---|---|---|
| Current theme (Week 1) | **Organize** — official brief: "Build a spatial experience that helps people organize, plan, or be more productive." | Fact — lenslist.co/clad-summer-hackathon (fetched 2026-08-10) |
| Week 1 window | Mon **Aug 10** – Sun **Aug 16, 2026**; T&C clock: 00:00:01–23:59:59 "PST"; winners Aug 20 | Fact — T&C §2 + site. Site says only "PT"; see unresolved Q3 |
| Other weeks | #2 Guide (Aug 17–23) · #3 Connect (Aug 24–30) · #4 Create (Aug 31–Sep 6); workshops Tuesdays 8am PT (first: **Aug 11**) | Fact — site (T&C only guarantees "at least 4") |
| Judging | Stage 1: yes/no gate (T&C-only). Stage 2: **50% CLAD Execution / 25% User Experience / 25% Creativity & Usefulness** | Fact — T&C §6.2 + site, wording matches |
| Submission artifacts | (1) **public** project repo link; (2) demo video via Drive/Dropbox/WeTransfer showing walkthrough, key features, CLAD usage; (3) **CLAD prompt log** (text/transcript/doc); (4) project description (what, theme response, who for). Submitted on the Lenslist site; confirmation email expected | Fact — T&C §5.2 + site |
| Video length | **Under 60 seconds** | Fact — T&C §5.8(g). **Site states no limit** — the cap binds via the PDF the site links; follow it |
| Prizes | $1,000 / $500 / $200 weekly; $6,800 total pool | Fact — T&C §7 + site |
| Hardware | Not required — "your Lens should be built for SPECS, but you do not need the device" | Fact — site |
| Tooling | Lens Studio **5.22+** required (site); installed 5.23.1 is the **current** release (2026-08-05) | Fact — site + ar.snap.com/download |
| Entry constraints | Original, solely created, never previously published/commercialized/awarded; **no third-party brand/product/service names, trademarks, logos, trade dress**; English materials; public/unprotected Snapchat account through judging; must follow Lens Studio Submission Guidelines; multiple entries allowed only if substantially different | Fact — T&C §5.8, §5.2(b) |
| Winner obligations | Source/proof of work on request within 7 days; Awardee Agreement within 7 days; payment ≤90 days; broad irrevocable license to Sponsor/Organizer + moral-rights waiver (entrant keeps ownership) | Fact — T&C §6, §8 |

## 2. Source ledger

| Source | Assessment |
|---|---|
| `clad_hackathon_terms.pdf` (local) | **Fact-grade.** Parsed cleanly. Identical filename/date to the PDF the official page links (`Terms-and-Conditions-CLAD-Hackathon-SPECS-29_07.pdf`). T&C §10.2: the T&C takes precedence over other documents. |
| lenslist.co/clad-summer-hackathon (live fetch) | **Fact-grade** for theme, dates, weights, prizes, artifacts. Under-discloses vs T&C: no video cap, no yes/no gate, no account/branding/originality clauses on the page — those still bind via the linked PDF. |
| Official ecosystem docs (developers.specs.com, ar.snap.com, developers.snap.com, github.com/specs-devs, live Asset Library) | **Fact-grade.** CLAD = "Closed loop agentic development… a suite of agents and skills which allow AI to create in Lens Studio, optimized for SPECS." LS 5.23.1 current; LEAF v2.0.2 in Asset Library (requires SIK, versions must match); SIK 2.0.0 / UIKit 2.0.0 current for the SPECS 27 track; SyncKit 2.0.1 available; samples at github.com/specs-devs. **Trap:** legacy Spectacles-2024 doc pages still list SIK 0.17.x / UIKit 0.1.x — wrong track, ignore. |
| `CLAD_Summer_Hackathon_Deep_Research_Strategy.md` | **Mixed.** Its fact sheet matches the T&C on every overlapping point (no Conflicts found). Its convergence map, rankings, UX system, and scope recipes are **Inference** — plausible, internally consistent, but unsourced (no scraped competitor data). Research cutoff Aug 8; Community Challenge #14/#15 winner signals absent. |
| `CLAD_200_Differentiated_Project_Ideas.json` | **Consistent** with the strategy doc §7 (all 50 Organize names/IDs match exactly). The per-idea `scores` quadruples have unlabeled axes — treated as author self-assessment, not evidence. Catalog banding: 01–10 professional, 11–20 civic/community, 21–30 cultural, 31–40 playful, 41–50 technically ambitious. |
| Environment (this session, via MCP) | **Fact-grade, observed live**: LS 5.23.1.26080420; SPECS 27 preview; Perspective camera + DeviceTracking World; SIK/UIKit 2.0.0 installed; LEAF/SyncKit not yet installed; compile clean; ls-clad 1.0.0 active; signed in; repo private. |

## 3. Material corrections to the supplied research

1. **The shortlist under-weights the #1 judging criterion.** The strategy doc's §8 rankings and final-three guide are built almost entirely on spatial legibility, UX, and reliability, and its evidence rubric omits the required CLAD prompt log — yet CLAD Execution is 50% of stage-2 scoring. Its Organize top-5 (O01, O09, O06, O45, O50) is a legitimate input but must be re-scored with CLAD-showcase weight restored. (Its §1 does acknowledge the 50% weight; the ranking section doesn't operationalize it.)
2. **A reader-flagged "unverified agents" caveat is itself wrong:** `script-author`, `editor-api-specialist`, `live-lens-tester`, and `specs-sync-kit-validator` all exist in the installed ls-clad 1.0.0 plugin — confirmed in this session's agent roster.
3. **Convergence predictions are heuristics, not measurements** — no competitor data was scraped. Useful as a prior, not as proof of what others will submit.
4. **Mobile-Lens limits (8 MB ZIP / 150 MB RAM / 27 FPS / 2048² textures) are Snapchat-mobile-phrased.** SPECS-specific budgets were not verifiably confirmed; treat these as conservative ceilings, don't cite them as SPECS facts.
5. Corrections the doc itself made to older legacy research — video <60s (not 90s), public repo mandatory, brand ban, strict originality — all check out against the T&C and are adopted.

## 4. Technical capabilities confirmed for this build (today, this machine)

- **Full CLAD loop available and exercised this session:** MCP scene/asset GraphQL, VirtualScene, ExecuteEditorCode, TypeScript recompile, log capture (refresh + tail), Preview screenshot/runtime capture, simulated interaction (SIK-based preview gestures), LEAF install/write/run skills, Perfetto trace + perf attribution/optimize skills, publish skill. 8 agents + ~50 skills enumerated.
- **Packages:** SIK 2.0.0 ✓ installed · UIKit 2.0.0 ✓ installed · LEAF 2.0.2 ⏳ installable (account signed in; SIK version matches) · SyncKit 2.0.1 installable but out of scope for Organize.
- **Preview (SPECS 27, Interactive) credibly demonstrates:** scene composition, state machines, simulated pinch/drag/hover flows, deterministic persistence with fixtures, UI readability, LEAF runs, perf traces, a no-hardware demo mode. (Inference from doc, consistent with tools verified live here.)
- **Asset generation:** build-mesh (SPECS text-to-3D, FAST3D, MeshBuilder scripting, Blender voxel), build-sfx/music (offline, license-clean), icon/font selectors — all local plugin skills.

## 5. Capabilities that are risky, dependent, or unsuitable for this one-week solo build

| Capability | Why risky | Verdict for Week 1 |
|---|---|---|
| Camera/depth/mic/ASR at runtime | Permission review; Preview cannot prove real-world fidelity (noise, lighting, occlusion) | Avoid; use manual input + fallbacks |
| Location / Custom Locations | Unverifiable without hardware/outdoors | Avoid; tabletop demo modes only |
| Sync Kit / multiplayer | Highest failure-mode count; needs role-replay fallback; wrong theme week | Avoid |
| Internet / cloud / Snap Cloud | Permission review when combined with sensors; nondeterministic demo | Avoid; local persistence only |
| Generative AI at runtime; generative-3D pipelines in the demo path | Latency owns the demo; "generic AI chat" is a flagged weak pattern | Avoid in-Lens; CLAD builds the Lens instead |
| NDK/native | Doc: only if core works by Day 2 | Avoid |
| Physics-driven core mechanics | Instability in demos | Prefer snap zones / deterministic tweens |
| Dense world-space text | Readability is the #1 spatial UX failure; 2° min target size, ~4–6 cm at 1.1 m | Concepts built on reading many labels are penalized |
| Anchor persistence across sessions | Drift unprovable in Preview | Session-scoped placement; fixed-floor fallback |

## 6. Unresolved questions that could alter concept selection

1. **Is publishing the Lens required?** T&C §4.1 says the task is "building, publishing and submitting"; the deliverables list (§5.2d) and the site omit any publish destination. Reading: repo+video+log+description are what's judged; publishing is likely optional-but-safe. **Mitigation:** plan a publish attempt late in the week (signed in, publish skill available), but never let it gate submission. Ask Lenslist (info@lenslist.co / Discord) early in the week.
2. **No-brands clause vs naming CLAD/SPECS/Lens Studio.** The submission inherently requires naming the tooling (the site demands the video show "how it uses CLAD"). Reading: the ban targets the *Lens content* (§4.2/§5.8e "Entry must not contain…"), not the README/prompt log. **Mitigation:** zero brand names inside the Lens itself; neutral fictional data everywhere; tooling names only in docs. Optionally confirm with organizer.
3. **"PST" vs PDT.** August Pacific time is PDT; T&C says PST (a 1-hour ambiguity). **Mitigation:** submit Sunday Aug 16 by ~20:00 local Pacific at the latest; target Saturday.
4. **SPECS-specific size/perf budgets** unverified (see §3.4). **Mitigation:** conservative budgets; measured perf pass regardless.
5. **Cross-week reuse of a private generic-utility starter.** Ambiguous under §5.8(a-b). **Mitigation:** this week's repo is self-contained; only process templates (doc structures, prompts) travel between weeks.
6. **Stage-1 yes/no gate criteria are unpublished.** **Mitigation:** make theme fit legible in <10 s of the video and the working demo undeniable — the gate most plausibly screens "does it fit the brief and actually work."

## 7. Consequences adopted for Phase C scoring

- CLAD-showcase potential is scored as the single heaviest criterion (mirrors 50% weight) — but it mostly differentiates via *build substance and verifiability*, since any buildable concept can host the full loop.
- Feasibility-with-determinism acts as a gate: a concept that can't reach a polished, deterministic Preview demo by Day 6 scores near-zero regardless of appeal.
- Phone-removal test applied to every contender (doc's test, adopted).
- Compliance screens: no brands, no regulated/safety-critical framing, no privacy-sensitive capture, original assets only.
