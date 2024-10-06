const FeesRecord = require('../models/FeesRecord');
const Student = require('../models/Student');
const { Op } = require('sequelize');
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
        where: { studentId }
      });
    },

    async studentsByTimeSlot(_, { timeSlot }) {
      const students = await Student.findAll({
        where: {
          timeSlot
        }
      });

      return students;
    },

    async getMonthlyFeesReport(_, { year, month }) {
      // Calculate the start and end of the month
      const startDate = new Date(year, month - 1, 1); // First day of the month
      const endDate = new Date(year, month, 0); // Last day of the month

      // Fetch all fees records for the specified month
      const feesRecords = await FeesRecord.findAll({
        where: {
          date_of_payment: {
            [Op.between]: [startDate, endDate]
          }
        }
      });

      // Get the student IDs who have paid fees
      const paidStudentIds = feesRecords.map(record => record.studentId);

      // Fetch students who haven't paid fees in the given month
      const unpaidStudents = await Student.findAll({
        where: {
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
    }
  },
  Mutation: {
    async createStudent(_, { input }) {
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
        !feesAmount ||
        !notes
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
        notes,
        timeSlot,
        logs: [`Student created: ${name}`]
      });
    },

    async updateStudent(
      _,
      { id, name, contactInfo, class: className, feesAmount, notes, timeSlot }
    ) {
      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');

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

    async toggleStudentActive(_, { id }) {
      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');
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

 
    async deleteStudent(_, { id }) {
      const feesRecords = await FeesRecord.findAll({
        where: { studentId: id }
      });
      await Promise.all(feesRecords.map(record => record.destroy()));

      const student = await Student.findByPk(id);
      if (!student) throw new Error('Student not found');

      await student.destroy();
      return `Student with id ${id} deleted successfully`;
    },

    async createFeesRecord(
      _,
      { studentId, studentName, amount, date_of_payment, status }
    ) {
      console.log(studentName);
      return await FeesRecord.create({
        studentId,
        studentName,
        amount,
        date_of_payment,
        status
      });
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
