
import { useState, useEffect } from 'react'
import './App.css'
import UploadForm from './components/UploadForm'
import MouList from './components/MouList'
import ReminderBanner from './components/ReminderBanner'
import useExpiryReminders from './hooks/useExpiryReminders'
import { API_BASE_URL } from './config'

function App() {
  const [mous, setMous] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { expiringCount, notifyIfAllowed } = useExpiryReminders(mous, {
    thresholdDays: 30,
    intervalMs: 60_000,
  })

  useEffect(() => {
    fetchMous()
  }, [])

  const fetchMous = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_BASE_URL)
      if (!res.ok) throw new Error('Failed to fetch MoUs')
      const data = await res.json()
      setMous(data)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Could not load MoUs. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async ({ name, expiryDate, file }) => {
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('expiryDate', expiryDate)
      formData.append('file', file)

      const res = await fetch(API_BASE_URL, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Failed to upload MoU')
      }

      const newMou = await res.json()
      setMous((prev) => [newMou, ...prev])
    } catch (err) {
      console.error(err)
      alert('Failed to upload. Please check the backend URL or try again.')
    }
  }

  useEffect(() => {
    if (expiringCount > 0) {
      notifyIfAllowed('MoU Expiry Reminder', `⚠ ${expiringCount} MoU(s) expiring within 30 days`)
    }
  }, [expiringCount, notifyIfAllowed])

  return (
    <div className="app">
      <div className="card">
        <ReminderBanner count={expiringCount} />
        <h1 className="title">MoU Documentation and Renewal Reminder System</h1>

        {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        <UploadForm onAdd={handleAdd} />

        <h2 className="section-title">Uploaded MoUs</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <MouList items={mous} />
        )}
      </div>
    </div>
  )
}

export default App
