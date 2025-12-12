const multer = require('multer')
const fs = require('fs')
const path = require('path')

const uploadDir = path.join(process.cwd(), 'server', 'uploads')

function ensureUploadDir() {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }
}

ensureUploadDir()

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir)
  },
  filename: function (_req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    cb(null, `${unique}-${safeOriginal}`)
  },
})

const upload = multer({ storage })

module.exports = { upload, uploadDir }
