// Cell.jsx
// A single board square. Handles all visual states: selection, legal targets,
// danger highlights, last-move tint, and explain-mode overlays.

import { pieceOwner } from '../../engine/constants.js'
import Piece from './Piece.jsx'

const LIGHT_SQ = '#c4a46b'   // --stone-light
const DARK_SQ  = '#7a5c2a'   // --stone-dark
const SQ_SIZE  = 68

export default function Cell({
  row, col, piece,
  isSelected   = false,
  isLegalTarget = false,
  isDanger     = false,
  isHint       = false,
  isLastFrom   = false,
  isLastTo     = false,
  explainType  = null,   // 'src' | 'dst' | 'cap' | 'alt'
  onClick,
}) {
  const isLight = (row + col) % 2 === 0
  const hasPiece = pieceOwner(piece) !== null

  // Build overlay color for the square background
  let bg = isLight ? LIGHT_SQ : DARK_SQ
  let boxShadow = 'none'

  if (isSelected)       { bg = 'rgba(201,162,39,0.5)';         boxShadow = 'inset 0 0 0 3px rgba(201,162,39,0.7)' }
  if (isDanger)         { bg = 'rgba(139,26,26,0.35)' }
  if (isHint)           { bg = 'rgba(30,120,50,0.3)' }
  if (isLastFrom)       { boxShadow = 'inset 0 0 0 2px rgba(100,160,255,0.35)' }
  if (isLastTo)         { boxShadow = 'inset 0 0 0 2px rgba(201,162,39,0.4)' }

  // Explain-mode overrides everything
  if (explainType === 'src') { bg = 'rgba(74,130,210,0.45)';  boxShadow = 'inset 0 0 0 3px rgba(100,160,255,0.7)' }
  if (explainType === 'dst') { bg = 'rgba(30,140,60,0.45)';   boxShadow = 'inset 0 0 0 3px rgba(60,200,100,0.7)' }
  if (explainType === 'cap') { bg = 'rgba(180,30,30,0.5)';    boxShadow = 'inset 0 0 0 3px rgba(255,60,60,0.7)' }
  if (explainType === 'alt') { bg = 'rgba(160,100,0,0.35)';   boxShadow = 'inset 0 0 0 2px rgba(220,160,0,0.5)' }

  return (
    <div
      onClick={onClick}
      style={{
        width:          SQ_SIZE,
        height:         SQ_SIZE,
        background:     bg,
        boxShadow:      boxShadow,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
        boxSizing:      'border-box',
        cursor:         onClick ? 'pointer' : 'default',
        transition:     'background 0.1s',
      }}
    >
      {/* Legal-move indicator dot */}
      {isLegalTarget && !hasPiece && (
        <div style={{
          position:     'absolute',
          width:        20,
          height:       20,
          borderRadius: '50%',
          background:   'rgba(201,162,39,0.45)',
          border:       '2px solid rgba(201,162,39,0.6)',
          pointerEvents:'none',
          zIndex:       1,
        }} />
      )}
      {/* Legal-move ring around occupied squares */}
      {isLegalTarget && hasPiece && (
        <div style={{
          position:     'absolute',
          inset:        4,
          border:       '3px solid rgba(201,162,39,0.6)',
          pointerEvents:'none',
          zIndex:       1,
        }} />
      )}

      {hasPiece && <Piece piece={piece} />}
    </div>
  )
}
