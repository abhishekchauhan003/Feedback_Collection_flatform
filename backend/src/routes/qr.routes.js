const express = require('express');
const { createBranch, getBranches, getBranch } = require('../controllers/qr.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/branch', auth, createBranch);
router.get('/branch/:businessId', auth, getBranches);
router.get('/branch/:id', auth, getBranch);

module.exports = router;