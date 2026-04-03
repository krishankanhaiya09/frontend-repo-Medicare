import React, { useEffect, useState } from 'react'
import API from '../api'

const Medicines = () => {
  const [medicines, setMedicines] = useState([])
  const [loadingId, setLoadingId] = useState(null)

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicines')
      setMedicines(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch medicines')
    }
  }

  useEffect(() => {
    fetchMedicines()
  }, [])

  const handleDoseStatus = async (medicineId, scheduledTime, status) => {
    try {
      setLoadingId(`${medicineId}-${status}`)

      const today = new Date().toISOString().split('T')[0]

      const res = await API.post('/medicines/log-dose', {
        medicineId,
        scheduledTime,
        date: today,
        status
      })

      alert(res.data.message)
    } catch (err) {
      alert(err.response?.data?.message || `Failed to mark as ${status}`)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="page">
      <h1 className="section-title">My Medicines</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px'
        }}
      >
        {medicines.map((item) => (
          <div key={item._id} className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ color: '#991b1b', marginBottom: '12px' }}>{item.medicineName}</h2>

            <p style={{ marginBottom: '8px' }}>
              <strong>Dosage:</strong> {item.dosage}
            </p>

            <p style={{ marginBottom: '8px' }}>
              <strong>Times:</strong> {item.times?.join(', ')}
            </p>

            <p style={{ marginBottom: '18px' }}>
              <strong>Instructions:</strong> {item.instructions || 'No instructions'}
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                className="glow-btn"
                style={{ padding: '10px 16px' }}
                onClick={() =>
                  handleDoseStatus(item._id, item.times?.[0] || '09:00', 'taken')
                }
                disabled={loadingId === `${item._id}-taken`}
              >
                {loadingId === `${item._id}-taken` ? 'Saving...' : 'Taken'}
              </button>

              <button
                className="outline-btn"
                onClick={() =>
                  handleDoseStatus(item._id, item.times?.[0] || '09:00', 'missed')
                }
                disabled={loadingId === `${item._id}-missed`}
              >
                {loadingId === `${item._id}-missed` ? 'Saving...' : 'Missed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Medicines