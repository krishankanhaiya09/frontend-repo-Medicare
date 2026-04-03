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
    todayStatus: 'no-data'
  })

  const fetchDashboardData = async () => {
    try {
      const [reportRes, medicineRes, streakRes] = await Promise.all([
        API.get('/reports/adherence'),
        API.get('/medicines'),
        API.get('/reports/streak')
      ])

      setReport(reportRes.data)
      setMedicines(medicineRes.data)
      setStreak(streakRes.data)
    } catch (err) {
      console.logt(err.response?.data?.message )
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
        dosage: med.dosage,
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
        return `${item.time} • ${item.medicineName}`
      }
    }

    return `${sorted[0].time} • ${sorted[0].medicineName} tomorrow`
  }

  const getHealthStatus = () => {
    if (!report) return 'Loading...'
    return report.report.missed >= 3 ? 'At Risk' : 'Stable'
  }

  const getAdherenceLabel = () => {
    if (!report) return 'Loading...'

    const rate = Number(report.report.adherenceRate)

    if (rate >= 80) return 'Excellent'
    if (rate >= 50) return 'Average'
    return 'Needs Attention'
  }

  const getMotivationMessage = () => {
    if (!report) return 'Loading your health summary...'

    const rate = Number(report.report.adherenceRate)

    if (rate >= 80) {
      return 'Amazing consistency. You are maintaining your medicines very well.'
    }
    if (rate >= 50) {
      return 'Good progress. Try to avoid missing the next few doses.'
    }
    return 'Your routine needs more focus. Stay on time for better recovery.'
  }

  const adherenceRate = useMemo(() => {
    return Number(report?.report?.adherenceRate || 0)
  }, [report])

  const takenCount = report?.report?.taken ?? 0
  const missedCount = report?.report?.missed ?? 0
  const delayedCount = report?.report?.delayed ?? 0
  const totalLogs = report?.report?.total ?? 0

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

  const getTodayStatusText = () => {
    if (streak.todayStatus === 'success') return 'Completed'
    if (streak.todayStatus === 'failed') return 'Missed'
    return 'No Data'
  }

  const getTodayStatusColor = () => {
    if (streak.todayStatus === 'success') return '#059669'
    if (streak.todayStatus === 'failed') return '#dc2626'
    return '#6b7280'
  }

  const stats = [
    {
      title: 'Health Status',
      value: getHealthStatus(),
      sub: report?.alert || 'Your live medication health summary'
    },
    {
      title: 'Next Dose',
      value: getNextDose(),
      sub: 'Upcoming scheduled medicine'
    },
    {
      title: 'Missed Doses',
      value: missedCount,
      sub: 'Total missed logs so far'
    },
    {
      title: 'Adherence',
      value: `${adherenceRate}%`,
      sub: `${getAdherenceLabel()} performance`
    }
  ]

  const sortedSchedule = getSortedTimes()

  if (loading) {
    return (
      <div className="page">
        <div
          className="glass-card"
          style={{
            padding: '40px',
            textAlign: 'center',
            borderRadius: '28px'
          }}
        >
          <h1
            style={{
              fontSize: '34px',
              color: '#991b1b',
              marginBottom: '10px'
            }}
          >
            Loading Dashboard...
          </h1>
          <p style={{ color: '#6b7280' }}>
            Fetching your medicines, reports and streak summary.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div
        className="glass-card"
        style={{
          padding: '30px',
          marginBottom: '28px',
          borderRadius: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px',
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(255,245,245,0.88), rgba(239,246,255,0.82))'
        }}
      >
        <div>
          <p
            style={{
              color: '#991b1b',
              fontWeight: '600',
              marginBottom: '8px',
              letterSpacing: '0.5px'
            }}
          >
            MEDICATION OVERVIEW
          </p>
          <h1
            style={{
              fontSize: '42px',
              lineHeight: 1.1,
              color: '#7f1d1d',
              marginBottom: '10px'
            }}
          >
            Welcome back, {user?.name || 'User'}
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
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '22px',
          marginBottom: '28px'
        }}
        className="doctor-grid"
      >
        <div
          className="glass-card"
          style={{
            padding: '30px',
            borderRadius: '28px',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,247,247,0.86))'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap',
              marginBottom: '20px'
            }}
          >
            <div>
              <p style={{ color: '#991b1b', fontWeight: '700', marginBottom: '8px' }}>
                Adherence Performance
              </p>
              <h2 style={{ fontSize: '34px', color: '#7f1d1d' }}>{adherenceRate}%</h2>
            </div>

            <div
              style={{
                minWidth: '180px',
                padding: '18px',
                borderRadius: '22px',
                background: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(239,68,68,0.1)'
              }}
            >
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '8px' }}>
                Today Status
              </p>
              <h3 style={{ color: getTodayStatusColor(), fontSize: '24px' }}>
                {getTodayStatusText()}
              </h3>
            </div>
          </div>

          <div
            style={{
              width: '100%',
              height: '18px',
              background: '#f3f4f6',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '22px'
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

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '14px'
            }}
          >
            <MiniMetric label="Total Logs" value={totalLogs} />
            <MiniMetric label="Taken" value={takenCount} />
            <MiniMetric label="Missed" value={missedCount} />
            <MiniMetric label="Delayed" value={delayedCount} />
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '30px',
            borderRadius: '28px',
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(240,253,250,0.84))'
          }}
        >
          <p style={{ color: '#991b1b', fontWeight: '700', marginBottom: '10px' }}>
            Streak Progress
          </p>

          <h2
            style={{
              fontSize: '48px',
              color: '#7f1d1d',
              lineHeight: 1,
              marginBottom: '10px'
            }}
          >
            🔥 {streak.currentStreak}
          </h2>

          <p style={{ color: '#6b7280', marginBottom: '18px' }}>
            Current consistency streak
          </p>

          <div
            style={{
              padding: '16px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(239,68,68,0.1)',
              marginBottom: '14px'
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '6px' }}>
              Longest Streak
            </p>
            <h3 style={{ color: '#991b1b', fontSize: '28px' }}>
              {streak.longestStreak} days
            </h3>
          </div>

          <div
            style={{
              padding: '16px',
              borderRadius: '20px',
              background: 'rgba(255,255,255,0.72)',
              border: '1px solid rgba(239,68,68,0.1)'
            }}
          >
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '6px' }}>
              Today
            </p>
            <h3 style={{ color: getTodayStatusColor(), fontSize: '24px' }}>
              {getTodayStatusText()}
            </h3>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px',
          marginBottom: '28px'
        }}
      >
        {stats.map((item, index) => (
          <div
            key={index}
            className="glass-card"
            style={{
              padding: '26px',
              minHeight: '170px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <p
                style={{
                  color: '#991b1b',
                  fontWeight: '700',
                  fontSize: '15px',
                  marginBottom: '12px'
                }}
              >
                {item.title}
              </p>

              <h3
                style={{
                  fontSize: item.title === 'Next Dose' ? '24px' : '36px',
                  color: '#7f1d1d',
                  lineHeight: 1.2,
                  marginBottom: '10px',
                  wordBreak: 'break-word'
                }}
              >
                {item.value}
              </h3>
            </div>

            <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.5 }}>
              {item.sub}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '22px',
          marginBottom: '28px'
        }}
        className="doctor-grid"
      >
        <div className="glass-card" style={{ padding: '28px', borderRadius: '26px' }}>
          <h2 style={{ color: '#991b1b', marginBottom: '18px' }}>Today’s Insight</h2>

          <div
            style={{
              padding: '20px',
              borderRadius: '22px',
              background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(239,68,68,0.12)'
            }}
          >
            <p
              style={{
                fontWeight: '700',
                marginBottom: '10px',
                color: '#991b1b',
                fontSize: '18px'
              }}
            >
              {getAdherenceLabel()}
            </p>
            <p style={{ lineHeight: '1.8', color: '#374151' }}>{getMotivationMessage()}</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '28px', borderRadius: '26px' }}>
          <h2 style={{ color: '#991b1b', marginBottom: '18px' }}>Quick Summary</h2>

          <div style={{ display: 'grid', gap: '12px' }}>
            <SummaryRow label="Total Medicines" value={medicines.length} />
            <SummaryRow label="Total Doses Logged" value={totalLogs} />
            <SummaryRow label="Next Scheduled Dose" value={getNextDose()} />
            <SummaryRow label="Current Health State" value={getHealthStatus()} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '28px', borderRadius: '28px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px'
          }}
        >
          <div>
            <h2 style={{ color: '#991b1b', marginBottom: '6px' }}>Today’s Medicine Schedule</h2>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>
              Sorted view of all upcoming medicine timings
            </p>
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(239,68,68,0.12)',
              color: '#7f1d1d',
              fontWeight: '600',
              fontSize: '14px'
            }}
          >
            {sortedSchedule.length} scheduled doses
          </div>
        </div>

        {sortedSchedule.length === 0 ? (
          <p style={{ color: '#6b7280' }}>No medicines added yet.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px'
            }}
          >
            {sortedSchedule.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: '18px',
                  borderRadius: '18px',
                  background: 'rgba(255,255,255,0.68)',
                  border: '1px solid rgba(239,68,68,0.12)'
                }}
              >
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6b7280',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.4px'
                  }}
                >
                  Dose Time
                </p>

                <h3 style={{ color: '#991b1b', marginBottom: '6px', fontSize: '24px' }}>
                  {item.time}
                </h3>

                <p style={{ color: '#374151', fontWeight: '600', marginBottom: '4px' }}>
                  {item.medicineName}
                </p>

                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  Dose: {item.dosage || 'Not specified'}
                </p>
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

          <button className="outline-btn" onClick={() => setReminderPopup(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  )
}

const MiniMetric = ({ label, value }) => {
  return (
    <div
      style={{
        padding: '16px',
        borderRadius: '18px',
        background: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(239,68,68,0.1)'
      }}
    >
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '6px' }}>{label}</p>
      <h3 style={{ color: '#991b1b', fontSize: '24px' }}>{value}</h3>
    </div>
  )
}

const SummaryRow = ({ label, value }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '14px 16px',
        borderRadius: '16px',
        background: 'rgba(255,255,255,0.62)',
        border: '1px solid rgba(239,68,68,0.1)',
        alignItems: 'center'
      }}
    >
      <p style={{ color: '#6b7280', fontSize: '14px' }}>{label}</p>
      <p
        style={{
          color: '#7f1d1d',
          fontWeight: '700',
          textAlign: 'right',
          maxWidth: '55%'
        }}
      >
        {value}
      </p>
    </div>
  )
}

export default Dashboard