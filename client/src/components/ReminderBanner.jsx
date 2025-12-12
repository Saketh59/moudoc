import { useState, useEffect } from 'react'

export default function ReminderBanner({ count = 0, onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setVisible(true)
  }, [count])

  if (!visible || count <= 0) return null

  const handleClose = () => {
    setVisible(false)
    onClose?.()
  }

  return (
    <div role="status" aria-live="polite" className="reminder-banner">
      <div className="reminder-text">⚠ {count} MoU{count > 1 ? 's' : ''} expiring soon!</div>
      <button className="btn btn-light banner-close" onClick={handleClose} aria-label="Dismiss reminder">
        Dismiss
      </button>
    </div>
  )
}
