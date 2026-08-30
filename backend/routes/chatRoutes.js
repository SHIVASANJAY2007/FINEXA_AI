import express from 'express';
import { sendMessage, checkStatus, getHistory } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/status', checkStatus);
router.get('/history/:sessionId', getHistory);

export default router;
