import express from 'express';
import { optimizeWithGWO } from '../controllers/gwoController.js';

const router = express.Router();

router.post('/optimize', optimizeWithGWO);

export default router;
