import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav
      style={{
        width: '100%',
        padding: '18px 40px',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(239,68,68,0.15)'
      }}
    >
      <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#b91c1c' }}>
        MediTrack
      </h2>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
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
              </>
            )}

            <button className="outline-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar