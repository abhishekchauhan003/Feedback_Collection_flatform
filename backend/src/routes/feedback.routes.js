const express = require('express');
const {
  submitFeedback,
  getFeedback,
  updateFeedback,
  regenerateDrafts,
  redirectFeedback,
} = require('../controllers/feedback.controller');
const router = express.Router();

router.post('/', submitFeedback);
router.get('/:id', getFeedback);
router.put('/:id', updateFeedback);
router.post('/:id/regenerate', regenerateDrafts);
router.post('/:id/redirect', redirectFeedback);

module.exports = router;