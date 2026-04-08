import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import MobileNav from '../components/MobileNav'

export default function AboutUs() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            <h1 className="text-display-large" style={{ color: 'var(--c3f5ff)', marginBottom: '1.5rem', fontWeight: '800' }}>
              About StockAI
            </h1>
            <div className="surface-high p-6 radius-lg" style={{ lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--on-surface)' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                StockAI was founded with a singular vision: to democratize advanced algorithmic trading and predictive market analysis for everyday investors.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Historically, the deep machine learning models and high-fidelity technical indicators utilized to navigate market volatility were locked behind the closed doors of hedge funds and institutional traders. We are tearing down those walls.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                By leveraging robust data pipelines, leading-edge neural networks, and comprehensive historical datasets, StockAI provides you with actionable insights, precise buy/sell signals, and holistic market trend tracking.
              </p>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginTop: '2.5rem', marginBottom: '1rem', fontWeight: '700' }}>
                Our Mission
              </h2>
              <p>
                To empower individuals to make highly informed, data-driven financial decisions. We believe that with the right tools, knowledge, and analytical power, anyone can confidently navigate the complexities of global financial markets.
              </p>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  )
}
