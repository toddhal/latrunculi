// Board.jsx
// 8x8 grid of Cell components. Reads the board array from game state.
// Styled to match the stone-and-gold aesthetic of latrunculi_full.html.

import { SIZE } from '../../engine/constants.js'
import Cell from './Cell.jsx'

const SQ_SIZE     = 68
const BOARD_PX    = SIZE * SQ_SIZE  // 544px

export default function Board({ board }) {
  return (
    <div
      style={{
        padding:    10,
        background: '#120e08',          // --bg2
        border:     '2px solid #3d2e18', // --border
        boxShadow:  '0 0 0 1px rgba(201,162,39,0.1), 0 8px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.3)',
        display:    'inline-block',
      }}
    >
      <div
        style={{
          display:             'grid',
          gridTemplateColumns: `repeat(${SIZE}, ${SQ_SIZE}px)`,
          gridTemplateRows:    `repeat(${SIZE}, ${SQ_SIZE}px)`,
          border:              '1px solid #7a5c2a',  // --stone-dark
          width:               BOARD_PX,
          height:              BOARD_PX,
        }}
      >
        {board.map((row, r) =>
          row.map((piece, c) => (
            <Cell key={`${r}-${c}`} row={r} col={c} piece={piece} />
          ))
        )}
      </div>
    </div>
  )
}
