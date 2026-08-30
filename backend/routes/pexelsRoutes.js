import express from 'express';
import { getMedia } from '../controllers/pexelsController.js';

const router = express.Router();

router.get('/media', getMedia);

export default router;
