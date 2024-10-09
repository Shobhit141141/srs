const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id', authMiddleware, studentController.getStudentById);
router.get('/', authMiddleware, studentController.getAllStudents);
router.get('/:id/logs', authMiddleware, studentController.getStudentLogs);
router.post('/', authMiddleware, studentController.createStudent);
router.put('/:id', authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, studentController.deleteStudent);
router.post('/:id/toggle-active', authMiddleware, studentController.toggleStudentActive);

module.exports = router;
