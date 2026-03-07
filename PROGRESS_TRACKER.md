# PROGRESS_TRACKER.md

## Step 1 — Project Scaffolding
- [x] `latrunculi-react` folder created with Vite + React template
- [x] `npm install` completed (157 packages)
- [x] Tailwind CSS v4 installed with `@tailwindcss/vite` plugin
- [x] Tailwind wired into `vite.config.js` and `src/index.css`
- [x] `npm run dev` launches React app at http://localhost:5173 with no errors

## Step 2 — Engine Extraction
- [x] Read latrunculi_full.html and mapped all JS logic
- [x] `src/engine/constants.js` — EMPTY, WHITE, BLACK, WD/BD/WG/BG, SIZE, DIRS, DIAG_DIRS, FILES, all helpers
- [x] `src/engine/rules.js` — legalMoves, isLegalMove, applyMove, isDuxSurrounded, winner
- [x] `src/engine/ai.js` — evaluate, minimax, chooseMove, orderedMoves, duxSurroundCount
- [x] `src/engine/coach.js` — PRINCIPLES, getDangerSquares, getForkMoves, getBracketingMoves, analyzeHint, coachTurnAnalysis, generateReview, explainMove
- [x] All 4 files import cleanly, smoke test passes (40 legal moves, AI picks move, winner=null at start)

## Step 3 — Component Architecture
- [ ] TBD

## Step 4 — Component Implementation
- [ ] TBD

## Step 5 — Integration
- [ ] TBD
