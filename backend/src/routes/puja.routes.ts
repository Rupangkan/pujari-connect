import { Router } from 'express';
import {
  getAllPujas, getPujaById, getFeaturedPujas, getPujaCategories
} from '../controllers/puja.controller';

const router = Router();

router.get('/featured', getFeaturedPujas);
router.get('/categories', getPujaCategories);
router.get('/', getAllPujas);
router.get('/:id', getPujaById);

export default router;
