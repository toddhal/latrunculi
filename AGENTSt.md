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

## Repo Structure (target)
latrunculi/
  __init__.py
  rules.py        # board state, move gen, capture resolution
  ai.py           # minimax/alphabeta, evaluation
  coach.py        # explain/hint layer (threat checks, "hung piece" warnings)
  cli.py          # interactive CLI
tests/
  test_rules.py
  test_captures.py
  test_ai_smoke.py
docs/
  RULES.md
  DESIGN.md

## Dev Workflow
- Start each task by writing/confirming acceptance criteria.
- Implement core rules first, then CLI, then tests, then AI, then coaching.
- When uncertain, add a short note to docs/ (DESIGN.md or RULES.md).

## Tooling
- Python 3.11+
- pytest
- ruff (optional but encouraged)
- mypy (optional)

## Definition of Done
- `pytest` passes
- CLI can complete a full game without crashing
- Capture rules validated by tests (edge cases included)
- AI can play legal moves and finish games
- Basic documentation exists
