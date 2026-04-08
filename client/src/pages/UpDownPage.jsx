import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, ArrowUpRight, ArrowDownRight, Search, ShieldCheck, Activity } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import '../index.css';

export default function UpDownPage() {
  const [stock, setStock] = useState('RELIANCE');
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  const fetchPrediction = async (ticker) => {
    setLoading(true);
    setErrorText('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:5000/api/updown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setResult(data);
    } catch (error) {
      console.error(error);
      setErrorText("Could not fetch prediction. Please check the ticker or try a valid Indian Stock Symbol like RELIANCE, TCS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrediction(stock);
  }, [stock]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) setStock(searchValue.toUpperCase());
  };

  const isUp = result && result.prediction === 'UP';
  const confidencePct = result ? (result.confidence * 100).toFixed(1) : 0;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">

          {/* Header / Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', paddingBottom: '16px', borderBottom: '1px solid var(--outline-variant)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity style={{ color: 'var(--primary)', width: '32px', height: '32px' }} />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', color: '#fff' }}>
                Up/Down <span style={{ color: 'var(--primary)' }}>Predictor</span>
              </h1>
            </div>
            <form onSubmit={handleSearch} style={{ position: 'relative', width: '320px' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '16px', display: 'flex', alignItems: 'center' }}>
                <Search style={{ width: '20px', height: '20px', color: 'var(--on-surface-muted)' }} />
              </div>
              <input
                list="stock-tickers-ud"
                type="text"
                style={{
                  background: 'var(--surface-high)',
                  border: '1px solid var(--outline-variant)',
                  color: 'white',
                  borderRadius: '9999px',
                  width: '100%',
                  padding: '10px 16px 10px 48px',
                  outline: 'none',
                }}
                placeholder="Search Stock (e.g., RELIANCE)"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <datalist id="stock-tickers-ud">
                <option value="RELIANCE">Reliance Industries</option>
                <option value="TCS">Tata Consultancy</option>
                <option value="HDFCBANK">HDFC Bank</option>
                <option value="ICICIBANK">ICICI Bank</option>
                <option value="INFY">Infosys</option>
                <option value="SBIN">State Bank of India</option>
                <option value="BHARTIARTL">Bharti Airtel</option>
                <option value="ITC">ITC Limited</option>
                <option value="HINDUNILVR">Hindustan Unilever</option>
                <option value="LT">Larsen & Toubro</option>
                <option value="BAJFINANCE">Bajaj Finance</option>
                <option value="AXISBANK">Axis Bank</option>
                <option value="HCLTECH">HCL Technologies</option>
                <option value="MARUTI">Maruti Suzuki</option>
                <option value="TATAMOTORS">Tata Motors</option>
                <option value="TATASTEEL">Tata Steel</option>
                <option value="WIPRO">Wipro</option>
                <option value="ONGC">Oil and Natural Gas</option>
              </datalist>
            </form>
          </div>

          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="dashboard-grid">

              {/* Left: Prediction Result Card */}
              <div className="glass dashboard-col" style={{
                flex: 2,
                padding: '32px',
                borderRadius: '24px',
                border: '1px solid var(--outline-variant)',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '340px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.3s',
              }}>
                {/* Background glow */}
                {result && !errorText && (
                  <div style={{
                    position: 'absolute',
                    top: '-20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: isUp ? 'var(--secondary-green)' : 'var(--error)',
                    filter: 'blur(120px)',
                    opacity: 0.12,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Loading state */}
                {loading && !result && !errorText && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <RefreshCw style={{ width: '40px', height: '40px', color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '1rem' }}>Analyzing {stock}...</p>
                  </div>
                )}

                {/* Error state */}
                {errorText && (
                  <div style={{ padding: '24px', background: 'rgba(255, 77, 77, 0.08)', border: '1px solid var(--error)', borderRadius: '16px', color: 'var(--error)', textAlign: 'center', maxWidth: '480px' }}>
                    <p style={{ fontWeight: 600, fontSize: '1.125rem' }}>Prediction Failed</p>
                    <p style={{ fontSize: '0.875rem', marginTop: '8px', opacity: 0.8 }}>{errorText}</p>
                  </div>
                )}

                {/* Result display */}
                {result && !errorText && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', position: 'relative', zIndex: 10, width: '100%', maxWidth: '500px' }}>
                    {/* Ticker badge */}
                    <div style={{
                      padding: '6px 20px',
                      background: 'var(--surface-highest)',
                      borderRadius: '9999px',
                      border: '1px solid var(--outline-variant)',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--on-surface-muted)',
                      letterSpacing: '0.05em',
                    }}>
                      {stock}.NS
                    </div>

                    {/* Big direction indicator */}
                    <div style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: isUp
                        ? 'linear-gradient(135deg, rgba(0,227,139,0.15), rgba(0,227,139,0.05))'
                        : 'linear-gradient(135deg, rgba(255,180,171,0.15), rgba(255,180,171,0.05))',
                      border: `2px solid ${isUp ? 'var(--secondary-green)' : 'var(--error)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      {isUp
                        ? <ArrowUpRight style={{ width: '56px', height: '56px', color: 'var(--secondary-green)' }} />
                        : <ArrowDownRight style={{ width: '56px', height: '56px', color: 'var(--error)' }} />
                      }
                    </div>

                    {/* Prediction text */}
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        fontFamily: 'Space Grotesk',
                        color: isUp ? 'var(--secondary-green)' : 'var(--error)',
                        letterSpacing: '0.04em',
                      }}>
                        {isUp ? 'BULLISH' : 'BEARISH'}
                      </p>
                      <p style={{ fontSize: '1rem', color: 'var(--on-surface-muted)', marginTop: '4px' }}>
                        Next trading session prediction
                      </p>
                    </div>

                    {/* Current price */}
                    <div style={{
                      padding: '16px 32px',
                      background: 'var(--bg)',
                      borderRadius: '16px',
                      border: '1px solid var(--outline-variant)',
                      textAlign: 'center',
                    }}>
                      <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem', marginBottom: '4px' }}>Current Price</p>
                      <p style={{ fontSize: '1.75rem', fontWeight: 300, color: '#fff' }}>₹{result.current_price?.toFixed(2)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Confidence & Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Confidence card */}
                <div className="glass" style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: '1px solid var(--outline-variant)',
                  opacity: loading ? 0.7 : 1,
                  transition: 'opacity 0.3s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ padding: '8px', background: 'var(--surface-highest)', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
                      <ShieldCheck style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                    </div>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#fff' }}>Model Confidence</h2>
                    {loading && <RefreshCw style={{ width: '16px', height: '16px', marginLeft: 'auto', color: 'var(--on-surface-muted)', animation: 'spin 1s linear infinite' }} />}
                  </div>

                  {result && !errorText ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <p style={{
                          fontSize: '3rem',
                          fontWeight: 700,
                          fontFamily: 'Space Grotesk',
                          background: 'linear-gradient(to right, var(--primary), var(--primary-accent))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}>
                          {confidencePct}%
                        </p>
                      </div>
                      <div style={{ width: '100%', background: 'var(--surface-highest)', borderRadius: '9999px', height: '10px' }}>
                        <div style={{
                          background: 'linear-gradient(to right, var(--primary), var(--primary-accent))',
                          height: '10px',
                          borderRadius: '9999px',
                          width: `${confidencePct}%`,
                          transition: 'width 0.5s ease',
                        }} />
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--on-surface-muted)', textAlign: 'center' }}>
                        {confidencePct >= 70 ? 'High confidence signal' : confidencePct >= 50 ? 'Moderate confidence' : 'Low confidence — proceed with caution'}
                      </p>
                    </div>
                  ) : !errorText ? (
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '20px 0' }}>
                      Waiting for prediction...
                    </p>
                  ) : null}
                </div>

                {/* Signal insight card */}
                <div className="glass" style={{
                  padding: '24px',
                  borderRadius: '24px',
                  border: '1px solid var(--outline-variant)',
                  position: 'relative',
                  overflow: 'hidden',
                  flex: 1,
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.08, borderRadius: '50%' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ padding: '6px', background: 'var(--surface-highest)', borderRadius: '8px' }}>
                      <Activity style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                    </div>
                    <h3 style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>Signal Insight</h3>
                  </div>
                  {result && !errorText ? (
                    <p style={{ color: 'var(--on-surface)', fontSize: '0.95rem', lineHeight: 1.7, position: 'relative', zIndex: 10 }}>
                      "{isUp
                        ? `Our ML model signals a bullish trend for ${stock}. Based on OHLCV data, moving averages, and volatility analysis, the stock is expected to close higher in the next trading session.`
                        : `Our ML model signals a bearish trend for ${stock}. Based on OHLCV data, moving averages, and volatility analysis, the stock is expected to close lower in the next trading session.`
                      }"
                    </p>
                  ) : (
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem' }}>
                      Insights will appear after prediction.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom info cards */}
            {result && !errorText && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '8px' }}>
                <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                  <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem' }}>Signal</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '4px', color: isUp ? 'var(--secondary-green)' : 'var(--error)' }}>
                    {isUp ? '📈 BUY Signal' : '📉 SELL Signal'}
                  </p>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                  <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem' }}>Model</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '4px', color: '#fff' }}>Random Forest</p>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                  <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem' }}>Features Used</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '4px', color: '#fff' }}>9 Indicators</p>
                </div>
                <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                  <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.8rem' }}>Data Source</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '4px', color: 'var(--primary)' }}>Yahoo Finance</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}