import React, { useState, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shield, TrendingUp, Target, Cpu } from "lucide-react";

const FEATURE_ICONS = [
    <Cpu key="cpu" size={16} className="text-burgundy" />,
    <TrendingUp key="trending" size={16} className="text-teal" />,
    <Target key="target" size={16} className="text-gold" />,
    <Shield key="shield" size={16} className="text-burgundy" />
];

export const StickyScrollReveal = memo(({
    content,
    activeCard = 0,
    onSelectCard,
    contentClassName = "",
}) => {
    const [currentCard, setCurrentCard] = useState(activeCard);

    useEffect(() => {
        setCurrentCard(activeCard);
    }, [activeCard]);

    const handleCardSelect = (index) => {
        setCurrentCard(index);
        if (onSelectCard) {
            onSelectCard(index);
        }
    };

    const activeItem = content[currentCard] || content[0];

    return (
        <div className="h-full w-full flex flex-col lg:flex-row items-center justify-between p-5 sm:p-8 md:p-14 gap-8 lg:gap-14 relative overflow-y-auto lg:overflow-hidden bg-ivory">
            {/* Left Side: Rich, High-Contrast Content Showcase */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between h-auto lg:h-full text-left z-10">
                {/* Feature Navigation Tabs */}
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar pb-2 shrink-0">
                    {content.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleCardSelect(index)}
                            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-sm font-bold uppercase tracking-wider transition-all cursor-pointer select-none shrink-0 ${currentCard === index
                                ? "bg-ink text-ivory shadow-md scale-102"
                                : "bg-beige/30 text-taupe hover:bg-beige/60 hover:text-ink"
                                }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${currentCard === index ? "bg-gold" : "bg-taupe/40"}`} />
                            <span>0{index + 1}</span>
                        </button>
                    ))}
                </div>

                {/* Main Feature Content with Smooth Morphing Transitions */}
                <div className="my-auto py-2 sm:py-4">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCard}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                            className="space-y-3 sm:space-y-4"
                        >
                            <div className="flex items-center gap-2 text-[11px] sm:text-sm font-extrabold uppercase tracking-widest text-burgundy">
                                {FEATURE_ICONS[currentCard % FEATURE_ICONS.length]}
                                <span>Domain 0{currentCard + 1} • Autonomous Workflow</span>
                            </div>

                            <h3 className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-ink leading-tight">
                                {activeItem.title}
                            </h3>

                            <p className="text-sm sm:text-base md:text-lg text-ink/80 font-medium leading-relaxed max-w-lg">
                                {activeItem.description}
                            </p>

                            <div className="pt-1 sm:pt-2 flex items-center gap-2 sm:gap-3 flex-wrap">
                                <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cream border border-beige/40 text-[11px] sm:text-xs font-bold text-ink shadow-xs">
                                    <Sparkles size={12} className="text-gold" />
                                    <span>AI Engine Active</span>
                                </div>
                                <div className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cream border border-beige/40 text-[11px] sm:text-xs font-bold text-taupe">
                                    DPDP Encrypted
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center justify-between border-t border-beige/40 pt-3 sm:pt-4 mt-2 lg:mt-0">
                    <span className="text-[9px] sm:text-[10px] font-mono font-bold text-taupe uppercase tracking-wider">
                        Node 0{currentCard + 1} / 0{content.length}
                    </span>
                    <div className="flex gap-1.5">
                        {content.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => handleCardSelect(i)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${currentCard === i ? "w-6 sm:w-8 bg-burgundy" : "w-2 bg-beige/60 hover:bg-taupe/40"
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side: Desktop/Mobile Visual Card Engine */}
            <div className="w-full lg:w-1/2 h-[300px] sm:h-[360px] md:h-[430px] lg:h-[480px] flex items-center justify-center relative shrink-0">
                <div
                    className={`h-full w-full max-w-md rounded-2xl sm:rounded-3xl bg-ink overflow-hidden border border-beige/40 shadow-[0_20px_50px_rgba(58,46,37,0.2)] relative ${contentClassName}`}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentCard}
                            initial={{
                                opacity: 0,
                                scale: 1.03,
                                filter: "blur(4px)",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.97,
                                filter: "blur(4px)",
                            }}
                            transition={{
                                duration: 0.35,
                                ease: "easeInOut",
                            }}
                            className="h-full w-full"
                        >
                            {activeItem.content ?? null}
                        </motion.div>
                    </AnimatePresence>

                    {/* Technical Metadata Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full border border-beige/10 mix-blend-overlay" />
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 font-mono text-[8px] sm:text-[9px] text-ivory/80 bg-ink/80 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md backdrop-blur-md border border-ivory/10">
                            PLAN_ID: FX_{currentCard + 402}
                        </div>
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 font-mono text-[7px] sm:text-[8px] text-camel tracking-widest uppercase">
                            [ FINEXA_PORTFOLIO_ENGINE_V1 ]
                        </div>
                        {/* Scanning Bar */}
                        <motion.div
                            animate={{ top: ['0%', '100%', '0%'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                            className="absolute left-0 w-full h-[1px] bg-burgundy/40 z-10"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
