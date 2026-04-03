import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  const token = localStorage.getItem('token')
  const [showPopup, setShowPopup] = useState(false)

  const features = [
    {
      title: 'Smart Reminders',
      desc: 'Time based reminders for every dose so patients never miss important medicines.'
    },
    {
      title: 'Dose Tracking',
      desc: 'Mark each medicine as taken, missed, or delayed and maintain complete logs.'
    },
    {
      title: 'Adherence Reports',
      desc: 'See compliance score, missed doses, and patient performance in a clean dashboard.'
    }
  ]

  const doctors = [
    {
      name: 'Dr. Priya Sharma',
      specialization: 'Cardiologist',
      experience: '10+ Years Experience',
      timing: '10 AM - 2 PM',
      icon: '👩‍⚕️'
    },
    {
      name: 'Dr. Rahul Mehta',
      specialization: 'General Physician',
      experience: '8+ Years Experience',
      timing: '4 PM - 8 PM',
      icon: '👨‍⚕️'
    },
    {
      name: 'Dr. Anjali Verma',
      specialization: 'Neurologist',
      experience: '12+ Years Experience',
      timing: '11 AM - 5 PM',
      icon: '👩‍⚕️'
    }
  ]

  return (
    <div className="page">
      {/* HERO SECTION */}
      <div
        className="glass-card"
        style={{
          padding: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '30px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              fontSize: '56px',
              lineHeight: '1.2',
              marginBottom: '20px',
              color: '#991b1b'
            }}
          >
            Smart Medication
            <br />
            Adherence Tracker
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#7f1d1d',
              marginBottom: '30px',
              maxWidth: '600px'
            }}
          >
            Track medicines, get reminders, monitor missed doses, and generate adherence
            reports for patients and caregivers with a smooth modern health dashboard.
          </p>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {!token ? (
              <>
                <Link to="/signup">
                  <button className="glow-btn">Get Started</button>
                </Link>

                <Link to="/login">
                  <button
                    className="outline-btn"
                    style={{ padding: '12px 24px' }}
                  >
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard">
                  <button className="glow-btn">Go to Dashboard</button>
                </Link>

                <Link to="/add-medicine">
                  <button
                    className="outline-btn"
                    style={{ padding: '12px 24px' }}
                  >
                    Add Medicine
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div
          className="glass-card"
          style={{
            flex: 1,
            minWidth: '280px',
            padding: '30px',
            transform: 'rotate(-4deg)',
            maxWidth: '400px'
          }}
        >
          <h3
            style={{
              marginBottom: '20px',
              fontSize: '24px',
              color: '#991b1b'
            }}
          >
            Today’s Summary
          </h3>
          <p style={{ marginBottom: '12px' }}>✅ Medicines Taken: 4</p>
          <p style={{ marginBottom: '12px' }}>⏰ Upcoming Reminder: 9:00 PM</p>
          <p style={{ marginBottom: '12px' }}>⚠ Missed Doses: 1</p>
          <p>📊 Adherence Score: 84%</p>
        </div>
      </div>

     
      <div style={{ marginTop: '50px' }}>
        <h2 className="section-title">Why Use MediTrack?</h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px'
          }}
        >
          {features.map((item, index) => (
            <div key={index} className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '14px', color: '#991b1b' }}>{item.title}</h3>
              <p style={{ lineHeight: '1.7', color: '#7f1d1d' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

     
      <div style={{ marginTop: '60px' }}>
        <h2 className="section-title">Need a Consultant?</h2>
        <p
          style={{
            color: '#7f1d1d',
            marginBottom: '24px',
            fontSize: '17px'
          }}
        >
          Connect with our top healthcare specialists for better guidance and treatment support.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '20px'
          }}
        >
          {doctors.map((doctor, index) => (
            <div key={index} className="glass-card" style={{ padding: '24px' }}>
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #fecaca, #fca5a5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  marginBottom: '16px'
                }}
              >
                {doctor.icon}
              </div>

              <h3 style={{ color: '#991b1b', marginBottom: '8px' }}>{doctor.name}</h3>
              <p style={{ marginBottom: '6px', color: '#7f1d1d' }}>{doctor.specialization}</p>
              <p style={{ marginBottom: '6px', color: '#7f1d1d' }}>{doctor.experience}</p>
              <p style={{ marginBottom: '16px', color: '#7f1d1d' }}>
                Available: {doctor.timing}
              </p>

              <button
                className="glow-btn"
                onClick={() => setShowPopup(true)}
              >
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>

      
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000
          }}
        >
          <div
            style={{
              background: '#fff',
              width: '90%',
              maxWidth: '360px',
              borderRadius: '20px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}
          >
            <h2 style={{ color: '#991b1b', marginBottom: '12px' }}>
              Appointment Confirmed
            </h2>

            <p style={{ color: '#7f1d1d', marginBottom: '20px', lineHeight: '1.6' }}>
              Doctor will call you shortly 📞
            </p>

            <button
              className="glow-btn"
              onClick={() => setShowPopup(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home