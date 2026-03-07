import useGame from './hooks/useGame.js'
import Board from './components/Board/Board.jsx'
import CoachPanel from './components/Panel/CoachPanel.jsx'
import WinModal from './components/Modals/WinModal.jsx'
import PromotionModal from './components/Modals/PromotionModal.jsx'
import { countPieces, WHITE } from './engine/constants.js'

export default function App() {
  const game = useGame()

  const whiteCount = countPieces(game.gameState.board, WHITE)
  const blackCount = countPieces(game.gameState.board, 'B')

  return (
    <div style={{
      minHeight:      '100vh',
      background:     '#0a0806',
      backgroundImage: 'radial-gradient(ellipse at 20% 0%,rgba(139,26,26,0.08) 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,rgba(201,162,39,0.06) 0%,transparent 50%)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      fontFamily:     "'EB Garamond', serif",
      color:          '#e8d5a8',
    }}>

      {/* Header */}
      <header style={{
        width:        '100%',
        textAlign:    'center',
        padding:      '20px 20px 14px',
        borderBottom: '1px solid #3d2e18',
        background:   'linear-gradient(180deg,rgba(201,162,39,0.05) 0%,transparent 100%)',
        position:     'relative',
      }}>
        <div style={{
          fontFamily:   "'Cinzel Decorative', serif",
          fontSize:     'clamp(20px,4vw,36px)',
          fontWeight:   700,
          letterSpacing:'0.12em',
          background:   'linear-gradient(135deg,#8a6e1a 0%,#e8c96d 45%,#8a6e1a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor:  'transparent',
          backgroundClip: 'text',
          lineHeight:   1,
        }}>
          LATRUNCULI
        </div>
        <div style={{
          fontFamily:   "'Cinzel', serif",
          fontSize:     11,
          letterSpacing:'0.4em',
          color:        '#8a7050',
          marginTop:    5,
          textTransform:'uppercase',
        }}>
          Game of Mercenaries
        </div>
      </header>

      {/* Main layout */}
      <div style={{
        display:    'flex',
        gap:        24,
        padding:    '24px 20px',
        width:      '100%',
        maxWidth:   1100,
        alignItems: 'flex-start',
      }}>

        {/* Board area */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, flexShrink:0 }}>

          {/* Piece counts + turn indicator */}
          <div style={{
            display:        'flex',
            justifyContent: 'space-between',
            alignItems:     'center',
            width:          '100%',
            padding:        '7px 12px',
            background:     '#1c1510',
            border:         '1px solid #3d2e18',
            fontFamily:     "'Cinzel', serif",
            fontSize:       12,
            letterSpacing:  '0.08em',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <PipCount color="#c9a227" count={whiteCount} label="White" />
              <PipCount color="#c0392b" count={blackCount} label="Black" />
            </div>
            <div style={{ color: game.aiThinking ? '#8a7050' : '#e8c96d', fontSize:13 }}>
              {game.gameOver
                ? `${game.winnerSide === WHITE ? 'White' : 'Black'} wins`
                : game.aiThinking
                  ? '⚙ Thinking…'
                  : game.gameState.toMove === WHITE ? "White's Turn" : "Black's Turn"}
            </div>
          </div>

          <Board
            board={game.gameState.board}
            selected={game.selected}
            legalDests={game.legalDests}
            dangerSquares={game.dangerSquares}
            lastMove={game.lastMove}
            explainHighlights={game.explainHighlights}
            onSquareClick={game.gameOver ? undefined : game.onSquareClick}
          />
        </div>

        {/* Side panel */}
        <CoachPanel
          mode={game.mode}           setMode={game.setMode}
          aiDepth={game.aiDepth}     setAiDepth={game.setAiDepth}
          variant={game.variant}     setVariant={game.setVariant}
          coachMsgs={game.coachMsgs}
          history={game.history}
          gameState={game.gameState}
          gameOver={game.gameOver}
          winnerSide={game.winnerSide}
          explainIdx={game.explainIdx}
          setExplainIdx={game.setExplainIdx}
          explainHighlights={game.explainHighlights}
          newGame={game.newGame}
        />
      </div>

      {/* Modals */}
      <WinModal
        winnerSide={game.winnerSide}
        gameState={game.gameState}
        history={game.history}
        onNewGame={game.newGame}
      />
      <PromotionModal
        pendingPromo={game.pendingPromo}
        onResolve={game.resolvePromotion}
      />
    </div>
  )
}

// Small helper component for piece-count display
function PipCount({ color, count, label }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <div style={{ width:12, height:12, borderRadius:'50%', background:color, flexShrink:0 }} />
      <span style={{ color:'#8a7050' }}>{label}</span>
      <span style={{ color:'#c9a227', marginLeft:2 }}>{count}</span>
    </div>
  )
}
