import { Router } from 'express';
import {
  updateProfile,
  getAddresses, addAddress, deleteAddress,
  getWishlist, toggleWishlist
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.patch('/profile', updateProfile);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.delete('/addresses/:id', deleteAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:pujaId', toggleWishlist);

export default router;
