const express = require('express');
const ServerController = require('./controller');

const {
  verifyToken
} = require('../../middleware/token');

const router = express.Router();

router.post('', [verifyToken, ServerController.addServerValidations], ServerController.addServer);
router.delete('/:server_address_with_port', [verifyToken, ServerController.deleteServerValidations], ServerController.deleteServer);
router.get('', [verifyToken], ServerController.getServers);
router.get('/:server_address_with_port', [verifyToken, ServerController.getServerValidations], ServerController.getServer);

module.exports = router;