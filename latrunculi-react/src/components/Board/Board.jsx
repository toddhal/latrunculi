// Board.jsx
// 8x8 grid. Computes per-cell highlight states from high-level props,
// then renders Cell components.

import { SIZE } from '../../engine/constants.js'
import Cell from './Cell.jsx'

const SQ_SIZE  = 68
const BOARD_PX = SIZE * SQ_SIZE  // 544px

export default function Board({
  board,
  selected    = null,    // [r, c] or null
  legalDests  = [],      // array of [r, c]
  dangerSquares = new Set(), // Set of 'r,c' strings
  hintSquares   = new Set(),
  lastMove    = null,    // { src:[r,c], dst:[r,c] } or null
  explainHighlights = {},// { src:[r,c], dst:[r,c], caps:[[r,c]…], alt:[r,c] }
  onSquareClick,
}) {
  const legalSet  = new Set(legalDests.map(([r, c]) => `${r},${c}`))
  const { src: exSrc, dst: exDst, caps: exCaps = [], alt: exAlt } = explainHighlights

  return (
    <div style={{
      padding:    10,
      background: '#120e08',
      border:     '2px solid #3d2e18',
      boxShadow:  '0 0 0 1px rgba(201,162,39,0.1), 0 8px 40px rgba(0,0,0,0.8), inset 0 0 30px rgba(0,0,0,0.3)',
      display:    'inline-block',
    }}>
      <div style={{
        display:             'grid',
        gridTemplateColumns: `repeat(${SIZE}, ${SQ_SIZE}px)`,
        gridTemplateRows:    `repeat(${SIZE}, ${SQ_SIZE}px)`,
        border:              '1px solid #7a5c2a',
        width:               BOARD_PX,
        height:              BOARD_PX,
      }}>
        {board.map((row, r) =>
          row.map((piece, c) => {
            const key   = `${r},${c}`
            const isSel = selected && selected[0] === r && selected[1] === c

            // Explain mode highlights
            let explainType = null
            if (exSrc && exSrc[0] === r && exSrc[1] === c) explainType = 'src'
            if (exDst && exDst[0] === r && exDst[1] === c) explainType = 'dst'
            if (exCaps.some(([er, ec]) => er === r && ec === c)) explainType = 'cap'
            if (exAlt && exAlt[0] === r && exAlt[1] === c) explainType = 'alt'

            return (
              <Cell
                key={key}
                row={r}
                col={c}
                piece={piece}
                isSelected={isSel}
                isLegalTarget={legalSet.has(key)}
                isDanger={dangerSquares.has(key)}
                isHint={hintSquares.has(key)}
                isLastFrom={lastMove && lastMove.src[0] === r && lastMove.src[1] === c}
                isLastTo={lastMove && lastMove.dst[0] === r && lastMove.dst[1] === c}
                explainType={explainType}
                onClick={() => onSquareClick?.(r, c)}
              />
            )
          })
        )}
      </div>
    </div>
  )
}
