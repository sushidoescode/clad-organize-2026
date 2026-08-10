# CLAD Summer Hackathon — Claude Code Start Here

## 1. Immediate setup sequence

1. Open Lens Studio first.
2. Create **SPECS → Base Template** and save it into a new dedicated project folder.
3. Sign into Lens Studio.
4. Open Terminal in that exact project folder.
5. Verify Claude Code is current and launch it from the project folder.
6. Select Fable 5, install the official Lens Studio extensions marketplace and CLAD plugin, reload plugins, and verify MCP.
7. Put the research files in `.context/research/`.
8. Put the persistent operating contract below into the project-root `CLAUDE.md`.
9. Paste the kickoff prompt below into Claude Code.
10. Do not let Claude edit the Lens scene until it finishes the evidence audit and concept decision gate.

### Terminal

```bash
cd "/absolute/path/to/your/saved-lens-studio-project"
claude --version
claude
```

### Inside Claude Code

```text
/model
/status
/plugin marketplace add https://github.com/lens-studio-devs/ls-extensions.git
/plugin install ls-clad@ls-extensions
/reload-plugins
/plugin
/mcp
```

Select **Fable 5** through `/model`. Confirm the `ls-clad` plugin is installed and that the Lens Studio MCP server is connected.

### Suggested project folders

```text
project-root/
├── CLAUDE.md
├── .context/
│   └── research/
│       ├── CLAD_Summer_Hackathon_Deep_Research_Strategy.md
│       ├── CLAD_200_Differentiated_Project_Ideas.json
│       ├── clad_hackathon_terms.pdf
│       └── prior-research/               # optional legacy AI reports
├── docs/
│   ├── research-audit.md
│   ├── idea-scorecard.md
│   ├── decision-memo.md
│   ├── product-spec.md
│   ├── architecture.md
│   ├── risk-register.md
│   ├── prompt-log.md
│   ├── test-evidence.md
│   ├── performance.md
│   └── demo-script.md
└── [Lens Studio project files]
```

Do not commit local MCP bearer tokens, credentials, private keys, or secrets. Inspect any generated MCP configuration before making the repository public.

---

## 2. Project-root `CLAUDE.md`

Copy the following into `CLAUDE.md` at the root of the saved Lens Studio project.

```markdown
# CLAD Summer Hackathon Operating Contract

## Mission
Build a polished, original, unbranded SPECS Lens for the active CLAD Summer Hackathon theme using Lens Studio and CLAD. Optimize for a convincing one-week vertical slice, not feature breadth.

## Current entrant context
- Solo developer with strong Node.js/web/backend experience.
- Junior-to-intermediate Unity/XR experience.
- Existing mixed-reality planetarium experience.
- Strong interests in spatial computing, documentary filmmaking, research, UI/UX, and agentic workflows.

## Source priority
1. Current official Lenslist hackathon page and official Terms & Conditions.
2. Current official SPECS, CLAD, Lens Studio, Snap, installed-package, and official sample documentation.
3. `.context/research/CLAD_Summer_Hackathon_Deep_Research_Strategy.md`.
4. `.context/research/CLAD_200_Differentiated_Project_Ideas.json`.
5. Legacy AI reports, treated only as unverified hypotheses.

Never silently resolve conflicts. Record the conflict, prefer the current primary source, and explain the consequence.

## Mandatory engineering workflow
1. Inspect before editing: project files, scene graph, packages, scripts, logs, Preview state, and relevant context.
2. Use current documented Lens Studio/SPECS APIs and CLAD agents/skills. Never invent APIs, packages, components, permissions, or events.
3. Keep runtime Lens TypeScript and Lens Studio editor automation separate.
4. Prefer typed, event-driven components, explicit state machines, and one source of truth.
5. Use SPECS UI Kit for flat readable UI and Spectacles Interaction Kit for 3D hand interactions. Do not hand-roll collider buttons where native UI fits.
6. Build the smallest complete vertical slice first. No secondary feature until the critical flow works.
7. After every meaningful change: compile, inspect runtime logs, exercise behavior in Preview, and run `/verify-preview`. A clean compile alone is not success.
8. Once core behavior is stable, add persistent LEAF scenarios for the primary path and one recovery path.
9. Profile before optimizing. Apply measured, reversible fixes one at a time and verify visual parity.
10. Any camera, microphone, location, internet, AI, cloud, or shared-state feature requires a visible state and deterministic local fallback.
11. Keep user-facing content unbranded and use only original or clearly licensed assets.
12. Protect the deadline. Propose the smallest scope cut whenever risk rises.
13. Maintain `docs/prompt-log.md`, `docs/test-evidence.md`, `docs/performance.md`, and the README during development.
14. Commit only verified states. Never commit secrets, MCP bearer tokens, credentials, or private data.
15. Report what was observed, changed, verified, uncertain, and next. Do not claim unobserved behavior.

## Product gates
- Theme fit is understood in under 10 seconds.
- It genuinely needs spatial computing rather than a phone UI.
- Its magic moment occurs within 20 seconds.
- It can be demonstrated deterministically in Preview without SPECS hardware.
- Scope can be completed and packaged within one week.
- The final tagged commit passes critical tests and has reproducible reviewer instructions.

## Submission discipline
Preserve exact prompts and annotate each important CLAD iteration with intent, agents/skills used, result, verification evidence, decision, and commit hash. The demo must tell one clear problem → spatial action → transformation story.
```

