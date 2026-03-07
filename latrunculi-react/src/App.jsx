import { useState } from 'react'
import { makeState, initialBoard } from './engine/constants.js'
import Board from './components/Board/Board.jsx'

function App() {
  const [gameState, setGameState] = useState(() => makeState(initialBoard(), 'W'))

  return (
    <div
      style={{
        minHeight:      '100vh',
        background:     '#0a0806',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        fontFamily:     "'Cinzel', serif",
        color:          '#e8d5a8',
        gap:            24,
      }}
    >
      <h1 style={{ fontSize: 32, letterSpacing: '0.12em', color: '#c9a227', margin: 0 }}>
        LATRUNCULI
      </h1>
      <p style={{ margin: 0, letterSpacing: '0.1em', color: '#8a7050' }}>
        {gameState.toMove === 'W' ? "White's Turn" : "Black's Turn"}
      </p>
      <Board board={gameState.board} />
    </div>
  )
}

export default App
