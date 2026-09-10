import express from 'express';

// Simulated Real-time Financial Data Store for Explore Feature

const MARKET_PULSE_DATA = [
    { symbol: 'NIFTY50', name: 'Nifty 50', price: 24834.80, change: 112.40, changePercent: 0.45, currency: 'INR' },
    { symbol: 'SENSEX', name: 'BSE Sensex', price: 81452.10, change: 340.25, changePercent: 0.42, currency: 'INR' },
    { symbol: 'BANKNIFTY', name: 'Bank Nifty', price: 51210.60, change: -85.30, changePercent: -0.17, currency: 'INR' },
    { symbol: 'NASDAQ', name: 'Nasdaq 100', price: 19780.40, change: 185.60, changePercent: 0.95, currency: 'USD' },
    { symbol: 'SP500', name: 'S&P 500', price: 5648.40, change: 24.15, changePercent: 0.43, currency: 'USD' },
    { symbol: 'GOLD', name: 'Gold (24K)', price: 72450.00, unit: '/10g', change: 210.00, changePercent: 0.29, currency: 'INR' },
    { symbol: 'CRUDE', name: 'Brent Crude', price: 78.45, unit: '/bbl', change: -1.12, changePercent: -1.41, currency: 'USD' },
    { symbol: 'USDINR', name: 'USD / INR', price: 83.92, change: 0.04, changePercent: 0.05, currency: 'INR' },
    { symbol: 'BTC', name: 'Bitcoin', price: 62350.00, change: 1420.00, changePercent: 2.33, currency: 'USD' },
    { symbol: 'ETH', name: 'Ethereum', price: 2680.50, change: 84.20, changePercent: 3.24, currency: 'USD' }
];

const MOVERS_DATA = {
    gainers: [
        { symbol: 'TATASTEEL', name: 'Tata Steel Ltd', price: 156.80, change: 6.40, changePercent: 4.25 },
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2985.50, change: 78.20, changePercent: 2.69 },
        { symbol: 'ZOMATO', name: 'Zomato Ltd', price: 242.10, change: 11.30, changePercent: 4.89 },
        { symbol: 'NVDA', name: 'NVIDIA Corp', price: 128.50, change: 5.80, changePercent: 4.73 },
        { symbol: 'INFY', name: 'Infosys Ltd', price: 1892.40, change: 38.60, changePercent: 2.08 }
    ],
    losers: [
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', price: 1624.10, change: -28.40, changePercent: -1.72 },
        { symbol: 'PAYTM', name: 'One97 Communications', price: 540.20, change: -18.60, changePercent: -3.33 },
        { symbol: 'TSLA', name: 'Tesla Inc', price: 214.30, change: -7.20, changePercent: -3.25 },
        { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', price: 968.00, change: -16.50, changePercent: -1.68 },
        { symbol: 'WIPRO', name: 'Wipro Ltd', price: 512.40, change: -7.80, changePercent: -1.50 }
    ]
};

