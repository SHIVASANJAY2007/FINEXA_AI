import React, { useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';

const NewsDetailModal = ({ article, onClose }) => {
    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!article) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.95 }}
                className="bg-ivory w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl relative z-10 no-scrollbar flex flex-col md:flex-row"
            >
                {/* Left Side: Article Details */}
                <div className="flex-1 p-8 md:p-10 border-b md:border-b-0 md:border-r border-beige/40">
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 md:hidden w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-ink shadow-sm border border-beige/40 cursor-pointer"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-2 text-xs font-bold text-taupe uppercase tracking-wider mb-4">
                        <span>{article.source}</span>
                        <span className="w-1 h-1 rounded-full bg-taupe/40" />
                        <span>{new Date(article.publishedAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-serif font-extrabold text-ink leading-tight mb-6">
                        {article.title}
                    </h2>

                    {article.image && (
                        <div className="w-full h-64 rounded-2xl overflow-hidden mb-6">
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <p className="text-base text-ink/80 leading-relaxed font-medium mb-8">
                        {article.summary}
                    </p>

                    <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-ink hover:bg-burgundy text-white px-6 py-3 rounded-full text-xs font-extrabold uppercase tracking-widest transition-colors shadow-md cursor-pointer"
                    >
                        <span>Read Original Article</span>
                        <ExternalLink size={14} />
                    </a>
                </div>

                {/* Right Side: FINEXA AI Insights */}
                <div className="w-full md:w-[40%] bg-[#FDF8F3] p-8 md:p-10 relative">
                    <button
                        onClick={onClose}
                        className="hidden md:flex absolute top-6 right-6 w-10 h-10 bg-white rounded-full items-center justify-center text-ink shadow-sm border border-beige/40 hover:bg-beige/20 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-2 mb-6 text-burgundy">
                        <Sparkles size={18} className="animate-pulse" />
                        <h3 className="font-serif font-extrabold text-lg tracking-tight uppercase">FINEXA AI Analysis</h3>
                    </div>

                    {article.aiExplanation ? (
                        <div className="space-y-6">
                            <div className="bg-white p-5 rounded-2xl border border-beige/40 shadow-sm">
                                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-taupe mb-2">Why It Matters</h4>
                                <p className="text-sm text-ink font-medium leading-relaxed">
                                    {article.aiExplanation.whyItMatters}
                                </p>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-beige/40 shadow-sm border-l-4 border-l-gold">
                                <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-gold mb-2">Learn From This</h4>
                                <p className="text-sm text-ink font-medium leading-relaxed">
                                    {article.aiExplanation.learn}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm text-taupe italic bg-white p-5 rounded-2xl border border-beige/40">
                            AI analysis currently unavailable for this article.
                        </div>
                    )}

                    {article.sentiment && (
                        <div className="mt-6 bg-white p-5 rounded-2xl border border-beige/40 shadow-sm">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-taupe mb-3">Market Impact</h4>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${article.sentiment === 'Positive' ? 'bg-teal/10 text-teal-800' :
                                article.sentiment === 'Negative' ? 'bg-red-50 text-red-900' :
                                    'bg-beige/30 text-ink'
                                }`}>
                                {article.sentiment === 'Positive' && <TrendingUp size={16} />}
                                {article.sentiment === 'Negative' && <TrendingDown size={16} />}
                                {article.sentiment === 'Neutral' && <Minus size={16} />}
                                {article.sentiment}
                            </div>
                        </div>
                    )}

                    {article.relatedCompanies && article.relatedCompanies.length > 0 && (
                        <div className="mt-6">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-taupe mb-3">Affected Companies</h4>
                            <div className="space-y-3">
                                {article.relatedCompanies.map(company => {
                                    const isPositive = company.change >= 0;
                                    return (
                                        <div key={company.symbol} className="bg-white p-4 rounded-xl border border-beige/40 flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-extrabold text-ink">{company.symbol}</div>
                                                <div className="text-[10px] text-taupe">{company.name}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-ink">₹{company.currentPrice.toFixed(2)}</div>
                                                <div className={`text-[10px] font-bold ${isPositive ? 'text-teal' : 'text-red-500'}`}>
                                                    {isPositive ? '+' : ''}{company.changePercent.toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default memo(NewsDetailModal);
