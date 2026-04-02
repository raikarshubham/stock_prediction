import React from 'react'

export default function AIInsights({ 
  insightText = "Model predicts bullish trend due to increasing RSI (64.2) and strong volume breakout over the 20-day moving average.",
  suggestedEntry = "₹2,990.00",
  stopLoss = "₹2,940.00"
}) {
  return (
    <div
      className="glass"
      style={{
        border: '1px solid rgba(238,193,255,0.2)',
        borderRadius: '12px',
        padding: '24px',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #eec1ff, #fbe6ff)',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#510074', fontSize: '20px' }}>
            smart_toy
          </span>
        </div>
        <div>
          <p style={{ fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#8a1ebd' }}>
            AI Market Strategist
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                background: '#16ff9e',
                animation: 'pulse 2s infinite',
              }}
            />
            <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700, color: '#bac9cc' }}>
              Live Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Chat bubbles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            padding: '16px',
            borderRadius: '16px',
            borderTopLeftRadius: 0,
            border: '1px solid rgba(59,73,76,0.1)',
            background: 'rgba(49,53,64,0.5)',
          }}
        >
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#dfe2f1' }}>
            {insightText}
          </p>
        </div>
        <div
          style={{
            padding: '16px',
            borderRadius: '16px',
            borderTopLeftRadius: 0,
            border: '1px solid rgba(59,73,76,0.1)',
            background: 'rgba(49,53,64,0.5)',
          }}
        >
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#dfe2f1' }}>
            Current sentiment is generating dynamic patterns. Suggesting entry point around{' '}
            <span style={{ fontWeight: 700, color: '#00e5ff' }}>{suggestedEntry}</span>{' '}
            with a trailing stop loss near {stopLoss}.
          </p>
        </div>

        {/* Quick prompts */}
        <div style={{ paddingTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Ask about RSI', 'Risk Factor?', 'Support Levels'].map(p => (
            <span
              key={p}
              style={{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                border: '1px solid rgba(59,73,76,0.3)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: '#1c1f2a',
                color: '#dfe2f1',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = '#00e5ff'
                e.currentTarget.style.color = '#00e5ff'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(59,73,76,0.3)'
                e.currentTarget.style.color = '#dfe2f1'
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
