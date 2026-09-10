import {
    getLiveMarketPulse,
    getLiveMovers,
    getAggregatedNews
} from '../services/exploreService.js';

export const getMarketPulse = async (req, res) => {
    try {
        const pulse = await getLiveMarketPulse();
        res.status(200).json(pulse);
    } catch (error) {
        console.error('Error in getMarketPulse controller:', error);
        res.status(500).json({ error: 'Failed to fetch market pulse data' });
    }
};

export const getMovers = async (req, res) => {
    try {
        const movers = await getLiveMovers();
        res.status(200).json(movers);
    } catch (error) {
        console.error('Error in getMovers controller:', error);
        res.status(500).json({ error: 'Failed to fetch market movers data' });
    }
};

export const getNews = async (req, res) => {
    try {
        const category = req.query.category || 'All';
        const news = await getAggregatedNews(category, '');
        res.status(200).json(news);
    } catch (error) {
        console.error('Error in getNews controller:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
};

export const searchNews = async (req, res) => {
    try {
        const query = req.query.q || '';
        const news = await getAggregatedNews('All', query);
        res.status(200).json(news);
    } catch (error) {
        console.error('Error in searchNews controller:', error);
        res.status(500).json({ error: 'Failed to search news' });
    }
};
