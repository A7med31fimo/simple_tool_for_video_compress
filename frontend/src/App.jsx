import { useState, useEffect } from 'react'
import axios from 'axios'
import './index.css'

function App() {
  const [jobs, setJobs] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    file: null,
    preset: 'medium',
    crf: 23,
    profile: 'main',
    level: '4.1',
    bitrate: '',
  })

  useEffect(() => {
    fetchJobs()
    fetchStats()
    const interval = setInterval(() => {
      fetchJobs()
      fetchStats()
    }, 3000)
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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, file })
      setError(null)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.file) {
      setError('Please select a video file')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const fileName = formData.file.name
      const outputFileName = `${fileName.split('.')[0]}_compressed.${fileName.split('.').pop()}`

      // Step 1: Upload the actual file to the server so FFmpeg can access it
      const uploadData = new FormData()
      uploadData.append('video', formData.file)
      const uploadResponse = await axios.post('/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const serverInputPath = uploadResponse.data.input_path
      const serverOutputPath = uploadResponse.data.output_path

      // Step 2: Create the compression job using the resolved server-side paths
      const response = await axios.post('/api/jobs', {
        input_file: serverInputPath,
        output_file: serverOutputPath,
        preset: formData.preset,
        crf: parseInt(formData.crf),
        profile: formData.profile,
        level: formData.level,
        bitrate: formData.bitrate || null,
      })

      setSuccess(`Job created successfully! ID: ${response.data.id}`)
      setFormData({
        file: null,
        preset: 'medium',
        crf: 23,
        profile: 'main',
        level: '4.1',
        bitrate: '',
      })
      document.getElementById('fileInput').value = ''

      // Refresh jobs
      setTimeout(() => {
        fetchJobs()
        fetchStats()
      }, 500)
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create compression job')
      console.error('Error:', error)
    } finally {
      setUploading(false)
    }
  }

  const deleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`/api/jobs/${id}`)
        fetchJobs()
        fetchStats()
      } catch (error) {
        setError('Failed to delete job')
        console.error('Error:', error)
      }
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🎬 Video Compress</h1>
        <p>Research-grade H.264 compression tool</p>
      </header>

      {/* Statistics */}
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

      {/* Upload Form */}
      <div className="upload-section">
        <h2>📤 Upload & Compress Video</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-group">
            <label htmlFor="fileInput">Select Video File</label>
            <input
              id="fileInput"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="file-input"
            />
            {formData.file && (
              <p className="file-name">Selected: {formData.file.name}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="preset">Preset</label>
              <select
                id="preset"
                name="preset"
                value={formData.preset}
                onChange={handleInputChange}
                disabled={uploading}
              >
                <option value="ultrafast">Ultrafast (Fastest)</option>
                <option value="superfast">Superfast</option>
                <option value="veryfast">Veryfast</option>
                <option value="faster">Faster</option>
                <option value="fast">Fast</option>
                <option value="medium">Medium (Default)</option>
                <option value="slow">Slow</option>
                <option value="slower">Slower</option>
                <option value="veryslow">Veryslow (Best Quality)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="crf">Quality (CRF)</label>
              <div className="crf-input">
                <input
                  id="crf"
                  type="range"
                  name="crf"
                  min="0"
                  max="51"
                  value={formData.crf}
                  onChange={handleInputChange}
                  disabled={uploading}
                />
                <span className="crf-value">{formData.crf}</span>
              </div>
              <small>0=Best, 51=Worst (Default: 23)</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile">H.264 Profile</label>
              <select
                id="profile"
                name="profile"
                value={formData.profile}
                onChange={handleInputChange}
                disabled={uploading}
              >
                <option value="baseline">Baseline (Compatible)</option>
                <option value="main">Main (Recommended)</option>
                <option value="high">High (Best Compression)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="level">H.264 Level</label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                disabled={uploading}
              >
                <option value="4.0">4.0 (HD)</option>
                <option value="4.1">4.1 (Full HD)</option>
                <option value="4.2">4.2 (4K)</option>
                <option value="5.0">5.0 (4K)</option>
                <option value="5.1">5.1 (4K)</option>
                <option value="5.2">5.2 (8K)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bitrate">Bitrate (Optional)</label>
            <input
              id="bitrate"
              type="text"
              name="bitrate"
              placeholder="e.g., 2000k, 5M"
              value={formData.bitrate}
              onChange={handleInputChange}
              disabled={uploading}
            />
            <small>Leave empty for CRF-based quality</small>
          </div>

          <button
            type="submit"
            disabled={uploading || !formData.file}
            className="submit-btn"
          >
            {uploading ? 'Creating Job...' : 'Start Compression'}
          </button>
        </form>
      </div>

      {/* Jobs List */}
      <div className="jobs-section">
        <h2>📋 Compression Jobs</h2>
        {jobs.length === 0 ? (
          <p className="empty-state">No compression jobs yet. Upload a video above to get started!</p>
        ) : (
          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className={`job-card status-${job.status}`}>
                <div className="job-header">
                  <div className="job-title">
                    <h3>{job.input_file}</h3>
                    <span className={`status-badge status-${job.status}`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteJob(job.id)}
                    disabled={job.status === 'processing'}
                    className="delete-btn"
                    title="Delete job"
                  >
                    ✕
                  </button>
                </div>

                <div className="job-details">
                  <div className="detail-row">
                    <span className="label">Preset:</span>
                    <span className="value">{job.preset}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Quality (CRF):</span>
                    <span className="value">{job.crf}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Profile:</span>
                    <span className="value">{job.profile}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Level:</span>
                    <span className="value">{job.level}</span>
                  </div>

                  {job.progress > 0 && (
                    <div className="progress-section">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${job.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{job.progress}%</span>
                    </div>
                  )}

                  {job.status === 'completed' && job.output_size && (
                    <div className="completion-info">
                      <div className="detail-row">
                        <span className="label">Input Size:</span>
                        <span className="value">{formatBytes(job.input_size)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Output Size:</span>
                        <span className="value">{formatBytes(job.output_size)}</span>
                      </div>
                      <div className="detail-row">
                        <span className="label">Reduction:</span>
                        <span className="value success">
                          {((1 - job.output_size / job.input_size) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  )}

                  {job.error_message && (
                    <div className="error-message">
                      <strong>Error:</strong> {job.error_message}
                    </div>
                  )}

                  <div className="job-timestamps">
                    <small>Created: {new Date(job.created_at).toLocaleString()}</small>
                    {job.completed_at && (
                      <small>Completed: {new Date(job.completed_at).toLocaleString()}</small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatBytes(bytes) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export default App