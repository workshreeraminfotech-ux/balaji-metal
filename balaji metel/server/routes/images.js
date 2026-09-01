const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const { verifyToken, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/:productId', verifyToken, isAdmin, upload.array('images', 10), imageController.upload);
router.delete('/:id', verifyToken, isAdmin, imageController.delete);
router.patch('/reorder', verifyToken, isAdmin, imageController.reorder);
router.patch('/:id/featured', verifyToken, isAdmin, imageController.setFeatured);

module.exports = router;
