import React from 'react'

const Footer = () => {
  return (
    <footer
      style={{
        marginTop: '60px',
        padding: '40px 20px',
        background: 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,0,0,0.1)'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px'
        }}
      >
       
        <div>
          <h2 style={{ color: '#991b1b', marginBottom: '10px' }}>MediTrack</h2>
          <p style={{ color: '#7f1d1d', lineHeight: '1.6' }}>
            Smart medication tracking system helping patients stay consistent
            with their treatment and improve adherence.
          </p>
        </div>

       
        <div>
          <h3 style={{ color: '#991b1b', marginBottom: '12px' }}>Quick Links</h3>
          <p>Home</p>
          <p>Dashboard</p>
          <p>Medicines</p>
          <p>Reports</p>
        </div>

        
        <div>
          <h3 style={{ color: '#991b1b', marginBottom: '12px' }}>Contact Us</h3>
          <p>Email: support@meditrack.com</p>
          <p>Phone: +91 9876543210</p>
          <p>Location: India</p>
        </div>

        
        <div>
          <h3 style={{ color: '#991b1b', marginBottom: '12px' }}>Follow Us</h3>
          <p>Instagram</p>
          <p>LinkedIn</p>
          <p>GitHub</p>
        </div>
      </div>

      
      <div
        style={{
          textAlign: 'center',
          marginTop: '30px',
          borderTop: '1px solid rgba(255,0,0,0.1)',
          paddingTop: '15px',
          color: '#7f1d1d'
        }}
      >
        © 2026 MediTrack | Built with ❤️ by Carecoders
      </div>
    </footer>
  )
}

export default Footer