import { Router } from 'express';
import { getAllSamagri, placeSamagriOrder } from '../controllers/samagri.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getAllSamagri);
router.post('/order', authenticate, placeSamagriOrder);

export default router;
