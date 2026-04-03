import React, { useEffect, useRef, useState } from 'react'
import API from '../api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

const Reports = () => {
  const [report, setReport] = useState(null)
  const [progress, setProgress] = useState(0)
  const printRef = useRef(null)

  const fetchReport = async () => {
    try {
      const res = await API.get('/reports/adherence')
      setReport(res.data)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch report')
    }
  }

  useEffect(() => {
    fetchReport()
  }, [])

  useEffect(() => {
    if (!report?.report?.adherenceRate) return

    const target = Number(report.report.adherenceRate)
    let current = 0

    const interval = setInterval(() => {
      current += 1
      if (current >= target) {
        current = target
        clearInterval(interval)
      }
      setProgress(current)
    }, 20)

    return () => clearInterval(interval)
  }, [report])

  const handleDownload = () => {
    window.print()
  }

  if (!report) {
    return (
      <div className="page">
        <h1 className="section-title">Reports</h1>
        <p>Loading...</p>
      </div>
    )
  }

  const summary = report.report

  const barData = [
    { name: 'Taken', value: summary.taken },
    { name: 'Missed', value: summary.missed },
    { name: 'Delayed', value: summary.delayed }
  ]

  const pieData = [
    { name: 'Taken', value: summary.taken },
    { name: 'Missed', value: summary.missed },
    { name: 'Delayed', value: summary.delayed }
  ]

  const circleDegree = (progress / 100) * 360

  return (
    <div className="page" ref={printRef}>
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
        <h1 className="section-title" style={{ marginBottom: 0 }}>Reports</h1>

        <button className="glow-btn" onClick={handleDownload}>
          Download Report
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
        <div className="glass-card" style={cardStyle}>
          <h3 style={titleStyle}>Total Doses</h3>
          <p style={valueStyle}>{summary.total}</p>
        </div>

        <div className="glass-card" style={cardStyle}>
          <h3 style={titleStyle}>Taken</h3>
          <p style={valueStyle}>{summary.taken}</p>
        </div>

        <div className="glass-card" style={cardStyle}>
          <h3 style={titleStyle}>Missed</h3>
          <p style={valueStyle}>{summary.missed}</p>
        </div>

        <div className="glass-card" style={cardStyle}>
          <h3 style={titleStyle}>Delayed</h3>
          <p style={valueStyle}>{summary.delayed}</p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '20px',
          marginBottom: '30px'
        }}
        className="reports-grid"
      >
        <div className="glass-card" style={{ padding: '24px', minHeight: '360px' }}>
          <h2 style={chartHeading}>Dose Status Chart</h2>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div
          className="glass-card"
          style={{
            padding: '24px',
            minHeight: '360px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h2 style={chartHeading}>Adherence Progress</h2>

          <div
            style={{
              width: '210px',
              height: '210px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: `conic-gradient(#ef4444 ${circleDegree}deg, #fde2e2 ${circleDegree}deg)`,
              boxShadow: '0 12px 30px rgba(239,68,68,0.18)',
              marginTop: '14px'
            }}
          >
            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#991b1b'
              }}
            >
              <span style={{ fontSize: '34px', fontWeight: 'bold' }}>{progress}%</span>
              <span style={{ fontSize: '14px' }}>Adherence</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '0.9fr 1.1fr',
          gap: '20px'
        }}
        className="reports-grid"
      >
        <div className="glass-card" style={{ padding: '24px', minHeight: '350px' }}>
          <h2 style={chartHeading}>Distribution</h2>

          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
                nameKey="name"
                label
              >
                <Cell fill="#ef4444" />
                <Cell fill="#f87171" />
                <Cell fill="#fca5a5" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ padding: '26px' }}>
          <h2 style={chartHeading}>Adherence Summary</h2>

          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={summaryRow}>
              <span>Total Logged Doses</span>
              <strong>{summary.total}</strong>
            </div>

            <div style={summaryRow}>
              <span>Taken Doses</span>
              <strong>{summary.taken}</strong>
            </div>

            <div style={summaryRow}>
              <span>Missed Doses</span>
              <strong>{summary.missed}</strong>
            </div>

            <div style={summaryRow}>
              <span>Delayed Doses</span>
              <strong>{summary.delayed}</strong>
            </div>

            <div style={summaryRow}>
              <span>Adherence Rate</span>
              <strong>{summary.adherenceRate}%</strong>
            </div>

            <div style={summaryRow}>
              <span>System Alert</span>
              <strong>{report.alert}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const cardStyle = {
  padding: '28px'
}

const titleStyle = {
  color: '#991b1b',
  marginBottom: '14px'
}

const valueStyle = {
  fontSize: '38px',
  fontWeight: 'bold',
  color: '#7f1d1d'
}

const chartHeading = {
  color: '#991b1b',
  marginBottom: '20px'
}

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 16px',
  borderRadius: '14px',
  background: 'rgba(255,255,255,0.55)',
  color: '#7f1d1d',
  gap: '14px'
}

export default Reports