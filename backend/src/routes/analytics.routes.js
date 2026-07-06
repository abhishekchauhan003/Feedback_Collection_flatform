const express = require('express');
const { getAnalytics } = require('../controllers/analytics.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.get('/:businessId', auth, getAnalytics);

module.exports = router;