const Feedback = require('../models/Feedback');
const Business = require('../models/Business');
const Branch = require('../models/Branch');
const { generateDrafts } = require('../services/ai.service');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { businessId, branchId, rating, selectedTags, customerComment } = req.body;

    const business = await Business.findById(businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });
    const branch = await Branch.findById(branchId);
    if (!branch) return res.status(404).json({ message: 'Branch not found' });

    const drafts = await generateDrafts({
      rating,
      selectedTags: selectedTags || [],
      businessType: business.businessType,
      customerComment: customerComment || '',
      language: 'en',
    });

    let sentiment = 'neutral';
    if (rating >= 4) sentiment = 'positive';
    else if (rating <= 2) sentiment = 'negative';

    const feedback = await Feedback.create({
      businessId,
      branchId,
      rating,
      selectedTags: selectedTags || [],
      customerComment,
      generatedDrafts: drafts,
      sentiment,
      status: 'draft',
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};

exports.getFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

exports.updateFeedback = async (req, res, next) => {
  try {
    const { selectedDraft, editedFinalText } = req.body;
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    if (selectedDraft !== undefined) feedback.selectedDraft = selectedDraft;
    if (editedFinalText !== undefined) feedback.editedFinalText = editedFinalText;
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

exports.regenerateDrafts = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    const business = await Business.findById(feedback.businessId);
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const drafts = await generateDrafts({
      rating: feedback.rating,
      selectedTags: feedback.selectedTags,
      businessType: business.businessType,
      customerComment: feedback.customerComment || '',
      language: 'en',
    });

    feedback.generatedDrafts = drafts;
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    next(err);
  }
};

exports.redirectFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    feedback.status = 'redirected';
    await feedback.save();
    res.json({ message: 'Feedback marked as redirected' });
  } catch (err) {
    next(err);
  }
};