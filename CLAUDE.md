# buildmyroutine.app (repo: glow-skincare-app)

Nicknames David uses: **buildmyroutine, buildroutineapp, glow app**. React/Vite +
Express/Drizzle. Three sub-apps: **Glow** (skincare quiz) · **Vita** (vitamins — dosing
changes need David's PharmD sign-off) · **Roam** (travel; episode data lives in
`client/src/lib/roam-data.ts`; catalog provenance in `data/roam-catalog-audit.json`
+ `data/roam-roster-audit.json` — regenerate via the roam-ingest pipeline, never hand-add).

## Ship
- Netlify auto-deploys **ONLY on push to main** via GH Actions — feature branches deploy
  nothing (past confusion: "fixed" work sitting on a branch).
- CI gates = `tsc --noEmit` + roam validator + monthly link-check. Run tsc locally before
  pushing.
- gh account **dkoon5501** — run `gh auth status` first (token expires silently); device
  flow when David may be remote.
- Sync with origin/main BEFORE multi-file work (a 31-conflict PR came from skipping this).

## Working style
- plan2 before big builds; bite-size file-at-a-time edits (prior sessions hit timeouts on
  big batches).
- Post-deploy acceptance = the LIVE site at 390px width (mobile-first; David checks on
  his phone).
- Preserve David's Claude chat reserve on long Roam/Glow/Vita work. If a Claude run approaches the
  final ~5% of session quota or shows a limit/reset warning, stop heavy work, write/update the current
  `RESUME-STATE.md` plus `/Users/dkoon/Max/NOW.md`, then schedule autoresume for one minute after reset.
  If still limited on wake, do no work and retry every 15 minutes until reset clears.

## State (07-04 late — repair week SHIPPED, all of the 07-04 review's known issues fixed)
- Glow routineSteps corruption FIXED (Save Routine + Rate My Routine work; products deduped to 200;
  honest "N derms" badges; consensus scoring + discard memory live). Do NOT re-add seed-upvotes.
- Roam: share links work via `roam/` OG shell + `_redirects`; 56 misattributed episodes re-credited
  (attribution = the channel that HOSTS the video, verified via oEmbed); scoring deterministic;
  corrupted share codes → invalid-link screen. Marketing no longer claims "8 trusted creators".
- Vita dosing gated (2000 IU D default, 5000 IU deficiency-only, iron needs deficiency/pregnancy)
  — awaiting David's PharmD sign-off; clinical changes ONLY with his approval.
- Privacy + Terms pages live; testimonials replaced with real-number stat band (never invent counts).
- CI gates (deploy.yml): `npm run check` (tsc) + `scripts/validate-roam-data.mjs` (schema + 112-combo
  quiz coverage via the real scorer) + monthly `scripts/check-links.mjs` action.
- IN FLIGHT: Roam creator expansion — top-50 research done, 21-channel roster, yt-dlp transcript
  ingestion pipeline in session scratchpad `roam-ingest/` (enumerate → select → subs → extract
  workflow with blind destination verification). US zone "West" currently has 0 episodes (honest;
  taxonomy overlaps Rocky Mtns/Southwest — candidate for a redesign, ask David).

If this repo moves off ~/Desktop, update /Users/dkoon/Max/PROJECTS.md and this file.
