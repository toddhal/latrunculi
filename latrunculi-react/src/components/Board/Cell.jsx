// Cell.jsx
// A single square on the board. Alternates light/dark stone colors.
// Renders a Piece if one is present.

import { pieceOwner } from '../../engine/constants.js'
import Piece from './Piece.jsx'

// Colors from latrunculi_full.html CSS variables
const LIGHT_SQ = '#c4a46b'  // --stone-light
const DARK_SQ  = '#7a5c2a'  // --stone-dark
const SQ_SIZE  = 68          // --sq: 68px

export default function Cell({ row, col, piece }) {
  const isLight = (row + col) % 2 === 0
  const owner   = pieceOwner(piece)

  return (
    <div
      style={{
        width:           SQ_SIZE,
        height:          SQ_SIZE,
        background:      isLight ? LIGHT_SQ : DARK_SQ,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        position:        'relative',
        boxSizing:       'border-box',
      }}
    >
      {owner && <Piece color={owner} />}
    </div>
  )
}
