// CoachPanel.jsx
// Right-hand side panel. Roman aesthetic — Cinzel font, dark stone, gold accents.
// Handles mode/difficulty/variant selection, coach messages, and move history.

import { WHITE } from '../../engine/constants.js'

// ── Shared style tokens ──────────────────────────────────────────
const T = {
  gold:      '#c9a227',
  goldLight: '#e8c96d',
  goldDim:   '#8a6e1a',
  red:       '#8b1a1a',
  redLight:  '#c0392b',
  bg2:       '#120e08',
  bg3:       '#1c1510',
  bg4:       '#241c12',
  border:    '#3d2e18',
  text:      '#e8d5a8',
  textDim:   '#8a7050',
  creamDim:  '#b8a07a',
}

const card = {
  background: T.bg2,
  border:     `1px solid ${T.border}`,
  padding:    '14px 16px',
  marginBottom: 12,
}

const cardTitle = {
  fontFamily:    "'Cinzel', serif",
  fontSize:      11,
  letterSpacing: '0.3em',
  color:         T.goldDim,
  textTransform: 'uppercase',
  marginBottom:  10,
  paddingBottom: 8,
  borderBottom:  `1px solid ${T.border}`,
}

function TabGroup({ options, value, onChange, cols = 4 }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${cols},1fr)`, gap:4, marginBottom:10 }}>
      {options.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          style={{
            padding:       '6px 4px',
            fontFamily:    "'Cinzel', serif",
            fontSize:      9.5,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            background:    value === id ? 'linear-gradient(180deg,rgba(201,162,39,0.15),rgba(201,162,39,0.05))' : T.bg3,
            border:        `1px solid ${value === id ? T.gold : T.border}`,
            color:         value === id ? T.goldLight : T.textDim,
            cursor:        'pointer',
            boxShadow:     value === id ? '0 0 8px rgba(201,162,39,0.15)' : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function CoachMsg({ type, text }) {
  const borderColor = {
    info:   T.goldDim,
    warn:   T.redLight,
    good:   '#2e7d32',
    lesson: '#4a90d9',
  }[type] ?? T.border

  const color = {
    warn:   '#f0c0b0',
    good:   '#a8d8a8',
    lesson: '#b8d4f0',
  }[type] ?? T.text

  return (
    <div style={{
      padding:    '7px 10px',
      marginBottom: 6,
      fontSize:   13.5,
      lineHeight: 1.55,
      borderLeft: `3px solid ${borderColor}`,
      background: T.bg3,
      color,
      fontFamily: "'EB Garamond', serif",
    }}>
      {text}
    </div>
  )
}

export default function CoachPanel({
  mode, setMode,
  aiDepth, setAiDepth,
  variant, setVariant,
  coachMsgs,
  history,
  gameState,
  gameOver,
  winnerSide,
  explainIdx, setExplainIdx,
  explainHighlights,
  newGame,
}) {
  const MODES = [
    { id:'spar',    label:'Spar' },
    { id:'hint',    label:'Hint' },
    { id:'learn',   label:'Learn' },
    { id:'explain', label:'Explain' },
    { id:'review',  label:'Review' },
  ]
  const DIFFS = [
    { id:1, label:'Novice' },
    { id:2, label:'Soldier' },
    { id:3, label:'Tribune' },
    { id:4, label:'Praetor' },
  ]
  const VARIANTS = [
    { id:'standard',  label:'Standard' },
    { id:'dux',       label:'Dux' },
    { id:'gladiator', label:'Gladiator' },
    { id:'full',      label:'Full' },
  ]

  const explainMsgs = (mode === 'explain' && explainHighlights?.msgs) ? explainHighlights.msgs : []
  const displayMsgs = mode === 'explain' && explainIdx !== null ? explainMsgs : coachMsgs

  return (
    <div style={{ width:300, display:'flex', flexDirection:'column', gap:0, fontFamily:"'Cinzel', serif" }}>

      {/* Mode tabs */}
      <div style={card}>
        <div style={cardTitle}>Mode</div>
        <TabGroup options={MODES} value={mode} onChange={setMode} cols={5} />
        {mode === 'hint' && (
          <div style={{ fontSize:12, color:T.creamDim, fontFamily:"'EB Garamond',serif", fontStyle:'italic' }}>
            Red squares show pieces in danger of capture.
          </div>
        )}
        {mode === 'explain' && (
          <div style={{ fontSize:12, color:T.creamDim, fontFamily:"'EB Garamond',serif", fontStyle:'italic' }}>
            Click a move in the history list to see its analysis.
          </div>
        )}
      </div>

      {/* Difficulty */}
      <div style={card}>
        <div style={cardTitle}>Difficulty</div>
        <TabGroup options={DIFFS} value={aiDepth} onChange={v => setAiDepth(Number(v))} cols={4} />
      </div>

      {/* Variant */}
      <div style={card}>
        <div style={cardTitle}>Variant</div>
        <TabGroup options={VARIANTS} value={variant} onChange={setVariant} cols={4} />
      </div>

      {/* Coach messages */}
      <div style={{ ...card, flexGrow:1 }}>
        <div style={cardTitle}>
          {mode === 'explain' && explainIdx !== null ? 'Analysis' : 'Coach'}
        </div>
        <div style={{ maxHeight:200, overflowY:'auto' }}>
          {displayMsgs.length === 0 && (
            <div style={{ color:T.textDim, fontSize:13, fontFamily:"'EB Garamond',serif", fontStyle:'italic' }}>
              No messages yet.
            </div>
          )}
          {[...displayMsgs].reverse().map((m, i) => (
            <CoachMsg key={i} type={m.type} text={m.text} />
          ))}
        </div>
      </div>

      {/* Move history */}
      <div style={card}>
        <div style={cardTitle}>History</div>
        <div style={{ maxHeight:140, overflowY:'auto', fontSize:12.5, fontFamily:"'EB Garamond',serif" }}>
          {history.length === 0 && (
            <div style={{ color:T.textDim, fontStyle:'italic' }}>No moves yet.</div>
          )}
          {history.map((h, i) => {
            const isActive = mode === 'explain' && explainIdx === i
            const [sr, sc] = h.src
            const [dr, dc] = h.dst
            const files = 'abcdefgh'
            const srcStr = files[sc] + (8 - sr)
            const dstStr = files[dc] + (8 - dr)
            const capStr = h.captures ? ` ×${h.captures}` : ''
            return (
              <div
                key={i}
                onClick={() => mode === 'explain' && setExplainIdx(isActive ? null : i)}
                style={{
                  display:      'flex',
                  gap:          8,
                  padding:      '3px 4px',
                  borderBottom: `1px solid rgba(61,46,24,0.4)`,
                  borderLeft:   isActive ? '2px solid rgba(100,160,255,0.7)' : '2px solid transparent',
                  background:   isActive ? 'rgba(74,130,210,0.12)' : 'transparent',
                  cursor:       mode === 'explain' ? 'pointer' : 'default',
                }}
              >
                <span style={{ color:T.goldDim, minWidth:22, fontFamily:"'Cinzel',serif", fontSize:10 }}>
                  {i + 1}.
                </span>
                <span style={{ color: h.player === WHITE ? '#c4a46b' : '#c07070' }}>
                  {srcStr}–{dstStr}{capStr}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* New Game button */}
      <button
        onClick={() => newGame()}
        style={{
          padding:       '10px 18px',
          fontFamily:    "'Cinzel', serif",
          fontSize:      11,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          background:    'transparent',
          border:        `1px solid ${T.goldDim}`,
          color:         T.gold,
          cursor:        'pointer',
          width:         '100%',
          marginTop:     4,
        }}
      >
        New Game
      </button>
    </div>
  )
}
