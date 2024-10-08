const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const FeesRecord = require('./FeesRecord');
const Teacher = require('./Teacher');
const Student = sequelize.define(
  'Student',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    joiningDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    contactInfo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^\d{10}$/,
          msg: 'Contact info must be a 10-digit mobile number.'
        },
        len: {
          args: [10, 10],
          msg: 'Contact info must be 10 digits long.'
        }
      }
    },
    class: {
      type: DataTypes.STRING,
      allowNull: false
    },
    feesAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    timeSlot: {
      type: DataTypes.ENUM(
        '7 - 8 AM',
        '8 - 9 AM',
        '9 - 10 AM',
        '10 - 11 AM',
        '11 - 12 PM',
        '12 - 1 PM',
        '1 - 2 PM',
        '2 - 3 PM',
        '3 - 4 PM',
        '4 - 5 PM',
        '5 - 6 PM',
        '6 - 7 PM',
        '7 - 8 PM',
        '8 - 9 PM',
      ),
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    
    logs: {
      type: DataTypes.JSON, // Use JSON to store an array of logs
      allowNull: true,
      defaultValue: [] // Initialize as an empty array
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true // Default to active
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Teacher, // Reference the Teacher model
        key: 'id'
      }
    }
  },
  {}
);
Student.belongsTo(Teacher, { foreignKey: 'teacherId' });

module.exports = Student;
