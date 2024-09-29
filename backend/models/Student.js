const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Student = sequelize.define(
  'Student',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^\d{10}$/,
          msg: 'Contact info must be a 10-digit mobile number.',
        },
        len: {
          args: [10, 10],
          msg: 'Contact info must be 10 digits long.',
        },
      },
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeSlot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {}
);

// Student.hasMany(FeesRecord, { foreignKey: 'studentId' });
module.exports = Student;