const NEWS_ARTICLES = [
    {
        id: 'news-1',
        title: 'RBI Signals Pause on Interest Rate Hikes as Retail Inflation Cools to 3.6%',
        summary: 'The Reserve Bank of India keeps the repo rate unchanged at 6.5%, citing steady decline in headline retail inflation and robust domestic consumption demand across major urban centers.',
        source: 'Economic Times',
        category: 'Economy',
        publishedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
        image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
        url: 'https://economictimes.indiatimes.com',
        sentiment: 'Positive',
        relatedSectors: ['Banking', 'Real Estate', 'Economy'],
        aiExplanation: {
            whyItMatters: 'A rate pause lowers borrowing costs for home and auto loans over time, spurring liquidity in consumer spending and boosting banking valuations.',
            learn: 'Repo rate is the benchmark interest rate at which RBI lends money to commercial banks. Lower or stable rates stimulate economic growth.'
        },
        relatedCompanies: [
            { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', currentPrice: 1624.10, change: 12.50, changePercent: 0.78 },
            { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd', currentPrice: 1210.40, change: 18.20, changePercent: 1.53 }
        ]
    },
    {
        id: 'news-2',
        title: 'Reliance Industries Announces ₹75,000 Crore Expansion into Green Hydrogen & Solar Manufacturing',
        summary: 'RIL outlines mega capital expenditure plan for Gigafactories in Jamnagar, aiming to produce green hydrogen at under $1/kg by 2030.',
        source: 'Moneycontrol',
        category: 'Companies',
        publishedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
        image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
        url: 'https://moneycontrol.com',
        sentiment: 'Positive',
        relatedSectors: ['Clean Energy', 'Oil & Gas', 'Manufacturing'],
        aiExplanation: {
            whyItMatters: 'Diversification into clean energy opens high-margin future revenue streams while de-risking traditional fossil fuel refining businesses.',
            learn: 'Capital expenditure (CapEx) indicates funds used by a company to acquire or upgrade physical assets, signaling long-term growth conviction.'
        },
        relatedCompanies: [
            { symbol: 'RELIANCE', name: 'Reliance Industries', currentPrice: 2985.50, change: 78.20, changePercent: 2.69 },
            { symbol: 'TATAPOWER', name: 'Tata Power Ltd', currentPrice: 425.60, change: 8.90, changePercent: 2.13 }
        ]
    },
    {
        id: 'news-3',
        title: 'Global Tech Stocks Rally as AI Chip Demand Exceeds Wall Street Forecasts',
        summary: 'Semiconductor manufacturers and cloud infrastructure providers surge after blowout quarterly earnings driven by enterprise AI adoption.',
        source: 'Bloomberg',
        category: 'Global Markets',
        publishedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        url: 'https://bloomberg.com',
        sentiment: 'Positive',
        relatedSectors: ['Technology', 'Semiconductors', 'AI'],
        aiExplanation: {
            whyItMatters: 'Massive capital outlays by big tech tech companies reinforce structural multi-year tailwinds for hardware and chip supply chains.',
            learn: 'Tech cycles often start with hardware infrastructure buildouts before downstream software application monetization manifests.'
        },
        relatedCompanies: [
            { symbol: 'NVDA', name: 'NVIDIA Corp', currentPrice: 128.50, change: 5.80, changePercent: 4.73 },
            { symbol: 'INFY', name: 'Infosys Ltd', currentPrice: 1892.40, change: 38.60, changePercent: 2.08 }
        ]
    },
    {
        id: 'news-4',
        title: 'SEBI Introduces Stricter Derivatives Regulations to Protect Retail Options Traders',
        summary: 'Market regulator SEBI increases contract sizes and limits weekly index options expiry products to curb speculative retail losses in F&O trading.',
        source: 'Livemint',
        category: 'Indian Markets',
        publishedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
        image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
        url: 'https://livemint.com',
        sentiment: 'Neutral',
        relatedSectors: ['Capital Markets', 'Broking', 'Regulation'],
        aiExplanation: {
            whyItMatters: 'While exchange volumes may experience short-term dampening, market integrity and long-term retail investor capital preservation will improve.',
            learn: 'Futures and Options (F&O) leverage amplified risk/reward. Regulatory circuit breakers reduce systemic volatility.'
        },
        relatedCompanies: [
            { symbol: 'BSE', name: 'BSE India Ltd', currentPrice: 2840.00, change: -95.00, changePercent: -3.24 },
            { symbol: 'MCX', name: 'Multi Commodity Exch', currentPrice: 3950.00, change: 42.00, changePercent: 1.07 }
        ]
    },
    {
        id: 'news-5',
        title: 'Gold Prices Touch Record Highs Amid Geopolitical Uncertainty and Currency Shifts',
        summary: 'Safe-haven demand pushes 24K gold past ₹72,400 per 10 grams as central banks across emerging economies accelerate bullion reserves accumulation.',
        source: 'Reuters',
        category: 'Commodities',
        publishedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80',
        url: 'https://reuters.com',
        sentiment: 'Positive',
        relatedSectors: ['Precious Metals', 'Jewellery', 'Commodities'],
        aiExplanation: {
            whyItMatters: 'Gold acts as a classic inflation hedge and store of value when fiat currencies fluctuate due to macroeconomic tensions.',
            learn: 'Asset allocation strategy recommends holding 5-10% of portfolio in sovereign gold bonds or gold ETFs for portfolio hedging.'
        },
        relatedCompanies: [
            { symbol: 'TITAN', name: 'Titan Company Ltd', currentPrice: 3450.00, change: 52.00, changePercent: 1.53 },
            { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers', currentPrice: 560.20, change: 14.80, changePercent: 2.71 }
        ]
    },
    {
        id: 'news-6',
        title: 'Flexi-Cap Mutual Funds See ₹4,500 Cr Monthly SIP Inflows in Record Retail Participation',
        summary: 'Association of Mutual Funds in India (AMFI) reports total monthly SIP contributions reaching ₹23,300 crore, reflecting disciplined long-term wealth creation by Indian households.',
        source: 'Financial Express',
        category: 'Mutual Funds',
        publishedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
        url: 'https://financialexpress.com',
        sentiment: 'Positive',
        relatedSectors: ['Asset Management', 'Financial Services', 'Personal Finance'],
        aiExplanation: {
            whyItMatters: 'Consistent SIP inflows provide strong domestic institutional buffer against foreign institutional investor (FII) outflows.',
            learn: 'Systematic Investment Plans (SIP) leverage rupee cost averaging, neutralizing short-term market volatility through automated investing.'
        },
        relatedCompanies: [
            { symbol: 'NAM-INDIA', name: 'Nippon Life India AMC', currentPrice: 685.00, change: 15.40, changePercent: 2.30 },
            { symbol: 'HDFCAMC', name: 'HDFC Asset Management', currentPrice: 4210.00, change: 68.00, changePercent: 1.64 }
        ]
    },
    {
        id: 'news-7',
        title: 'Upcoming Tech Unicorn IPO Subscribed 45x Driven by Strong Institutional Demand',
        summary: 'The initial public offering generates overwhelming response across QIB and NII categories, pointing to robust appetite for profitable new-age tech business models.',
        source: 'CNBC-TV18',
        category: 'IPO',
        publishedAt: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        url: 'https://cnbctv18.com',
        sentiment: 'Positive',
        relatedSectors: ['IPO', 'Technology', 'Venture Capital'],
        aiExplanation: {
            whyItMatters: 'High IPO oversubscription ratios reflect strong market liquidity and confidence in corporate governance and unit economics.',
            learn: 'QIB stands for Qualified Institutional Buyers while NII represents Non-Institutional Investors in primary market listings.'
        },
        relatedCompanies: [
            { symbol: 'ZOMATO', name: 'Zomato Ltd', currentPrice: 242.10, change: 11.30, changePercent: 4.89 }
        ]
    },
    {
        id: 'news-8',
        title: 'How Tax Harvesting Can Save Up to ₹12,500 on Capital Gains Under New Tax Slab Rules',
        summary: 'Financial advisors urge investors to utilize annual ₹1.25 Lakh Long Term Capital Gains (LTCG) tax exemption limit before end of financial year.',
        source: 'Business Standard',
        category: 'Personal Finance',
        publishedAt: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        url: 'https://business-standard.com',
        sentiment: 'Neutral',
        relatedSectors: ['Taxation', 'Wealth Management', 'Personal Finance'],
        aiExplanation: {
            whyItMatters: 'Tax-loss harvesting allows investors to sell holding assets at gains or losses to reset their cost base without altering long-term portfolio asset allocation.',
            learn: 'LTCG tax on equity investments applies at 12.5% on gains exceeding ₹1.25 lakh per financial year.'
        },
        relatedCompanies: []
    }
];

// Controller Handlers
export const getMarketPulse = (req, res) => {
    try {
        // Add subtle live fluctuations for realistic feel
        const pulse = MARKET_PULSE_DATA.map(item => {
            const fluctuation = (Math.random() - 0.48) * (item.price * 0.001);
            const newPrice = Number((item.price + fluctuation).toFixed(2));
            const newChange = Number((item.change + fluctuation).toFixed(2));
            return {
                ...item,
                price: newPrice,
                change: newChange
            };
        });
        res.status(200).json(pulse);
    } catch (error) {
        console.error('Error in getMarketPulse:', error);
        res.status(500).json({ error: 'Failed to fetch market pulse data' });
    }
};

export const getMovers = (req, res) => {
    try {
        res.status(200).json(MOVERS_DATA);
    } catch (error) {
        console.error('Error in getMovers:', error);
        res.status(500).json({ error: 'Failed to fetch market movers data' });
    }
};

export const getNews = (req, res) => {
    try {
        const { category } = req.query;
        if (!category || category.toLowerCase() === 'all') {
            return res.status(200).json(NEWS_ARTICLES);
        }

        const filtered = NEWS_ARTICLES.filter(article => {
            const catMatch = article.category.toLowerCase() === category.toLowerCase();
            const sectorMatch = article.relatedSectors?.some(s => s.toLowerCase().includes(category.toLowerCase()));
            return catMatch || sectorMatch;
        });

        // If specific category yields no direct match, return all articles as fallback rather than empty
        res.status(200).json(filtered.length > 0 ? filtered : NEWS_ARTICLES);
    } catch (error) {
        console.error('Error in getNews:', error);
        res.status(500).json({ error: 'Failed to fetch news articles' });
    }
};

export const searchNews = (req, res) => {
    try {
        const query = (req.query.q || '').trim().toLowerCase();
        if (!query) {
            return res.status(200).json(NEWS_ARTICLES);
        }

        const results = NEWS_ARTICLES.filter(article => {
            const titleMatch = article.title.toLowerCase().includes(query);
            const summaryMatch = article.summary.toLowerCase().includes(query);
            const sourceMatch = article.source.toLowerCase().includes(query);
            const categoryMatch = article.category.toLowerCase().includes(query);
            const sectorMatch = article.relatedSectors?.some(s => s.toLowerCase().includes(query));
            const companyMatch = article.relatedCompanies?.some(c =>
                c.symbol.toLowerCase().includes(query) || c.name.toLowerCase().includes(query)
            );
            return titleMatch || summaryMatch || sourceMatch || categoryMatch || sectorMatch || companyMatch;
        });

        res.status(200).json(results);
    } catch (error) {
        console.error('Error in searchNews:', error);
        res.status(500).json({ error: 'Failed to search news' });
    }
};
