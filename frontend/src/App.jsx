import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchJobs()
    fetchStats()
    const interval = setInterval(() => {
      fetchJobs()
      fetchStats()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs')
      setJobs(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const deleteJob = async (id) => {
    try {
      await axios.delete(`/api/jobs/${id}`)
      fetchJobs()
    } catch (error) {
      console.error('Error deleting job:', error)
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Video Compress</h1>
        <p>Research-grade H.264 compression tool</p>
      </header>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Jobs</h3>
            <p className="stat-value">{stats.total_jobs}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-value">{stats.completed}</p>
          </div>
          <div className="stat-card">
            <h3>Processing</h3>
            <p className="stat-value">{stats.processing}</p>
          </div>
          <div className="stat-card">
            <h3>Failed</h3>
            <p className="stat-value">{stats.failed}</p>
          </div>
        </div>
      )}

      <div className="jobs-section">
        <h2>Compression Jobs</h2>
        {jobs.length === 0 ? (
          <p className="empty-state">No compression jobs yet. Use the CLI to start compressing videos.</p>
        ) : (
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className={`job-card status-${job.status}`}>
                <div className="job-header">
                  <h3>{job.input_file}</h3>
                  <span className={`status-badge status-${job.status}`}>{job.status}</span>
                </div>
                <div className="job-details">
                  <p><strong>Preset:</strong> {job.preset}</p>
                  <p><strong>CRF:</strong> {job.crf}</p>
                  <p><strong>Profile:</strong> {job.profile}</p>
                  {job.progress > 0 && (
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${job.progress}%` }}></div>
                      <span className="progress-text">{job.progress}%</span>
                    </div>
                  )}
                  {job.output_size && (
                    <p><strong>Reduction:</strong> {job.reduction_percentage}%</p>
                  )}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
