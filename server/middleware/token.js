const jwt = require('jsonwebtoken');

const {
  HTTP_STATUS
} = require('../utils/constantsAndFunctions');

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = { verifyToken };