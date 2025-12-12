const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const path = require('path')
const { router: mouRouter, uploadDir } = require('./routes/mous.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Static serve for uploaded files
app.use('/uploads', express.static(uploadDir))

// API routes
app.use('/api/mous', mouRouter)

module.exports = app
