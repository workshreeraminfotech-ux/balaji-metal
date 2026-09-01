const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const pdfController = require('../controllers/pdfController');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/', inquiryController.create);
router.get('/export/csv', verifyToken, isAdmin, inquiryController.exportCsv);
router.get('/', verifyToken, isAdmin, inquiryController.getAll);
router.get('/:id', verifyToken, isAdmin, inquiryController.getById);
router.get('/:id/pdf', verifyToken, isAdmin, pdfController.generateQuotePdf);
router.patch('/:id/status', verifyToken, isAdmin, inquiryController.updateStatus);

module.exports = router;

