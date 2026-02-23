"""Simple CLI interface for Latrunculi."""

from __future__ import annotations

import argparse

from .ai import choose_move
from .rules import BLACK, EMPTY, WHITE, apply_move, format_coord, initial_state, legal_moves, parse_move, winner


def render_board(state) -> str:
    lines = ["  a b c d e f g h"]
    for row_idx, row in enumerate(state.board):
        rank = 8 - row_idx
        lines.append(f"{rank} " + " ".join(row))
    lines.append(f"Turn: {state.to_move}")
    return "\n".join(lines)


def run_game(vs_ai: bool = False, ai_side: str = BLACK, depth: int = 2) -> None:
    state = initial_state()
    while True:
        print(render_board(state))
        win = winner(state)
        if win is not None:
            print(f"Winner: {win}")
            return

        moves = legal_moves(state)
        if not moves:
            print(f"No legal moves for {state.to_move}.")
            print(f"Winner: {WHITE if state.to_move == BLACK else BLACK}")
            return

        if vs_ai and state.to_move == ai_side:
            move = choose_move(state, depth=depth)
            if move is None:
                print("AI has no legal move.")
                return
            print(f"AI plays {format_coord(move.src)} {format_coord(move.dst)}")
            state = apply_move(state, move)
            continue

        raw = input("Enter move (e2 e5) or 'resign': ").strip()
        if raw.lower() == "resign":
            loser = state.to_move
            winner_side = WHITE if loser == BLACK else BLACK
            print(f"{loser} resigns. Winner: {winner_side}")
            return

        try:
            move = parse_move(raw)
            state = apply_move(state, move)
        except ValueError as exc:
            print(f"Invalid move: {exc}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Play Latrunculi v1")
    parser.add_argument("--vs-ai", action="store_true", help="Play against AI")
    parser.add_argument("--ai-side", choices=[WHITE, BLACK], default=BLACK, help="AI side")
    parser.add_argument("--depth", type=int, default=2, help="AI search depth")
    args = parser.parse_args()
    run_game(vs_ai=args.vs_ai, ai_side=args.ai_side, depth=args.depth)


if __name__ == "__main__":
    main()
