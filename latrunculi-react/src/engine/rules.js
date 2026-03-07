// rules.js
// Pure game rules for Latrunculi: legal move generation, move application, and win detection.
// No React. No DOM. Depends only on constants.js.

import {
  EMPTY, WHITE, BLACK, SIZE, DIRS, DIAG_DIRS,
  pieceOwner, isDux, isGladiator, isRound, isFriendly, isEnemy,
  cloneBoard, makeState, inBounds, opponent, countPieces,
} from './constants.js';

// ════════════════════════════════════════════════════════════════
//  LEGAL MOVES
// ════════════════════════════════════════════════════════════════

export function legalMoves(st, player) {
  const side = player || st.toMove;
  const moves = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const p = st.board[r][c];
      if (pieceOwner(p) !== side) continue;
      // Gladiators slide diagonally; all others slide orthogonally
      const dirs = isGladiator(p) ? DIAG_DIRS : DIRS;
      for (const [dr, dc] of dirs) {
        let nr = r + dr, nc = c + dc;
        while (inBounds(nr, nc) && st.board[nr][nc] === EMPTY) {
          moves.push({ src: [r, c], dst: [nr, nc] });
          nr += dr; nc += dc;
        }
      }
    }
  }
  return moves;
}

export function isLegalMove(st, src, dst) {
  const [sr, sc] = src, [dr, dc] = dst;
  if (!inBounds(sr, sc) || !inBounds(dr, dc)) return false;
  if (sr === dr && sc === dc) return false;
  if (pieceOwner(st.board[sr][sc]) !== st.toMove) return false;
  if (st.board[dr][dc] !== EMPTY) return false;

  const glad = isGladiator(st.board[sr][sc]);
  const rowDiff = dr - sr, colDiff = dc - sc;

  if (glad) {
    // Must move diagonally (|rowDiff| === |colDiff|, both non-zero)
    if (Math.abs(rowDiff) !== Math.abs(colDiff) || rowDiff === 0) return false;
  } else {
    // Must move orthogonally
    if (sr !== dr && sc !== dc) return false;
  }

  const stepR = rowDiff === 0 ? 0 : (rowDiff > 0 ? 1 : -1);
  const stepC = colDiff === 0 ? 0 : (colDiff > 0 ? 1 : -1);
  let r = sr + stepR, c = sc + stepC;
  while (r !== dr || c !== dc) {
    if (st.board[r][c] !== EMPTY) return false;
    r += stepR; c += stepC;
  }
  return true;
}

// ════════════════════════════════════════════════════════════════
//  CAPTURE HELPERS
// ════════════════════════════════════════════════════════════════

export function isDuxSurrounded(board, r, c, duxOwner) {
  // Dux is captured only when ALL 4 orthogonal neighbors are enemy pieces.
  // Board edges do NOT count — you need actual enemy pieces on all 4 sides.
  for (const [dr, dc] of DIRS) {
    const nr = r + dr, nc = c + dc;
    if (!inBounds(nr, nc)) return false;          // edge = escape, not capture
    if (!isEnemy(board[nr][nc], duxOwner)) return false;
  }
  return true;
}

// ════════════════════════════════════════════════════════════════
//  APPLY MOVE
// ════════════════════════════════════════════════════════════════

export function applyMove(st, move) {
  const { src: [sr, sc], dst: [dr, dc] } = move;
  const player      = st.toMove;
  const enemy       = opponent(player);
  const board       = cloneBoard(st.board);
  const movingPiece = board[sr][sc];
  board[sr][sc] = EMPTY;
  board[dr][dc] = movingPiece;
  let caps = 0;
  let promotionSquare = null; // [r,c] of capturing round piece if it killed a Gladiator

  // ── Orthogonal custodial captures (rounds & Gladiators, NOT Dux) ──
  for (const [drow, dcol] of DIRS) {
    const ar = dr + drow, ac = dc + dcol;
    const br = dr + 2 * drow, bc = dc + 2 * dcol;
    if (!inBounds(ar, ac) || !inBounds(br, bc)) continue;
    const adjPiece = board[ar][ac];
    if (!isEnemy(adjPiece, player)) continue;
    if (isDux(adjPiece)) continue;                    // Dux immune to sandwich
    if (!isFriendly(board[br][bc], player)) continue; // need friendly anchor
    // Orthogonal Gladiator capture is a ROUND sandwich only:
    // mover and anchor must both be regular round pieces (not Dux/Gladiator).
    const anchorIsRound = isRound(board[br][bc]);
    const moverIsRound  = isRound(movingPiece);
    if (isGladiator(adjPiece)) {
      if (!moverIsRound || !anchorIsRound) continue;
      board[ar][ac] = EMPTY; caps++;
      promotionSquare = [dr, dc];
    } else {
      board[ar][ac] = EMPTY; caps++;
    }
  }

  // ── Diagonal custodial captures (Gladiator vs Gladiator only) ──
  if (isGladiator(movingPiece)) {
    for (const [drow, dcol] of DIAG_DIRS) {
      const ar = dr + drow, ac = dc + dcol;
      const br = dr + 2 * drow, bc = dc + 2 * dcol;
      if (!inBounds(ar, ac) || !inBounds(br, bc)) continue;
      const adjPiece = board[ar][ac];
      if (!isEnemy(adjPiece, player)) continue;
      if (!isGladiator(adjPiece)) continue;           // diagonal only captures Gladiators
      if (!isGladiator(board[br][bc])) continue;      // anchor must also be Gladiator
      if (!isFriendly(board[br][bc], player)) continue;
      board[ar][ac] = EMPTY; caps++;
    }
  }

  // ── Dux capture: fully surrounded on all 4 orthogonal sides ──
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!isEnemy(board[r][c], player)) continue;
      if (!isDux(board[r][c])) continue;
      if (isDuxSurrounded(board, r, c, enemy)) {
        board[r][c] = EMPTY; caps++;
      }
    }
  }

  return { state: makeState(board, enemy), captures: caps, promotionSquare };
}

// ════════════════════════════════════════════════════════════════
//  WIN DETECTION
// ════════════════════════════════════════════════════════════════

export function winner(st) {
  const wc = countPieces(st.board, WHITE);  // WHITE is 'W'
  const bc = countPieces(st.board, BLACK);  // BLACK is 'B'
  if (wc === 0) return BLACK;
  if (bc === 0) return WHITE;
  if (legalMoves(st, st.toMove).length === 0) return opponent(st.toMove);
  return null;
}
