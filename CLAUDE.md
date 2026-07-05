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

## State (07-05 — Roam creator expansion SHIPPED: 7f63c10 + 9b67fd0)
- Roam catalog: **356 verified episodes / 21 channels** (176 oEmbed-verified survivors kept, 81
  off-roster dropped, 180 new via transcript extraction + blind destination verification).
  Provenance: `data/roam-catalog-audit.json` + `data/roam-roster-audit.json`. Regenerate via the
  roam-ingest pipeline only — never hand-add episodes.
- Scorer uses HARD TIERS (+100 direct-region, +50 zone): a chosen region can never be topped by a
  Global fallback, a chosen US zone always ranks its episodes first. Don't shrink these back to
  nudge-sized bonuses — preference points max at 11.4.
- All titles are editorial "Dest: Label" house style (297 rewritten). Validator rejects clickbait
  artifacts, asserts region honesty + zone ordering through the real scorer in CI.
- Thumbnails: maxresdefault 404s decode as a 120x90 placeholder (onError never fires) — cards swap
  to hqdefault via naturalWidth check on load.
- OPEN (David decisions): US zone taxonomy — West has 0 episodes, no Northeast/Midwest buckets;
  NYC + Badlands deliberately zoneless (ZONELESS_OK in validator). Vita dosing PharmD sign-off
  still pending; clinical changes ONLY with his approval.
- Glow: routineSteps fixed 07-04 (Save/Rate work, 200 products deduped, honest "N derms" badges,
  consensus scoring, discard memory). Do NOT re-add seed-upvotes.
- Privacy + Terms live; real-number stat band (never invent counts). CI gates (deploy.yml):
  `npm run check` + `scripts/validate-roam-data.mjs` + monthly `scripts/check-links.mjs`.
- NEXT (David 07-05): make all-inclusive resorts easy to search; if coverage is thin, research and
  add the top 50-100 all-inclusives via the verified pipeline.

If this repo moves off ~/Desktop, update /Users/dkoon/Max/PROJECTS.md and this file.
