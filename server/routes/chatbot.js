import express from 'express';
import * as chatbotController from '../controllers/chatbotController.js';

const router = express.Router();

router.get('/start', chatbotController.startChat);
router.post('/session', chatbotController.createSession);
router.post('/next', chatbotController.getNextQuestion);
router.post('/progress', chatbotController.updateChecklistProgress);
router.get('/session/:sessionId', chatbotController.getSession);

export default router;
