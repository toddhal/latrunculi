"""Optional coaching helpers for Latrunculi."""

from __future__ import annotations

from .ai import choose_move
from .rules import GameState, format_coord, legal_moves


def hint(state: GameState, depth: int = 1) -> str:
    """Return a short best-move hint for the side to move."""
    move = choose_move(state, depth=depth)
    if move is None:
        return "No legal moves available."
    return f"Consider {format_coord(move.src)} {format_coord(move.dst)}"


def mobility_summary(state: GameState) -> str:
    return f"{state.to_move} has {len(legal_moves(state))} legal moves."
