import { Router } from 'express';
import multer from 'multer';
import { onboardingChat, parseTimetable, chatEndpoint, generateResources } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/onboarding', requireAuth, onboardingChat);
router.post('/timetable', requireAuth, upload.single('file'), parseTimetable);
router.post('/chat', requireAuth, chatEndpoint);
router.get('/resources', requireAuth, generateResources);

export default router;
