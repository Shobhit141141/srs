const express = require('express');
const router = express.Router();
const feesRecordController = require('../controllers/feesRecordController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:studentId', authMiddleware, feesRecordController.createFeesRecord);
router.post('/', authMiddleware, feesRecordController.createFeesRecord);
router.put('/:id', authMiddleware, feesRecordController.updateFeesRecord);
router.post('/monthly', authMiddleware, feesRecordController.getMonthlyFeesReport);

module.exports = router;
