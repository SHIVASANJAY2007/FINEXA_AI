import express from 'express';
import { classifyWithRIPPER } from '../controllers/ripperController.js';

const router = express.Router();

router.post('/optimize', classifyWithRIPPER);
router.post('/classify', classifyWithRIPPER);

export default router;
