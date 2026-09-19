import express from 'express';
import { generateReport, checkBIStatus } from '../controllers/biController.js';

const router = express.Router();

router.post('/report', generateReport);
router.get('/status', checkBIStatus);

export default router;
