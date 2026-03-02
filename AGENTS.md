# AGENTS.md — Latrunculi (Codex) Working Agreement

## Mission
Build a playable Latrunculi game in Python with:
- Clean rules implementation
- CLI play
- Optional coach mode (hints + analysis)
- Simple AI opponent (minimax/alphabeta)
- Tests + CI

## Non-negotiables (Quality Gates)
1) Every change must keep the test suite green.
2) Add/extend tests for any rule logic you modify.
3) Prefer small PR-sized commits with clear messages.
4) No "magic" assumptions—write it down in docs.

## Ruleset (v1)
Board: 8x8
Players: W and B
Pieces: identical men (no dux/king in v1)
Movement: rook-like sliding orthogonally any number of empty squares; no jumping.
Capture: custodial capture. After a move, any adjacent enemy piece is captured if it is sandwiched
         between the moved player's piece and another of the moved player's pieces on the opposite side
         orthogonally (N/S or E/W). Multiple captures may occur from one move.
Win: opponent has 0 pieces OR opponent has 0 legal moves.

# AGENTS.md — Latrunculi Full Edition

## Repo Contents
- latrunculi_standard.html   — Classic 8v8 Latrunculi, no special pieces
- latrunculi_dux.html        — Standard + Dux commander variant
- latrunculi_full.html       — All variants combined (primary file)

## Primary File
Work on: latrunculi_full.html
This is the flagship single-file app. All improvements go here.

## Game Variants (selectable in-game)
Standard   — Pure Latrunculi. Rook-movement, custodial capture, no special pieces.
Dux        — Adds one commander per side (e2/e7). Immune to sandwich; needs 4-surround.
Gladiator  — Adds 6 diamond warriors per side (B1-G1 / B8-G8). Move diagonally.
            Captured by diagonal Gladiator sandwich OR orthogonal round sandwich.
            Orthogonal capture by rounds triggers optional promotion.
Full       — All of the above simultaneously.

## Coach Modes
Spar     — Play vs AI. Choose difficulty Novice/Soldier/Tribune/Praetor (depth 1-4).
Hint     — Danger squares glow red. Coach warns before risky moves, flags captures.
Learn    — 6 structured lessons: capture geometry, danger squares, forks, gates,
           tempo/mobility, endgame technique.
Explain  — Click any move in history. Board replays position with color overlays:
           blue=origin, green=destination, red=captured, gold=engine suggestion.
           Coach explains why the move was good, bad, or missed an opportunity.
Review   — Postgame after-action report. Surfaces forks, blunders, hung pieces,
           missed captures. Displayed in win modal and Review tab.

## AI Engine
- Minimax + alpha-beta pruning.
- Evaluation: material, mobility, bracketing threats, trapped pieces, Dux safety.
- Dux safety term: penalizes 3-of-4 surround, rewards encircling enemy Dux.
- AI auto-promotes Gladiators when earning the right.

## Non-Negotiables
1. All variants must work correctly. Rules are as specified in RULES.md v2.
2. The Dux is only captured by 4-surround (NOT edge proximity).
3. Gladiator diagonal captures require BOTH the mover AND anchor to be Gladiators.
4. Orthogonal round captures of Gladiators always trigger promotion choice for human.
5. Keep the file single-file HTML/CSS/JS. No build step. No frameworks.
6. Pytest suite must stay green if rules.py is touched.
