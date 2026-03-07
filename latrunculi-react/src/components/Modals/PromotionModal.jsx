// PromotionModal.jsx
// Appears when a human player's round piece captures a Gladiator.
// Asks: promote to Dux commander, or stay as a round soldier?

const overlay = {
  position:       'fixed',
  inset:          0,
  background:     'rgba(0,0,0,0.75)',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  zIndex:         200,
}

const modal = {
  background: '#120e08',
  border:     '1px solid #3d2e18',
  borderTop:  '3px solid #c9a227',
  padding:    '32px 36px',
  maxWidth:   380,
  width:      '90%',
  textAlign:  'center',
  boxShadow:  '0 20px 60px rgba(0,0,0,0.9)',
}

function ChoiceBtn({ label, sub, onClick, accent }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex:          1,
        padding:       '14px 10px',
        fontFamily:    "'Cinzel', serif",
        fontSize:      11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background:    'transparent',
        border:        `1px solid ${accent}`,
        color:         accent,
        cursor:        'pointer',
        lineHeight:    1.5,
      }}
    >
      <div>{label}</div>
      <div style={{ fontSize:10, opacity:0.7, marginTop:4, fontStyle:'italic', letterSpacing:'0.05em' }}>{sub}</div>
    </button>
  )
}

export default function PromotionModal({ pendingPromo, onResolve }) {
  if (!pendingPromo) return null

  return (
    <div style={overlay}>
      <div style={modal}>
        <div style={{
          fontFamily:   "'Cinzel Decorative', serif",
          fontSize:     20,
          color:        '#e8c96d',
          marginBottom: 8,
        }}>
          Promotion
        </div>
        <div style={{
          fontSize:     14,
          color:        '#b8a07a',
          fontStyle:    'italic',
          marginBottom: 24,
          lineHeight:   1.5,
          fontFamily:   "'EB Garamond', serif",
        }}>
          Your soldier slew a Gladiator.<br />
          Shall they be raised to commander?
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <ChoiceBtn
            label="Claim Dux"
            sub="Promote to commander"
            accent="#c9a227"
            onClick={() => onResolve('dux')}
          />
          <ChoiceBtn
            label="Remain Soldier"
            sub="Keep as round piece"
            accent="#8a7050"
            onClick={() => onResolve('keep')}
          />
        </div>
      </div>
    </div>
  )
}
