const app = require('./src/app')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 5001
const MONGODB_URI = process.env.MONGODB_URI

async function start() {
  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI)
      console.log('MongoDB connected')
    } catch (err) {
      console.error('MongoDB connection failed:', err.message)
      console.warn('Continuing to start server without an active DB connection...')
    }
  } else {
    console.warn('MONGODB_URI not set. Starting server without DB connection.')
  }

  app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`)
  })
}

start()
