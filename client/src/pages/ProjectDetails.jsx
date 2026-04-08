import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'

export default function ProjectDetails() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 className="text-display-large" style={{ color: 'var(--c3f5ff)', marginBottom: '1.5rem', fontWeight: '800' }}>
              Project Details & Models
            </h1>
            <p style={{ color: 'var(--on-surface-muted)', fontSize: '1.2rem', marginBottom: '3rem', lineHeight: '1.7' }}>
              An in-depth technical breakdown of the datasets, feature engineering pipelines, and specialized machine learning models powering the StockAI predictions.
            </p>

            <div className="surface-high p-6 radius-lg" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--primary)' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--on-surface)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>database</span>
                Dataset & Data Ingestion
              </h2>
              <p style={{ color: 'var(--on-surface-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                StockAI relies on high-fidelity historical data fetched directly in real-time using the <strong>yfinance</strong> API. Models have been trained on robust daily stock data (notably NSE stocks like RELIANCE.NS) spanning from 2015 to the present day, ensuring they capture both bull runs and recessions.
              </p>
              <ul style={{ color: 'var(--on-surface-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginLeft: '1.5rem', marginBottom: '1.5rem' }}>
                <li><strong>Raw Features:</strong> Ingests standard OHLCV (Open, High, Low, Close, Volume) data.</li>
                <li><strong>Preprocessing:</strong> Multi-index columns are flattened, and rows containing NaN values from missing trading days are rigorously cleaned and dropped.</li>
                <li><strong>Inference pipeline:</strong> For live predictions, the backend fetches a rolling 120-day window to accurately compute the required moving averages and momentum oscillators before running inference for the current day.</li>
              </ul>

              <h3 style={{ color: 'var(--on-surface)', fontSize: '1.3rem', marginBottom: '0.8rem', fontWeight: '600' }}>Feature Engineering</h3>
              <p style={{ color: 'var(--on-surface-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '1rem' }}>
                Raw closing prices aren't enough to capture market sentiment. StockAI enriches the dataset dynamically with strict technical indicators:
              </p>
              <ul style={{ color: 'var(--on-surface-muted)', fontSize: '1.1rem', lineHeight: '1.7', marginLeft: '1.5rem' }}>
                <li><strong>SMA_10 & SMA_50:</strong> 10-day and 50-day Simple Moving Averages.</li>
                <li><strong>EMA_10:</strong> 10-day Exponential Moving Average to give weight to recent price changes.</li>
                <li><strong>RSI (Relative Strength Index):</strong> 14-day momentum oscillator to detect overbought/oversold conditions.</li>
                <li><strong>Returns & Volatility:</strong> Percentage change of closing price alongside a 10-day rolling standard deviation of those returns.</li>
              </ul>
            </div>

            <div className="surface-high p-6 radius-lg" style={{ marginBottom: '2.5rem', borderLeft: '4px solid var(--secondary-green)' }}>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--on-surface)', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--secondary-green)' }}>memory</span>
                Machine Learning Models Used
              </h2>
              <div style={{ color: 'var(--on-surface-muted)', fontSize: '1.1rem', lineHeight: '1.7' }}>
                <p style={{ marginBottom: '1.5rem' }}>
                  Rather than relying on a single generalized algorithm, StockAI deploys an ensemble of three independent models exported via <code>joblib</code>/<code>pickle</code>, each optimized for a specific predictive task:
                </p>

                <h3 style={{ color: 'var(--on-surface)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--primary)' }}>1. Next-Day Price Predictor: XGBoost Regressor</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                  Evaluated against Linear Regression and Random Forest, <strong>XGBRegressor</strong> demonstrated the lowest Root Mean Squared Error (RMSE) during training. It consumes 11 separate features (including our engineered technical indicators) to predict the exact closing price for the next trading session.
                </p>

                <h3 style={{ color: 'var(--on-surface)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--secondary-green)' }}>2. Buy/Sell Signal Generator: XGBoost Classifier</h3>
                <p style={{ marginBottom: '1.5rem' }}>
                  This model leverages an <strong>XGBClassifier</strong> to categorize market conditions into 3 distinct signals: <strong>BUY</strong> (expected return &gt; 0.5%), <strong>SELL</strong> (expected return &lt; -0.5%), and <strong>HOLD</strong>. It bases decisions strongly on recent moving averages, volume spikes, and RSI divergences across the last 60 days of rolling data.
                </p>

                <h3 style={{ color: 'var(--on-surface)', marginTop: '1.5rem', marginBottom: '0.5rem', fontWeight: '600', color: 'var(--tertiary-container)' }}>3. General Up/Down Market Model: Random Forest</h3>
                <p>
                  For immediate binary classification to determine if tomorrow's close will strictly be higher or lower than today's, we utilize a <strong>Random Forest Classifier</strong> (with 100 estimators). This tree-based ensemble method effectively resists overfitting while mapping out non-linear relationships between basic OHLCV data and high-level volatility.
                </p>
              </div>
            </div>

          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
