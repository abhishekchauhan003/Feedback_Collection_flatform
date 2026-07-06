const Feedback = require('../models/Feedback');

exports.getBusinessAnalytics = async (businessId) => {
  const feedbacks = await Feedback.find({ businessId });
  const total = feedbacks.length;
  if (total === 0) {
    return { total: 0, averageRating: 0, tagFrequency: {}, recentFeedbacks: [] };
  }

  const sumRatings = feedbacks.reduce((acc, f) => acc + f.rating, 0);
  const avgRating = sumRatings / total;

  const tagFreq = {};
  feedbacks.forEach(f => {
    f.selectedTags.forEach(tag => {
      tagFreq[tag] = (tagFreq[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.entries(tagFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topTags = Object.fromEntries(sortedTags);

  const recent = feedbacks.sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);

  return {
    total,
    averageRating: parseFloat(avgRating.toFixed(2)),
    tagFrequency: topTags,
    recentFeedbacks: recent.map(f => ({
      id: f._id,
      rating: f.rating,
      tags: f.selectedTags,
      comment: f.customerComment,
      createdAt: f.createdAt,
    })),
  };
};