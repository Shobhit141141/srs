const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const SECRET_KEY = 'your_secret_key'; // Make sure this is securely stored

const authMiddleware = async (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new Error('Authorization header is missing.');
  }

  if (req.body.operationName === 'SignupTeacher' || req.body.operationName === 'LoginTeacher') {
    return {};
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const teacher = await Teacher.findByPk(decodedToken.teacherId);
    if (!teacher) {
      throw new Error('Invalid token or teacher does not exist.');
    }

    console.log('Authenticated teacher:', teacher.username);

    return teacher; // Return the authenticated teacher
  } catch (err) {
    throw new Error('Authentication failed: ' + err.message);
  }
};

module.exports = authMiddleware;
