const express = require('express')
const path = require('path')
const fs = require('fs')
const Mou = require('../models/Mou')
const { upload, uploadDir } = require('../middleware/upload')

const router = express.Router()

// Create (upload)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { expiryDate, name, org } = req.body
    if (!req.file || !expiryDate || !name) {
      return res.status(400).json({ message: 'file, name and expiryDate are required' })
    }
    const mou = await Mou.create({
      name,
      expiryDate: new Date(expiryDate),
      org: org || null,
      filePath: req.file.path,
    })
    res.status(201).json(mou)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to create MoU' })
  }
})

// List with optional filters
router.get('/', async (req, res) => {
  try {
    const { org, expiringSoon } = req.query
    const filter = {}
    if (org) filter.org = org
    if (expiringSoon) {
      const days = Number(expiringSoon) || 30
      const now = new Date()
      const until = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
      filter.expiryDate = { $lte: until }
    }
    const list = await Mou.find(filter).sort({ createdAt: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch MoUs' })
  }
})

// Get one
router.get('/:id', async (req, res) => {
  try {
    const item = await Mou.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to fetch MoU' })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const { name, expiryDate, org } = req.body
    const item = await Mou.findByIdAndUpdate(
      req.params.id,
      { name, expiryDate, org },
      { new: true }
    )
    if (!item) return res.status(404).json({ message: 'Not found' })
    res.json(item)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to update MoU' })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    const item = await Mou.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    if (item.filePath && fs.existsSync(item.filePath)) {
      fs.unlink(item.filePath, () => {})
    }
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to delete MoU' })
  }
})

// Download
router.get('/:id/download', async (req, res) => {
  try {
    const item = await Mou.findById(req.params.id)
    if (!item) return res.status(404).json({ message: 'Not found' })
    if (!item.filePath || !fs.existsSync(item.filePath)) {
      return res.status(404).json({ message: 'File not found' })
    }
    res.download(item.filePath, path.basename(item.filePath))
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Failed to download MoU' })
  }
})

module.exports = { router, uploadDir }
