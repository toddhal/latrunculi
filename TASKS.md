# TASKS.md — Current Mission

## Active Task: Step 2 — Engine Extraction

Read latrunculi_full.html and extract all pure game logic into 
separate files inside latrunculi-react/src/engine/

### Files to Create
1. `src/engine/constants.js` — EMPTY, WHITE, BLACK, WD, BD, WG, BG, DIRS, DIAG_DIRS
2. `src/engine/rules.js` — legalMoves, applyMove, winner, isLegalMove
3. `src/engine/ai.js` — minimax, evaluate, chooseMove
4. `src/engine/coach.js` — getDangerSquares, coachTurnAnalysis, explainMove

### Rules
- Pure JS only. Zero React imports. Zero DOM references.
- Copy logic faithfully from latrunculi_full.html — do not simplify or rewrite rules.
- Each file gets a comment at the top explaining what it does.

### Done When
- All 4 files exist in src/engine/
- Each file can be imported without errors
- No DOM or React references anywhere in engine/

### Do NOT
- Modify latrunculi_full.html
- Start building components yet — that is Step 3