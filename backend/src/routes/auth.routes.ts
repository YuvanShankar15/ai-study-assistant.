import { Router } from 'express';
import { getMe, register, login } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);

export default router;
