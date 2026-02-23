from latrunculi.ai import choose_move
from latrunculi.rules import apply_move, initial_state, legal_moves, winner


def test_ai_returns_legal_move_from_initial_position() -> None:
    state = initial_state()
    move = choose_move(state, depth=2)
    assert move is not None
    assert move in legal_moves(state)


def test_ai_game_progresses_for_fixed_plies() -> None:
    state = initial_state()
    plies = 16
    for _ in range(plies):
        if winner(state) is not None:
            break
        move = choose_move(state, depth=1)
        assert move is not None
        assert move in legal_moves(state)
        state = apply_move(state, move)
