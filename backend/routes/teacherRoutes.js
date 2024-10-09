const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController'); // Ensure this path is correct
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', teacherController.loginTeacher);
router.post('/signup', teacherController.createTeacher);
router.post('/add', authMiddleware, teacherController.createTeacher);
router.get('/all', authMiddleware, teacherController.getAllTeachers);
router.get('/:id', authMiddleware, teacherController.getTeacherById);
router.put('/:id', authMiddleware, teacherController.updateTeacher);
router.delete('/:id', authMiddleware, teacherController.deleteTeacher);

module.exports = router;
