const jwt = require('jsonwebtoken');

const SECRET_KEY = 'mon_secret';
const SERVER_WITH_PORT_REGEX = /^((\w){1,}\.)?\w*\.(\w){2,}(:\d{5,5})?$/;
const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};
const servers = [ 
  { host: 'mc.erisium.com', port: 25565 },
  { host: 'play.craftok.fr', port: 25565 }, 
  { host: 'funcraft.net', port: 25565 }, 
  { host: 'mc.erisium.com', port: 25565 },
  { host: 'funcraft.net', port: 25565 }, 
  { host: 'play.rinaorc.com', port: 25565 },
  { host: 'oneblockfrance.fr', port: 25565 },
  { host: 'play.hypenetwork.fr', port: 25565 },
  { host: 'mc.hypixel.net', port: 25565 },
  { host: 'play.mccisland.net', port: 25565 },
  { host: 'mc.uhcworld.fr', port: 25565 }
];

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Invalid token' });
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = {
  SECRET_KEY,
  SERVER_WITH_PORT_REGEX,
  HTTP_STATUS,
  servers,
  verifyToken
};