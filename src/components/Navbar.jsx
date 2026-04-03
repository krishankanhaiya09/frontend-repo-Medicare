import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setMenuOpen(false)
    navigate('/login')
  }

  const handleLinkClick = () => {
    setMenuOpen(false)
  }

  return (
    <nav
      style={{
        width: '100%',
        padding: window.innerWidth <= 768 ? '12px 16px' : '18px 40px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.82)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(239,68,68,0.12)'
      }}
    >
      <h2
        style={{
          fontSize: window.innerWidth <= 768 ? '22px' : '28px',
          fontWeight: 'bold',
          color: '#b91c1c',
          margin: 0
        }}
      >
        MediTrack
      </h2>

      {/* Desktop Menu */}
      <div
        className="desktop-nav"
        style={{
          display: window.innerWidth <= 768 ? 'none' : 'flex',
          gap: '24px',
          alignItems: 'center'
        }}
      >
        <Link to="/">Home</Link>

        {!token ? (
          <>
            <Link to="/login">
              <button className="glow-btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="glow-btn">Signup</button>
            </Link>
          </>
        ) : (
          <>
            {user?.role === 'admin' && (
              <Link to="/admin-dashboard">Admin Dashboard</Link>
            )}

            {user?.role === 'doctor' && (
              <Link to="/doctor-dashboard">Doctor Dashboard</Link>
            )}

            {user?.role !== 'admin' && user?.role !== 'doctor' && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/add-medicine">Add Medicine</Link>
                <Link to="/medicines">Medicines</Link>
                <Link to="/reports">Reports</Link>
                <Link to="/ai-chat">AI Assistant</Link>
              </>
            )}

            <button className="outline-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: window.innerWidth <= 768 ? 'block' : 'none',
          border: 'none',
          background: 'linear-gradient(135deg, #dc2626, #2563eb)',
          color: '#fff',
          padding: '8px 14px',
          borderRadius: '10px',
          fontSize: '18px',
          cursor: 'pointer',
          boxShadow: '0 8px 18px rgba(37, 99, 235, 0.18)'
        }}
      >
        ☰
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && window.innerWidth <= 768 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '16px',
            marginTop: '10px',
            width: '220px',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: '16px',
            boxShadow: '0 14px 30px rgba(0,0,0,0.08)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link to="/" onClick={handleLinkClick}>Home</Link>

          {!token ? (
            <>
              <Link to="/login" onClick={handleLinkClick}>
                <button className="glow-btn" style={{ width: '100%' }}>Login</button>
              </Link>
              <Link to="/signup" onClick={handleLinkClick}>
                <button className="glow-btn" style={{ width: '100%' }}>Signup</button>
              </Link>
            </>
          ) : (
            <>
              {user?.role === 'admin' && (
                <Link to="/admin-dashboard" onClick={handleLinkClick}>
                  Admin Dashboard
                </Link>
              )}

              {user?.role === 'doctor' && (
                <Link to="/doctor-dashboard" onClick={handleLinkClick}>
                  Doctor Dashboard
                </Link>
              )}

              {user?.role !== 'admin' && user?.role !== 'doctor' && (
                <>
                  <Link to="/dashboard" onClick={handleLinkClick}>Dashboard</Link>
                  <Link to="/add-medicine" onClick={handleLinkClick}>Add Medicine</Link>
                  <Link to="/medicines" onClick={handleLinkClick}>Medicines</Link>
                  <Link to="/reports" onClick={handleLinkClick}>Reports</Link>
                  <Link to="/ai-chat">AI Assistant</Link>
                </>
              )}

              <button
                className="outline-btn"
                onClick={handleLogout}
                style={{ width: '100%' }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar