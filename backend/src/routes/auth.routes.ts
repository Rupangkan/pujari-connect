import { Router } from 'express';
import { sendOtp, verifyOtp, googleSignIn, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/google', googleSignIn);
router.get('/me', authenticate, getMe);

export default router;
