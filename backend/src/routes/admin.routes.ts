import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import {
  adminLogin,
  getResources,
  getStats,
  listResource,
  getResourceItem,
  createResourceItem,
  updateResourceItem,
  removeResourceItem,
} from '../controllers/admin.controller';

const router = Router();

// Public: obtain an admin token with username/password
router.post('/login', adminLogin);

// Everything below requires a valid ADMIN token
router.use(authenticate, authorize('ADMIN'));

router.get('/resources', getResources);
router.get('/stats', getStats);

router.get('/:resource', listResource);
router.get('/:resource/:id', getResourceItem);
router.post('/:resource', createResourceItem);
router.put('/:resource/:id', updateResourceItem);
router.delete('/:resource/:id', removeResourceItem);

export default router;
