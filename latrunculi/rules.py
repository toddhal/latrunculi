"""Core rules engine for Latrunculi v1."""

from __future__ import annotations

from dataclasses import dataclass

BOARD_SIZE = 8
EMPTY = "."
WHITE = "W"
BLACK = "B"
PLAYERS = (WHITE, BLACK)
ORTHOGONAL_DIRS = ((1, 0), (-1, 0), (0, 1), (0, -1))

Coord = tuple[int, int]


@dataclass(frozen=True)
class Move:
    src: Coord
    dst: Coord


@dataclass(frozen=True)
class GameState:
    board: tuple[tuple[str, ...], ...]
    to_move: str = WHITE


def initial_state() -> GameState:
    board = [[EMPTY for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
    for col in range(BOARD_SIZE):
        board[6][col] = WHITE
        board[1][col] = BLACK
    return GameState(board=freeze_board(board), to_move=WHITE)


def freeze_board(board: list[list[str]]) -> tuple[tuple[str, ...], ...]:
    return tuple(tuple(row) for row in board)


def thaw_board(board: tuple[tuple[str, ...], ...]) -> list[list[str]]:
    return [list(row) for row in board]


def in_bounds(pos: Coord) -> bool:
    row, col = pos
    return 0 <= row < BOARD_SIZE and 0 <= col < BOARD_SIZE


def opponent(player: str) -> str:
    return BLACK if player == WHITE else WHITE


def piece_at(state: GameState, pos: Coord) -> str:
    row, col = pos
    return state.board[row][col]


def legal_moves(state: GameState, player: str | None = None) -> list[Move]:
    side = player or state.to_move
    moves: list[Move] = []
    for row in range(BOARD_SIZE):
        for col in range(BOARD_SIZE):
            if state.board[row][col] != side:
                continue
            src = (row, col)
            for dr, dc in ORTHOGONAL_DIRS:
                nr, nc = row + dr, col + dc
                while in_bounds((nr, nc)) and state.board[nr][nc] == EMPTY:
                    moves.append(Move(src=src, dst=(nr, nc)))
                    nr += dr
                    nc += dc
    return moves


def is_legal_move(state: GameState, move: Move, player: str | None = None) -> bool:
    side = player or state.to_move
    sr, sc = move.src
    dr, dc = move.dst

    if not in_bounds(move.src) or not in_bounds(move.dst):
        return False
    if move.src == move.dst:
        return False
    if state.board[sr][sc] != side:
        return False
    if state.board[dr][dc] != EMPTY:
        return False
    if sr != dr and sc != dc:
        return False

    step_r = 0 if sr == dr else (1 if dr > sr else -1)
    step_c = 0 if sc == dc else (1 if dc > sc else -1)
    r, c = sr + step_r, sc + step_c
    while (r, c) != (dr, dc):
        if state.board[r][c] != EMPTY:
            return False
        r += step_r
        c += step_c
    return True


def apply_move(state: GameState, move: Move) -> GameState:
    if not is_legal_move(state, move):
        raise ValueError(f"Illegal move: {move}")

    board = thaw_board(state.board)
    sr, sc = move.src
    dr, dc = move.dst
    player = state.to_move
    enemy = opponent(player)

    board[sr][sc] = EMPTY
    board[dr][dc] = player

    for drow, dcol in ORTHOGONAL_DIRS:
        adj = (dr + drow, dc + dcol)
        beyond = (dr + 2 * drow, dc + 2 * dcol)
        if not (in_bounds(adj) and in_bounds(beyond)):
            continue
        ar, ac = adj
        br, bc = beyond
        if board[ar][ac] == enemy and board[br][bc] == player:
            board[ar][ac] = EMPTY

    return GameState(board=freeze_board(board), to_move=enemy)


def count_pieces(state: GameState, player: str) -> int:
    return sum(cell == player for row in state.board for cell in row)


def winner(state: GameState) -> str | None:
    white_count = count_pieces(state, WHITE)
    black_count = count_pieces(state, BLACK)

    if white_count == 0:
        return BLACK
    if black_count == 0:
        return WHITE

    if not legal_moves(state, state.to_move):
        return opponent(state.to_move)

    return None


def is_terminal(state: GameState) -> bool:
    return winner(state) is not None


def parse_coord(token: str) -> Coord:
    token = token.strip().lower()
    if len(token) != 2:
        raise ValueError(f"Invalid coordinate: {token}")
    file_char, rank_char = token[0], token[1]
    if file_char < "a" or file_char > "h" or rank_char < "1" or rank_char > "8":
        raise ValueError(f"Invalid coordinate: {token}")
    col = ord(file_char) - ord("a")
    row = BOARD_SIZE - int(rank_char)
    return row, col


def format_coord(coord: Coord) -> str:
    row, col = coord
    return f"{chr(ord('a') + col)}{BOARD_SIZE - row}"


def parse_move(text: str) -> Move:
    parts = text.split()
    if len(parts) != 2:
        raise ValueError("Move must be two coordinates like 'e2 e5'")
    return Move(src=parse_coord(parts[0]), dst=parse_coord(parts[1]))
