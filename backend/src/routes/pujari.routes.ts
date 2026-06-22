import { Router } from 'express';
import { getAllPujaris, getPujariById, getFeaturedPujaris } from '../controllers/pujari.controller';

const router = Router();

router.get('/featured', getFeaturedPujaris);
router.get('/', getAllPujaris);
router.get('/:id', getPujariById);

export default router;
