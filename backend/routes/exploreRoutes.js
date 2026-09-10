import express from 'express';
import { getMarketPulse, getMovers, getNews, searchNews } from '../controllers/exploreController.js';

const router = express.Router();

router.get('/market-pulse', getMarketPulse);
router.get('/movers', getMovers);
router.get('/news', getNews);
router.get('/search', searchNews);

export default router;