---

## 3. Master kickoff prompt for Fable 5

Paste this after the CLAD plugin and Lens Studio MCP are connected.

```text
You are now the lead spatial-computing product strategist, skeptical hackathon judge, principal Lens Studio/SPECS engineer, and execution lead for my CLAD Summer Hackathon project.

This is not permission to immediately generate a Lens. First perform a rigorous, evidence-backed intake and concept decision. The research recommendation is a hypothesis, not an instruction. You may reject it.

ACTIVE CHALLENGE
- Weekly theme: Organize.
- Goal: build a useful spatial experience that helps people organize, plan, or be more productive.
- Treat current official Lenslist terms, dates, submission requirements, and judging weights as authoritative and re-verify them now.
- The working research hypothesis is “Continuity Compass,” but you must independently compare it against the full Organize idea catalog and stronger alternatives.

LOCAL SOURCES TO INGEST
1. `.context/research/CLAD_Summer_Hackathon_Deep_Research_Strategy.md`
2. `.context/research/CLAD_200_Differentiated_Project_Ideas.json`
3. `.context/research/clad_hackathon_terms.pdf`
4. Everything under `.context/research/prior-research/`, if present.
5. The current `CLAUDE.md` operating contract.
6. Current project files, scene, packages, logs, and Preview state through Lens Studio MCP.

SOURCE RULES
- Read the research files rather than relying on filenames or summaries.
- Treat the deep-research strategy and idea catalog as a serious starting point, not ground truth.
- Treat legacy AI material as unverified.
- Recheck important claims against current official Lenslist, SPECS, CLAD, Lens Studio, Snap, installed-package, official sample, and official GitHub sources.
- If a PDF or DOCX cannot be parsed reliably, state that explicitly and extract it safely or use its official source. Never pretend it was read.
- Distinguish confirmed fact, inference, recommendation, and unresolved uncertainty.
- Do not invent APIs, past winners, capabilities, rules, or evidence.

PHASE A — READ-ONLY ENVIRONMENT AUDIT
Do not modify files or the Lens scene yet.

1. Confirm Lens Studio version, SPECS target, Preview profile, active camera/world tracking, installed packages, CLAD plugin availability, MCP connection, compile status, runtime logs, and current scene contents.
2. Identify local generated files or MCP configuration that must never be committed publicly.
3. Determine which official CLAD agents/skills are actually available in this session.
4. Return blockers ranked Critical / High / Medium / Low.
5. Propose the smallest corrective setup actions, but do not perform them until the audit is complete.

PHASE B — SOURCE AND REQUIREMENTS AUDIT
Read all supplied research and independently verify the decision-critical claims.

Create `docs/research-audit.md` containing:
- current theme, dates/time zone, submission artifacts, judging weights, repo/video/prompt-log requirements, and important terms constraints;
- a source ledger with Fact / Inference / Unverified / Conflict labels;
- any material corrections to the supplied research;
- technical capabilities that are confirmed in current CLAD and installed packages;
- capabilities that are risky, device-dependent, permission-dependent, backend-dependent, or unsuitable for one week;
- unresolved questions that could alter concept selection.

PHASE C — INDEPENDENT ORGANIZE IDEA VETTING
Evaluate all 50 Organize concepts in the JSON catalog. Do not only inspect the already-ranked shortlist. You may add at most 10 new challenger concepts only when you can identify a genuine uncovered white space.

For each serious contender, evaluate:
1. Theme fit: understandable in under 10 seconds.
2. Spatial inevitability: why this belongs on SPECS rather than a phone/browser.
3. CLAD showcase value: meaningful build, Preview verification, LEAF, and measured optimization story.
4. One-week feasibility for this solo developer.
5. Twenty-second magic moment and sub-60-second demo clarity.
6. Novelty and likely LLM-convergence risk.
7. Technical and dependency risk without physical hardware.
8. UX/readability/interaction risk.
9. Compliance, permissions, asset, privacy, and branding risk.
10. Deterministic fallback quality.

Use weighted scoring only as a decision aid. Explain tradeoffs and do not manufacture precision.

Explicitly pressure-test Continuity Compass:
- Is the organizing value immediately obvious?
- Is actual-room camera geometry technically reliable enough in Preview?
- Can a fixed rehearsal-floor version preserve the spatial thesis?
- Does it risk feeling too niche, too much like a filmmaking tool, or too visually quiet?
- Is there another Organize idea with a stronger CLAD showcase, clearer utility, or better video moment at equal or lower risk?

Create:
- `docs/idea-scorecard.md` with the top 10 and transparent scoring;
- `docs/decision-memo.md` with the top 3, strongest objections to each, minimum winning MVP, scope-cut fallback, technical dependencies, and one recommendation;
- `docs/risk-register.md` for the recommended concept.

PHASE D — DECISION GATE
Present me with:
1. your recommended concept;
2. why it beats the other two finalists;
3. the smallest MVP that still has a winning thesis;
4. the exact 20-second magic moment;
5. the first three-hour feasibility test;
6. the kill criteria that would force a pivot;
7. the fallback concept if the feasibility test fails.

Then stop all implementation and print exactly:
`DECISION GATE — reply APPROVE <concept name> to begin the vertical slice.`

PHASE E — AFTER I APPROVE A CONCEPT
Only after explicit approval:

1. Create or finalize `docs/product-spec.md`, `docs/architecture.md`, and `docs/prompt-log.md`.
2. Define one primary user, one real-world moment, one spatial relationship, one state model, one critical flow, at least five non-goals, and observable acceptance criteria.
3. Initialize/validate the SPECS project with documented CLAD setup skills and reset Preview safely.
4. Create a short-lived `vertical-slice` branch from a clean, verified baseline.
5. Build only the first complete action → visible consequence loop. Avoid networking, cloud, AI, persistence, generated assets, elaborate shaders, and secondary UI unless indispensable to that loop.
6. Compile, inspect logs, exercise the interaction in Preview, and run `/verify-preview` against every acceptance criterion.
7. Fix deterministic defects only. Do not hide a failing interaction behind scripted video behavior.
8. Capture evidence and append to the prompt log: exact prompt, intent, agents/skills used, observed result, verification, decision, and commit hash.
9. Commit the verified slice.
10. Stop and report whether the three-hour feasibility gate passed, failed, or passed only with a scope cut.

AUTONOMY AND QUALITY RULES
- Use CLAD’s router/orchestrator and documented skills when appropriate; do not invoke named skills theatrically just to pad the prompt log.
- Use Experience Builder only when it helps, then inspect and verify every generated result.
- Do not parallelize multiple agents against the same Lens Studio scene. Parallel agents may research, review, test fixtures, or draft documentation, but one designated Lens Studio agent owns scene mutations.
- Keep `main` demoable and use small commits after verified milestones.
- Keep the repository private during development unless a rule requires otherwise; make it public only after a final secret/compliance audit and before submission.
- Never commit bearer tokens, MCP config secrets, credentials, or private user data.
- Prefer a polished, deterministic vertical slice over ambitious breadth.
- No feature may enter after the agreed scope-freeze gate without replacing another feature.

Begin with Phase A now. Do not edit anything.
```

---

## 4. Connection smoke-test prompt

Use this before the master kickoff prompt if you are unsure whether MCP works:

```text
Read-only smoke test. Do not modify the project. Through the Lens Studio MCP, report the current scene objects, active camera and tracking mode, target platform, Preview profile, installed packages, compile/runtime log state, and one screenshot or Preview description. Then list the CLAD plugin agents/skills visible to you. If any of this cannot be accessed, identify the exact failed connection or missing capability.
```

---

## 5. Recommended Week 1 feasibility gate if Continuity Compass survives vetting

The first slice should contain only:

- a fixed rehearsal floor;
- one subject mark;
- one draggable camera marker;
- one projected camera wedge;
- one visible coverage/category state change;
- Reset;
- a successful `/verify-preview` pass.

If free placement is unreliable, immediately cut to fixed-plane movement and three snap zones. Do not add continuity tokens, persistence, generated meshes, AI, camera capture, or cloud features until this slice works.
