import { Router } from 'express';
import {
  createBooking, getUserBookings, getBookingById, cancelBooking
} from '../controllers/booking.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

export default router;
