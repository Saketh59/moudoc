const mongoose = require('mongoose')

const MouSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    org: { type: String },
    filePath: { type: String, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Mou', MouSchema)
