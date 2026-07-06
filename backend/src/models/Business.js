const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  description: { type: String },
  reviewDestination: { type: String, required: true },
  experienceTags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);