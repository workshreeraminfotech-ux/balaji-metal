const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', verifyToken, isAdmin, productController.getAllProducts);
router.get('/published', productController.getPublishedProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', verifyToken, isAdmin, productController.getProductById);
router.post('/', verifyToken, isAdmin, productController.createProduct);
router.put('/:id', verifyToken, isAdmin, productController.updateProduct);
router.delete('/:id', verifyToken, isAdmin, productController.deleteProduct);
router.patch('/:id/toggle-publish', verifyToken, isAdmin, productController.togglePublish);
router.patch('/:id/toggle-featured', verifyToken, isAdmin, productController.toggleFeatured);

module.exports = router;
