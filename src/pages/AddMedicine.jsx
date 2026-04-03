import React, { useState } from 'react'
import API from '../api'
import { useNavigate } from 'react-router-dom'

const AddMedicine = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    medicineName: '',
    dosage: '',
    frequencyPerDay: '',
    times: '',
    startDate: '',
    endDate: '',
    instructions: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...form,
        frequencyPerDay: Number(form.frequencyPerDay),
        times: form.times.split(',').map((t) => t.trim())
      }

      const res = await API.post('/medicines', payload)
      alert(res.data.message)
      navigate('/medicines')
    } catch (err) {
      alert(err.response?.data?.message || 'Medicine add failed')
    }
  }

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Add Medicine</h1>
          <p style={subtitleStyle}>
            Add medicine details, timing and instructions in the same MediTrack theme.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle}>Medicine Name</label>
            <input
              type="text"
              name="medicineName"
              placeholder="Enter medicine name"
              value={form.medicineName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Dosage</label>
            <input
              type="text"
              name="dosage"
              placeholder="e.g. 500mg"
              value={form.dosage}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Frequency Per Day</label>
            <input
              type="number"
              name="frequencyPerDay"
              placeholder="e.g. 2"
              value={form.frequencyPerDay}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Times</label>
            <input
              type="text"
              name="times"
              placeholder="09:00, 21:00"
              value={form.times}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={{ ...fieldStyle, gridColumn: '1 / 3' }}>
            <label style={labelStyle}>Instructions</label>
            <textarea
              name="instructions"
              placeholder="Take after food / before sleep / avoid empty stomach..."
              value={form.instructions}
              onChange={handleChange}
              style={textareaStyle}
            />
          </div>

          <div style={buttonWrapper}>
            <button type="submit" style={buttonStyle}>
              Add Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const pageStyle = {
  minHeight: '100vh',
  padding: ' 120px 32px 32px',
  background: 'linear-gradient(135deg, #eef7f7 0%, #f7fbfb 50%, #edf8f3 100%)'
}

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  animation: 'floatCard 4s ease-in-out infinite'
}

const headerStyle = {
  marginBottom: '24px'
}

const titleStyle = {
  margin: 0,
  fontSize: '44px',
  fontWeight: '800',
  background: 'linear-gradient(90deg, #c43d5b, #2a8bdc, #19b88f)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent'
}

const subtitleStyle = {
  marginTop: '10px',
  color: '#5f6b7a',
  fontSize: '16px'
}

const formStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  background: 'rgba(255,255,255,0.78)',
  border: '1px solid rgba(214, 226, 240, 0.95)',
  borderRadius: '28px',
  padding: '28px',
  boxShadow: '0 16px 40px rgba(143, 182, 201, 0.18)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  transform: 'perspective(1200px) rotateX(3deg)'
}

const fieldStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
}

const labelStyle = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#b22222',
  paddingLeft: '4px'
}

const inputStyle = {
  padding: '15px 16px',
  borderRadius: '16px',
  border: '1px solid #dbe7f3',
  background: '#ffffff',
  outline: 'none',
  fontSize: '15px',
  color: '#1f2d3d',
  boxShadow: '0 8px 18px rgba(176, 197, 214, 0.12)',
  transition: 'all 0.3s ease'
}

const textareaStyle = {
  ...inputStyle,
  minHeight: '130px',
  resize: 'none'
}

const buttonWrapper = {
  gridColumn: '1 / 3',
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '8px'
}

const buttonStyle = {
  border: 'none',
  borderRadius: '14px',
  padding: '14px 24px',
  fontSize: '15px',
  fontWeight: '600',
  color: '#fff',
  cursor: 'pointer',
  background: 'linear-gradient(90deg, #ef4444, #3b82f6, #10b981)',
  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.22)',
  transition: 'all 0.3s ease'
}

export default AddMedicine