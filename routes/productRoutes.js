const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getAllProducts);
router.post('/', createProduct);
router.put('/', updateProduct);
router.delete('/', deleteProduct);

module.exports = router;
