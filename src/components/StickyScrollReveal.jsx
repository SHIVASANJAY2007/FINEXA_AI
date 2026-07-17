import React, { useRef, useState } from "react";
import { useScroll, motion, AnimatePresence, useMotionValueEvent } from "framer-motion";

export const StickyScrollReveal = ({
    content,
    contentClassName,
}) => {
    const [activeCard, setActiveCard] = useState(0);
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });
    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0
        );
        setActiveCard(closestBreakpointIndex);
    });

    return (
        <motion.div
            className="h-full overflow-y-auto flex justify-center relative lg:space-x-12 px-6 md:px-12 no-scrollbar"
            ref={ref}
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <div className="relative flex items-start px-2 py-4">
                <div className="max-w-xl">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-36 first:mt-16 last:mb-52 text-left">
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.25,
                                    x: activeCard === index ? 0 : -20,
                                    scale: activeCard === index ? 1.05 : 1,
                                }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="text-3xl md:text-4xl font-serif font-bold text-ink leading-tight"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.2,
                                    y: activeCard === index ? 0 : 10,
                                }}
                                transition={{ duration: 0.5, ease: "circOut", delay: 0.1 }}
                                className="text-sm md:text-base text-taupe font-medium max-w-md mt-6 leading-relaxed"
                            >
                                {item.description}
                            </motion.p>

                            {/* Mobile Content Display */}
                            <div className="lg:hidden mt-8 h-56 w-full rounded-2xl border border-beige/40 overflow-hidden shadow-[0_8px_24px_rgba(58,46,37,0.08)] bg-ivory">
                                {item.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Sticky Visuals */}
            <div className="hidden lg:flex items-center justify-center sticky top-0 h-full w-[450px]">
                <div
                    className={`h-[400px] w-full rounded-3xl bg-ivory overflow-hidden border border-beige/45 shadow-[0_20px_60px_rgba(58,46,37,0.12)] relative ${contentClassName}`}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeCard}
                            initial={{
                                opacity: 0,
                                scale: 1.1,
                                filter: "blur(10px)",
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                filter: "blur(0px)",
                            }}
                            exit={{
                                opacity: 0,
                                scale: 0.9,
                                filter: "blur(10px)",
                            }}
                            transition={{
                                duration: 0.5,
                                ease: "easeInOut",
                            }}
                            className="h-full w-full"
                        >
                            {content[activeCard].content ?? null}
                        </motion.div>
                    </AnimatePresence>

                    {/* Technical Metadata Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full border border-beige/10 mix-blend-overlay" />
                        <div className="absolute top-4 right-4 font-mono text-[9px] text-ivory/60 bg-ink/75 px-2.5 py-1 rounded-md backdrop-blur-md">
                            PLAN_ID: FX_{activeCard + 402}
                        </div>
                        <div className="absolute bottom-4 left-4 font-mono text-[8px] text-camel tracking-widest uppercase">
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
        </motion.div>
    );
};
