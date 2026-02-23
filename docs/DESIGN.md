# Latrunculi v1 Design

## File plan
- `latrunculi/__init__.py`: package exports.
- `latrunculi/rules.py`: immutable game state, move generation, capture resolution, terminal detection.
- `latrunculi/cli.py`: command-line gameplay loop, rendering, input parsing.
- `latrunculi/ai.py`: minimax with alpha-beta pruning and a simple heuristic.
- `tests/test_rules.py`: board and movement behavior.
- `tests/test_captures.py`: custodial capture edge cases.
- `tests/test_ai_smoke.py`: AI legality and game progression smoke tests.
- `.github/workflows/ci.yml`: run `pytest` on push and pull requests.

## Core data model
`GameState` is a frozen dataclass:
- `board: tuple[tuple[str, ...], ...]` where each cell is `"."`, `"W"`, or `"B"`.
- `to_move: str` either `"W"` or `"B"`.

Immutability keeps search code safe and avoids accidental mutation bugs.

`Move` is represented as:
- `src: tuple[int, int]`
- `dst: tuple[int, int]`

Coordinates are internal as `(row, col)` zero-indexed with row `0` = rank `8`.

## Rules pipeline per move
1. Validate source/destination and side-to-move.
2. Validate rook-line path is unobstructed.
3. Move piece on copied board.
4. Resolve custodial captures from moved piece in four orthogonal directions.
5. Flip `to_move`.
6. Return new immutable `GameState`.

## Terminal logic
`winner(state)` evaluates:
- Piece exhaustion first.
- Otherwise legal moves for side to move; if none, opponent wins.
- Else game is ongoing (`None`).

## AI approach
Depth-limited minimax with alpha-beta pruning:
- Utility uses high-magnitude terminal scores.
- Non-terminal evaluation: material balance + mobility bonus.
- Deterministic tie-break by legal-move iteration order.

This is intentionally simple but legal and stable for v1.
