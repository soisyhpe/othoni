const jwt = require('jsonwebtoken');
const logger = require('../../middleware/logger');

const {
  SECRET_KEY,
  HTTP_STATUS
} = require('../../utils/constantsAndFunctions');

// curl -s -X POST -H 'Accept: application/json' -H 'Content-Type: application/json' --data '{"username":"soisyhpe","password":"okx*jo4PDUF*ydfk.xTK","rememberMe":true}' http://localhost:3000/api/v1/authorizations/login
const users = [
  { id: 1, username: 'soisyhpe', password: 'okx*jo4PDUF*ydfk.xTK'}
]

// Route to authenticate and generate JWT token
function login(req, res) {
  const { username, password } = req.body;
  logger.info(`Attempting login for username: ${username}`);

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    logger.warn(`Login failed for username: ${username}`);
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Authentication failed' });
  }

  logger.info(`Login successful for username: ${username}`);
  const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
}

module.exports = { login };