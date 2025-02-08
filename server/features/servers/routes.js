import { Router } from 'express';
import { addServerValidations, addServer, deleteServerValidations, deleteServer, getServers, getServerValidations, getServer } from './controller';

import { verifyToken } from '../../middleware/token';

const router = Router();

router.post('', [verifyToken, addServerValidations], addServer);
router.delete('/:server_address_with_port', [verifyToken, deleteServerValidations], deleteServer);
router.get('', [verifyToken], getServers);
router.get('/:server_address_with_port', [verifyToken, getServerValidations], getServer);

export default router;