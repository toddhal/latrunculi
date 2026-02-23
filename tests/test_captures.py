from latrunculi.rules import BLACK, EMPTY, WHITE, GameState, Move, apply_move


def make_state(placements: dict[tuple[int, int], str], to_move: str = WHITE) -> GameState:
    board = [[EMPTY for _ in range(8)] for _ in range(8)]
    for pos, piece in placements.items():
        r, c = pos
        board[r][c] = piece
    return GameState(tuple(tuple(row) for row in board), to_move=to_move)


def test_single_horizontal_capture() -> None:
    state = make_state({(4, 3): WHITE, (4, 4): BLACK, (4, 6): WHITE})
    nxt = apply_move(state, Move((4, 6), (4, 5)))
    assert nxt.board[4][4] == EMPTY


def test_single_vertical_capture() -> None:
    state = make_state({(2, 3): WHITE, (3, 3): BLACK, (6, 3): WHITE})
    nxt = apply_move(state, Move((6, 3), (4, 3)))
    assert nxt.board[3][3] == EMPTY


def test_multi_capture_in_two_directions() -> None:
    state = make_state(
        {
            (4, 3): WHITE,
            (4, 4): BLACK,
            (4, 6): WHITE,
            (2, 5): WHITE,
            (3, 5): BLACK,
            (6, 5): WHITE,
        }
    )
    nxt = apply_move(state, Move((6, 5), (4, 5)))
    assert nxt.board[4][4] == EMPTY
    assert nxt.board[3][5] == EMPTY


def test_no_capture_without_friendly_anchor() -> None:
    state = make_state({(4, 3): BLACK, (4, 5): WHITE})
    nxt = apply_move(state, Move((4, 5), (4, 4)))
    assert nxt.board[4][3] == BLACK


def test_edge_of_board_no_out_of_bounds_capture() -> None:
    state = make_state({(0, 0): WHITE, (0, 1): BLACK, (0, 3): WHITE})
    nxt = apply_move(state, Move((0, 3), (0, 2)))
    assert nxt.board[0][1] == EMPTY


def test_capture_only_orthogonal_not_diagonal() -> None:
    state = make_state({(4, 4): WHITE, (3, 3): BLACK, (2, 2): WHITE})
    nxt = apply_move(state, Move((4, 4), (4, 5)))
    assert nxt.board[3][3] == BLACK


def test_captured_piece_removed_before_turn_switch() -> None:
    state = make_state({(2, 3): WHITE, (2, 4): BLACK, (2, 6): WHITE})
    nxt = apply_move(state, Move((2, 6), (2, 5)))
    assert nxt.board[2][4] == EMPTY
    assert nxt.to_move == BLACK
