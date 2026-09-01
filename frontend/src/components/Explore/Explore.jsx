import React, { useState, useEffect, useCallback } from 'react';
import { Search, Info, AlertTriangle } from 'lucide-react';
import MarketPulse from './MarketPulse';
import NewsFeed from './NewsFeed';
import Movers from './Movers';

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'}/explore`;

const CATEGORIES = [
    "All", "Indian Markets", "Global Markets", "Stocks", "Companies",
    "Investments", "Mutual Funds", "IPO", "Economy", "Banking",
    "Commodities", "Currency", "Personal Finance"
];

const Explore = () => {
    const [marketPulse, setMarketPulse] = useState([]);
    const [news, setNews] = useState([]);
    const [movers, setMovers] = useState({ gainers: [], losers: [] });
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (category = 'All', search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch Market Pulse
            const pulseRes = await fetch(`${API_BASE_URL}/market-pulse`);
            if (pulseRes.ok) setMarketPulse(await pulseRes.json());

            // Fetch Movers
            const moversRes = await fetch(`${API_BASE_URL}/movers`);
            if (moversRes.ok) setMovers(await moversRes.json());

            // Fetch News
            let newsUrl = `${API_BASE_URL}/news?category=${encodeURIComponent(category)}`;
            if (search) {
                newsUrl = `${API_BASE_URL}/search?q=${encodeURIComponent(search)}`;
            }
            const newsRes = await fetch(newsUrl);
            if (newsRes.ok) {
                setNews(await newsRes.json());
            } else {
                throw new Error('Failed to fetch news');
            }
        } catch (err) {
            console.error('Error fetching explore data:', err);
            setError('Market data temporarily unavailable. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(activeCategory, searchQuery);
        }, searchQuery ? 600 : 0);
        return () => clearTimeout(timer);
    }, [activeCategory, searchQuery, fetchData]);

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="min-h-screen bg-ivory text-ink font-sans pb-20">
            {/* Header */}
            <div className="bg-ivory border-b border-beige/40 px-6 sm:px-12 py-8 pt-24 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto mb-6">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="flex items-center gap-2 text-taupe hover:text-ink transition-colors text-sm font-semibold uppercase tracking-wider cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        Back to Home
                    </button>
                </div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-serif font-extrabold text-ink tracking-tight uppercase">
                            Explore
                        </h1>
                        <p className="text-taupe font-medium mt-2 text-sm sm:text-base">
                            Understand what's happening in the financial world.
                        </p>
                        <div className="flex items-center gap-2 mt-4 text-xs font-semibold text-teal bg-teal/10 px-3 py-1.5 rounded-full w-fit">
                            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                            Markets Open • Updated {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search finance news... (e.g., Reliance, RBI)"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="w-full bg-white border border-beige/60 focus:border-burgundy focus:ring-1 focus:ring-burgundy rounded-full px-5 py-3 pl-11 text-sm outline-none transition-all"
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe/70" />
                    </div>
                </div>
            </div>

            {error && (
                <div className="max-w-7xl mx-auto mt-8 px-6 sm:px-12">
                    <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-start gap-3">
                        <AlertTriangle size={20} className="shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-sm">Unable to refresh market data.</p>
                            <p className="text-xs mt-1">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-8">
                {/* Market Pulse (Horizontal Scroll) */}
                <MarketPulse data={marketPulse} isLoading={isLoading} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    {/* Main Content (News) */}
                    <div className="lg:col-span-2">
                        {/* Categories */}
                        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setSearchQuery(''); }}
                                    className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${activeCategory === cat
                                            ? 'bg-ink text-white shadow-md'
                                            : 'bg-white text-taupe border border-beige/40 hover:bg-beige/20'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <h2 className="text-2xl font-serif font-extrabold text-ink uppercase tracking-tight mb-6">
                            Trending Now
                        </h2>
                        <NewsFeed news={news} isLoading={isLoading} />
                    </div>

                    {/* Sidebar (Movers) */}
                    <div className="lg:col-span-1">
                        <Movers movers={movers} isLoading={isLoading} />
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="max-w-7xl mx-auto px-6 sm:px-12 mt-16 pt-8 border-t border-beige/40 text-center">
                <p className="text-[10px] sm:text-xs text-taupe/70 font-medium max-w-3xl mx-auto flex items-center justify-center gap-2">
                    <Info size={14} className="shrink-0" />
                    BIZRA provides financial information and educational content for informational purposes only. Market data, news interpretations and AI-generated insights may be delayed or inaccurate and should not be considered personalized investment advice.
                </p>
            </div>
        </div>
    );
};

export default Explore;
