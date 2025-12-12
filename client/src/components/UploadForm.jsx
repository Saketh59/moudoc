import { useState } from 'react'

export default function UploadForm({ onAdd }) {
  const [file, setFile] = useState(null)
  const [expiry, setExpiry] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!file || !expiry) return
    onAdd({ name: file.name, expiryDate: expiry, file })
    setFile(null)
    setExpiry('')
    e.target.reset()
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="input file-input"
      />
      <input
        type="date"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        className="date-input"
      />
      <button
        type="submit"
        className="btn btn-accent"
      >
        Upload MoU
      </button>
    </form>
  )
}
