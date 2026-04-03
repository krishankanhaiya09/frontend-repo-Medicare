import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient'
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    try {
      const res = await API.post('/auth/signup', form)
      alert(res.data.message)
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form
        onSubmit={handleSignup}
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        <h2 style={{ fontSize: '32px', textAlign: 'center', color: '#991b1b' }}>Signup</h2>

        <input type="text" name="name" placeholder="Enter name" value={form.name} onChange={handleChange} style={inputStyle} />
        <input type="email" name="email" placeholder="Enter email" value={form.email} onChange={handleChange} style={inputStyle} />
        <input type="password" name="password" placeholder="Enter password" value={form.password} onChange={handleChange} style={inputStyle} />

        <select name="role" value={form.role} onChange={handleChange} style={inputStyle}>
          <option value="patient">Patient</option>
          <option value="caregiver">Caregiver</option>
          <option value="doctor">Doctor</option>
        </select>

        <button className="glow-btn" type="submit">Create Account</button>
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

export default Signup