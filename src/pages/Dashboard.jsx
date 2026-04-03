import React, { useEffect, useMemo, useState } from 'react'
import API from '../api'

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'))
  const [report, setReport] = useState(null)
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [reminderPopup, setReminderPopup] = useState(null)
const [streak, setStreak] = useState({
  currentStreak: 0,
  longestStreak: 0,
  todayStatus: "no-data"
});

useEffect(() => {
  const fetchStreak = async () => {
    try {
      const res = await API.get("/reports/streak");
      setStreak(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  fetchStreak();
}, []);
  const fetchDashboardData = async () => {
    try {
      const [reportRes, medicineRes] = await Promise.all([
        API.get('/reports/adherence'),
        API.get('/medicines')
      ])

      setReport(reportRes.data)
      setMedicines(medicineRes.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const todayDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const getSortedTimes = () => {
    const allTimes = medicines.flatMap((med) =>
      (med.times || []).map((time) => ({
        medicineName: med.medicineName,
        time
      }))
    )

    return allTimes.sort((a, b) => {
      const [ah, am] = a.time.split(':').map(Number)
      const [bh, bm] = b.time.split(':').map(Number)
      return ah * 60 + am - (bh * 60 + bm)
    })
  }

  const getNextDose = () => {
    const sorted = getSortedTimes()
    if (!sorted.length) return 'No dose scheduled'

    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()

    for (const item of sorted) {
      const [hour, minute] = item.time.split(':').map(Number)
      const doseMinutes = hour * 60 + minute

      if (doseMinutes >= currentMinutes) {
        return `${item.time} (${item.medicineName})`
      }
    }

    return `${sorted[0].time} (${sorted[0].medicineName}) tomorrow`
  }

  const getHealthStatus = () => {
    if (!report) return 'Loading...'
    return report.report.missed >= 3 ? 'Risk' : 'Active'
  }

  const getAdherenceLabel = () => {
    if (!report) return 'Loading...'

    const rate = Number(report.report.adherenceRate)

    if (rate >= 80) return 'Good'
    if (rate >= 50) return 'Average'
    return 'Poor'
  }

  const getMotivationMessage = () => {
    if (!report) return 'Loading your health summary...'

    const rate = Number(report.report.adherenceRate)

    if (rate >= 80) return 'Amazing work! You are following your medicine routine very well 💚'
    if (rate >= 50) return 'Good going. Try to avoid missing the next doses 👍'
    return 'Your routine needs attention. Take medicines on time for better recovery ❤️'
  }

  const adherenceRate = useMemo(() => {
    return Number(report?.report?.adherenceRate || 0)
  }, [report])

  const checkMedicineReminders = () => {
    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()

    medicines.forEach((med) => {
      med.times?.forEach((time) => {
        const [hour, minute] = time.split(':').map(Number)

        const medDate = new Date()
        medDate.setHours(hour, minute, 0, 0)

        const reminderDate = new Date(medDate.getTime() - 10 * 60 * 1000)

        if (
          reminderDate.getHours() === currentHours &&
          reminderDate.getMinutes() === currentMinutes
        ) {
          const message = `${med.medicineName} lene ka time 10 min me hai 💊`

          setReminderPopup(message)

          if (Notification.permission === 'granted') {
            new Notification('Medicine Reminder', {
              body: message
            })
          }
        }
      })
    })
  }

  useEffect(() => {
    if (!medicines.length) return

    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission()
    }

    checkMedicineReminders()

    const interval = setInterval(() => {
      checkMedicineReminders()
    }, 60000)

    return () => clearInterval(interval)
  }, [medicines])

  if (loading) {
    return (
      <div className="page">
        <h1 className="section-title">Loading Dashboard...</h1>
      </div>
    )
  }

  const stats = [
    { title: 'Health Status', value: getHealthStatus() },
    { title: 'Next Dose', value: getNextDose() },
    { title: 'Missed Doses', value: report?.report?.missed ?? 0 },
    { title: 'Adherence', value: `${adherenceRate}%` }
  ]

  const sortedSchedule = getSortedTimes()

  return (
    <div className="page">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}
      >
        <div>
          <h1 className="section-title" style={{ marginBottom: '8px' }}>
            Welcome, {user?.name || 'User'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '15px' }}>{todayDate}</p>
        </div>

        <button className="glow-btn" onClick={fetchDashboardData}>
          Refresh Dashboard
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}
      >
        {stats.map((item, index) => (
          <div key={index} className="glass-card" style={{ padding: '30px', minHeight: '170px' }}>
            <h3 style={{ color: '#991b1b' }}>{item.title}</h3>
            <p
              style={{
                fontSize: item.title === 'Next Dose' ? '24px' : '38px',
                fontWeight: 'bold',
                marginTop: '20px',
                lineHeight: 1.3
              }}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '20px',
          marginBottom: '30px'
        }}
        className="doctor-grid"
      >
        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ color: '#991b1b', marginBottom: '16px' }}>Live Summary</h2>

          <p style={{ marginBottom: '8px' }}>
            <strong>Total Medicines:</strong> {medicines.length}
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Total Doses Logged:</strong> {report?.report?.total ?? 0}
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Taken:</strong> {report?.report?.taken ?? 0}
          </p>
          <p style={{ marginBottom: '8px' }}>
            <strong>Missed:</strong> {report?.report?.missed ?? 0}
          </p>
          <p style={{ marginBottom: '18px' }}>
            <strong>Adherence Rate:</strong> {adherenceRate}%
          </p>
<div className="glass-card" style={{ padding: "20px", marginTop: "20px" }}>
  <h2>🔥 Streak Progress</h2>
  <p>Current Streak: {streak.currentStreak} day(s)</p>
  <p>Longest Streak: {streak.longestStreak} day(s)</p>
  <p>
    Today Status:{" "}
    {streak.todayStatus === "success"
      ? "Completed"
      : streak.todayStatus === "failed"
      ? "Missed"
      : "No data"}
  </p>
</div>
          <div style={{ marginTop: '14px' }}>
            <div
              style={{
                width: '100%',
                height: '16px',
                background: '#f3f4f6',
                borderRadius: '999px',
                overflow: 'hidden'
              }}
            >
              
              <div
                style={{
                  width: `${Math.min(adherenceRate, 100)}%`,
                  height: '100%',
                  borderRadius: '999px',
                  background: 'linear-gradient(90deg, #ef4444, #3b82f6, #10b981)',
                  transition: '0.4s ease'
                }}
              />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '28px' }}>
          <h2 style={{ color: '#991b1b', marginBottom: '16px' }}>Today’s Insight</h2>

          <div
            style={{
              padding: '18px',
              borderRadius: '18px',
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(239,68,68,0.12)'
            }}
          >
            <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#991b1b' }}>
              {getAdherenceLabel()} Performance
            </p>
            <p style={{ lineHeight: '1.7', color: '#374151' }}>
              {getMotivationMessage()}
            </p>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '28px', marginBottom: '30px' }}>
        <h2 style={{ color: '#991b1b', marginBottom: '18px' }}>Medicine Schedule</h2>

        {sortedSchedule.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No medicines added yet.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px'
            }}
          >
            {sortedSchedule.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(255,255,255,0.65)',
                  border: '1px solid rgba(239,68,68,0.12)'
                }}
              >
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px' }}>
                  Dose Time
                </p>
                <h3 style={{ color: '#991b1b', marginBottom: '6px' }}>{item.time}</h3>
                <p style={{ color: '#374151' }}>{item.medicineName}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {reminderPopup && (
        <div
          style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            background: '#fff',
            color: '#991b1b',
            padding: '18px 20px',
            borderRadius: '18px',
            boxShadow: '0 12px 30px rgba(0,0,0,0.18)',
            border: '1px solid rgba(239,68,68,0.18)',
            zIndex: 3000,
            maxWidth: '320px'
          }}
        >
          <h3 style={{ marginBottom: '8px' }}>⏰ Reminder</h3>
          <p style={{ marginBottom: '12px', color: '#7f1d1d' }}>{reminderPopup}</p>

          <button
            className="outline-btn"
            onClick={() => setReminderPopup(null)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard