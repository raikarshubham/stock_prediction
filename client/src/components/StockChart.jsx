import React, { useState } from 'react'

const timeframes = ['1D', '1W', '1M', '1Y']

const candleData = [
  { height: 40, green: false },
  { height: 60, green: true },
  { height: 55, green: true },
  { height: 75, green: true },
  { height: 50, green: false },
  { height: 85, green: true },
  { height: 70, green: true },
  { height: 40, green: false },
  { height: 60, green: true },
  { height: 90, green: true },
  { height: 65, green: true },
  { height: 45, green: false },
  { height: 80, green: true },
  { height: 70, green: true },
  { height: 55, green: false },
  { height: 95, green: true },
]

export default function StockChart({ ticker = 'RELIANCE' }) {
  const [activeFrame, setActiveFrame] = useState('1D')

  return (
    <div style={{ borderRadius: '12px', padding: '24px', background: '#171b26', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '8px', borderRadius: '8px', background: '#313540' }}>
            <span className="material-symbols-outlined" style={{ color: '#c3f5ff' }}>
              candlestick_chart
            </span>
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: '1.25rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              Market Performance
            </p>
            <p style={{ fontSize: '12px', color: '#bac9cc' }}>
              Live {ticker}/INR • Updated 2s ago
            </p>
          </div>
        </div>
        {/* Timeframe selector */}
        <div style={{ display: 'flex', borderRadius: '9999px', padding: '4px', background: '#313540' }}>
          {timeframes.map(tf => (
            <button
              key={tf}
              onClick={() => setActiveFrame(tf)}
              style={{
                padding: '4px 16px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                transition: 'all 0.2s',
                ...(activeFrame === tf
                  ? { background: '#c3f5ff', color: '#00363d' }
                  : { color: '#bac9cc', background: 'transparent' }),
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', paddingBottom: '16px' }}>
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px 0', pointerEvents: 'none', opacity: 0.1 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{ borderTop: '1px solid #3b494c', width: '100%' }} />
          ))}
        </div>

        {/* SVG Line */}
        <div style={{ position: 'absolute', top: '16px', left: 0, right: 0, height: '112px', pointerEvents: 'none' }}>
          <svg style={{ width: '100%', height: '100%' }} preserveAspectRatio="none" viewBox="0 0 1000 100">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="#16ff9e" />
              </linearGradient>
            </defs>
            <path
              className="chart-line"
              d="M0,80 Q50,90 100,50 T200,60 T300,20 T400,40 T500,10 T600,30 T700,50 T800,20 T900,40 T1000,10"
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              style={{ filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.8))' }}
            />
          </svg>
        </div>

        {/* Candles */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', padding: '0 8px 24px', marginTop: '112px' }}>
          {candleData.map((candle, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                borderTopLeftRadius: '2px',
                borderTopRightRadius: '2px',
                transition: 'opacity 0.2s',
                cursor: 'pointer',
                height: `${candle.height}%`,
                background: candle.green ? '#16ff9e' : '#ffb4ab',
                boxShadow: candle.green
                  ? '0 0 6px rgba(22,255,158,0.3)'
                  : '0 0 4px rgba(255,180,171,0.2)',
                minHeight: '4px',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.8')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            />
          ))}
        </div>

        {/* X-axis labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginTop: '4px' }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'].map((d, i) => (
            <span key={i} style={{ fontSize: '12px', color: '#bac9cc' }}>{d}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
