const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  selectedTags: [{ type: String }],
  customerComment: { type: String },
  generatedDrafts: [{ type: String }],
  selectedDraft: { type: String },
  editedFinalText: { type: String },
  sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] },
  status: { type: String, enum: ['draft', 'published', 'redirected'], default: 'draft' },
}, { timestamps: true });

module.exports = mongoose.model('Feedback', FeedbackSchema);