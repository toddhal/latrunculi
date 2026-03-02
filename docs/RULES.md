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

# Latrunculi_full v2 Rules

UPDATED RULES (v2 — Full Edition)
Board & Setup

8×8 board. White moves first.
Standard: 8 round pieces per side. White on rank 2, Black on rank 7.
Dux: Standard + one Dux commander per side (placed at e2/e7).
Gladiator: Standard + 6 Gladiator pieces per side (placed B1–G1 / B8–G8).
Full: All of the above — rounds, Dux, and Gladiators.

Round Pieces (⚪/🔴)

Move like a rook: orthogonally, any number of empty squares, no jumping.
Custodial capture: If after your move an enemy round piece is sandwiched between your piece and another of your pieces orthogonally (N/S or E/W), it is removed. Multiple captures can occur from a single move.

The Dux ⚜ (Commander)

One per side. Visually distinct with a crown glyph and glowing border.
Moves identically to a round piece (rook-style, orthogonal).
Immune to standard custodial capture — a simple sandwich does nothing.
Captured only when surrounded on ALL 4 orthogonal sides simultaneously by enemy pieces. Board edges do NOT count as surrounds — you need 4 actual enemy pieces.
The AI actively tries to encircle enemy Dux and protect its own.
When a Dux reaches 3-of-4 sides surrounded, it pulses red as a warning.

Gladiators ◆ (Diamond Warriors)

Six per side. Rendered as rotated diamond shapes.
Move diagonally only — like a bishop in chess, any number of empty squares.
Block all friendly and enemy pieces' paths (pieces cannot pass through them).
Captured two ways:

Diagonal sandwich: Two friendly Gladiators sandwiching an enemy Gladiator along a diagonal line — the enemy Gladiator is removed.
Orthogonal sandwich: Two enemy round pieces sandwiching a Gladiator orthogonally — the Gladiator is removed, and the capturing player earns a promotion choice.


Promotion: When a round piece captures a Gladiator via orthogonal sandwich, the capturing player may optionally promote that round piece into a Gladiator. A modal pauses the game for the human's choice; AI always promotes.
Gladiators cannot assist rounds in orthogonal captures and rounds cannot assist Gladiators in diagonal captures — the capture type is strict.

Winning

Opponent has zero pieces remaining, OR
Opponent has zero legal moves at the start of their turn.
