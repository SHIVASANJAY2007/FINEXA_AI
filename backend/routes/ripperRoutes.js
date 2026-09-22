import express from 'express';
import { classifyWithRIPPER } from '../controllers/ripperController.js';

const router = express.Router();

router.post('/classify', classifyWithRIPPER);
router.post('/optimize', classifyWithRIPPER);

export default router;
