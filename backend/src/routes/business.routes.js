const express = require('express');
const { createBusiness, getBusinesses, updateBusiness, deleteBusiness } = require('../controllers/business.controller');
const auth = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/', auth, createBusiness);
router.get('/', auth, getBusinesses);
router.put('/:id', auth, updateBusiness);
router.delete('/:id', auth, deleteBusiness);

module.exports = router;