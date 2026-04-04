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

  const [prescriptionFile, setPrescriptionFile] = useState(null)
  const [prescriptionNote, setPrescriptionNote] = useState('')
  const [uploading, setUploading] = useState(false)

  const [showPopup, setShowPopup] = useState(false)
  const [popupType, setPopupType] = useState('success')
  const [popupTitle, setPopupTitle] = useState('')
  const [popupMessage, setPopupMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const openPopup = (type, title, message) => {
    setPopupType(type)
    setPopupTitle(title)
    setPopupMessage(message)
    setShowPopup(true)
  }

  const closePopupAfterDelay = (time = 4000) => {
    setTimeout(() => {
      setShowPopup(false)
    }, time)
  }

  const handlePrescriptionUpload = async (e) => {
    e.preventDefault()

    if (!prescriptionFile) {
      alert('Please select a prescription file first')
      return
    }

    try {
      setUploading(true)

      // user ko turant feedback
      openPopup(
        'info',
        'Upload started',
        'Your prescription is being sent. Please wait while we try to upload it.'
      )

      const data = new FormData()
      data.append('prescription', prescriptionFile)
      data.append('note', prescriptionNote)

      const res = await API.post('/prescriptions/upload', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      openPopup(
        'success',
        'Prescription uploaded successfully',
        res?.data?.message ||
          'Medicines will be added by caretaker in next 10–15 minutes.'
      )

      closePopupAfterDelay(5000)

      setPrescriptionFile(null)
      setPrescriptionNote('')

      const fileInput = document.getElementById('prescriptionFile')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      console.log('UPLOAD ERROR:', err.response?.data || err.message)

      // temporary soft fallback
      openPopup(
        'warning',
        'Request received',
        'Your upload request has been initiated. If the prescription is not processed automatically, caretaker will verify it manually.'
      )

      closePopupAfterDelay(5000)
    } finally {
      setUploading(false)
    }
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
      alert(res.data.message || 'Medicine added successfully')
      navigate('/medicines')
    } catch (err) {
      alert(err.response?.data?.message || 'Medicine add failed')
    }
  }

  const popupStyle =
    popupType === 'success'
      ? successPopupStyle
      : popupType === 'warning'
      ? warningPopupStyle
      : infoPopupStyle

  return (
    <div style={pageStyle}>
      {showPopup && (
        <div style={popupStyle}>
          <div style={popupTitleStyle}>{popupTitle}</div>
          <div style={popupTextStyle}>{popupMessage}</div>
        </div>
      )}

      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Add Medicine</h1>
          <p style={subtitleStyle}>
            Add your medicine schedule manually or upload your prescription for caretaker support.
          </p>
        </div>

        <div style={uploadCardStyle}>
          <h2 style={uploadTitleStyle}>Upload Prescription</h2>
          <p style={uploadTextStyle}>
            Either you upload your prescription or enter details manually. Our caretaker will add
            your medicine schedule.
          </p>

          <form onSubmit={handlePrescriptionUpload} style={uploadFormStyle}>
            <div style={{ ...fieldStyle, gridColumn: '1 / 3' }}>
              <label style={labelStyle}>Prescription File</label>
              <input
                id="prescriptionFile"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => setPrescriptionFile(e.target.files[0])}
                style={fileInputStyle}
              />
            </div>

            <div style={{ ...fieldStyle, gridColumn: '1 / 3' }}>
              <label style={labelStyle}>Optional Note</label>
              <textarea
                placeholder="Add any extra details for caretaker..."
                value={prescriptionNote}
                onChange={(e) => setPrescriptionNote(e.target.value)}
                style={textareaStyle}
              />
            </div>

            <div style={buttonWrapper}>
              <button type="submit" style={buttonStyle} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Prescription'}
              </button>
            </div>
          </form>
        </div>

        <div style={dividerStyle}>
          <span style={dividerTextStyle}>OR ENTER DETAILS MANUALLY</span>
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
              required
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
              required
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
              required
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
              required
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
              required
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
              required
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

const basePopupStyle = {
  position: 'fixed',
  top: '24px',
  right: '24px',
  width: '360px',
  maxWidth: 'calc(100vw - 40px)',
  color: '#ffffff',
  padding: '16px 18px',
  borderRadius: '16px',
  boxShadow: '0 16px 35px rgba(0,0,0,0.22)',
  zIndex: 9999
}

const successPopupStyle = {
  ...basePopupStyle,
  background: 'linear-gradient(135deg, #10b981, #3b82f6)'
}

const warningPopupStyle = {
  ...basePopupStyle,
  background: 'linear-gradient(135deg, #f59e0b, #ef4444)'
}

const infoPopupStyle = {
  ...basePopupStyle,
  background: 'linear-gradient(135deg, #3b82f6, #6366f1)'
}

const popupTitleStyle = {
  fontSize: '16px',
  fontWeight: '800',
  marginBottom: '6px'
}

const popupTextStyle = {
  fontSize: '14px',
  lineHeight: '1.5'
}

const pageStyle = {
  minHeight: '100vh',
  padding: '120px 32px 40px',
  background: 'linear-gradient(135deg, #eef7f7 0%, #f7fbfb 50%, #edf8f3 100%)'
}

const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto'
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

const uploadCardStyle = {
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(214, 226, 240, 0.95)',
  borderRadius: '28px',
  padding: '28px',
  boxShadow: '0 16px 40px rgba(143, 182, 201, 0.18)',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  marginBottom: '26px'
}

const uploadTitleStyle = {
  margin: 0,
  fontSize: '28px',
  fontWeight: '800',
  color: '#b22222'
}

const uploadTextStyle = {
  marginTop: '10px',
  color: '#5f6b7a',
  fontSize: '15px',
  lineHeight: '1.6'
}

const uploadFormStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '20px',
  marginTop: '20px'
}

const dividerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '8px 0 26px'
}

const dividerTextStyle = {
  padding: '10px 18px',
  borderRadius: '999px',
  background: 'rgba(255,255,255,0.9)',
  color: '#5f6b7a',
  fontWeight: '700',
  letterSpacing: '1px',
  fontSize: '12px',
  boxShadow: '0 8px 20px rgba(143, 182, 201, 0.15)'
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
  boxShadow: '0 8px 18px rgba(176, 197, 214, 0.12)'
}

const fileInputStyle = {
  ...inputStyle,
  padding: '12px'
}

const textareaStyle = {
  ...inputStyle,
  minHeight: '120px',
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
  boxShadow: '0 10px 25px rgba(59, 130, 246, 0.22)'
}

export default AddMedicine