// useGame.js
// All game logic in one place. App.jsx stays thin — just layout.
// Returns everything the UI needs: state + action handlers.

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  makeState, initialBoard, setGameVariant,
  pieceOwner, WHITE, BLACK, opponent,
} from '../engine/constants.js'
import { legalMoves, applyMove, winner, isLegalMove } from '../engine/rules.js'
import { chooseMove } from '../engine/ai.js'
import {
  getDangerSquares, coachTurnAnalysis, generateReview, explainMove,
} from '../engine/coach.js'

const AI_SIDE  = BLACK
const AI_DELAY = 400   // ms before AI moves

export default function useGame() {
  // ── Settings (survive new game) ──────────────────────────────
  const [variant, setVariantRaw] = useState('standard')
  const [mode,    setMode]       = useState('spar')
  const [aiDepth, setAiDepth]    = useState(1)

  // ── Per-game state ───────────────────────────────────────────
  const [gameState,    setGameState]    = useState(() => { setGameVariant('standard'); return makeState(initialBoard(), WHITE) })
  const [selected,     setSelected]     = useState(null)
  const [legalDests,   setLegalDests]   = useState([])
  const [lastMove,     setLastMove]     = useState(null)
  const [history,      setHistory]      = useState([])     // [{player,src,dst,captures,walkedInDanger,stateBefore,stateAfter}]
  const [coachMsgs,    setCoachMsgs]    = useState([{ type:'info', text:'White moves first. Select a piece.' }])
  const [gameOver,     setGameOver]     = useState(false)
  const [winnerSide,   setWinnerSide]   = useState(null)
  const [pendingPromo, setPendingPromo] = useState(null)   // {board, square:[r,c], nextToMove}
  const [aiThinking,   setAiThinking]   = useState(false)
  const [explainIdx,   setExplainIdx]   = useState(null)

  // We keep a mutable ref of history so closures inside effects can read latest value
  const historyRef = useRef([])

  // ── Variant switcher ─────────────────────────────────────────
  function setVariant(v) {
    setVariantRaw(v)
  }

  // ── Coach helpers ─────────────────────────────────────────────
  function pushCoach(msgs) {
    setCoachMsgs(prev => [...prev.slice(-30), ...msgs])
  }

  // ── New game ──────────────────────────────────────────────────
  const newGame = useCallback((v) => {
    const activeVariant = v ?? variant
    setGameVariant(activeVariant)
    const st = makeState(initialBoard(), WHITE)
    setGameState(st)
    setSelected(null)
    setLegalDests([])
    setLastMove(null)
    setHistory([])
    historyRef.current = []
    setCoachMsgs([{ type:'info', text:'New game. White moves first.' }])
    setGameOver(false)
    setWinnerSide(null)
    setPendingPromo(null)
    setAiThinking(false)
    setExplainIdx(null)
  }, [variant])

  // Re-start when variant changes
  useEffect(() => {
    newGame(variant)
  }, [variant]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core: finish applying a move and advance game state ───────
  // histEntry is the record for the history log.
  // ns is the new game state AFTER any promotion has been resolved.
  function finishMove(ns, histEntry) {
    const w = winner(ns)

    // Record in history
    const finalEntry = { ...histEntry, stateAfter: ns }
    const newHistory = [...historyRef.current, finalEntry]
    historyRef.current = newHistory
    setHistory(newHistory)
    setLastMove({ src: histEntry.src, dst: histEntry.dst })

    if (w) {
      setGameState(ns)
      setSelected(null)
      setLegalDests([])
      setGameOver(true)
      setWinnerSide(w)
      const events = generateReview(newHistory)
      pushCoach([
        { type:'info', text: `Game over! ${w === WHITE ? 'White' : 'Black'} wins.` },
        ...events.map(e => ({ type: e.type === 'blunder' ? 'warn' : (e.type === 'good' ? 'good' : 'info'), text: e.msg })),
      ])
      return
    }

    setGameState(ns)
    setSelected(null)
    setLegalDests([])

    if (mode === 'spar' || mode === 'hint') {
      const msgs = coachTurnAnalysis(ns)
      if (msgs.length) pushCoach(msgs)
    }
  }

  // ── Core: execute a move (human or AI) ───────────────────────
  function executeMove(st, move) {
    const { state: ns, captures, promotionSquare } = applyMove(st, move)

    const dangerAfter    = getDangerSquares(ns, st.toMove)
    const walkedInDanger = dangerAfter.has(`${move.dst[0]},${move.dst[1]}`)

    const histEntry = {
      player: st.toMove,
      src:    move.src,
      dst:    move.dst,
      captures,
      walkedInDanger,
      stateBefore: st,
      stateAfter:  ns,   // may be updated by finishMove
    }

    if (promotionSquare) {
      const [pr, pc] = promotionSquare
      if (st.toMove === AI_SIDE) {
        // AI always promotes to Dux
        const promoBoard = ns.board.map(r => [...r])
        promoBoard[pr][pc] = st.toMove === WHITE ? 'WD' : 'BD'
        const promoState = makeState(promoBoard, ns.toMove)
        finishMove(promoState, histEntry)
      } else {
        // Human — pause and show promotion modal
        setGameState(ns)   // show board with piece at destination
        setSelected(null)
        setLegalDests([])
        setLastMove({ src: move.src, dst: move.dst })
        setPendingPromo({ board: ns.board, square: promotionSquare, nextToMove: ns.toMove, histEntry })
      }
    } else {
      finishMove(ns, histEntry)
    }
  }

  // Human picks promotion piece
  function resolvePromotion(choice) {
    if (!pendingPromo) return
    const { board, square: [pr, pc], nextToMove, histEntry } = pendingPromo
    const newBoard = board.map(r => [...r])
    // The piece at [pr][pc] is 'W' or 'B' (the mover); promote it or keep
    const base = newBoard[pr][pc]   // 'W' or 'B'
    newBoard[pr][pc] = choice === 'dux'
      ? (base === 'W' ? 'WD' : 'BD')
      : base
    const promoState = makeState(newBoard, nextToMove)
    setPendingPromo(null)
    finishMove(promoState, histEntry)
  }

  // ── Human click ───────────────────────────────────────────────
  const onSquareClick = useCallback((r, c) => {
    if (gameOver || pendingPromo || aiThinking) return
    if (gameState.toMove === AI_SIDE) return

    const piece        = gameState.board[r][c]
    const clickedOwner = pieceOwner(piece)

    if (selected) {
      const [sr, sc] = selected

      // Same square → deselect
      if (sr === r && sc === c) { setSelected(null); setLegalDests([]); return }

      // Legal move destination → execute
      if (isLegalMove(gameState, selected, [r, c])) {
        executeMove(gameState, { src: selected, dst: [r, c] })
        return
      }

      // Another friendly piece → re-select
      if (clickedOwner === gameState.toMove) {
        const moves = legalMoves(gameState, gameState.toMove).filter(m => m.src[0] === r && m.src[1] === c)
        setSelected([r, c])
        setLegalDests(moves.map(m => m.dst))
        return
      }

      // Anywhere else → deselect
      setSelected(null); setLegalDests([])
      return
    }

    // Select a friendly piece
    if (clickedOwner === gameState.toMove) {
      const moves = legalMoves(gameState, gameState.toMove).filter(m => m.src[0] === r && m.src[1] === c)
      setSelected([r, c])
      setLegalDests(moves.map(m => m.dst))
    }
  }, [gameState, selected, gameOver, pendingPromo, aiThinking]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── AI move (useEffect) ───────────────────────────────────────
  useEffect(() => {
    if (gameOver || pendingPromo || mode === 'review') return
    if (gameState.toMove !== AI_SIDE) return

    setAiThinking(true)
    const t = setTimeout(() => {
      const move = chooseMove(gameState, aiDepth)
      setAiThinking(false)
      if (move) executeMove(gameState, move)
    }, AI_DELAY)

    return () => clearTimeout(t)
  }, [gameState.toMove, gameOver, pendingPromo, mode, aiDepth]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values ────────────────────────────────────────────
  const dangerSquares = (mode === 'hint' && !gameOver)
    ? getDangerSquares(gameState, gameState.toMove)
    : new Set()

  // Explain mode: compute board highlights for the selected history entry
  const explainHighlights = (() => {
    if (mode !== 'explain' || explainIdx === null) return {}
    const h = historyRef.current[explainIdx]
    if (!h) return {}
    const { msgs, altMove } = explainMove(h, aiDepth)
    // Captured squares = pieces present in stateBefore but gone in stateAfter
    const caps = []
    for (let er = 0; er < 8; er++)
      for (let ec = 0; ec < 8; ec++)
        if (pieceOwner(h.stateBefore.board[er][ec]) === opponent(h.player)
         && h.stateAfter.board[er][ec] === '.')
          caps.push([er, ec])
    return { src: h.src, dst: h.dst, caps, alt: altMove?.dst ?? null, msgs }
  })()

  return {
    // Game state
    gameState, selected, legalDests, lastMove, history, coachMsgs,
    gameOver, winnerSide, pendingPromo, aiThinking,
    // Settings
    variant, mode, aiDepth,
    // Derived
    dangerSquares, explainHighlights, explainIdx,
    // Actions
    onSquareClick, newGame, setVariant, setMode, setAiDepth,
    resolvePromotion, setExplainIdx,
  }
}
