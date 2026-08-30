import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink, Bookmark, Calendar, Sunrise, Sun, Sunset, Moon,
    Info, AlertTriangle, CheckCircle, AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import {
    ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line,
    PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

// Helper to check image extension or unsplash sources
const isImageUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)/i) || 
           url.includes('images.unsplash.com') ||
           url.includes('pexels.com/photo') ||
           url.includes('images.pexels.com');
};

// Helper to check video platform URLs
const isVideoUrl = (url) => {
    if (!url) return false;
    return url.match(/\.(mp4|webm|ogg)/i) || 
           url.includes('youtube.com') || 
           url.includes('youtu.be') || 
           url.includes('vimeo.com');
};

// Regex constants for the parsing engine
const dayHeaderRegex = /^(?:#+\s+|\*\*|)\b(Day\s+\d+|DAY\s+\d+)\b(?:\s*[:\-]\s*|\s+)(.*?)(?:\*\*|)$/i;
const timeSegmentRegex = /^\s*[\-\*\d\.\+\s]*\*\*?(Morning|Afternoon|Evening|Night)(?:\s*\([^)]+\))?\*\*?:?\s*(.*?)\s*$/i;
const calloutRegex = /^(?:💡|⚠️|🚨|ℹ️|🛑|📌|👉)?\s*\*\*?(Tip|Warning|Important|Note|Remember|Caution|Alert|Success|Info)\*\*?\s*:\s*(.*?)$/i;
const planHeaderRegex = /^(?:#+\s+|\*\*|)\b(Plan\s+\d+|Option\s+[A-Z])\b(?:\s*[:\-]\s*|\s+)(.*?)(?:\*\*|)$/i;
const sourcesHeaderRegex = /^(?:#+\s+|\*\*|)(Sources|References|Citations)(?:\s*[:\-]\s*|\s*)(?:\*\*|)$/i;
const sourceLinkRegex = /^\s*[\-\*\d\.\+\s]*(?:\[(.*?)\]\((.*?)\)|(https?:\/\/[^\s]+))\s*$/i;

// Preprocessing text (separates lists that are squeezed together with emojis)
const preprocessBotReplyText = (text) => {
    if (!text) return '';
    
    let lines = text.split('\n');
    let processedLines = lines.map(line => {
        let currentLine = line;
        
        // 1. Split on keycaps 1️⃣ to 10️⃣ and list bullets (✨, 💡, ⭐️) preceded by non-whitespace
        const generalListRegex = /([^\s])\s*((?:[1-9]|10)️⃣|✨|💡|⭐️)\s+/g;
        currentLine = currentLine.replace(generalListRegex, '$1\n- $2 ');
        
        // 2. Split on activity emojis followed by titles and colons/dashes
        const titleListRegex = /([^\s])\s*(🏄|🌿|🏛️|🛍️|🍴|👤|🏨|🎟️|🎡|🚕|🚗|🚌|💰|💵|🗺️|🏔️|🏝️|⛺|🚂|✈️|⏱️|🎒)\s+([A-Za-z0-9\s&]+?)(:|–|-)\s+/g;
        currentLine = currentLine.replace(titleListRegex, '$1\n- $2 $3$4 ');
        
        return currentLine;
    });
    
    // Eliminate consecutive horizontal rule lines
    let filteredLines = [];
    let lastWasHr = false;
    for (let i = 0; i < processedLines.length; i++) {
        const line = processedLines[i];
        if (/^\s*([-*_])\s*(?:\1\s*){2,}\s*$/.test(line)) {
            if (lastWasHr) continue;
            lastWasHr = true;
        } else {
            lastWasHr = false;
        }
        filteredLines.push(line);
    }
    
    return filteredLines.join('\n');
};

// Inline markdown styling parser (links, bold, currency highlights)
const parseInlineStyles = (inputText) => {
    if (!inputText) return null;
    
    const currencyRegex = /([₹$€£])/g;
    let tokens = [{ type: 'text', value: inputText }];
    
    // Parse Links: [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    let nextTokens = [];
    for (let token of tokens) {
        if (token.type !== 'text') {
            nextTokens.push(token);
            continue;
        }
        let lastIndex = 0;
        let match;
        linkRegex.lastIndex = 0;
        while ((match = linkRegex.exec(token.value)) !== null) {
            const before = token.value.substring(lastIndex, match.index);
            if (before) nextTokens.push({ type: 'text', value: before });
            nextTokens.push({ type: 'link', text: match[1], url: match[2] });
            lastIndex = linkRegex.lastIndex;
        }
        const after = token.value.substring(lastIndex);
        if (after) nextTokens.push({ type: 'text', value: after });
    }
    tokens = nextTokens;
    
    // Parse Bold: **text**
    nextTokens = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    for (let token of tokens) {
        if (token.type !== 'text') {
            nextTokens.push(token);
            continue;
        }
        let lastIndex = 0;
        let match;
        boldRegex.lastIndex = 0;
        while ((match = boldRegex.exec(token.value)) !== null) {
            const before = token.value.substring(lastIndex, match.index);
            if (before) nextTokens.push({ type: 'text', value: before });
            nextTokens.push({ type: 'bold', value: match[1] });
            lastIndex = boldRegex.lastIndex;
        }
        const after = token.value.substring(lastIndex);
        if (after) nextTokens.push({ type: 'text', value: after });
    }
    tokens = nextTokens;

    // Parse Currency symbols: ₹, $, €, £
    nextTokens = [];
    for (let token of tokens) {
        if (token.type !== 'text') {
            nextTokens.push(token);
            continue;
        }
        let lastIndex = 0;
        let match;
        currencyRegex.lastIndex = 0;
        while ((match = currencyRegex.exec(token.value)) !== null) {
            const before = token.value.substring(lastIndex, match.index);
            if (before) nextTokens.push({ type: 'text', value: before });
            nextTokens.push({ type: 'currency', value: match[1] });
            lastIndex = currencyRegex.lastIndex;
        }
        const after = token.value.substring(lastIndex);
        if (after) nextTokens.push({ type: 'text', value: after });
    }
    tokens = nextTokens;
    
    return tokens.map((token, idx) => {
        if (token.type === 'link') {
            return (
                <a 
                    key={idx} 
                    href={token.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-burgundy hover:text-gold font-bold underline inline-flex items-center gap-0.5 group/link"
                >
                    {token.text}
                    <ExternalLink size={10} className="inline transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                </a>
            );
        }
        if (token.type === 'bold') {
            return <strong key={idx} className="font-extrabold text-ink">{parseInlineStyles(token.value)}</strong>;
        }
        if (token.type === 'currency') {
            return <span key={idx} className="text-gold font-extrabold select-none mx-0.5">{token.value}</span>;
        }
        return token.value;
    });
};

// Markdown block rendering (renders paragraphs, lists, headers, etc.)
// Markdown block rendering using ReactMarkdown for robust tables, lists, and headers
const MarkdownBlock = ({ block }) => {
    return (
        <div className="markdown-block text-ink text-xs sm:text-sm leading-relaxed space-y-4">
            <ReactMarkdown 
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                    h1: ({node, ...props}) => <h1 className="font-serif font-extrabold text-xl sm:text-2xl text-ink mt-6 mb-3 border-b border-beige/35 pb-2 text-left" {...props} />,
                    h2: ({node, ...props}) => <h2 className="font-serif font-extrabold text-lg sm:text-xl text-ink mt-5 mb-2.5 text-left" {...props} />,
                    h3: ({node, ...props}) => <h3 className="font-serif font-bold text-base sm:text-lg text-ink mt-4 mb-2 text-left" {...props} />,
                    h4: ({node, ...props}) => <h4 className="font-sans font-extrabold text-xs sm:text-sm uppercase tracking-wider text-taupe mt-3 mb-1.5 text-left" {...props} />,
                    p: ({node, ...props}) => <p className="mb-3.5 text-ink leading-relaxed font-medium text-left" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1.5 text-ink font-medium text-left marker:text-burgundy" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1.5 text-ink font-medium text-left marker:text-burgundy" {...props} />,
                    li: ({node, ...props}) => <li className="pl-0.5 text-ink" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-extrabold text-ink font-bold" {...props} />,
                    hr: ({node, ...props}) => <hr className="my-6 border-t border-beige/45" {...props} />,
                    a: ({node, ...props}) => (
                        <a 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-burgundy hover:text-gold font-bold underline inline-flex items-center gap-0.5 group/link"
                            {...props}
                        />
                    ),
                    table: ({node, ...props}) => (
                        <div className="my-5 overflow-x-auto rounded-xl border border-beige/45 shadow-sm">
                            <table className="min-w-full divide-y divide-beige/40 text-left border-collapse" {...props} />
                        </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-cream/40" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="divide-y divide-beige/25 bg-white" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-cream/10 transition-colors" {...props} />,
                    th: ({node, ...props}) => <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-ink font-sans" {...props} />,
                    td: ({node, ...props}) => <td className="px-4 py-3 text-xs sm:text-sm text-taupe font-semibold" {...props} />,
                    blockquote: ({node, ...props}) => (
                        <blockquote className="border-l-4 border-burgundy/40 pl-4 py-1 my-4 italic text-taupe bg-cream/15 rounded-r-lg" {...props} />
                    ),
                    code: ({node, inline, className, children, ...props}) => {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline ? (
                            <pre className="bg-cream/30 p-4 rounded-xl border border-beige/25 overflow-x-auto font-mono text-xs text-ink my-4">
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            </pre>
                        ) : (
                            <code className="bg-cream/50 px-1.5 py-0.5 rounded font-mono text-xs text-burgundy font-bold" {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {block.content}
            </ReactMarkdown>
        </div>
    );
};

// Candlestick stock chart using Recharts
const CandlestickChart = ({ data }) => {
    if (!data || data.length === 0) return null;
    const chartData = data.map(item => {
        const isOpenCloseUp = item.close >= item.open;
        return {
            ...item,
            wick: [item.low, item.high],
            body: [Math.min(item.open, item.close), Math.max(item.open, item.close)],
            color: isOpenCloseUp ? '#10B981' : '#EF4444' // Green or Red
        };
    });

    return (
        <div className="h-[250px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                    <XAxis dataKey="time" stroke="#8a7a6e" fontSize={10} />
                    <YAxis domain={['auto', 'auto']} stroke="#8a7a6e" fontSize={10} />
                    <Tooltip 
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const d = payload[0].payload;
                                return (
                                    <div className="bg-white/95 backdrop-blur border border-beige/45 p-3 rounded-xl shadow-lg font-sans text-xs">
                                        <p className="font-extrabold text-ink mb-1">{d.time}</p>
                                        <p className="font-semibold text-taupe">Open: <span className="text-ink font-bold">₹{d.open}</span></p>
                                        <p className="font-semibold text-taupe">High: <span className="text-ink font-bold">₹{d.high}</span></p>
                                        <p className="font-semibold text-taupe">Low: <span className="text-ink font-bold">₹{d.low}</span></p>
                                        <p className="font-semibold text-taupe">Close: <span className="text-ink font-bold">₹{d.close}</span></p>
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="wick" fill="#a89a90" barSize={1.5} />
                    <Bar dataKey="body" barSize={10}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

// SIP Calculator component
const SipCalculator = () => {
    const [monthlyInv, setMonthlyInv] = useState(10000);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(10);

    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const totalInvested = monthlyInv * months;
    const futureValue = Math.round(monthlyInv * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    const estReturns = futureValue - totalInvested;

    const chartData = [
        { name: 'Invested Amount', value: totalInvested, color: '#6B1E2B' },
        { name: 'Est. Returns', value: estReturns, color: '#C5A880' }
    ];

    return (
        <div className="bg-cream/10 border border-beige/45 rounded-2xl p-5 sm:p-6 my-6 shadow-sm font-sans text-left">
            <h4 className="font-serif font-extrabold text-sm uppercase tracking-wider text-burgundy mb-5 border-b border-beige/35 pb-2">
                🧮 Interactive SIP Calculator
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs font-bold text-ink mb-1.5">
                            <span>Monthly Investment</span>
                            <span className="text-burgundy">₹{monthlyInv.toLocaleString('en-IN')}</span>
                        </div>
                        <input 
                            type="range" 
                            min="500" 
                            max="100000" 
                            step="500" 
                            value={monthlyInv} 
                            onChange={(e) => setMonthlyInv(Number(e.target.value))}
                            className="w-full accent-burgundy h-1 bg-beige/40 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-ink mb-1.5">
                            <span>Expected Return Rate (p.a.)</span>
                            <span className="text-burgundy">{rate}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="30" 
                            step="0.5" 
                            value={rate} 
                            onChange={(e) => setRate(Number(e.target.value))}
                            className="w-full accent-burgundy h-1 bg-beige/40 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold text-ink mb-1.5">
                            <span>Time Period (Years)</span>
                            <span className="text-burgundy">{years} Yr</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="30" 
                            step="1" 
                            value={years} 
                            onChange={(e) => setYears(Number(e.target.value))}
                            className="w-full accent-burgundy h-1 bg-beige/40 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="h-[120px] w-[120px] shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={50}
                                    paddingAngle={3}
                                    dataKey="value"
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    
                    <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-burgundy shrink-0" />
                            <span className="text-xs text-taupe font-semibold">Invested Amount:</span>
                            <span className="text-xs text-ink font-extrabold">₹{totalInvested.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded bg-gold shrink-0" />
                            <span className="text-xs text-taupe font-semibold">Est. Returns:</span>
                            <span className="text-xs text-ink font-extrabold">₹{estReturns.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t border-beige/35 pt-2 mt-1">
                            <span className="text-xs text-taupe font-semibold block">Total Value:</span>
                            <span className="text-base text-burgundy font-black">₹{futureValue.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Risk Meter component
const RiskMeter = ({ level }) => {
    const riskLevels = ['Low', 'Moderate', 'Medium', 'High', 'Aggressive'];
    const cleanLevel = level ? level.trim().toLowerCase() : 'moderate';
    let activeIdx = 1;
    if (cleanLevel.includes('low')) activeIdx = 0;
    else if (cleanLevel.includes('moderate')) activeIdx = 1;
    else if (cleanLevel.includes('medium')) activeIdx = 2;
    else if (cleanLevel.includes('high')) activeIdx = 3;
    else if (cleanLevel.includes('aggressive')) activeIdx = 4;

    const descriptions = [
        "Suitable for capital preservation with low volatility.",
        "Mild risk, balance of fixed income and stable stocks.",
        "Moderate growth focus, medium fluctuation expected.",
        "Aggressive growth with high equity/stock allocation.",
        "Extreme equity focus. High risk of capital loss."
    ];

    const colors = [
        'bg-emerald-500',
        'bg-teal-500',
        'bg-amber-500',
        'bg-orange-500',
        'bg-rose-500'
    ];

    return (
        <div className="bg-cream/10 border border-beige/45 rounded-2xl p-5 my-6 shadow-sm font-sans text-left">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-serif font-extrabold text-xs uppercase tracking-wider text-taupe">
                    🛡️ Risk Profile Assessment
                </h4>
                <span className={`text-[10px] uppercase tracking-wider font-black text-white px-2.5 py-0.5 rounded-full ${colors[activeIdx]}`}>
                    {riskLevels[activeIdx]} Risk
                </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 h-2 my-4 rounded-full overflow-hidden bg-beige/10">
                {colors.map((color, idx) => {
                    const isActive = idx === activeIdx;
                    return (
                        <div 
                            key={idx} 
                            className={`h-full rounded-sm transition-all duration-500 ${
                                isActive ? `${color} opacity-100 scale-y-110 shadow-sm` : 'bg-beige/40 opacity-40'
                            }`}
                        />
                    );
                })}
            </div>

            <p className="text-xs text-taupe font-semibold leading-relaxed">
                {descriptions[activeIdx]}
            </p>
        </div>
    );
};

// Plan Option tabs component
const PlansTabs = ({ containerBlock }) => {
    const { plans } = containerBlock;
    const [activeTab, setActiveTab] = useState(0);
    
    if (!plans || plans.length === 0) return null;
    
    return (
        <div className="plans-widget my-6 border border-beige/45 rounded-2xl bg-white overflow-hidden shadow-[0_6px_20px_rgba(58,46,37,0.04)] text-left">
            <div className="flex border-b border-beige/40 bg-cream/30 overflow-x-auto no-scrollbar scroll-smooth p-1.5 gap-1.5">
                {plans.map((plan, idx) => {
                    const isActive = activeTab === idx;
                    return (
                        <button
                            key={plan.id + '-' + idx}
                            onClick={() => setActiveTab(idx)}
                            className={`px-4 py-2.5 rounded-xl font-sans text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap cursor-pointer shrink-0 select-none ${
                                isActive 
                                    ? 'bg-burgundy text-white shadow-md' 
                                    : 'text-taupe hover:text-ink hover:bg-beige/20'
                            }`}
                        >
                            {plan.title}
                        </button>
                    );
                })}
            </div>
            
            <div className="p-5 sm:p-6 bg-white min-h-[150px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        {plans[activeTab].blocks.map((block, index) => (
                            <BlockRenderer key={index} block={block} />
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// Rich Alert / Callout renderer
const CalloutBox = ({ block }) => {
    const { style, title, text } = block;
    
    let bgClass = 'bg-cream/40 border-beige text-ink';
    let icon = <Info size={18} />;
    
    if (style === 'warning') {
        bgClass = 'bg-amber-500/5 border-amber-500/20 text-amber-950';
        icon = <AlertTriangle size={18} />;
    } else if (style === 'success') {
        bgClass = 'bg-emerald-500/5 border-emerald-500/20 text-emerald-950';
        icon = <CheckCircle size={18} />;
    } else if (style === 'error') {
        bgClass = 'bg-rose-500/5 border-rose-500/20 text-rose-950';
        icon = <AlertCircle size={18} />;
    }
    
    const emojis = {
        tip: '💡',
        warning: '⚠️',
        important: '🚨',
        note: '📌',
        remember: '👉',
        caution: '🛑',
        alert: '🚨',
        success: '✅',
        info: 'ℹ️'
    };
    
    const emoji = emojis[title.toLowerCase()] || '💡';

    return (
        <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`my-5 p-4 rounded-xl border flex gap-3 items-start shadow-sm text-left ${bgClass}`}
        >
            <span className="text-lg shrink-0 select-none mt-0.5">{emoji}</span>
            <div className="flex-1 text-left">
                <span className="font-extrabold text-xs uppercase tracking-widest block mb-0.5">{title}</span>
                <div className="text-xs sm:text-sm font-medium leading-relaxed">
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        components={{
                            p: ({node, ...props}) => <span {...props} />,
                            a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-burgundy hover:text-gold font-bold underline" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-extrabold text-ink" {...props} />
                        }}
                    >
                        {text}
                    </ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
};

// Media embed widget (renders images or video players)
const MediaEmbed = ({ block }) => {
    const { mediaType, url } = block;
    
    if (mediaType === 'video') {
        let embedUrl = url;
        
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            let videoId = '';
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1]?.split('&')[0];
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0];
            }
            if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        } else if (url.includes('vimeo.com')) {
            const vimeoId = url.split('vimeo.com/')[1]?.split('?')[0];
            if (vimeoId) {
                embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
            }
        }

        return (
            <div className="my-5 aspect-video w-full rounded-2xl overflow-hidden border border-beige/40 shadow-md">
                {embedUrl !== url ? (
                    <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Video Player"
                    />
                ) : (
                    <video src={url} controls className="w-full h-full object-cover" />
                )}
            </div>
        );
    }
    
    return (
        <div className="my-5 w-full rounded-2xl overflow-hidden border border-beige/40 shadow-md group relative">
            <img 
                src={url} 
                alt="Attachment" 
                className="w-full h-auto object-cover max-h-[350px] transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="bg-white/90 backdrop-blur text-ink px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                    <ExternalLink size={12} />
                    View Original
                </a>
            </div>
        </div>
    );
};

// Citations and references link list
const SourcesCitation = ({ block }) => {
    const { items } = block;
    
    if (!items || items.length === 0) return null;
    
    return (
        <div className="sources-citation mt-6 border-t border-beige/35 pt-4 text-left">
            <h4 className="font-serif font-extrabold text-xs uppercase tracking-wider text-taupe mb-3 flex items-center gap-1.5 select-none">
                <Bookmark size={12} className="text-burgundy" />
                Sources & References
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {items.map((item, idx) => {
                    let hostname = '';
                    try {
                        hostname = new URL(item.url).hostname;
                    } catch(e) {}
                    
                    return (
                        <a
                            key={idx}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl border border-beige/45 bg-cream/10 hover:bg-cream/40 flex items-center justify-between gap-3 group transition-colors shadow-sm cursor-pointer"
                        >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                                {hostname && (
                                    <img 
                                        src={`https://www.google.com/s2/favicons?sz=64&domain=${hostname}`} 
                                        alt="" 
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                        className="w-4 h-4 rounded shrink-0 bg-white"
                                    />
                                )}
                                <span className="text-xs font-bold text-ink truncate group-hover:text-burgundy transition-colors">
                                    {item.title}
                                </span>
                            </div>
                            <ExternalLink size={12} className="text-taupe shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                    );
                })}
            </div>
        </div>
    );
};

// Daily timeline itinerary rendering
const ItineraryTimeline = ({ block }) => {
    const { days } = block;
    const [expandedDay, setExpandedDay] = useState(0);
    
    if (!days || days.length === 0) return null;
    
    return (
        <div className="my-6 border border-beige/40 rounded-2xl bg-cream/10 p-5 shadow-[0_4px_16px_rgba(58,46,37,0.03)] text-left">
            <h3 className="font-serif font-extrabold text-sm uppercase tracking-wider text-burgundy mb-5 flex items-center gap-2 select-none border-b border-beige/35 pb-2.5">
                <Calendar size={15} />
                Detailed Daily Itinerary
            </h3>
            
            <div className="relative border-l-2 border-beige/50 ml-3 pl-6 space-y-6">
                {days.map((day, dayIdx) => {
                    const isExpanded = expandedDay === dayIdx;
                    
                    return (
                        <div key={dayIdx} className="relative group">
                            <button
                                onClick={() => setExpandedDay(isExpanded ? -1 : dayIdx)}
                                className={`absolute -left-[33px] top-0 w-[14px] h-[14px] rounded-full border-2 bg-white transition-all duration-300 cursor-pointer ${
                                    isExpanded 
                                        ? 'border-burgundy scale-125 shadow-[0_0_8px_rgba(107,30,43,0.3)] bg-burgundy' 
                                        : 'border-beige group-hover:border-burgundy'
                                }`}
                                title={`Toggle Day ${dayIdx + 1}`}
                            />
                            
                            <div className="flex flex-col select-none cursor-pointer text-left" onClick={() => setExpandedDay(isExpanded ? -1 : dayIdx)}>
                                <span className="font-serif font-extrabold text-xs uppercase tracking-wider text-gold">
                                    {day.dayNum}
                                </span>
                                <h4 className="font-serif font-extrabold text-sm sm:text-base text-ink group-hover:text-burgundy transition-colors">
                                    {day.title}
                                </h4>
                            </div>
                            
                            <AnimatePresence initial={false}>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                                        className="overflow-hidden"
                                    >
                                        <div className="mt-3.5 space-y-3 pb-2 text-xs sm:text-sm text-left">
                                            {day.description && (
                                                <div className="text-taupe font-medium leading-relaxed italic bg-white/60 p-3 rounded-xl border border-beige/25 text-left">
                                                    <ReactMarkdown 
                                                        remarkPlugins={[remarkGfm, remarkBreaks]}
                                                        components={{
                                                            p: ({node, ...props}) => <p className="mb-0" {...props} />,
                                                            a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-burgundy hover:text-gold font-bold underline" {...props} />,
                                                            strong: ({node, ...props}) => <strong className="font-extrabold text-ink" {...props} />
                                                        }}
                                                    >
                                                        {day.description}
                                                    </ReactMarkdown>
                                                </div>
                                            )}
                                            
                                            {day.segments && day.segments.length > 0 && (
                                                <div className="space-y-3 mt-4">
                                                    {day.segments.map((seg, segIdx) => {
                                                        const timeLower = seg.time.toLowerCase();
                                                        let segmentIcon = <Sun size={12} />;
                                                        let segColor = 'text-amber-500';
                                                        
                                                        if (timeLower.includes('morning')) {
                                                            segmentIcon = <Sunrise size={12} />;
                                                            segColor = 'text-amber-500';
                                                        } else if (timeLower.includes('afternoon')) {
                                                            segmentIcon = <Sun size={12} />;
                                                            segColor = 'text-orange-500';
                                                        } else if (timeLower.includes('evening')) {
                                                            segmentIcon = <Sunset size={12} />;
                                                            segColor = 'text-burgundy';
                                                        } else if (timeLower.includes('night')) {
                                                            segmentIcon = <Moon size={12} />;
                                                            segColor = 'text-indigo-900';
                                                        }
                                                        
                                                        return (
                                                            <div key={segIdx} className="flex gap-3 bg-white p-3 rounded-xl border border-beige/25 shadow-sm text-left">
                                                                <div className={`w-8 h-8 rounded-lg bg-cream/30 flex items-center justify-center shrink-0 ${segColor}`}>
                                                                    {segmentIcon}
                                                                </div>
                                                                <div className="flex-1 text-left">
                                                                    <span className="font-extrabold text-[10px] uppercase tracking-wider block mb-0.5 text-taupe">
                                                                        {seg.time}
                                                                    </span>
                                                                    <div className="font-medium text-ink leading-relaxed">
                                                                        <ReactMarkdown 
                                                                            remarkPlugins={[remarkGfm, remarkBreaks]}
                                                                            components={{
                                                                                p: ({node, ...props}) => <p className="mb-0" {...props} />,
                                                                                a: ({node, ...props}) => <a target="_blank" rel="noopener noreferrer" className="text-burgundy hover:text-gold font-bold underline" {...props} />,
                                                                                strong: ({node, ...props}) => <strong className="font-extrabold text-ink" {...props} />
                                                                            }}
                                                                        >
                                                                            {seg.details}
                                                                        </ReactMarkdown>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Custom JSON widgets component
const JsonWidgets = ({ block }) => {
    const { data } = block;
    if (!data || !data.type) return null;
    
    const type = data.type.toLowerCase();
    
    if (type === 'buttons') {
        const buttons = data.buttons || [];
        return (
            <div className="flex flex-wrap gap-3 my-4 justify-start">
                {buttons.map((btn, idx) => {
                    const style = btn.style || 'primary';
                    const isPrimary = style === 'primary';
                    
                    return (
                        <motion.a
                            key={idx}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-5 py-3 rounded-xl font-sans text-xs font-black uppercase tracking-widest shadow transition-all cursor-pointer select-none inline-flex items-center gap-1.5 ${
                                isPrimary 
                                    ? 'bg-burgundy text-white hover:bg-burgundy/90 shadow-burgundy/10' 
                                    : 'bg-white border border-beige text-ink hover:bg-cream/40 shadow-sm'
                            }`}
                        >
                            {btn.label}
                            <ExternalLink size={12} />
                        </motion.a>
                    );
                })}
            </div>
        );
    }
    
    if (type === 'links') {
        const links = data.links || [];
        return (
            <div className="my-4 space-y-2 text-left">
                {links.map((link, idx) => {
                    let hostname = '';
                    try { hostname = new URL(link.url).hostname; } catch(e) {}
                    
                    return (
                        <a
                            key={idx}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3.5 rounded-xl border border-beige/45 bg-white hover:bg-cream/30 flex items-center justify-between gap-3 group transition-all shadow-sm cursor-pointer"
                        >
                            <div className="flex items-center gap-3 overflow-hidden">
                                {hostname && (
                                    <img 
                                        src={`https://www.google.com/s2/favicons?sz=64&domain=${hostname}`} 
                                        alt="" 
                                        onError={(e) => { e.target.style.display = 'none'; }}
                                        className="w-5 h-5 rounded shrink-0 bg-white"
                                    />
                                )}
                                <div className="text-left overflow-hidden">
                                    <span className="text-xs sm:text-sm font-bold text-ink block truncate group-hover:text-burgundy transition-colors">
                                        {link.label || link.title}
                                    </span>
                                    {link.description && (
                                        <span className="text-[10px] text-taupe font-medium block truncate">
                                            {link.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <ExternalLink size={13} className="text-taupe shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </a>
                    );
                })}
            </div>
        );
    }
    
    if (['cards', 'places', 'news', 'recommendations'].includes(type)) {
        const cards = data.cards || data.places || data.news || data.recommendations || [];
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-5 text-left">
                {cards.map((card, idx) => {
                    const stars = [];
                    if (card.rating) {
                        const numStars = Math.round(Number(card.rating));
                        for (let s = 0; s < 5; s++) {
                            stars.push(
                                <span key={s} className={s < numStars ? "text-gold" : "text-beige/40"}>
                                    ★
                                </span>
                            );
                        }
                    }

                    return (
                        <motion.a
                            key={idx}
                            href={card.url || '#'}
                            target={card.url ? "_blank" : "_self"}
                            rel="noopener noreferrer"
                            whileHover={{ y: -4 }}
                            className="flex flex-col border border-beige/45 rounded-2xl bg-white overflow-hidden shadow-md group hover:shadow-lg transition-all text-left"
                        >
                            {card.image && (
                                <div className="aspect-video w-full overflow-hidden relative border-b border-beige/35 bg-cream/20">
                                    <img 
                                        src={card.image} 
                                        alt={card.title} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                    />
                                    {card.price && (
                                        <div className="absolute top-3 right-3 bg-burgundy/90 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase shadow-md select-none">
                                            {card.price}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <h4 className="font-serif font-extrabold text-sm sm:text-base text-ink group-hover:text-burgundy transition-colors leading-tight">
                                            {card.title}
                                        </h4>
                                        {!card.image && card.price && (
                                            <span className="text-[10px] font-black text-burgundy bg-burgundy/10 px-2 py-0.5 rounded-full uppercase shrink-0 select-none">
                                                {card.price}
                                            </span>
                                        )}
                                    </div>
                                    {card.description && (
                                        <p className="text-[11px] sm:text-xs text-taupe leading-relaxed font-semibold mb-3 line-clamp-2">
                                            {card.description}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center justify-between border-t border-beige/25 pt-2.5 mt-auto">
                                    {card.rating ? (
                                        <div className="flex items-center gap-0.5 text-xs font-bold select-none">
                                            <div className="flex text-sm leading-none mr-1">{stars}</div>
                                            <span className="text-ink text-[10px]">{card.rating}</span>
                                        </div>
                                    ) : (
                                        <div />
                                    )}
                                    {card.url && (
                                        <span className="text-[9px] uppercase tracking-wider font-extrabold text-burgundy flex items-center gap-1 group-hover:text-gold transition-colors select-none">
                                            Discover
                                            <ExternalLink size={10} />
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.a>
                    );
                })}
            </div>
        );
    }
    
    if (type === 'callout') {
        const style = data.style || 'info';
        const title = data.title || 'Note';
        const text = data.text || '';
        
        return <CalloutBox block={{ type: 'callout', style, title, text }} />;
    }
    
    if (type === 'image') {
        return (
            <div className="my-5 border border-beige/40 rounded-2xl bg-white overflow-hidden shadow-sm text-left">
                {data.url && <img src={data.url} alt={data.alt || 'Widget'} className="w-full h-auto object-cover max-h-[300px]" />}
                {(data.caption || data.description) && (
                    <div className="p-3 bg-cream/20">
                        {data.caption && <span className="font-serif font-extrabold text-xs block text-ink">{data.caption}</span>}
                        {data.description && <span className="text-[10px] text-taupe font-semibold leading-normal block mt-0.5">{data.description}</span>}
                    </div>
                )}
            </div>
        );
    }

    if (['chart', 'rechart'].includes(type)) {
        const chartType = data.chartType || 'bar';
        const title = data.title || 'Chart Data';
        const items = data.data || [];
        const xKey = data.xKey || 'name';
        const yKeys = Array.isArray(data.yKeys) ? data.yKeys : [data.yKeys || 'value'];
        const themeColors = ['#6B1E2B', '#C5A880', '#10B981', '#3B82F6', '#F59E0B'];

        return (
            <div className="bg-cream/10 border border-beige/45 rounded-2xl p-5 my-6 shadow-sm font-sans text-left">
                {title && <h4 className="font-serif font-extrabold text-xs uppercase tracking-wider text-taupe mb-4">{title}</h4>}
                <div className="h-[220px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                            <LineChart data={items} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                                <XAxis dataKey={xKey} stroke="#8a7a6e" fontSize={10} />
                                <YAxis stroke="#8a7a6e" fontSize={10} />
                                <Tooltip contentStyle={{ background: '#faf8f5', borderColor: '#d9d2c9', borderRadius: '12px', fontSize: '11px', fontFamily: 'sans-serif' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                {yKeys.map((key, idx) => (
                                    <Line key={key} type="monotone" dataKey={key} stroke={themeColors[idx % themeColors.length]} strokeWidth={2} dot={{ r: 3 }} />
                                ))}
                            </LineChart>
                        ) : chartType === 'area' ? (
                            <AreaChart data={items} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                                <XAxis dataKey={xKey} stroke="#8a7a6e" fontSize={10} />
                                <YAxis stroke="#8a7a6e" fontSize={10} />
                                <Tooltip contentStyle={{ background: '#faf8f5', borderColor: '#d9d2c9', borderRadius: '12px', fontSize: '11px', fontFamily: 'sans-serif' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                {yKeys.map((key, idx) => (
                                    <Area key={key} type="monotone" dataKey={key} stroke={themeColors[idx % themeColors.length]} fill={themeColors[idx % themeColors.length]} fillOpacity={0.15} strokeWidth={2} />
                                ))}
                            </AreaChart>
                        ) : chartType === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={items}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={70}
                                    paddingAngle={3}
                                    dataKey={yKeys[0]}
                                    nameKey={xKey}
                                >
                                    {items.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={themeColors[index % themeColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: '#faf8f5', borderColor: '#d9d2c9', borderRadius: '12px', fontSize: '11px', fontFamily: 'sans-serif' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                            </PieChart>
                        ) : (
                            <BarChart data={items} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0ede9" />
                                <XAxis dataKey={xKey} stroke="#8a7a6e" fontSize={10} />
                                <YAxis stroke="#8a7a6e" fontSize={10} />
                                <Tooltip contentStyle={{ background: '#faf8f5', borderColor: '#d9d2c9', borderRadius: '12px', fontSize: '11px', fontFamily: 'sans-serif' }} />
                                <Legend wrapperStyle={{ fontSize: '10px' }} />
                                {yKeys.map((key, idx) => (
                                    <Bar key={key} dataKey={key} fill={themeColors[idx % themeColors.length]} radius={[4, 4, 0, 0]} />
                                ))}
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        );
    }

    if (['financial-chart', 'stock-chart'].includes(type)) {
        const title = data.title || 'Stock Candlestick Chart';
        const items = data.data || [];
        return (
            <div className="bg-cream/10 border border-beige/45 rounded-2xl p-5 my-6 shadow-sm font-sans text-left">
                {title && <h4 className="font-serif font-extrabold text-xs uppercase tracking-wider text-taupe mb-4">{title}</h4>}
                <CandlestickChart data={items} />
            </div>
        );
    }

    if (['calculator', 'sip-calculator'].includes(type)) {
        return <SipCalculator />;
    }

    if (type === 'risk-meter') {
        return <RiskMeter level={data.level} />;
    }
    
    return null;
};

// Dispatcher component that maps parsed blocks to their individual renders
const BlockRenderer = ({ block }) => {
    switch (block.type) {
        case 'markdown':
            return <MarkdownBlock block={block} />;
        case 'itinerary':
            return <ItineraryTimeline block={block} />;
        case 'callout':
            return <CalloutBox block={block} />;
        case 'media':
            return <MediaEmbed block={block} />;
        case 'sources':
            return <SourcesCitation block={block} />;
        case 'plans-container':
            return <PlansTabs containerBlock={block} />;
        case 'json-widget':
            return <JsonWidgets block={block} />;
        default:
            return null;
    }
};

// Core response parser logic
const parseSubBlocks = (lines) => {
    const blocks = [];
    let accumulatedMarkdown = [];
    
    const flushMarkdown = () => {
        if (accumulatedMarkdown.length > 0) {
            let content = accumulatedMarkdown.join('\n');
            if (content.trim() !== '') {
                blocks.push({ type: 'markdown', content });
            }
            accumulatedMarkdown = [];
        }
    };

    let currentDay = null;
    let currentSegment = null;
    let sourceLinks = null;
    let inJsonBlock = false;
    let jsonLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.trim().startsWith('```json')) {
            flushMarkdown();
            inJsonBlock = true;
            jsonLines = [];
            continue;
        }
        
        if (inJsonBlock) {
            if (line.trim() === '```') {
                inJsonBlock = false;
                try {
                    const parsed = JSON.parse(jsonLines.join('\n'));
                    blocks.push({ type: 'json-widget', data: parsed });
                } catch (e) {
                    console.error('Failed to parse JSON widget:', e);
                    blocks.push({ type: 'markdown', content: '```json\n' + jsonLines.join('\n') + '\n```' });
                }
                jsonLines = [];
            } else {
                jsonLines.push(line);
            }
            continue;
        }
        
        if (line.match(sourcesHeaderRegex)) {
            flushMarkdown();
            if (currentDay) {
                blocks.push({ type: 'day', day: currentDay });
                currentDay = null;
            }
            sourceLinks = [];
            continue;
        }
        
        if (sourceLinks !== null) {
            const linkMatch = line.match(sourceLinkRegex);
            if (linkMatch) {
                const title = linkMatch[1] || linkMatch[3];
                const url = linkMatch[2] || linkMatch[3];
                sourceLinks.push({ title, url });
                continue;
            } else if (line.trim() === '') {
                continue; 
            } else {
                blocks.push({ type: 'sources', items: sourceLinks });
                sourceLinks = null;
            }
        }
        
        const dayMatch = line.match(dayHeaderRegex);
        if (dayMatch) {
            flushMarkdown();
            if (currentDay) {
                blocks.push({ type: 'day', day: currentDay });
            }
            currentDay = {
                dayNum: dayMatch[1],
                title: dayMatch[2] || 'Exploration',
                description: '',
                segments: []
            };
            currentSegment = null;
            continue;
        }
        
        const calloutMatch = line.match(calloutRegex);
        if (calloutMatch) {
            flushMarkdown();
            const type = calloutMatch[1].toLowerCase();
            const text = calloutMatch[2];
            let style = 'info';
            if (['warning', 'caution', 'alert'].includes(type)) style = 'warning';
            else if (['success', 'done'].includes(type)) style = 'success';
            else if (['error', 'danger'].includes(type)) style = 'error';
            
            blocks.push({ type: 'callout', style, title: calloutMatch[1], text });
            continue;
        }
        
        if (currentDay) {
            const timeMatch = line.match(timeSegmentRegex);
            if (timeMatch) {
                currentSegment = { time: timeMatch[1], details: timeMatch[2] };
                currentDay.segments.push(currentSegment);
                continue;
            }
            
            const timeHeaderMatch = line.match(/^[#\s\*]*\s*(Morning|Afternoon|Evening|Night)\s*$/i);
            if (timeHeaderMatch) {
                currentSegment = { time: timeHeaderMatch[1], details: '' };
                currentDay.segments.push(currentSegment);
                continue;
            }
            
            if (line.trim() !== '') {
                if (currentSegment) {
                    currentSegment.details += (currentSegment.details ? '\n' : '') + line.replace(/^\s*[\-\*\+\s]*/, '');
                } else {
                    currentDay.description += (currentDay.description ? '\n' : '') + line.replace(/^\s*[\-\*\+\s]*/, '');
                }
                continue;
            }
        }
        
        const urlRegex = /(https?:\/\/[^\s\)]+)/g;
        const urls = line.match(urlRegex);
        if (urls && urls.length === 1 && line.trim() === urls[0]) {
            const url = urls[0];
            const isGif = url.match(/\.gif/i) || url.includes('giphy.com') || url.includes('tenor.com');
            const isImage = isImageUrl(url);
            const isVideo = isVideoUrl(url);
            
            if (isGif || isImage || isVideo) {
                flushMarkdown();
                blocks.push({
                    type: 'media',
                    mediaType: isGif ? 'gif' : isVideo ? 'video' : 'image',
                    url: url
                });
                continue;
            }
        }
        
        accumulatedMarkdown.push(line);
    }
    
    flushMarkdown();
    if (currentDay) blocks.push({ type: 'day', day: currentDay });
    if (sourceLinks) blocks.push({ type: 'sources', items: sourceLinks });
    
    const finalBlocks = [];
    let currentItineraryDays = [];
    
    for (let block of blocks) {
        if (block.type === 'day') {
            currentItineraryDays.push(block.day);
        } else {
            if (currentItineraryDays.length > 0) {
                finalBlocks.push({ type: 'itinerary', days: currentItineraryDays });
                currentItineraryDays = [];
            }
            finalBlocks.push(block);
        }
    }
    if (currentItineraryDays.length > 0) {
        finalBlocks.push({ type: 'itinerary', days: currentItineraryDays });
    }
    
    return finalBlocks;
};

// Master segmentation (Intro, Plans Tabbed layout, Outro/Sources)
const parseResponseText = (rawText) => {
    const text = preprocessBotReplyText(rawText);
    const lines = text.split('\n');
    
    let hasPlans = false;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(planHeaderRegex)) {
            hasPlans = true;
            break;
        }
    }
    
    if (!hasPlans) {
        return parseSubBlocks(lines);
    }
    
    const introLines = [];
    const plans = [];
    const outroLines = [];
    
    let currentPlan = null;
    let inOutro = false;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        if (line.match(sourcesHeaderRegex)) {
            inOutro = true;
        }
        
        if (inOutro) {
            outroLines.push(line);
            continue;
        }
        
        const planMatch = line.match(planHeaderRegex);
        if (planMatch) {
            currentPlan = {
                id: planMatch[1],
                title: planMatch[2] || planMatch[1],
                lines: []
            };
            plans.push(currentPlan);
            continue;
        }
        
        if (currentPlan) {
            currentPlan.lines.push(line);
        } else {
            introLines.push(line);
        }
    }
    
    const introBlocks = parseSubBlocks(introLines);
    const outroBlocks = parseSubBlocks(outroLines);
    const parsedPlans = plans.map(p => ({
        id: p.id,
        title: p.title,
        blocks: parseSubBlocks(p.lines)
    }));
    
    const finalBlocks = [];
    if (introBlocks.length > 0) {
        finalBlocks.push(...introBlocks);
    }
    if (parsedPlans.length > 0) {
        finalBlocks.push({
            type: 'plans-container',
            plans: parsedPlans
        });
    }
    if (outroBlocks.length > 0) {
        finalBlocks.push(...outroBlocks);
    }
    
    return finalBlocks;
};

// Main Export Component
const ResponseRenderer = ({ text }) => {
    const blocks = parseResponseText(text);
    
    return (
        <div className="chatbot-response-renderer space-y-4">
            {blocks.map((block, idx) => (
                <BlockRenderer key={idx} block={block} />
            ))}
        </div>
    );
};

export default ResponseRenderer;
