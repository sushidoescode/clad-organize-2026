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
