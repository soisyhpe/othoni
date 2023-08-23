const express = require('express');
const ServerController = require('./controller');

const {
  verifyToken
} = require('../../middleware/token');

const router = express.Router();

router.post('', verifyToken, ServerController.addServer);
router.delete('/:server_address_with_port', verifyToken, ServerController.deleteServer);
router.get('', verifyToken, ServerController.getServers);
router.get('/:server_address_with_port', verifyToken, ServerController.getServer);

module.exports = router;