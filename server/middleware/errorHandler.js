const { HTTP_STATUS } = require('../utils/constantsAndFunctions');

// middleware that should be used when no error is handled
function errorHandlers(err, req, res, next) {
  console.error(err);
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Something went wrong.'})
}

module.exports = errorHandlers;