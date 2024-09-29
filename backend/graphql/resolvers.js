const FeesRecord = require('../models/FeesRecord');
const Student = require('../models/Student');

const resolvers = {
  Query: {
    async getStudentById(_, { id }) {
      return await Student.findByPk(id, {
        // include: FeesRecord,
        // required: false,
      });
    },
    async getAllStudents() {
      return await Student.findAll({
        // include: FeesRecord,
        // required: false,
      });
    },
    async getFeesRecords(_, { studentId }) {
      return await FeesRecord.findAll({
        where: { studentId },
      });
    },

    async studentsByTimeSlot(_, { timeSlot }) {
      const students = await Student.findAll({
        where: {
          timeSlot,
        },
      });

      return students;
    },
  },
  Mutation: {
    async createStudent(
      _,
      { name, joiningDate, contactInfo, class: className, timeSlot }
    ) {
      if (!name || !joiningDate || !contactInfo || !className || !timeSlot) {
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
        timeSlot,
      });
    },

    async updateStudent(
      _,
      { id, name, contactInfo, class: className, timeSlot }
    ) {
      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');

      await student.update({
        name: name || student.name,
        contactInfo: contactInfo || student.contactInfo,
        class: className || student.class,
        timeSlot: timeSlot || student.timeSlot,
      });

      return student;
    },

    async deleteStudent(_, { id }) {
      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');

      await student.destroy();
      return `Student with id ${id} deleted successfully`;
    },

    async createFeesRecord(_, { studentId, amount, month, year, status }) {
      return await FeesRecord.create({
        studentId,
        amount,
        month,
        year,
        status,
      });
    },

    async updateFeesRecord(_, { id, amount, status }) {
      const feesRecord = await FeesRecord.findByPk(id);
      if (!feesRecord) throw new Error('FeesRecord not found');

      await feesRecord.update({
        amount: amount || feesRecord.amount,
        status: status || feesRecord.status,
      });

      return feesRecord;
    },
  },
  Student: {
    feesRecords: async student => {
      return await FeesRecord.findAll({ where: { studentId: student.id } });
    },
  },
};

module.exports = resolvers;
