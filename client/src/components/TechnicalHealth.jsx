import React from 'react'

export default function TechnicalHealth({ rsi = { value: 64.2, percentage: 64 }, macd = 'Bullish', sma = '₹2,955.00', metricsData }) {
  const displayMetrics = metricsData || [
    { icon: 'payments', label: 'Current Price', value: '₹3,002.15', iconColor: '#c3f5ff' },
    { icon: 'auto_awesome', label: 'Predicted', value: '₹3,142.50', iconColor: '#e9b3ff' },
    { icon: 'speed', label: 'Volatility', value: 'Low', iconColor: '#00e38b' },
    { icon: 'bar_chart', label: 'Volume (24h)', value: '12.4M', iconColor: '#9cf0ff' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Technical Indicators */}
      <div style={{ borderRadius: '12px', padding: '24px', background: '#171b26' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '24px', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="material-symbols-outlined" style={{ color: '#00daf3' }}>analytics</span>
          Technical Health
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* RSI */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#bac9cc' }}>
                Relative Strength Index (RSI)
              </span>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#00e38b' }}>{rsi.value}</span>
            </div>
            <div style={{ height: '6px', width: '100%', borderRadius: '9999px', overflow: 'hidden', background: '#313540' }}>
              <div style={{ height: '100%', width: `${rsi.percentage}%`, borderRadius: '9999px', background: 'linear-gradient(to right, #c3f5ff, #16ff9e)', boxShadow: '0 0 8px rgba(0,229,255,0.4)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: '#bac9cc' }}>30 (Oversold)</span>
              <span style={{ fontSize: '10px', color: '#bac9cc' }}>70 (Overbought)</span>
            </div>
          </div>

          {/* MACD */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#bac9cc' }}>
                MACD Signal
              </span>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#c3f5ff' }}>{macd}</span>
            </div>
            <div style={{ height: '6px', width: '100%', borderRadius: '9999px', overflow: 'hidden', background: '#313540' }}>
              <div style={{ height: '100%', width: '72%', borderRadius: '9999px', background: 'linear-gradient(to right, #00daf3, #c3f5ff)', boxShadow: '0 0 8px rgba(0,229,255,0.4)' }} />
            </div>
          </div>

          {/* 20D Moving Average */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', color: '#bac9cc' }}>
                20D Moving Average
              </span>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#00e5ff' }}>{sma}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '32px' }}>
              {[20, 30, 15, 25, 35, 25, 20].map((h, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    borderRadius: '2px',
                    height: `${h * 0.9}px`,
                    background: `rgba(195, 245, 255, ${0.2 + i * 0.05})`,
                    boxShadow: i === 4 ? '0 0 8px rgba(0,229,255,0.4)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {displayMetrics.map(m => (
          <div
            key={m.label}
            style={{
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(59,73,76,0.1)',
              background: '#1c1f2a',
              transition: 'border-color 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,229,255,0.2)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(59,73,76,0.1)')}
          >
            <span className="material-symbols-outlined" style={{ color: m.iconColor, fontSize: '20px', marginBottom: '8px', display: 'block' }}>
              {m.icon}
            </span>
            <p style={{ textTransform: 'uppercase', fontWeight: 700, marginBottom: '4px', color: '#bac9cc', fontSize: '10px' }}>
              {m.label}
            </p>
            <p style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
