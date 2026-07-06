const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  branchName: { type: String, required: true },
  address: { type: String },
  qrCodeData: { type: String },
  qrCodeImage: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);