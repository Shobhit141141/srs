const FeesRecord = require('../models/FeesRecord');
const Student = require('../models/Student');
const { Op } = require('sequelize');
const Teacher = require('../models/Teacher');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authMiddleware } = require('../middleware/authMiddleware');
// Secret key for signing JWTs
const SECRET_KEY = 'your_secret_key';

const resolvers = {
  Query: {
    async getStudentById(_, { id }, context) {
      const teacher = context.teacher;

      const student = await Student.findByPk(id, {
        // include: FeesRecord,
        // required: false,
      });

      if (!student) {
        throw new Error('Student not found');
      }
      if (student.teacherId !== teacher.id) {
        throw new Error('You are not authorized to view this student record.');
      }
      return student;
    },
    async getAllStudents(_, __, context) {
      const teacher = context.teacher;

      return await Student.findAll({
        where: {
          teacherId: teacher.id
        }
      });
    },
    async getFeesRecords(_, { studentId }, context) {
      const teacher = context.teacher;
      const student = await FeesRecord.findAll({
        where: { studentId }
      });
      if (!student) {
        throw new Error('Student not found');
      }
      if (student.teacherId !== teacher.id) {
        throw new Error('You are not authorized to view this student record.');
      }
      return student;
    },

    async studentsByTimeSlot(_, { timeSlot }) {
      const students = await Student.findAll({
        where: {
          timeSlot
        }
      });

      return students;
    },


    getTeacherById: (_, { id }, context) => {
      const teacher = context.teacher;

      console.log(teacher.id);
      console.log(id);  
      if(!teacher) {
        throw new Error('No teachers found');
      }
      console.log(teacher.id == id);
      if(teacher.id != id) {
        throw new Error('You are not authorized to view this teacher record.');
      }
      return teacher;
    },

    async getMonthlyFeesReport(_, { year, month }, context) {
      const teacherId = context.teacher.id; // Get the logged-in teacher's ID

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
            [Op.notIn]: paidStudentIds
          }
        }
      });

      // Return the report
      return {
        paidFeesCount: paidStudentIds.length,
        unpaidFeesCount: unpaidStudents.length,
        paidStudents: feesRecords,
        unpaidStudents
      };
    },
    async getStudentLogs(_, { id }, context) {
      const teacher = context.teacher;
      const student = await Student.findByPk(id);
      if (!student) {
        throw new Error('Student not found');
      }

      if (student.teacherId !== teacher.id) {
        throw new Error('You are not authorized to view this student record.');
      }

      return student.logs || []; 
    }
  },
  Mutation: {
    async signupTeacher(_, { username, email, password }) {
      // Check if the teacher already exists
      const existingTeacher = await Teacher.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingTeacher) {
        throw new Error('Teacher already exists with this email or username.');
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new teacher
      const teacher = await Teacher.create({
        username,
        email,
        password: hashedPassword
      });

      // Generate a JWT token
      const token = jwt.sign({ teacherId: teacher.id }, SECRET_KEY, {
        expiresIn: '1d'
      });

      return { token, teacher };
    },

    async loginTeacher(_, { email, password }) {
      // Find the teacher by email
      const teacher = await Teacher.findOne({ where: { email } });
      if (!teacher) {
        throw new Error('Teacher not found.');
      }

      // Check if the password matches
      const validPassword = await bcrypt.compare(password, teacher.password);
      if (!validPassword) {
        throw new Error('Invalid password.');
      }

      // Generate a JWT token
      const token = jwt.sign({ teacherId: teacher.id }, SECRET_KEY, {
        expiresIn: '1d'
      });

      return { token, teacher };
    },
    async createStudent(_, { input }, context) {
      const {
        name,
        joiningDate,
        contactInfo,
        class: className,
        feesAmount,
        notes,
        timeSlot
      } = input;

      if (
        !name ||
        !joiningDate ||
        !contactInfo ||
        !className ||
        !timeSlot ||
        !feesAmount
      ) {
        throw new Error(
          'All fields are required: name, joiningDate, contactInfo, class, timeSlot.'
        );
      }

      const contactRegex = /^\d{10}$/;
      if (!contactRegex.test(contactInfo)) {
        throw new Error('Contact info must be a 10-digit mobile number.');
      }

      return await Student.create({
        name,
        joiningDate,
        contactInfo,
        class: className,
        feesAmount,
        notes: notes || '',
        timeSlot,
        logs: [`Student created: ${name}`],
        teacherId: context.teacher.id
      });
    },

    async updateStudent(
      _,
      { id, name, contactInfo, class: className, feesAmount, notes, timeSlot },
      context
    ) {
      const teacher = context.teacher;
      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');
      if (student.teacherId !== teacher.id) {
        throw new Error(
          'You are not authorized to update this student record.'
        );
      }
      const updates = {};
      const logsToUpdate = [];
      if (name && name !== student.name) {
        updates.name = name;
        logsToUpdate.push(
          `Updated name from ${student.name} to ${name} at ${new Date().toLocaleString()}`
        );
      }

      if (contactInfo && contactInfo !== student.contactInfo) {
        updates.contactInfo = contactInfo;
        logsToUpdate.push(
          `Updated contact info from ${student.contactInfo} to ${contactInfo} at ${new Date().toLocaleString()}`
        );
      }

      if (className && className !== student.class) {
        updates.class = className;
        logsToUpdate.push(
          `Updated class from ${student.class} to ${className} at ${new Date().toLocaleString()}`
        );
      }

      if (feesAmount !== undefined && feesAmount !== student.feesAmount) {
        updates.feesAmount = feesAmount;
        logsToUpdate.push(
          `Updated fees amount from ${student.feesAmount} to ${feesAmount} at ${new Date().toLocaleString()}`
        );
      }

      if (timeSlot && timeSlot !== student.timeSlot) {
        updates.timeSlot = timeSlot;
        logsToUpdate.push(
          `Updated time slot from ${student.timeSlot} to ${timeSlot} at ${new Date().toLocaleString()}`
        );
      }

      if (notes && notes !== student.notes) {
        updates.notes = notes;
        logsToUpdate.push(
          `Added ${notes} in notes at ${new Date().toLocaleString()}`
        );
      }

      // Update the student record and log changes
      await student.update({
        ...updates,
        logs: [...student.logs, ...logsToUpdate]
      });

      return student;
    },

    async toggleStudentActive(_, { id }, context) {
      const teacher = context.teacher;

      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');

      if (student.teacherId !== teacher.id) {
        throw new Error(
          'You are not authorized to toggle this student status.'
        );
      }
      const logsToUpdate = [];
      student.isActive = !student.isActive;
      if (student.isActive) {
        logsToUpdate.push(`Made active at ${new Date().toLocaleString()}`);
      } else {
        logsToUpdate.push(`Made inactive at ${new Date().toLocaleString()}`);
      }
      await student.update({
        logs: [...student.logs, ...logsToUpdate]
      });
      await student.save();

      return { ...student.get(), isActive: student.isActive };
    },

    async deleteStudent(_, { id }, context) {
      const teacher = context.teacher;
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
      return `Student with id ${id} deleted successfully`;
    },

    async createFeesRecord(
      _,
      { studentId, studentName, amount, date_of_payment, status }, context
    ) {
      const teacher = context.teacher;
      const id = teacher.id;
      const student = await Student.findByPk(studentId);
      if (!student) throw new Error('Student not found');

      // Prepare the fees record
      const feesRecordData = {
        studentId,
        studentName,
        amount,
        date_of_payment,
        status,
        teacherId: id
      };

      try {
        // Create the FeesRecord
        const feesRecord = await FeesRecord.create(feesRecordData);

        // If successful, log the payment
        const logsToUpdate = [];
        logsToUpdate.push(`Fees of ${amount} paid on ${date_of_payment}`);

        // Update student logs
        await student.update({
          logs: [...student.logs, ...logsToUpdate]
        });

        return feesRecord; // Return the created FeesRecord
      } catch (error) {
        // Handle the error (e.g., logging or throwing a custom error)
        throw new Error('Failed to create fees record: ' + error.message);
      }
    },

    async updateFeesRecord(_, { id, amount, status }) {
      const feesRecord = await FeesRecord.findByPk(id);
      if (!feesRecord) throw new Error('FeesRecord not found');

      await feesRecord.update({
        amount: amount || feesRecord.amount,
        status: status || feesRecord.status
      });

      return feesRecord;
    }
  },
  Student: {
    feesRecords: async student => {
      return await FeesRecord.findAll({ where: { studentId: student.id } });
    }
  }
};

module.exports = resolvers;
