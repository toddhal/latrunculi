// Piece.jsx
// Renders all three piece types: Round, Dux (commander), Gladiator (diamond).
// Colors and shapes match latrunculi_full.html exactly.

import { pieceOwner, isDux, isGladiator } from '../../engine/constants.js'

export default function Piece({ piece }) {
  const owner  = pieceOwner(piece)
  const dux    = isDux(piece)
  const glad   = isGladiator(piece)
  const isWhite = owner === 'W'

  if (glad) return <GladiatorPiece isWhite={isWhite} />
  if (dux)  return <DuxPiece isWhite={isWhite} />
  return <RoundPiece isWhite={isWhite} />
}

// ── Round piece (standard soldier) ──────────────────────────────
function RoundPiece({ isWhite }) {
  const base = {
    width:        52,
    height:       52,
    borderRadius: '50%',
    position:     'relative',
    flexShrink:   0,
  }
  const style = isWhite
    ? {
        ...base,
        background: 'radial-gradient(circle at 35% 30%, #f5e090, #c9a227 60%, #8a6e1a)',
        boxShadow:  '2px 3px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
        border:     '2px solid rgba(201,162,39,0.5)',
      }
    : {
        ...base,
        background: 'radial-gradient(circle at 35% 30%, #d04040, #8b1a1a 60%, #4a0808)',
        boxShadow:  '2px 3px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,100,100,0.15)',
        border:     '2px solid rgba(139,26,26,0.6)',
      }
  const shineColor = isWhite ? 'rgba(255,255,255,0.25)' : 'rgba(255,150,150,0.15)'
  return (
    <div style={style}>
      <div style={{ position:'absolute', width:18, height:10, borderRadius:'50%', top:10, left:10, transform:'rotate(-30deg)', background:shineColor, pointerEvents:'none' }} />
    </div>
  )
}

// ── Dux (commander) — larger circle with crown glyph ────────────
function DuxPiece({ isWhite }) {
  const base = {
    width:        56,
    height:       56,
    borderRadius: '50%',
    position:     'relative',
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    flexShrink:   0,
  }
  const style = isWhite
    ? {
        ...base,
        background:  'radial-gradient(circle at 35% 30%, #f5e090, #c9a227 60%, #8a6e1a)',
        boxShadow:   '2px 3px 8px rgba(0,0,0,0.6), 0 0 14px rgba(255,230,100,0.5), inset 0 -2px 4px rgba(0,0,0,0.3)',
        border:      '3px solid rgba(255,255,255,0.7)',
      }
    : {
        ...base,
        background:  'radial-gradient(circle at 35% 30%, #d04040, #8b1a1a 60%, #4a0808)',
        boxShadow:   '2px 3px 8px rgba(0,0,0,0.6), 0 0 14px rgba(200,60,60,0.5), inset 0 -2px 4px rgba(0,0,0,0.4)',
        border:      '3px solid rgba(255,160,160,0.7)',
      }
  return (
    <div style={style}>
      <span style={{ fontSize:20, lineHeight:1, textShadow:'0 1px 4px rgba(0,0,0,0.8)', pointerEvents:'none', zIndex:3 }}>
        {isWhite ? '♘' : '♞'}
      </span>
    </div>
  )
}

// ── Gladiator — rotated square (diamond shape) ──────────────────
function GladiatorPiece({ isWhite }) {
  const base = {
    width:        34,
    height:       34,
    borderRadius: 3,
    transform:    'rotate(45deg)',
    position:     'relative',
    display:      'flex',
    alignItems:   'center',
    justifyContent: 'center',
    flexShrink:   0,
  }
  const style = isWhite
    ? {
        ...base,
        background: 'radial-gradient(circle at 35% 30%, #f5e090, #c9a227 60%, #8a6e1a)',
        boxShadow:  '2px 3px 8px rgba(0,0,0,0.6), 0 0 8px rgba(200,160,0,0.25), inset 0 -2px 3px rgba(0,0,0,0.3)',
        border:     '2px solid rgba(201,162,39,0.5)',
      }
    : {
        ...base,
        background: 'radial-gradient(circle at 35% 30%, #d04040, #8b1a1a 60%, #4a0808)',
        boxShadow:  '2px 3px 8px rgba(0,0,0,0.6), 0 0 8px rgba(160,30,30,0.25), inset 0 -2px 3px rgba(0,0,0,0.4)',
        border:     '2px solid rgba(139,26,26,0.6)',
      }
  return (
    <div style={style}>
      <span style={{ transform:'rotate(-45deg)', fontSize:12, pointerEvents:'none', zIndex:3, textShadow:'0 1px 3px rgba(0,0,0,0.8)' }}>
        ◆
      </span>
    </div>
  )
}
