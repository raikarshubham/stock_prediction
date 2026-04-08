import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [search, setSearch] = useState('')
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await fetch('http://localhost:5000/api/auth/user', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUser(data)
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchUser()
  }, [])

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Project Details', path: '/project-details' },
    { label: 'About Us', path: '/about' }
  ]

  return (
    <nav className="app-navbar">
      <div className="app-navbar-inner">
        {/* Logo + Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <Link
            to="/"
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              letterSpacing: '-0.05em',
              fontFamily: 'Space Grotesk, sans-serif',
              color: '#c3f5ff',
              filter: 'drop-shadow(0 0 8px rgba(0,229,255,0.5))',
              textDecoration: 'none',
            }}
          >
            StockAI
          </Link>
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '14px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  style={{ 
                    color: isActive ? '#00E5FF' : '#dfe2f1', 
                    borderBottom: isActive ? '2px solid #00E5FF' : 'none', 
                    paddingBottom: '4px',
                    textDecoration: 'none',
                    transition: 'color 0.3s'
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = '#c3f5ff' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = '#dfe2f1' }}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            style={{ padding: '8px', color: '#dfe2f1', borderRadius: '9999px', transition: 'background 0.2s', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(49,53,64,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>

          {/* Avatar Link */}
          <Link
            to="/profile"
            style={{
              height: '40px',
              width: '40px',
              borderRadius: '9999px',
              border: '2px solid #00E5FF',
              overflow: 'hidden',
              boxShadow: '0 0 15px rgba(0,229,255,0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg,#00daf3,#006875)',
              color: '#001f24',
              fontWeight: 700,
              fontSize: '14px',
              textDecoration: 'none'
            }}
          >
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
          </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
