// coach.js
// Game analysis, coaching messages, and move explanation for Latrunculi.
// Returns plain data objects — no DOM manipulation, no React.
// Depends on constants.js, rules.js, and ai.js.

import {
  WHITE, BLACK, SIZE, DIRS,
  pieceOwner, opponent, inBounds, formatCoord,
} from './constants.js';
import { legalMoves, applyMove, isLegalMove } from './rules.js';
import { duxSurroundCount, chooseMove } from './ai.js';

// ════════════════════════════════════════════════════════════════
//  PRINCIPLES (coaching text library)
// ════════════════════════════════════════════════════════════════

export const PRINCIPLES = {
  captureGeometry: "Custodial capture: sandwich an enemy piece on opposite sides orthogonally.",
  dangerSquare:    "A piece is 'hot' if an enemy can bracket it next turn.",
  fork:            "A fork threatens two captures at once — devastating if unblocked.",
  tempo:           "Don't rush forward; walking into a bracket costs you tempo and material.",
  gate:            "Two pieces forming a gate restrict enemy escape routes.",
  endgame:         "In the endgame, reduce mobility first — herd, then capture.",
};

// ════════════════════════════════════════════════════════════════
//  DANGER DETECTION
// ════════════════════════════════════════════════════════════════

export function getDangerSquares(st, player) {
  // squares where player's pieces are threatened by a 1-move capture
  const enemy = opponent(player);
  const enemyMoves = legalMoves(st, enemy);
  const dangerous = new Set();
  for (const m of enemyMoves) {
    const { state: ns } = applyMove({ ...st, toMove: enemy }, m);
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (pieceOwner(st.board[r][c]) === player && pieceOwner(ns.board[r][c]) !== player) {
          dangerous.add(r + ',' + c);
        }
      }
    }
  }
  return dangerous;
}

// ════════════════════════════════════════════════════════════════
//  TACTICAL MOVE FINDERS
// ════════════════════════════════════════════════════════════════

export function getForkMoves(st) {
  // moves that cause 2+ captures
  const forks = [];
  for (const m of legalMoves(st)) {
    const { captures } = applyMove(st, m);
    if (captures >= 2) forks.push({ move: m, captures });
  }
  return forks;
}

export function getBracketingMoves(st) {
  // moves that create a capture (1+)
  const caps = [];
  for (const m of legalMoves(st)) {
    const { captures } = applyMove(st, m);
    if (captures >= 1) caps.push({ move: m, captures });
  }
  return caps;
}

// ════════════════════════════════════════════════════════════════
//  HINT / REAL-TIME ANALYSIS
// ════════════════════════════════════════════════════════════════

export function analyzeHint(st, proposedSrc, proposedDst) {
  if (!proposedSrc || !proposedDst) return null;
  if (!isLegalMove(st, proposedSrc, proposedDst)) return null;

  const { state: ns } = applyMove(st, { src: proposedSrc, dst: proposedDst });
  const dangerAfter = getDangerSquares(ns, st.toMove);
  if (dangerAfter.has(proposedDst[0] + ',' + proposedDst[1])) {
    return { type: 'warn', text: `⚠ Caution: moving to ${formatCoord(proposedDst)} places your piece in immediate danger of being captured next turn. ${PRINCIPLES.dangerSquare}` };
  }
  const { captures } = applyMove(st, { src: proposedSrc, dst: proposedDst });
  if (captures >= 2) return { type: 'good', text: `✦ Excellent! This move captures ${captures} enemy pieces — a fork! ${PRINCIPLES.fork}` };
  if (captures === 1) return { type: 'good', text: `✦ This move captures 1 enemy piece through custodial sandwich. ${PRINCIPLES.captureGeometry}` };
  return null;
}

// ════════════════════════════════════════════════════════════════
//  TURN COACHING
// ════════════════════════════════════════════════════════════════

