const SERVER_WITH_PORT_REGEX = /^((\w){1,}\.)?\w*\.(\w){2,}(:\d{5,5})?$/;
const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

module.exports = {
  SERVER_WITH_PORT_REGEX,
  HTTP_STATUS
};