const { getBusinessAnalytics } = require('../services/analytics.service');
const Business = require('../models/Business');

exports.getAnalytics = async (req, res, next) => {
  try {
    const { businessId } = req.params;
    const business = await Business.findOne({ _id: businessId, ownerId: req.user.id });
    if (!business) return res.status(404).json({ message: 'Business not found' });

    const analytics = await getBusinessAnalytics(businessId);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
};