export function coachTurnAnalysis(st) {
  const msgs = [];
  const side = st.toMove;

  // Check for available forks
  const forks = getForkMoves(st);
  if (forks.length) {
    const m = forks[0].move;
    msgs.push({ type: 'good', text: `Fork available! ${formatCoord(m.src)} → ${formatCoord(m.dst)} captures ${forks[0].captures} pieces. ${PRINCIPLES.fork}` });
  }

  // Check capturing moves
  const caps = getBracketingMoves(st);
  if (!forks.length && caps.length) {
    const m = caps[0].move;
    msgs.push({ type: 'info', text: `Capture opportunity: ${formatCoord(m.src)} → ${formatCoord(m.dst)}.` });
  }

  // Dux danger check
  const myDuxDgr = duxSurroundCount(st.board, side);
  if (myDuxDgr === 3) {
    msgs.push({ type: 'warn', text: `⚜ CRITICAL: Your Dux is surrounded on 3 of 4 sides! One more enemy piece in position and your commander falls. Escape or break the encirclement immediately.` });
  } else if (myDuxDgr === 2) {
    msgs.push({ type: 'warn', text: `⚜ Your Dux has 2 sides surrounded — watch for the encirclement tactic.` });
  }
  const oppDuxDgr = duxSurroundCount(st.board, opponent(side));
  if (oppDuxDgr === 3) {
    msgs.push({ type: 'good', text: `⚜ Enemy Dux is surrounded on 3 of 4 sides — one more piece in position captures the commander!` });
  }

  const danger = getDangerSquares(st, side);
  if (danger.size) {
    const coordStr = [...danger].map(k => {
      const [r, c] = k.split(',');
      return formatCoord([+r, +c]);
    }).join(', ');
    msgs.push({ type: 'warn', text: `⚠ Pieces at ${coordStr} are in danger of being captured!` });
  }

  return msgs;
}

// ════════════════════════════════════════════════════════════════
//  POST-GAME REVIEW
// ════════════════════════════════════════════════════════════════

export function generateReview(histArr) {
  // Identify turning points from move history
  const events = [];
  for (let i = 0; i < histArr.length; i++) {
    const h = histArr[i];
    if (h.captures >= 2) events.push({ type: 'good', turn: i + 1, msg: `Turn ${i + 1}: ${h.player === WHITE ? 'White' : 'Black'} executed a fork capturing ${h.captures} pieces.` });
    else if (h.captures === 1) events.push({ type: 'neutral', turn: i + 1, msg: `Turn ${i + 1}: ${h.player === WHITE ? 'White' : 'Black'} made a custodial capture.` });
    if (h.walkedInDanger) events.push({ type: 'blunder', turn: i + 1, msg: `Turn ${i + 1}: ${h.player === WHITE ? 'White' : 'Black'} walked a piece into danger (hung piece).` });
  }
  return events.slice(-6); // last 6 notable events
}

// ════════════════════════════════════════════════════════════════
//  MOVE EXPLANATION
//  Returns an array of {type, text} message objects.
//  The caller (component) is responsible for displaying them
//  and applying board highlight data (src, dst, captures, altMove).
// ════════════════════════════════════════════════════════════════

