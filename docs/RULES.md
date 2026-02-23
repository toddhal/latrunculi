# Latrunculi v1 Rules

## Board and pieces
- Board size: 8x8.
- Players: `W` (White) and `B` (Black).
- Pieces: identical men only (no king/dux in v1).

Initial setup in this prototype:
- White occupies row 2 (`a2` through `h2`).
- Black occupies row 7 (`a7` through `h7`).
- White moves first.

## Movement
- A piece moves like a rook in chess:
  - Orthogonally (north/south/east/west).
  - Any number of empty squares.
- Pieces cannot jump over other pieces.
- Destination square must be empty.

## Custodial capture
After a move is completed, captures are resolved immediately:
- For each orthogonal direction from the moved piece, check the adjacent square.
- If the adjacent square contains an enemy piece and the next square beyond it (same direction) contains a friendly piece, the enemy piece is captured and removed.
- Captures may happen in multiple directions from a single move.

Only strict orthogonal sandwiching captures; diagonal patterns do not capture.

## Winning and terminal conditions
A player wins when the opponent:
1. Has zero pieces remaining, or
2. Has zero legal moves at the start of their turn.

If a player to move has no legal moves, the game is terminal and the other player is the winner.

## Coordinate notation
- Files are `a` to `h` (left to right from White perspective).
- Ranks are `1` to `8` (bottom to top).
- CLI move input format: `e2 e5`.
