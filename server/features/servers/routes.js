const express = require('express');
const serverController = require('./controller');

const {
  verifyToken
} = require('../../utils/constantsAndFunctions');

const router = express.Router();

router.get("/:server_address_with_port", verifyToken, serverController.getServer);
router.get("/", verifyToken, serverController.getServers);

module.exports = router;