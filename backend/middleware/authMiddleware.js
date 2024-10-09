const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const SECRET_KEY = process.env.SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
console.log("authHeader", authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header is required' });
  
  }

  const token = authHeader.split(' ')[1];
if(!token){
  return res.status(401).json({ message: 'Token is required' });
}

  console.log(token);

  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    const teacher = await Teacher.findByPk(decodedToken.id);
    if (!teacher) {
      throw new Error('Invalid token or teacher does not exist.');
    }

    console.log('Authenticated teacher:', teacher.username);
    req.teacher = teacher;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message); // Log the error for debugging
    return res.status(401).json({ message: 'Authentication failed: ' + err.message });
  
  }
};

module.exports = authMiddleware;
