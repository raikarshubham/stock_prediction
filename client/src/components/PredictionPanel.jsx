import React from 'react'

export default function PredictionPanel({ ticker = 'RELIANCE', predictedPrice = 3142.50, confidence = 94, changePercent = 4.2 }) {
  const isUp = changePercent >= 0;
  
  return (
    <div
      className="glass"
      style={{
        border: '1px solid rgba(0,229,255,0.2)',
        borderRadius: '12px',
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background rocket icon */}
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '16px' }}>
        <span
          className="material-symbols-outlined"
          style={{ color: '#00e5ff', fontSize: '64px', opacity: 0.1 }}
        >
          {isUp ? 'rocket_launch' : 'trending_down'}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
        <div>
          <h3
            style={{
              textTransform: 'uppercase',
              letterSpacing: '2px',
              fontSize: '14px',
              fontWeight: 700,
              marginBottom: '4px',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              color: '#bac9cc',
            }}
          >
            {ticker} Forecast
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.75rem)',
                fontWeight: 900,
                fontFamily: 'Space Grotesk, sans-serif',
                color: 'white',
              }}
            >
              ₹{Number(predictedPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontWeight: 700,
                gap: '4px',
                color: isUp ? '#00e38b' : '#ff4d4d',
                background: isUp ? 'rgba(0,227,139,0.1)' : 'rgba(255,77,77,0.1)',
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                {isUp ? 'trending_up' : 'trending_down'}
              </span>
              <span>{isUp ? '+' : ''}{changePercent}%</span>
            </div>
          </div>
          <p style={{ fontSize: '14px', marginTop: '12px', color: '#bac9cc' }}>
            Next Day Predicted Close Price
          </p>
        </div>

        {/* Confidence Score Ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '8px',
              color: '#bac9cc',
            }}
          >
            Confidence Score
          </span>
          <div style={{ position: 'relative', width: '128px', height: '128px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle
                cx="64" cy="64" r="58"
                fill="transparent"
                stroke="#313540"
                strokeWidth="8"
              />
              <circle
                cx="64" cy="64" r="58"
                fill="transparent"
                stroke="#00e5ff"
                strokeWidth="8"
                strokeDasharray="364.4"
                strokeDashoffset={364.4 - (364.4 * (confidence / 100))}
                style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,255,0.6))', transition: 'stroke-dashoffset 1s ease-out' }}
              />
            </svg>
            <span
              style={{
                position: 'absolute',
                fontSize: '1.5rem',
                fontWeight: 900,
                fontFamily: 'Space Grotesk, sans-serif',
                color: '#00e5ff',
              }}
            >
              {confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
