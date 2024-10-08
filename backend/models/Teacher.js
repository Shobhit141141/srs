const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Teacher = sequelize.define(
  'Teacher',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Each teacher should have a unique username
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Email should be unique
      validate: {
        isEmail: true, // Validate email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Password must be provided
    },
  },
  {}
);


module.exports = Teacher;
