import { useState } from 'react'
import { makeState, initialBoard } from './engine/constants.js'

function App() {
  const [gameState, setGameState] = useState(() => makeState(initialBoard(), 'W'))

  return (
    <div>
      <h1>Latrunculi</h1>
      <p>Turn: {gameState.toMove === 'W' ? 'White' : 'Black'}</p>
      <pre>{gameState.board.map(row => row.join(' ')).join('\n')}</pre>
    </div>
  )
}

export default App
