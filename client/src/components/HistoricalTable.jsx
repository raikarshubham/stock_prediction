import React from 'react'

export default function HistoricalTable({ data }) {
  const tableData = data || [
    { date: 'May 24, 2024', open: '2,980.45', high: '3,015.00', low: '2,975.20', close: '3,002.15', volume: '12.4M' },
    { date: 'May 23, 2024', open: '2,965.00', high: '2,990.00', low: '2,950.00', close: '2,980.45', volume: '10.1M' },
    { date: 'May 22, 2024', open: '2,995.20', high: '3,010.50', low: '2,960.00', close: '2,965.00', volume: '8.9M' },
    { date: 'May 21, 2024', open: '2,940.15', high: '3,005.00', low: '2,935.45', close: '2,995.20', volume: '15.2M' },
    { date: 'May 20, 2024', open: '2,920.00', high: '2,955.00', low: '2,910.00', close: '2,940.15', volume: '9.4M' },
  ];

  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', background: '#171b26' }}>
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(59,73,76,0.15)' }}>
        <h3 style={{ fontWeight: 700, fontSize: '1.125rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          Historical Session Data
        </h3>
        <button
          style={{
            fontSize: '12px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: '#c3f5ff',
            transition: 'text-shadow 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.textShadow = '0 0 10px rgba(0,229,255,0.5)')}
          onMouseLeave={e => (e.currentTarget.style.textShadow = 'none')}
        >
          Download CSV
        </button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(28,31,42,0.5)', color: '#bac9cc' }}>
              {['Date', 'Open', 'High', 'Low', 'Close', 'Volume'].map(h => (
                <th
                  key={h}
                  style={{ padding: '16px 24px', fontSize: '12px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr
                key={i}
                style={{ borderTop: '1px solid rgba(59,73,76,0.08)', transition: 'background 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(195,245,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 500 }}>{row.date}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px' }}>{row.open}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#00e38b' }}>{row.high}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 600, color: '#ffb4ab' }}>{row.low}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: 700 }}>{row.close}</td>
                <td style={{ padding: '16px 24px', fontSize: '14px', color: '#bac9cc' }}>{row.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
