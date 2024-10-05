const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = require('./Student');

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
  },
  {}
);

FeesRecord.belongsTo(Student, { foreignKey: 'studentId' });

module.exports = FeesRecord;
