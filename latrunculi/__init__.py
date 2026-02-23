"""Latrunculi package."""

from .rules import (
    BLACK,
    BOARD_SIZE,
    EMPTY,
    WHITE,
    GameState,
    Move,
    apply_move,
    format_coord,
    initial_state,
    is_legal_move,
    is_terminal,
    legal_moves,
    parse_move,
    winner,
)

__all__ = [
    "BLACK",
    "BOARD_SIZE",
    "EMPTY",
    "WHITE",
    "GameState",
    "Move",
    "apply_move",
    "format_coord",
    "initial_state",
    "is_legal_move",
    "is_terminal",
    "legal_moves",
    "parse_move",
    "winner",
]
