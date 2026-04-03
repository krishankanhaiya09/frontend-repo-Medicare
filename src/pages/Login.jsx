import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
  e.preventDefault()

  try {
    const res = await API.post('/auth/login', { email, password })

    localStorage.setItem('token', res.data.token)
    localStorage.setItem('user', JSON.stringify(res.data.user))

    alert(res.data.message)

    if (res.data.user.role === 'admin') {
      navigate('/admin-dashboard')
    } else if (res.data.user.role === 'doctor') {
      navigate('/doctor-dashboard')
    } else {
      navigate('/dashboard')
    }
  } catch (err) {
    alert(err.response?.data?.message || 'Login failed')
  }
}

  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form
        onSubmit={handleLogin}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <h2 style={{ fontSize: '32px', textAlign: 'center', color: '#991b1b' }}>Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button className="glow-btn" type="submit">Login</button>
      </form>
    </div>
  )
}

const inputStyle = {
  padding: '14px',
  borderRadius: '14px',
  border: '1px solid rgba(239,68,68,0.15)',
  outline: 'none',
  background: 'rgba(255,255,255,0.75)',
  color: '#7f1d1d'
}

export default Login