"""Basic minimax + alpha-beta AI for Latrunculi."""

from __future__ import annotations

from math import inf

from .rules import BLACK, WHITE, GameState, Move, apply_move, count_pieces, legal_moves, opponent, winner


TERMINAL_SCORE = 10_000


def evaluate(state: GameState, perspective: str) -> int:
    win = winner(state)
    if win == perspective:
        return TERMINAL_SCORE
    if win == opponent(perspective):
        return -TERMINAL_SCORE

    my_material = count_pieces(state, perspective)
    opp_material = count_pieces(state, opponent(perspective))
    my_mobility = len(legal_moves(state, perspective))
    opp_mobility = len(legal_moves(state, opponent(perspective)))

    return (my_material - opp_material) * 100 + (my_mobility - opp_mobility) * 5


def choose_move(state: GameState, depth: int = 2) -> Move | None:
    moves = legal_moves(state)
    if not moves:
        return None

    perspective = state.to_move
    best_move = moves[0]
    best_score = -inf

    for move in moves:
        child = apply_move(state, move)
        score = minimax(child, depth - 1, -inf, inf, maximizing=False, perspective=perspective)
        if score > best_score:
            best_score = score
            best_move = move

    return best_move


def minimax(
    state: GameState,
    depth: int,
    alpha: float,
    beta: float,
    maximizing: bool,
    perspective: str,
) -> float:
    if depth <= 0 or winner(state) is not None:
        return evaluate(state, perspective)

    moves = legal_moves(state)
    if not moves:
        return evaluate(state, perspective)

    if maximizing:
        value = -inf
        for move in moves:
            value = max(
                value,
                minimax(apply_move(state, move), depth - 1, alpha, beta, False, perspective),
            )
            alpha = max(alpha, value)
            if beta <= alpha:
                break
        return value

    value = inf
    for move in moves:
        value = min(
            value,
            minimax(apply_move(state, move), depth - 1, alpha, beta, True, perspective),
        )
        beta = min(beta, value)
        if beta <= alpha:
            break
    return value


def choose_move_for_side(state: GameState, side: str, depth: int = 2) -> Move | None:
    if side not in (WHITE, BLACK):
        raise ValueError("side must be 'W' or 'B'")
    if state.to_move != side:
        return None
    return choose_move(state, depth=depth)
