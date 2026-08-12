import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MarketPulse = ({ data, isLoading }) => {
    if (isLoading && data.length === 0) {
        return (
            <div className="flex gap-4 overflow-x-hidden">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="min-w-[200px] h-24 bg-white/50 animate-pulse rounded-2xl border border-beige/40" />
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 snap-x">
            {data.map((item, idx) => {
                const isPositive = item.change >= 0;
                return (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={item.symbol} 
                        className={`min-w-[220px] snap-start bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-between transition-shadow ${item.price === 0 ? 'border-red-200 bg-red-50/30' : 'border-beige/40 hover:shadow-md'}`}
                    >
                        <div className="text-xs font-bold text-taupe uppercase tracking-wider mb-2">
                            {item.name}
                        </div>
                        <div>
                            {item.price === 0 ? (
                                <div>
                                    <div className="text-xl font-extrabold text-taupe">N/A</div>
                                    <div className="text-xs font-medium mt-1 text-red-500">Temporarily unavailable</div>
                                </div>
                            ) : (
                                <div>
                                    <div className="text-xl font-extrabold text-ink flex items-baseline gap-1">
                                        {item.currency === 'INR' ? '₹' : item.currency === 'USD' ? '$' : ''}
                                        {item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        {item.unit && <span className="text-xs font-semibold text-taupe/70">{item.unit}</span>}
                                    </div>
                                    <div className={`flex items-center gap-1.5 text-xs font-bold mt-1 ${isPositive ? 'text-teal' : 'text-red-500'}`}>
                                        {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                        <span>{isPositive ? '+' : ''}{item.change.toFixed(2)}</span>
                                        <span>({isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%)</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default memo(MarketPulse);
