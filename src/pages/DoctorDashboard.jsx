import React, { useEffect, useState } from 'react'
import API from '../api'

const DoctorDashboard = () => {
  const [patients, setPatients] = useState([])
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [patientMedicines, setPatientMedicines] = useState([])
  const [patientReport, setPatientReport] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchPatients = async () => {
    try {
      const res = await API.get('/doctor/patients')
      setPatients(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch patients')
    } finally {
      setLoading(false)
    }
  }

  const handleViewPatient = async (patient) => {
    try {
      setSelectedPatient(patient)

      const [medRes, repRes] = await Promise.all([
        API.get(`/doctor/patients/${patient._id}/medicines`),
        API.get(`/doctor/patients/${patient._id}/report`)
      ])

      setPatientMedicines(medRes.data)
      setPatientReport(repRes.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch patient details')
    }
  }

  useEffect(() => {
    fetchPatients()
  }, [])

  return (
    <div className="page">
      <h1 className="section-title">Doctor Dashboard</h1>

      <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
        <h2 style={{ color: '#991b1b', marginBottom: '10px' }}>Patients Overview</h2>
        <p style={{ color: '#7f1d1d' }}>
          View patient names, emails, medicines, and adherence reports.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '0.95fr 1.05fr',
            gap: '20px'
          }}
          className="doctor-grid"
        >
          <div className="glass-card" style={{ padding: '24px' }}>
            <h2 style={{ color: '#991b1b', marginBottom: '18px' }}>All Patients</h2>

            {patients.length === 0 ? (
              <p style={{ color: '#7f1d1d' }}>No patients found.</p>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {patients.map((patient) => (
                  <div
                    key={patient._id}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: 'rgba(255,255,255,0.55)',
                      border: '1px solid rgba(239,68,68,0.1)'
                    }}
                  >
                    <h3 style={{ color: '#991b1b', marginBottom: '6px' }}>{patient.name}</h3>
                    <p style={{ color: '#7f1d1d', marginBottom: '12px' }}>{patient.email}</p>

                    <button
                      className="outline-btn"
                      onClick={() => handleViewPatient(patient)}
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="glass-card" style={{ padding: '24px' }}>
            {!selectedPatient ? (
              <div>
                <h2 style={{ color: '#991b1b', marginBottom: '12px' }}>Patient Details</h2>
                <p style={{ color: '#7f1d1d' }}>Select a patient to view medicines and report.</p>
              </div>
            ) : (
              <div>
                <h2 style={{ color: '#991b1b', marginBottom: '12px' }}>{selectedPatient.name}</h2>
                <p style={{ color: '#7f1d1d', marginBottom: '24px' }}>
                  <strong>Email:</strong> {selectedPatient.email}
                </p>

                <div style={{ marginBottom: '26px' }}>
                  <h3 style={{ color: '#991b1b', marginBottom: '14px' }}>Medicines</h3>

                  {patientMedicines.length === 0 ? (
                    <p style={{ color: '#7f1d1d' }}>No medicines added.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {patientMedicines.map((med) => (
                        <div
                          key={med._id}
                          style={{
                            padding: '14px',
                            borderRadius: '14px',
                            background: 'rgba(255,255,255,0.55)'
                          }}
                        >
                          <p style={{ color: '#991b1b', fontWeight: 'bold', marginBottom: '6px' }}>
                            {med.medicineName}
                          </p>
                          <p style={{ color: '#7f1d1d', marginBottom: '4px' }}>
                            <strong>Dosage:</strong> {med.dosage}
                          </p>
                          <p style={{ color: '#7f1d1d', marginBottom: '4px' }}>
                            <strong>Times:</strong> {med.times?.join(', ')}
                          </p>
                          <p style={{ color: '#7f1d1d' }}>
                            <strong>Instructions:</strong> {med.instructions || 'No instructions'}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ color: '#991b1b', marginBottom: '14px' }}>Adherence Report</h3>

                  {!patientReport ? (
                    <p style={{ color: '#7f1d1d' }}>No report found.</p>
                  ) : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={rowStyle}>
                        <span>Total</span>
                        <strong>{patientReport.report?.total ?? patientReport.total ?? 0}</strong>
                      </div>
                      <div style={rowStyle}>
                        <span>Taken</span>
                        <strong>{patientReport.report?.taken ?? patientReport.taken ?? 0}</strong>
                      </div>
                      <div style={rowStyle}>
                        <span>Missed</span>
                        <strong>{patientReport.report?.missed ?? patientReport.missed ?? 0}</strong>
                      </div>
                      <div style={rowStyle}>
                        <span>Delayed</span>
                        <strong>{patientReport.report?.delayed ?? patientReport.delayed ?? 0}</strong>
                      </div>
                      <div style={rowStyle}>
                        <span>Adherence Rate</span>
                        <strong>
                          {patientReport.report?.adherenceRate ?? patientReport.adherenceRate ?? 0}%
                        </strong>
                      </div>
                      {'alert' in patientReport && (
                        <div style={rowStyle}>
                          <span>Alert</span>
                          <strong>{patientReport.alert}</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 16px',
  borderRadius: '14px',
  background: 'rgba(255,255,255,0.55)',
  color: '#7f1d1d',
  gap: '14px'
}

export default DoctorDashboard