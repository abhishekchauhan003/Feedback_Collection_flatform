const mongoose = require('mongoose');

const ExperienceTagSchema = new mongoose.Schema({
  businessType: { type: String, required: true, unique: true },
  tags: [{ type: String }],
});

module.exports = mongoose.model('ExperienceTag', ExperienceTagSchema);