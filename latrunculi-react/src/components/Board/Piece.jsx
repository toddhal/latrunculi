// Piece.jsx
// Renders a single game piece (round only for now — Dux/Gladiator come in a later step).
// Colors match the Roman aesthetic from latrunculi_full.html exactly.

const styles = {
  white: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #f5e090, #c9a227 60%, #8a6e1a)',
    boxShadow: '2px 3px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.3), inset 0 2px 4px rgba(255,255,255,0.2)',
    border: '2px solid rgba(201,162,39,0.5)',
    position: 'relative',
  },
  black: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'radial-gradient(circle at 35% 30%, #d04040, #8b1a1a 60%, #4a0808)',
    boxShadow: '2px 3px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,100,100,0.15)',
    border: '2px solid rgba(139,26,26,0.6)',
    position: 'relative',
  },
  // Shine highlight (the ::after pseudo-element from the original)
  shine: {
    position: 'absolute',
    width: 18,
    height: 10,
    borderRadius: '50%',
    top: 10,
    left: 10,
    transform: 'rotate(-30deg)',
    pointerEvents: 'none',
  },
}

export default function Piece({ color }) {
  const isWhite = color === 'W'
  const pieceStyle = isWhite ? styles.white : styles.black
  const shineColor = isWhite
    ? 'rgba(255,255,255,0.25)'
    : 'rgba(255,150,150,0.15)'

  return (
    <div style={pieceStyle}>
      <div style={{ ...styles.shine, background: shineColor }} />
    </div>
  )
}
