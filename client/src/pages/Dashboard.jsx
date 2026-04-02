import React, { useState, useEffect } from 'react'
import '../index.css' // Import from parent directory
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'
import HeroSection from '../components/HeroSection'
import PredictionPanel from '../components/PredictionPanel'
import StockChart from '../components/StockChart'
import HistoricalTable from '../components/HistoricalTable'
import AIInsights from '../components/AIInsights'
import TechnicalHealth from '../components/TechnicalHealth'

export default function Dashboard() {
  const [predictionData, setPredictionData] = useState(null)
  
  useEffect(() => {
    const fetchDefaultData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticker: 'RELIANCE' })
        });
        const data = await response.json();
        
        let currentP = data.current_price || 3002.15;
        let predictedP = data.predicted_price || 3142.50;

        setPredictionData({
          ticker: 'RELIANCE',
          currentPrice: currentP,
          predictedPrice: predictedP,
          confidence: data.confidence || 94,
          changePercent: (((predictedP - currentP) / currentP) * 100).toFixed(2),
          aiText: data.aiInsight || "Model predicts bullish trend due to increasing RSI (64.2) and strong volume breakout over the 20-day moving average.",
          metricsData: [
            { icon: 'payments', label: 'Current Price', value: `₹${currentP.toLocaleString()}`, iconColor: '#c3f5ff' },
            { icon: 'auto_awesome', label: 'Predicted D+1', value: `₹${predictedP.toLocaleString()}`, iconColor: '#e9b3ff' },
            { icon: 'speed', label: 'Volatility', value: data.metrics?.volatility || 'Low', iconColor: '#00e38b' },
            { icon: 'bar_chart', label: 'Volume (24h)', value: data.metrics?.volume || '12.4M', iconColor: '#9cf0ff' },
          ],
          sma: `₹${data.metrics?.sma_10 || 2955.00}`,
          rsi: {
            value: data.metrics?.rsi || 64.2,
            percentage: data.metrics?.rsi || 64
          }
        });
      } catch (err) {
        setPredictionData({
          ticker: 'BACKEND ERROR',
          currentPrice: 0,
          predictedPrice: 0,
          confidence: 0,
          changePercent: 0,
          aiText: "Could not connect to the ML Backend Server. Please ensure Python server is running.",
          metricsData: [
            { icon: 'payments', label: 'Current Price', value: 'N/A', iconColor: '#c3f5ff' },
            { icon: 'auto_awesome', label: 'Predicted D+1', value: 'N/A', iconColor: '#e9b3ff' },
            { icon: 'speed', label: 'Volatility', value: 'N/A', iconColor: '#00e38b' },
            { icon: 'bar_chart', label: 'Volume (24h)', value: 'N/A', iconColor: '#9cf0ff' },
          ],
          sma: 'N/A',
          rsi: { value: 0, percentage: 0 }
        })
      }
    };
    fetchDefaultData();
  }, []);

  return (
    <div className="app-shell">
      <Navbar />

      <div className="app-body">
        <Sidebar />

        <main className="app-main">
          <HeroSection />

          <div className="dashboard-grid">
            <div className="dashboard-col">
              <PredictionPanel 
                 ticker={predictionData?.ticker || 'RELIANCE'}
                 predictedPrice={predictionData?.predictedPrice || 3142.50}
                 confidence={predictionData?.confidence || 94}
                 changePercent={predictionData?.changePercent || 4.2}
              />
              <StockChart ticker={predictionData?.ticker || 'RELIANCE'} />
              <HistoricalTable />
            </div>
            <div className="dashboard-col">
              <AIInsights 
                insightText={predictionData?.aiText} 
                suggestedEntry={`₹${predictionData?.currentPrice || '2,990.00'}`}
                stopLoss={`₹${((predictionData?.currentPrice || 2990) * 0.98).toFixed(2)}`}
              />
              <TechnicalHealth 
                metricsData={predictionData?.metricsData}
                rsi={predictionData?.rsi}
                sma={predictionData?.sma}
              />
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}
