import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import NewsDetailModal from './NewsDetailModal';

const NewsCard = memo(({ article, onClick }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => onClick(article)}
            className="bg-white rounded-3xl border border-beige/40 overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col h-full"
        >
            <div className="relative h-48 sm:h-56 overflow-hidden bg-cream">
                {article.image ? (
                    <img 
                        src={article.image} 
                        alt={article.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-taupe/40 font-serif text-2xl font-extrabold italic bg-gradient-to-br from-beige/20 to-burgundy/5">
                        FINEXA
                    </div>
                )}
                <div className="absolute top-4 left-4 bg-ink/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {article.category}
                </div>
                {article.sentiment && (
                    <div className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md ${
                        article.sentiment === 'Positive' ? 'bg-teal/20 text-teal-800 border border-teal/30' :
                        article.sentiment === 'Negative' ? 'bg-red-500/20 text-red-900 border border-red-500/30' :
                        'bg-white/30 text-ink border border-white/40'
                    }`}>
                        {article.sentiment}
                    </div>
                )}
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-taupe uppercase tracking-wider mb-3">
                        <span>{article.source}</span>
                        <span className="w-1 h-1 rounded-full bg-taupe/40" />
                        <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <h3 className="text-lg font-serif font-extrabold text-ink leading-tight mb-3 group-hover:text-burgundy transition-colors">
                        {article.title}
                    </h3>
                    <p className="text-sm text-taupe/90 font-medium line-clamp-3 mb-4">
                        {article.summary}
                    </p>
                </div>
                
                {article.relatedSectors && article.relatedSectors.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-beige/40">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-taupe mb-2">Affected Sectors</div>
                        <div className="flex flex-wrap gap-2">
                            {article.relatedSectors.map(sector => (
                                <span key={sector} className="text-[10px] font-semibold bg-beige/30 text-ink px-2 py-1 rounded-md">
                                    {sector}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
});

const NewsFeed = ({ news, isLoading }) => {
    const [selectedArticle, setSelectedArticle] = useState(null);

    if (isLoading && news.length === 0) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-96 bg-white/50 animate-pulse rounded-3xl border border-beige/40" />
                ))}
            </div>
        );
    }

    if (news.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-beige/40 border-dashed">
                <AlertCircle size={32} className="mx-auto text-taupe/50 mb-3" />
                <p className="font-bold text-ink">No relevant financial news found.</p>
                <p className="text-sm text-taupe mt-1">Try another category or search.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <AnimatePresence>
                    {news.map(article => (
                        <NewsCard key={article.id} article={article} onClick={setSelectedArticle} />
                    ))}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {selectedArticle && (
                    <NewsDetailModal 
                        article={selectedArticle} 
                        onClose={() => setSelectedArticle(null)} 
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default memo(NewsFeed);
