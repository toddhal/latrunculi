from latrunculi.rules import (
    BLACK,
    EMPTY,
    WHITE,
    GameState,
    Move,
    apply_move,
    initial_state,
    is_legal_move,
    legal_moves,
    parse_coord,
    parse_move,
    winner,
)


def make_state(placements: dict[tuple[int, int], str], to_move: str = WHITE) -> GameState:
    board = [[EMPTY for _ in range(8)] for _ in range(8)]
    for pos, piece in placements.items():
        r, c = pos
        board[r][c] = piece
    return GameState(tuple(tuple(row) for row in board), to_move=to_move)


def test_initial_state_piece_count_and_turn() -> None:
    state = initial_state()
    assert sum(cell == WHITE for row in state.board for cell in row) == 8
    assert sum(cell == BLACK for row in state.board for cell in row) == 8
    assert state.to_move == WHITE


def test_parse_coord_and_move() -> None:
    assert parse_coord("a1") == (7, 0)
    assert parse_coord("h8") == (0, 7)
    move = parse_move("e2 e5")
    assert move.src == (6, 4)
    assert move.dst == (3, 4)


def test_piece_moves_orthogonally_no_jumping() -> None:
    state = make_state({(4, 4): WHITE, (4, 6): BLACK})
    legal = legal_moves(state, WHITE)
    assert Move((4, 4), (4, 5)) in legal
    assert Move((4, 4), (4, 7)) not in legal
    assert Move((4, 4), (5, 5)) not in legal


def test_illegal_move_blocked_path() -> None:
    state = make_state({(4, 4): WHITE, (4, 5): BLACK})
    assert not is_legal_move(state, Move((4, 4), (4, 7)))


def test_apply_move_changes_turn_and_position() -> None:
    state = make_state({(4, 4): WHITE, (1, 1): BLACK})
    nxt = apply_move(state, Move((4, 4), (4, 6)))
    assert nxt.board[4][4] == EMPTY
    assert nxt.board[4][6] == WHITE
    assert nxt.to_move == BLACK


def test_winner_when_side_to_move_has_no_legal_moves() -> None:
    state = make_state(
        {
            (0, 0): BLACK,
            (0, 1): WHITE,
            (1, 0): WHITE,
        },
        to_move=BLACK,
    )
    assert legal_moves(state, BLACK) == []
    assert winner(state) == WHITE
