const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const SECRET_KEY = 'your_secret_key'; // Make sure this is securely stored

const authMiddleware = async (resolve, parent, args, context, info) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new Error('Authorization header is missing.');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const teacher = await Teacher.findByPk(decodedToken.teacherId);
    if (!teacher) {
      throw new Error('Invalid token or teacher does not exist.');
    }

    context.teacher = teacher; // Attach the authenticated teacher to the context
    return resolve(parent, args, context, info); // Proceed to the next resolver
  } catch (err) {
    throw new Error('Authentication failed: ' + err.message);
  }
};

module.exports = authMiddleware;
