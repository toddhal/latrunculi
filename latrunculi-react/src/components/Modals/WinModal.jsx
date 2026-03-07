// WinModal.jsx
// Displays when the game ends. Shows winner, piece counts, move count.
// Matches the Roman modal aesthetic from latrunculi_full.html.

import { WHITE, countPieces } from '../../engine/constants.js'

const overlay = {
  position:       'fixed',
  inset:          0,
  background:     'rgba(0,0,0,0.85)',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  zIndex:         100,
}

const modal = {
  background: '#120e08',
  border:     '1px solid #3d2e18',
  borderTop:  '3px solid #c9a227',
  padding:    '40px',
  maxWidth:   500,
  width:      '90%',
  textAlign:  'center',
  boxShadow:  '0 20px 60px rgba(0,0,0,0.9)',
}

const statBox = {
  background: '#1c1510',
  border:     '1px solid #3d2e18',
  padding:    12,
}

export default function WinModal({ winnerSide, gameState, history, onNewGame }) {
  if (!winnerSide) return null

  const isWhiteWin = winnerSide === WHITE
  const wc = countPieces(gameState.board, WHITE)
  const bc = countPieces(gameState.board, 'B')

  return (
    <div style={overlay}>
      <div style={modal}>
        {/* Title */}
        <div style={{
          fontFamily:   "'Cinzel Decorative', serif",
          fontSize:     28,
          background:   'linear-gradient(135deg,#8a6e1a,#e8c96d,#8a6e1a)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip: 'text',
          marginBottom: 8,
        }}>
          {isWhiteWin ? 'Victory' : 'Defeat'}
        </div>

        <div style={{ fontSize:15, color:'#b8a07a', marginBottom:24, fontStyle:'italic', fontFamily:"'EB Garamond',serif" }}>
          {isWhiteWin ? 'White claims the field.' : 'Black claims the field.'}
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:28 }}>
          <div style={statBox}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.2em', color:'#8a7050', textTransform:'uppercase', marginBottom:4 }}>Moves</div>
            <div style={{ fontSize:22, color:'#e8c96d' }}>{history.length}</div>
          </div>
          <div style={statBox}>
            <div style={{ fontFamily:"'Cinzel',serif", fontSize:9, letterSpacing:'0.2em', color:'#8a7050', textTransform:'uppercase', marginBottom:4 }}>Remaining</div>
            <div style={{ fontSize:22, color:'#e8c96d' }}>{isWhiteWin ? wc : bc}</div>
          </div>
        </div>

        <button
          onClick={onNewGame}
          style={{
            padding:       '12px 28px',
            fontFamily:    "'Cinzel', serif",
            fontSize:      12,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            background:    'transparent',
            border:        '1px solid #c9a227',
            color:         '#c9a227',
            cursor:        'pointer',
            width:         '100%',
          }}
        >
          New Campaign
        </button>
      </div>
    </div>
  )
}
