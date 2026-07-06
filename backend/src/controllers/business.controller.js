const Business = require('../models/Business');

exports.createBusiness = async (req, res, next) => {
  try {
    const { businessName, businessType, description, reviewDestination, experienceTags } = req.body;
    const business = await Business.create({
      ownerId: req.user.id,
      businessName,
      businessType,
      description,
      reviewDestination,
      experienceTags: experienceTags || [],
    });
    res.status(201).json(business);
  } catch (err) {
    next(err);
  }
};

exports.getBusinesses = async (req, res, next) => {
  try {
    const businesses = await Business.find({ ownerId: req.user.id });
    res.json(businesses);
  } catch (err) {
    next(err);
  }
};

exports.updateBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json(business);
  } catch (err) {
    next(err);
  }
};

exports.deleteBusiness = async (req, res, next) => {
  try {
    const business = await Business.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });
    if (!business) return res.status(404).json({ message: 'Business not found' });
    res.json({ message: 'Business deleted' });
  } catch (err) {
    next(err);
  }
};