import React, { memo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MoversList = memo(({ title, items, isGainers }) => {
    return (
        <div className="mb-8">
            <h3 className="text-sm font-bold text-taupe uppercase tracking-wider mb-4 border-b border-beige/40 pb-2">
                {title}
            </h3>
            <div className="space-y-3">
                {items.length === 0 ? (
                    <div className="text-xs text-red-500 bg-red-50/50 p-3 rounded-lg border border-red-100 font-medium text-center">
                        Data temporarily unavailable
                    </div>
                ) : (
                    items.map(item => (
                        <div key={item.symbol} className="bg-white rounded-xl p-4 border border-beige/40 shadow-sm flex items-center justify-between hover:border-burgundy/30 transition-colors">
                            <div>
                                <div className="text-sm font-extrabold text-ink">{item.symbol}</div>
                                <div className="text-[10px] font-semibold text-taupe mt-0.5 truncate max-w-[120px]">{item.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-ink">
                                    ₹{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className={`flex items-center justify-end gap-1 text-[11px] font-bold mt-0.5 ${isGainers ? 'text-teal' : 'text-red-500'}`}>
                                    {isGainers ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                    <span>{isGainers ? '+' : ''}{item.change.toFixed(2)}</span>
                                    <span>({isGainers ? '+' : ''}{item.changePercent.toFixed(2)}%)</span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});

const Movers = ({ movers, isLoading }) => {
    if (isLoading && (!movers.gainers?.length && !movers.losers?.length)) {
        return (
            <div className="bg-white/50 p-6 rounded-3xl border border-beige/40 min-h-[500px] animate-pulse" />
        );
    }

    return (
        <div className="bg-[#Fdf8f3] sticky top-32">
            <MoversList title="Top Gainers" items={movers.gainers || []} isGainers={true} />
            <MoversList title="Top Losers" items={movers.losers || []} isGainers={false} />
        </div>
    );
};

export default memo(Movers);
