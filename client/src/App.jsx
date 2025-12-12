import { useState, useEffect } from 'react'
import './App.css'
import UploadForm from './components/UploadForm'
import MouList from './components/MouList'
import ReminderBanner from './components/ReminderBanner'
import useExpiryReminders from './hooks/useExpiryReminders'

function App() {
  const [mous, setMous] = useState([])

  const { expiringCount, notifyIfAllowed } = useExpiryReminders(mous, {
    thresholdDays: 30,
    intervalMs: 60_000,
  })

  const handleAdd = ({ name, expiryDate, file }) => {
    setMous((prev) => [...prev, { name, expiryDate, file }])
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
        <UploadForm onAdd={handleAdd} />
        <h2 className="section-title">Uploaded MoUs</h2>
        <MouList items={mous} />
      </div>
    </div>
  )
}

export default App