export function explainMove(histEntry, aiDepth = 1) {
  // histEntry shape: { player, src, dst, captures, walkedInDanger, stateBefore, stateAfter }
  const h   = histEntry;
  const sb  = h.stateBefore;
  const msgs = [];

  const pName  = h.player === WHITE ? 'White' : 'Black';
  const srcStr = formatCoord(h.src);
  const dstStr = formatCoord(h.dst);

  // ── WHAT HAPPENED ──
  msgs.push({ type: 'info', text: `${pName}: ${srcStr} → ${dstStr}${h.captures ? ` (captured ${h.captures} piece${h.captures > 1 ? 's' : ''})` : ''}` });

  // ── CAPTURE EXPLANATION ──
  if (h.captures >= 2) {
    msgs.push({ type: 'good', text: `⚔ FORK! This move captured ${h.captures} pieces simultaneously by landing between two enemy clusters. This is one of the most powerful moves in Latrunculi — your opponent could only block one threat.` });
  } else if (h.captures === 1) {
    const [dr, dc] = h.dst;
    for (const [drow, dcol] of DIRS) {
      const ar = dr + drow, ac = dc + dcol;
      const br = dr + 2 * drow, bc = dc + 2 * dcol;
      if (!inBounds(ar, ac) || !inBounds(br, bc)) continue;
      if (pieceOwner(sb.board[ar][ac]) === opponent(h.player) && pieceOwner(sb.board[br][bc]) === h.player) {
        const capDir = drow !== 0 ? (drow > 0 ? 'south' : 'north') : (dcol > 0 ? 'east' : 'west');
        msgs.push({ type: 'good', text: `✦ Custodial capture to the ${capDir}: the piece at ${formatCoord([ar, ac])} was sandwiched between ${dstStr} and the anchor at ${formatCoord([br, bc])}. Classic bracket geometry.` });
        break;
      }
    }
  }

  // ── DANGER / BLUNDER ──
  let altMove = null;
  if (h.walkedInDanger) {
    msgs.push({ type: 'warn', text: `⚠ HUNG PIECE: After this move, the piece at ${dstStr} could be captured by the opponent next turn. Moving into a bracket zone without a retreat is one of the most common beginner mistakes. Always check if the destination can be sandwiched before committing.` });
    const aiMove = chooseMove(sb, Math.min(aiDepth + 1, 3));
    if (aiMove && !(aiMove.src[0] === h.src[0] && aiMove.src[1] === h.src[1] && aiMove.dst[0] === h.dst[0] && aiMove.dst[1] === h.dst[1])) {
      msgs.push({ type: 'lesson', text: `💡 The engine preferred ${formatCoord(aiMove.src)} → ${formatCoord(aiMove.dst)} instead — safer destination with more escape routes.` });
      altMove = aiMove; // component can use this to highlight the alternative square
    }
  }

  // ── MISSED OPPORTUNITIES ──
  if (!h.captures) {
    const caps = getBracketingMoves(sb);
    if (caps.length) {
      const best = caps.sort((a, b) => b.captures - a.captures)[0];
      const wasThisMove = best.move.src[0] === h.src[0] && best.move.src[1] === h.src[1];
      if (!wasThisMove) {
        msgs.push({ type: 'warn', text: `⚠ MISSED CAPTURE: ${pName} had a capturing move available (${formatCoord(best.move.src)} → ${formatCoord(best.move.dst)}) but didn't take it. In Latrunculi, captures should generally be prioritized — each piece lost is a loss of mobility and material.` });
      }
    }
  }

  // ── MOBILITY CONTEXT ──
  const myMob  = legalMoves(sb, h.player).length;
  const oppMob = legalMoves(sb, opponent(h.player)).length;
  if (myMob - oppMob > 6) {
    msgs.push({ type: 'good', text: `📊 Mobility advantage: ${pName} had ${myMob} legal moves vs opponent's ${oppMob} — a strong positional edge before this move.` });
  } else if (oppMob - myMob > 6) {
    msgs.push({ type: 'warn', text: `📊 Mobility deficit: ${pName} had only ${myMob} legal moves vs opponent's ${oppMob}. Low mobility often precedes material loss — focus on opening escape routes.` });
  }

  // ── PRINCIPLE REMINDER ──
  const principles = [
    { cond: h.captures >= 2,  msg: `Principle: ${PRINCIPLES.fork}` },
    { cond: h.walkedInDanger, msg: `Principle: ${PRINCIPLES.dangerSquare}` },
    { cond: h.captures === 1, msg: `Principle: ${PRINCIPLES.captureGeometry}` },
    { cond: myMob < 6,        msg: `Principle: ${PRINCIPLES.endgame}` },
  ];
  const match = principles.find(p => p.cond);
  if (match) msgs.push({ type: 'lesson', text: match.msg });

  return { msgs, altMove };
}
