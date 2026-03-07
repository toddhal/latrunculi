// ai.js
// Minimax AI engine for Latrunculi with alpha-beta pruning.
// No React. No DOM. Depends on constants.js and rules.js.

import {
  SIZE, DIRS, DIAG_DIRS,
  WHITE, BLACK,
  pieceOwner, isDux, isGladiator, isEnemy, opponent, countPieces,
  getGameVariant,
} from './constants.js';
import { legalMoves, applyMove, winner } from './rules.js';

// ════════════════════════════════════════════════════════════════
//  EVALUATION HELPERS
// ════════════════════════════════════════════════════════════════

export const TERMINAL_SCORE = 100000;

function bracketing(board, player) {
  // count how many enemy pieces are threatened (1 bracket away)
  const enemy = opponent(player);
  let threats = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (pieceOwner(board[r][c]) !== enemy) continue;
      for (const [dr, dc] of DIRS) {
        const ar = r - dr, ac = c - dc; // one side
        const br = r + dr, bc = c + dc; // other side
        if (ar < 0 || ar >= SIZE || ac < 0 || ac >= SIZE) continue;
        if (br < 0 || br >= SIZE || bc < 0 || bc >= SIZE) continue;
        if (pieceOwner(board[ar][ac]) === player && board[br][bc] === '.') threats++;
        if (board[ar][ac] === '.' && pieceOwner(board[br][bc]) === player) threats++;
      }
    }
  }
  return threats;
}

function trappedPieces(st, player) {
  // pieces with very low mobility
  const moves = legalMoves(st, player);
  const srcSet = {};
  for (const m of moves) srcSet[m.src[0] + ',' + m.src[1]] = (srcSet[m.src[0] + ',' + m.src[1]] || 0) + 1;
  let trapped = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (pieceOwner(st.board[r][c]) === player && (srcSet[r + ',' + c] || 0) <= 1) trapped++;
  return trapped;
}

export function duxSurroundCount(board, side) {
  // How many of the Dux's 4 sides are occupied by enemies? (0-4, -1 if no Dux)
  // Board edges do NOT count — only actual enemy pieces
  const duxPiece = side === WHITE ? 'WD' : 'BD';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c] !== duxPiece) continue;
      let count = 0;
      for (const [dr, dc] of DIRS) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && isEnemy(board[nr][nc], side)) count++;
      }
      return count;
    }
  }
  return -1; // Dux already captured
}

// ════════════════════════════════════════════════════════════════
//  STATIC EVALUATION
// ════════════════════════════════════════════════════════════════

export function evaluate(st, perspective) {
  const w = winner(st);
  if (w === perspective)           return  TERMINAL_SCORE;
  if (w === opponent(perspective)) return -TERMINAL_SCORE;

  const myMat  = countPieces(st.board, perspective);
  const oppMat = countPieces(st.board, opponent(perspective));
  const myMob  = legalMoves(st, perspective).length;
  const oppMob = legalMoves(st, opponent(perspective)).length;
  const myBrk  = bracketing(st.board, perspective);
  const oppBrk = bracketing(st.board, opponent(perspective));
  const myTrap = trappedPieces(st, perspective);
  const oppTrap= trappedPieces(st, opponent(perspective));

  // Dux safety: penalise having your Dux cornered (3-of-4 = very bad, 4 = dead)
  const myDuxDanger  = duxSurroundCount(st.board, perspective);
  const oppDuxDanger = duxSurroundCount(st.board, opponent(perspective));
  const duxScore = (oppDuxDanger - myDuxDanger) * 40;

  // Gladiator value: they're worth slightly more due to diagonal coverage
  let gladBonus = 0;
  const variant = getGameVariant();
  if (variant === 'gladiator' || variant === 'full') {
    let myGlads = 0, oppGlads = 0;
    for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
      if (isGladiator(st.board[r][c])) {
        if (pieceOwner(st.board[r][c]) === perspective) myGlads++;
        else oppGlads++;
      }
    }
    gladBonus = (myGlads - oppGlads) * 20;
    // Center control bonus for gladiators
    for (let r = 2; r <= 5; r++) for (let c = 2; c <= 5; c++) {
      if (isGladiator(st.board[r][c]) && pieceOwner(st.board[r][c]) === perspective)           gladBonus += 5;
      if (isGladiator(st.board[r][c]) && pieceOwner(st.board[r][c]) === opponent(perspective)) gladBonus -= 5;
    }
  }

  return (myMat - oppMat) * 100
       + (myMob - oppMob) * 5
       + (myBrk - oppBrk) * 15
       + (oppTrap - myTrap) * 8
       + duxScore
       + gladBonus;
}

// ════════════════════════════════════════════════════════════════
//  MOVE ORDERING
// ════════════════════════════════════════════════════════════════

export function orderedMoves(st) {
  const moves = legalMoves(st);
  // Score each move quickly for ordering: captures first, then center moves
  const scored = moves.map(m => {
    const { captures } = applyMove(st, m);
    const centerDist = Math.abs(m.dst[0] - 3.5) + Math.abs(m.dst[1] - 3.5);
    return { m, score: captures * 1000 - centerDist };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.map(s => s.m);
}

// ════════════════════════════════════════════════════════════════
//  MINIMAX WITH ALPHA-BETA PRUNING
// ════════════════════════════════════════════════════════════════

export function minimax(st, depth, alpha, beta, maximizing, perspective) {
  if (depth <= 0 || winner(st) !== null) return evaluate(st, perspective);
  const moves = orderedMoves(st);
  if (!moves.length) return evaluate(st, perspective);

  if (maximizing) {
    let val = -Infinity;
    for (const m of moves) {
      const { state: ns } = applyMove(st, m);
      val = Math.max(val, minimax(ns, depth - 1, alpha, beta, false, perspective));
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return val;
  } else {
    let val = Infinity;
    for (const m of moves) {
      const { state: ns } = applyMove(st, m);
      val = Math.min(val, minimax(ns, depth - 1, alpha, beta, true, perspective));
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return val;
  }
}

export function chooseMove(st, depth) {
  const moves = orderedMoves(st);
  if (!moves.length) return null;
  const perspective = st.toMove;
  let best = moves[0], bestScore = -Infinity;
  for (const m of moves) {
    const { state: ns } = applyMove(st, m);
    const score = minimax(ns, depth - 1, -Infinity, Infinity, false, perspective);
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return best;
}
