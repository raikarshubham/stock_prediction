import { useState, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, RefreshCw, BarChart2, Activity, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileNav from '../components/MobileNav';
import '../index.css';

// Custom shape for the Candlestick logic
const CandlestickShape = (props) => {
  const {
    x, y, width, height, payload,
  } = props;
  const isUp = payload.close >= payload.open;
  const color = isUp ? '#00e38b' : '#ff4d4d';
  
  // We need to map high, low, open, close. But our `height` and `y` from Recharts 
  // only tell us the size of [min(open, close), max(open, close)]. 
  // To draw the wick, we need the mathematical scale or we can simply use the pre-calculated `wick` Bar layer.
  return (
    <rect x={x} y={y} width={width} height={height} fill={color} />
  );
};

export default function PredictionPage() {
  const [stock, setStock] = useState('RELIANCE');
  const [searchValue, setSearchValue] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [chartType, setChartType] = useState('Candlestick'); // 'Area' or 'Candlestick'

  const [historicalData, setHistoricalData] = useState([]);

  const fetchPrediction = async (ticker) => {
    setLoading(true);
    setErrorText('');
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker })
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);

      setPrediction({
        currentPrice: data.current_price,
        predictedPrice: data.predicted_price,
        confidence: data.confidence || 81,
        aiInsight: data.aiInsight,
        metrics: data.metrics
      });
      
      // Use real historical data instead of mock graph
      if (data.historical_data && data.historical_data.length > 0) {
        // We will process the real 30-day OHLCV data returned from the Flask ML Pipeline
        const mappedData = data.historical_data.map(d => ({
           date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
           price: d.close,  // for AreaChart backward compatibility
           open: d.open,
           high: d.high,
           low: d.low,
           close: d.close,
           volume: d.volume,
           // For simple Recharts Candlestick layering:
           wick: [d.low, d.high],
           body: [Math.min(d.open, d.close), Math.max(d.open, d.close)],
           isUp: d.close >= d.open
        }));
        setHistoricalData(mappedData);
      } else {
        // Fallback gracefully 
        setHistoricalData([]);
      }
      
    } catch (error) {
      console.error(error);
      setErrorText("Could not fetch data for this ticker. Please check the spelling or try a valid Indian Stock Symbol like RELIANCE, TCS.");
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

  const isUp = prediction && (prediction.predictedPrice >= prediction.currentPrice);
  const changePercent = prediction ? (((prediction.predictedPrice - prediction.currentPrice) / prediction.currentPrice) * 100).toFixed(2) : 0;

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
                AI Prediction <span style={{ color: 'var(--primary)' }}>Engine</span>
              </h1>
            </div>
            <form onSubmit={handleSearch} style={{ position: 'relative', width: '320px' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '16px', display: 'flex', alignItems: 'center' }}>
                  <Search style={{ width: '20px', height: '20px', color: 'var(--on-surface-muted)' }} />
                </div>
                <input
                  list="stock-tickers"
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
                  onFocus={() => setSearchValue('')}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
                <datalist id="stock-tickers">
                  <option value="RELIANCE.NS">Reliance Industries</option>
                  <option value="TCS.NS">Tata Consultancy</option>
                  <option value="HDFCBANK.NS">HDFC Bank</option>
                  <option value="ICICIBANK.NS">ICICI Bank</option>
                  <option value="INFY.NS">Infosys</option>
                  <option value="SBIN.NS">State Bank of India</option>
                  <option value="BHARTIARTL.NS">Bharti Airtel</option>
                  <option value="ITC.NS">ITC Limited</option>
                  <option value="HINDUNILVR.NS">Hindustan Unilever</option>
                  <option value="LT.NS">Larsen & Toubro</option>
                  <option value="BAJFINANCE">Bajaj Finance</option>
                  <option value="AXISBANK">Axis Bank</option>
                  <option value="HCLTECH">HCL Technologies</option>
                  <option value="MARUTI">Maruti Suzuki</option>
                  <option value="TATAMOTORS">Tata Motors</option>
                  <option value="TATASTEEL.NS">Tata Steel</option>
                  <option value="WIPRO.NS">Wipro</option>
                  <option value="ONGC.NS">Oil and Natural Gas</option>
                </datalist>
              </form>
          </div>

          {/* Main Dashboard Layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="dashboard-grid">

              {/* Left Column: Chart */}
              <div className="glass dashboard-col" style={{ flex: 2, padding: '24px', borderRadius: '24px', border: '1px solid var(--outline-variant)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>{stock} Live Trend</h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-muted)', marginTop: '4px' }}>Last 5 Days (1hr intervals)</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => setChartType('Area')}
                      style={{ padding: '4px 12px', fontSize: '0.875rem', background: chartType === 'Area' ? 'rgba(0, 229, 255, 0.1)' : 'var(--surface-highest)', border: chartType === 'Area' ? '1px solid rgba(0,229,255,0.3)' : '1px solid transparent', borderRadius: '8px', color: chartType === 'Area' ? 'var(--primary-accent)' : 'var(--on-surface)' }}>
                      Line
                    </button>
                    <button 
                      onClick={() => setChartType('Candlestick')}
                      style={{ padding: '4px 12px', fontSize: '0.875rem', background: chartType === 'Candlestick' ? 'rgba(0, 229, 255, 0.1)' : 'var(--surface-highest)', border: chartType === 'Candlestick' ? '1px solid rgba(0,229,255,0.3)' : '1px solid transparent', borderRadius: '8px', color: chartType === 'Candlestick' ? 'var(--primary-accent)' : 'var(--on-surface)' }}>
                      Candles
                    </button>
                  </div>
                </div>
                <div style={{ height: '300px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'Area' ? (
                      <AreaChart data={historicalData}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary-accent)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary-accent)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                        <XAxis dataKey="date" stroke="var(--on-surface-muted)" />
                        <YAxis domain={['auto', 'auto']} stroke="var(--on-surface-muted)" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--surface-highest)', border: '1px solid var(--outline-variant)', borderRadius: '12px' }}
                          itemStyle={{ color: 'var(--primary-accent)' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="var(--primary-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                      </AreaChart>
                    ) : (
                      <ComposedChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" vertical={false} />
                        <XAxis dataKey="date" stroke="var(--on-surface-muted)" />
                        <YAxis domain={['auto', 'auto']} stroke="var(--on-surface-muted)" />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--surface-highest)', border: '1px solid var(--outline-variant)', borderRadius: '12px' }}
                          itemStyle={{ color: 'var(--primary-accent)' }}
                          formatter={(value, name, props) => {
                            const d = props.payload;
                            if (name === 'wick' || name === 'body') return null; // hide drawing keys
                            return [`O: ${d.open} | H: ${d.high} | L: ${d.low} | C: ${d.close}`];
                          }}
                        />
                        {/* Wicks layer (high/low bounds as thin vertical lines) */}
                        <Bar 
                          dataKey="wick" 
                          barSize={2} 
                          shape={(props) => <rect x={props.x + props.width/2 - 1} y={props.y} width={2} height={props.height} fill={props.payload.isUp ? '#00e38b' : '#ff4d4d'} />} 
                        />
                        {/* Body layer (open/close bounds as thick blocks) */}
                        <Bar 
                          dataKey="body" 
                          shape={<CandlestickShape />} 
                        />
                      </ComposedChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column: Prediction Card */}
              <div className="glass dashboard-col" style={{
                flex: 1,
                padding: '24px',
                borderRadius: '24px',
                border: '1px solid var(--outline-variant)',
                position: 'relative',
                overflow: 'hidden',
                opacity: loading ? 0.7 : 1,
              }}>
                {/* Dynamic Glow */}
                {prediction && !errorText && (
                  <div style={{
                    position: 'absolute', top: '-10%', right: '-10%', width: '200px', height: '200px',
                    borderRadius: '50%', background: isUp ? 'var(--secondary-green)' : 'var(--error)',
                    filter: 'blur(80px)', opacity: 0.15, pointerEvents: 'none'
                  }} />
                )}

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ padding: '8px', background: 'var(--surface-highest)', borderRadius: '8px', border: '1px solid var(--outline-variant)' }}>
                      <BarChart2 style={{ width: '20px', height: '20px', color: 'var(--primary)' }} />
                    </div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff' }}>AI Prediction</h2>
                    {loading && <RefreshCw style={{ width: '16px', height: '16px', marginLeft: 'auto', color: 'var(--on-surface-muted)', animation: 'spin 1s linear infinite' }} />}
                  </div>

                  {errorText && (
                    <div style={{ padding: '20px', background: 'rgba(255, 77, 77, 0.1)', border: '1px solid var(--error)', borderRadius: '12px', color: 'var(--error)', textAlign: 'center' }}>
                      <p style={{ fontWeight: 600 }}>Error</p>
                      <p style={{ fontSize: '0.875rem', marginTop: '8px' }}>{errorText}</p>
                    </div>
                  )}

                  {prediction && !errorText && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div>
                        <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Current Price</p>
                        <p style={{ fontSize: '2rem', fontWeight: 300, color: '#fff' }}>₹{prediction.currentPrice}</p>
                      </div>

                      <div style={{ position: 'relative', zIndex: 10, padding: '20px', background: 'var(--bg)', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                        <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem', marginBottom: '4px' }}>Predicted Next Close</p>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                          <p style={{ fontSize: '2.5rem', fontWeight: 700, color: isUp ? 'var(--secondary-green)' : 'var(--error)' }}>
                            ₹{prediction.predictedPrice.toFixed(2)}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', paddingBottom: '6px', color: isUp ? 'var(--secondary-green)' : 'var(--error)' }}>
                            {isUp ? <ArrowUpRight style={{ width: '24px', height: '24px' }} /> : <ArrowDownRight style={{ width: '24px', height: '24px' }} />}
                            <span style={{ fontWeight: 600 }}>{Math.abs(changePercent)}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--on-surface-muted)' }}>Model Confidence</span>
                          <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{prediction.confidence}%</span>
                        </div>
                        <div style={{ width: '100%', background: 'var(--surface-highest)', borderRadius: '9999px', height: '8px' }}>
                          <div
                            style={{
                              background: 'linear-gradient(to right, var(--primary), var(--primary-accent))',
                              height: '8px',
                              borderRadius: '9999px',
                              width: `${prediction.confidence}%`
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Layout */}
            {prediction && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '16px' }}>

                {/* Key Metrics */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem' }}>Volume</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '4px', color: '#fff' }}>{prediction.metrics.volume}</p>
                  </div>
                  <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem' }}>Volatility (10D)</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '4px', color: '#ffb4ab' }}>{prediction.metrics.volatility}</p>
                  </div>
                  <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem' }}>RSI (14D)</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '4px', color: 'var(--primary)' }}>{prediction.metrics.rsi}</p>
                  </div>
                  <div className="glass" style={{ padding: '20px', borderRadius: '16px', border: '1px solid var(--outline-variant)' }}>
                    <p style={{ color: 'var(--on-surface-muted)', fontSize: '0.875rem' }}>SMA (10D)</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '4px', color: '#fff' }}>₹{prediction.metrics.sma_10}</p>
                  </div>
                </div>

                {/* AI Insights Panel */}
                <div className="glass" style={{
                  padding: '24px', borderRadius: '16px', border: '1px solid var(--outline-variant)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, width: '128px', height: '128px', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.1, borderRadius: '50%' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <div style={{ padding: '6px', background: 'var(--surface-highest)', borderRadius: '8px' }}>
                      <Activity style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                    </div>
                    <h3 style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '1.125rem' }}>AI Insight</h3>
                  </div>
                  <p style={{ color: 'var(--on-surface)', fontSize: '1.125rem', lineHeight: 1.6, position: 'relative', zIndex: 10 }}>
                    "{prediction.aiInsight}"
                  </p>
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
