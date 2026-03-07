// constants.js
// Pure game constants and identity helpers for Latrunculi.
// No React. No DOM. Safe to import anywhere.

// ════════════════════════════════════════════════════════════════
//  CONSTANTS & TYPES
// ════════════════════════════════════════════════════════════════
export const EMPTY      = '.';
export const WHITE      = 'W';
export const BLACK      = 'B';
export const WHITE_DUX  = 'WD';
export const BLACK_DUX  = 'BD';
export const WHITE_GLAD = 'WG';
export const BLACK_GLAD = 'BG';
export const SIZE       = 8;
export const DIRS       = [[1,0],[-1,0],[0,1],[0,-1]];
export const DIAG_DIRS  = [[1,1],[1,-1],[-1,1],[-1,-1]];
export const FILES      = 'abcdefgh';

// game variant: 'standard' | 'dux' | 'gladiator' | 'full'
// Components should call setGameVariant() before initialBoard().
let gameVariant = 'standard';
export function getGameVariant() { return gameVariant; }
export function setGameVariant(v) { gameVariant = v; }

// ── piece identity helpers ──
export function pieceOwner(p) {
  if (p === WHITE || p === WHITE_DUX || p === WHITE_GLAD) return WHITE;
  if (p === BLACK || p === BLACK_DUX || p === BLACK_GLAD) return BLACK;
  return null;
}
export function isDux(p)         { return p === WHITE_DUX  || p === BLACK_DUX;  }
export function isGladiator(p)   { return p === WHITE_GLAD || p === BLACK_GLAD; }
export function isRound(p)       { return p === WHITE || p === BLACK; }
export function isFriendly(p, side) { return pieceOwner(p) === side; }
export function isEnemy(p, side)    { const o = pieceOwner(p); return o !== null && o !== side; }

// ── board/state helpers ──
export function cloneBoard(b)  { return b.map(r => [...r]); }
export function makeState(board, toMove = WHITE) { return { board, toMove }; }
export function inBounds(r, c) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE; }
export function opponent(p)    { return p === WHITE ? BLACK : WHITE; }

export function countPieces(board, p) {
  let n = 0;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (pieceOwner(board[r][c]) === p) n++;
  return n;
}

export function initialBoard() {
  const b = Array.from({ length: SIZE }, () => Array(SIZE).fill(EMPTY));
  // Rounds on rank 2 (row 6) and rank 7 (row 1)
  for (let c = 0; c < SIZE; c++) { b[6][c] = WHITE; b[1][c] = BLACK; }

  // Dux: e-file centre of each round row
  if (gameVariant === 'dux' || gameVariant === 'full') {
    b[6][4] = WHITE_DUX;
    b[1][4] = BLACK_DUX;
  }

  // Gladiators: B1–G1 (row 7, cols 1–6) and B8–G8 (row 0, cols 1–6)
  if (gameVariant === 'gladiator' || gameVariant === 'full') {
    for (let c = 1; c <= 6; c++) {
      b[7][c] = WHITE_GLAD;
      b[0][c] = BLACK_GLAD;
    }
  }
  return b;
}

// ── coordinate utilities ──
export function formatCoord([r, c]) { return FILES[c] + (SIZE - r); }
export function parseCoord(s)       { return [SIZE - parseInt(s[1]), FILES.indexOf(s[0])]; }
