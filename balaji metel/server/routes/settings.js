const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.get('/', settingsController.getAll);
router.get('/:key', settingsController.getByKey);
router.put('/', verifyToken, isAdmin, settingsController.update);

module.exports = router;
