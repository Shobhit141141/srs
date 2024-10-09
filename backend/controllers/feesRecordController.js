const { Op } = require('sequelize');
const FeesRecord = require('../models/FeesRecord');
const Student = require('../models/Student');

// Create a new fees record
const createFeesRecord = async (req, res) => {
  try {
    const teacher = req.teacher;
    const { studentId, amount, date_of_payment, status } = req.body;
    const logs = [];
    const feesRecord = await FeesRecord.create({
      studentId,
      amount,
      date_of_payment,
      status,
      teacherId: teacher.id
    });
    logs.push(`Fees paid : ₹ ${amount} on ${date_of_payment.toLocaleString()}`);
    const student = await Student.findByPk(studentId);
    await student.update({
      logs: [...student.logs, ...logs]
    });
    await student.save();
    res
      .status(201)
      .json({ message: 'Fees record created successfully', feesRecord });
  } catch (error) {
    res.status(400).json({ message: 'Error creating fees record', error });
  }
};

// Get all fees records
const getAllFeesRecords = async (req, res) => {
  try {
    const feesRecords = await FeesRecord.findAll({
      include: [{ model: Student, attributes: ['name', 'class'] }] // Include student details
    });
    res.status(200).json(feesRecords);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fees records', error });
  }
};

// Get fees record by ID
const getFeesRecordById = async (req, res) => {
  try {
    const feesRecord = await FeesRecord.findByPk(req.params.id);
    if (!feesRecord) {
      return res.status(404).json({ message: 'Fees record not found' });
    }
    res.status(200).json(feesRecord);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching fees record', error });
  }
};

// Update a fees record
const updateFeesRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const feesRecord = await FeesRecord.findByPk(id);
    if (!feesRecord) {
      return res.status(404).json({ message: 'Fees record not found' });
    }

    const updatedFeesRecord = await feesRecord.update(req.body);
    res
      .status(200)
      .json({ message: 'Fees record updated successfully', updatedFeesRecord });
  } catch (error) {
    res.status(400).json({ message: 'Error updating fees record', error });
  }
};

// Delete a fees record
const deleteFeesRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const feesRecord = await FeesRecord.findByPk(id);
    if (!feesRecord) {
      return res.status(404).json({ message: 'Fees record not found' });
    }

    await feesRecord.destroy();
    res.status(204).json({ message: 'Fees record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting fees record', error });
  }
};

const getMonthlyFeesReport = async (req, res) => {
  const teacherId = req.teacher.id;
  const { year, month } = req.body;

  console.log('req.query', req.query);
  console.log('req.body', req.body);

  console.log('year', year);
  console.log('month', month);
  console.log('teacherId', teacherId);
  // Calculate the start and end of the month
  const startDate = new Date(year, month - 1, 1); // First day of the month
  const endDate = new Date(year, month, 0); // Last day of the month

  // Fetch all fees records for the specified month and teacher's students
  const feesRecords = await FeesRecord.findAll({
    where: {
      date_of_payment: {
        [Op.between]: [startDate, endDate]
      },
      '$Student.teacherId$': teacherId // Ensure the student belongs to the teacher
    },
    include: [
      {
        model: Student, // Join with the Student model
        required: true // Only include fees records with valid students
      }
    ]
  });

  // Get the student IDs who have paid fees
  const paidStudentIds = feesRecords.map(record => record.studentId);

  // Fetch students of this teacher who haven't paid fees in the given month
  const unpaidStudents = await Student.findAll({
    where: {
      teacherId: teacherId, // Filter students by teacher
      id: {
        [Op.notIn]: paidStudentIds // Exclude paid students
      }
    }
  });

  // Return the report
  // return {
  //   paidFeesCount: paidStudentIds.length,
  //   unpaidFeesCount: unpaidStudents.length,
  //   paidStudents: feesRecords,
  //   unpaidStudents
  // };
  res.json({
    paidFeesCount: paidStudentIds.length,
    unpaidFeesCount: unpaidStudents.length,
    paidStudents: feesRecords,
    unpaidStudents
  });
};

module.exports = {
  createFeesRecord,
  getAllFeesRecords,
  getFeesRecordById,
  updateFeesRecord,
  deleteFeesRecord,
  getMonthlyFeesReport
};
