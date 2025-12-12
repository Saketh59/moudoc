import { useState } from 'react'
import './App.css'
import UploadForm from './components/UploadForm'
import MouList from './components/MouList'

function App() {
  const [mous, setMous] = useState([])

  const handleAdd = ({ name, expiryDate, file }) => {
    setMous((prev) => [...prev, { name, expiryDate, file }])
  }

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">MoU Documentation and Renewal Reminder System</h1>
        <UploadForm onAdd={handleAdd} />
        <h2 className="section-title">Uploaded MoUs</h2>
        <MouList items={mous} />
      </div>
    </div>
  )
}

export default App
