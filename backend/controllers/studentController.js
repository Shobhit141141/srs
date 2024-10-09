const Student = require('../models/Student')
const FeesRecord = require('../models/FeesRecord')

// Controller methods
const getStudentById = async (req, res) => {
  const teacher = req.teacher;
  const student = await Student.findByPk(req.params.id);
  const feesRecords = await FeesRecord.findAll({ where: { studentId: student.id } });

  if (!student) {
    return res.status(404).json({ message: 'Student not found' });
  }
  if (student.teacherId !== teacher.id) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  return res.json({student,feesRecords});
};

const getAllStudents = async (req, res) => {
  const teacher = req.teacher;
  const students = await Student.findAll({ where: { teacherId: teacher.id } });
  res.json(students);
};

const getStudentLogs = async (req, res) => {
  const teacher = req.teacher;
  const student = await Student.findByPk(req.params.id);

  if (!student) return res.status(404).json({ message: 'Student not found' });
  if (student.teacherId !== teacher.id) return res.status(403).json({ message: 'Unauthorized' });

  res.json(student.logs || []);
};

const createStudent = async (req, res) => {
  const teacher = req.teacher;
  const { name, joiningDate, contactInfo, class: className, feesAmount, timeSlot, notes } = req.body;

  if (!name || !joiningDate || !contactInfo || !className || !timeSlot || !feesAmount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const contactRegex = /^\d{10}$/;
  if (!contactRegex.test(contactInfo)) {
    return res.status(400).json({ message: 'Invalid contact info' });
  }

  const student = await Student.create({
    name,
    joiningDate,
    contactInfo,
    class: className,
    feesAmount,
    timeSlot,
    notes: notes || '',
    logs: [`Student created: ${name}`],
    teacherId: teacher.id
  });

  res.json(student);
};

const updateStudent = async (req, res) => {
  const teacher = req.teacher;
  const student = await Student.findByPk(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  if (student.teacherId !== teacher.id) return res.status(403).json({ message: 'Unauthorized' });

  const { name, contactInfo, class: className, feesAmount, timeSlot, notes } = req.body;
  const updates = {};
  const logs = [];

  if (name && name !== student.name) {
    updates.name = name;
    logs.push(`Updated name from ${student.name} to ${name}`);
  }
  if (contactInfo && contactInfo !== student.contactInfo) {
    updates.contactInfo = contactInfo;
    logs.push(`Updated contact info`);
  }
  if (className && className !== student.class) {
    updates.class = className;
    logs.push(`Updated class`);
  }
  if (feesAmount !== undefined && feesAmount !== student.feesAmount) {
    updates.feesAmount = feesAmount;
    logs.push(`Updated fees`);
  }
  if (timeSlot && timeSlot !== student.timeSlot) {
    updates.timeSlot = timeSlot;
    logs.push(`Updated timeSlot`);
  }
  if (notes && notes !== student.notes) {
    updates.notes = notes;
    logs.push(`Updated notes`);
  }

  await student.update({ ...updates, logs: [...student.logs, ...logs] });
  res.json(student);
};

const toggleStudentActive = async (req, res) => {
  const teacher = req.teacher;
  const student = await Student.findByPk(req.params.id);
  const logs = [];
  if (!student) return res.status(404).json({ message: 'Student not found' });
  if (student.teacherId !== teacher.id) return res.status(403).json({ message: 'Unauthorized' });

  student.isActive = !student.isActive;
  if (student.isActive) {
    logs.push(`Made active at ${new Date().toLocaleString()}`);
  } else {
    logs.push(`Made inactive at ${new Date().toLocaleString()}`);
  }
  await student.update({
    logs: [...student.logs, ...logs]
  });
  await student.save();
  res.json(student);
};

const deleteStudent = async (req, res) => {
  const teacher = req.teacher;
  const id = req.params.id;
  const feesRecords = await FeesRecord.findAll({
    where: { studentId: id }
  });
  await Promise.all(feesRecords.map(record => record.destroy()));

  const student = await Student.findByPk(id);
  if (!student) throw new Error('Student not found');

  if (student.teacherId !== teacher.id) {
    throw new Error('You are not authorized to delete this student.');
  }
  await student.destroy();
  res.json({ message: 'Student deleted successfully' });
};
module.exports = {
    getStudentById,
    getAllStudents,
    getStudentLogs,
    createStudent,
    updateStudent,
    toggleStudentActive,
    deleteStudent
    };