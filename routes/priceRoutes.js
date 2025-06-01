const express = require('express');
const router = express.Router();
const priceController = require('../controllers/priceController');

// POST /api/prices
router.post('/', priceController.createPrice);
router.get('/', priceController.getAllPrices);

module.exports = router;
