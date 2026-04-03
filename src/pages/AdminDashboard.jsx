import React, { useEffect, useState } from 'react'
import API from '../api'

const AdminDashboard = () => {
  const [pendingDoctors, setPendingDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPendingDoctors = async () => {
    try {
      const res = await API.get('/admin/pending-doctors')
      setPendingDoctors(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch pending doctors')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (doctorId) => {
    try {
      const res = await API.put(`/admin/approve-doctor/${doctorId}`)
      alert(res.data.message)
      fetchPendingDoctors()
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed')
    }
  }

  useEffect(() => {
    fetchPendingDoctors()
  }, [])

  return (
    <div className="page">
      <h1 className="section-title">Admin Dashboard</h1>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ color: '#991b1b', marginBottom: '10px' }}>Pending Doctor Requests</h2>
        <p style={{ color: '#7f1d1d' }}>
          Approve doctor accounts before they get access to patient reports and medicines.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : pendingDoctors.length === 0 ? (
        <div className="glass-card" style={{ padding: '24px' }}>
          <p style={{ color: '#7f1d1d' }}>No pending doctors right now.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {pendingDoctors.map((doctor) => (
            <div key={doctor._id} className="glass-card" style={{ padding: '24px' }}>
              <h3 style={{ color: '#991b1b', marginBottom: '10px' }}>{doctor.name}</h3>
              <p style={{ marginBottom: '8px', color: '#7f1d1d' }}>
                <strong>Email:</strong> {doctor.email}
              </p>
              <p style={{ marginBottom: '18px', color: '#7f1d1d' }}>
                <strong>Role:</strong> {doctor.role}
              </p>

              <button className="glow-btn" onClick={() => handleApprove(doctor._id)}>
                Approve Doctor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminDashboard