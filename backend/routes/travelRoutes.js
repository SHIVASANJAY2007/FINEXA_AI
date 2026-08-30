import express from 'express';
import { createPlan, getUserPlans, getPlanById, updatePlan, deletePlan } from '../controllers/travelController.js';

const router = express.Router();

router.post('/', createPlan);
router.get('/user/:personId', getUserPlans);
router.get('/:id', getPlanById);
router.put('/:id', updatePlan);
router.delete('/:id', deletePlan);

export default router;
