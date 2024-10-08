const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');
const Teacher = require('./Teacher');

const FeesRecord = sequelize.define(
  'FeesRecord',
  {
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Student, // reference the Student model
        key: 'id',
      },
    },
    studentName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    date_of_payment: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Teacher,
        key: 'id',
      },
    },
  },
  {}
);

FeesRecord.belongsTo(Student, { foreignKey: 'studentId' });
FeesRecord.belongsTo(Teacher, { foreignKey: 'teacherId' });

module.exports = FeesRecord;
