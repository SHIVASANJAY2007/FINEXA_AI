import React, { useEffect, useRef, useState, useCallback, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EncryptedText } from './EncryptedText';
import { TrendingUp, Target, Receipt, PiggyBank, ArrowRight, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
    {
        title: "Profiling",
        description: "Financial DNA",
        color: "bg-burgundy text-ivory",
        icon: <UserCheck className="text-gold w-6 h-6 sm:w-7 sm:h-7" />,
        shape: "rounded-3xl"
    },
    {
        title: "Planning",
        description: "Goal Roadmaps",
        color: "bg-teal text-ivory",
        icon: <Target className="text-camel w-6 h-6 sm:w-7 sm:h-7" />,
        shape: "rounded-3xl"
    },
    {
        title: "Markets",
        description: "Live NAVs & FDs",
        color: "bg-camel text-ink",
        icon: <TrendingUp className="text-ink w-6 h-6 sm:w-7 sm:h-7" />,
        shape: "rounded-3xl"
    },
    {
        title: "Risk",
        description: "Stress Testing",
        color: "bg-gold text-ink",
        icon: <Receipt className="text-ink w-6 h-6 sm:w-7 sm:h-7" />,
        shape: "rounded-3xl"
    },
    {
        title: "Monitor",
        description: "Weekly Alerts",
        color: "bg-taupe text-ivory",
        icon: <PiggyBank className="text-ivory w-6 h-6 sm:w-7 sm:h-7" />,
        shape: "rounded-3xl"
    }
];

const Hero = () => {
    const cardsContainerRef = useRef(null);
    const cardsRef = useRef([]);
    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [chatStep, setChatStep] = useState(0);

    // 3D Phone interactive state
    const [phoneRotate, setPhoneRotate] = useState({ x: 0, y: 0 });
    const [phoneHovered, setPhoneHovered] = useState(false);

    const handlePhoneMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setPhoneRotate({
            x: -(y / (rect.height / 2)) * 12,
            y:  (x / (rect.width  / 2)) * 12,
        });
    }, []);

    const handlePhoneMouseLeave = useCallback(() => {
        setPhoneHovered(false);
        setPhoneRotate({ x: 0, y: 0 });
    }, []);

    useEffect(() => {
        // Typing timeline simulation
        const timers = [
            setTimeout(() => setChatStep(1), 800),    // AI msg 1
            setTimeout(() => setChatStep(2), 1800),   // User msg
            setTimeout(() => setChatStep(3), 2800),   // AI msg 2
            setTimeout(() => setChatStep(4), 3600),   // Projection Card
            setTimeout(() => setChatStep(5), 5200),   // AI msg 3
        ];

        // GSAP ScrollTrigger for pinning until all cards (including Monitor) are fully revealed with extended hold
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=3200",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Set initial card states
            gsap.set(cardsContainerRef.current, {
                opacity: 0,
                y: 35,
                pointerEvents: "none"
            });

            gsap.set(cardsRef.current, {
                opacity: 0,
                y: 30,
                scale: 0.8,
                rotate: -6,
                filter: "blur(8px)"
            });

            // 1. Reveal cards container header and frame
            tl.to(cardsContainerRef.current, {
                opacity: 1,
                y: 0,
                pointerEvents: "auto",
                duration: 0.8,
                ease: "power2.out"
            });

            // 2. Reveal each card sequentially: Profiling -> Planning -> Markets -> Risk -> Monitor (Piggy Bank)
            cardsRef.current.forEach((card, index) => {
                if (!card) return;
                tl.to(card, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    rotate: 0,
                    filter: "blur(0px)",
                    duration: 1.2,
                    ease: "power2.out"
                }, `-=${index === 0 ? 0.2 : 0.6}`);
            });

            // 3. Extended Lock/Hold phase after the 5th card (Piggy Bank Monitor) completes its full reveal
            // Holds the section locked while user scrolls through this duration before unpinning
            tl.to({}, { duration: 2.5 });

        }, containerRef);

        return () => {
            timers.forEach(clearTimeout);
            ctx.revert();
        };
    }, []);

    const scrollToFeatures = useCallback(() => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return (
        <div 
            ref={containerRef} 
            className="w-full bg-ivory text-ink relative min-h-screen overflow-hidden flex flex-col justify-center pt-20 md:pt-24 pb-12 dot-grid linen-noise"
        >
            {/* Ambient Blooms */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-burgundy/6 blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/4 blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />

            <div ref={contentRef} className="max-w-7xl mx-auto px-6 sm:px-8 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mt-2 sm:mt-4">
                {/* Left Column: Unified Max-W-XL Centered Container */}
                <div className="lg:col-span-7 flex flex-col justify-center items-center text-center space-y-6 max-w-xl mx-auto w-full">
                    <h1 className="hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-ink leading-[1.1] uppercase text-center w-full">
                        <span className="block">
                            <EncryptedText
                                text="YOUR WEALTH"
                                revealDelayMs={40}
                                initialDelayMs={300}
                                encryptedClassName="text-beige"
                                revealedClassName="text-ink"
                            />
                        </span>
                        <span className="block text-burgundy">
                            <EncryptedText
                                text="NEVER SLEEPS."
                                revealDelayMs={40}
                                initialDelayMs={800}
                                encryptedClassName="text-beige"
                                revealedClassName="text-burgundy"
                            />
                        </span>
                    </h1>

                    <p className="text-taupe text-sm sm:text-base font-normal leading-relaxed text-center w-full">
                        Your intelligent financial companion on WhatsApp. Powered by Agentic AI that reasons, plans, and remembers — delivering personalized wealth decisions without the cost of a financial advisor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                        <button
                            onClick={scrollToFeatures}
                            className="bg-burgundy text-ivory px-8 py-3.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-burgundy/90 transition-all active:scale-95 shadow-[0_4px_16px_rgba(107,30,43,0.25)] flex items-center justify-center gap-2 group pointer-events-auto cursor-pointer"
                        >
                            <span>Explore Features</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href="/signup"
                            className="bg-transparent border border-beige hover:border-ink text-ink px-8 py-3.5 rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all text-center flex items-center justify-center pointer-events-auto"
                        >
                            Start Free
                        </a>
                    </div>

                    {/* Trust Line */}
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-beige/40 w-full">
                        <span className="text-[11px] font-medium text-taupe uppercase tracking-wider">WhatsApp-Native</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-beige" />
                        <span className="text-[11px] font-medium text-taupe uppercase tracking-wider">DPDP Compliant</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-beige" />
                        <span className="text-[11px] font-medium text-taupe uppercase tracking-wider">Agentic AI Powered</span>
                    </div>

                    {/* Pinned Scroll-Revealed Cards Container (Exact 5-col match width to content) */}
                    <div ref={cardsContainerRef} className="pt-2 w-full flex flex-col items-center justify-center text-center">
                        <div className="flex items-center justify-center gap-2 mb-3 w-full">
                            <span className="w-2 h-2 rounded-full bg-burgundy animate-pulse" />
                            <span className="text-[10px] font-bold text-taupe uppercase tracking-widest select-none">
                                Autonomous Financial Domains
                            </span>
                        </div>
                        <div className="grid grid-cols-5 gap-2 sm:gap-2.5 w-full">
                            {CARDS.map((card, index) => (
                                <div
                                    key={card.title}
                                    ref={el => cardsRef.current[index] = el}
                                    className={`${card.color} ${card.shape} w-full p-2.5 sm:p-3 flex flex-col justify-between items-center text-center relative group overflow-hidden transition-all duration-300 hover:scale-105 shadow-[0_6px_20px_rgba(58,46,37,0.12)] border border-beige/20 min-h-[110px] sm:min-h-[118px]`}
                                >
                                    <div className="p-1.5 sm:p-2 bg-ivory/15 rounded-xl group-hover:scale-110 transition-transform duration-300 mb-1">
                                        {card.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-[11px] sm:text-xs font-extrabold uppercase leading-tight tracking-wider mb-0.5">
                                            {card.title}
                                        </h3>
                                        <p className="text-[7.5px] sm:text-[8px] font-bold opacity-80 uppercase tracking-wider">
                                            {card.description}
                                        </p>
                                    </div>
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Refined Phone Mockup (Slightly reduced) */}
                <div className="lg:col-span-5 flex justify-center lg:justify-end lg:pr-2 xl:pr-4" style={{ perspective: '1400px' }}>
                    <motion.div
                        onMouseEnter={() => setPhoneHovered(true)}
                        onMouseMove={handlePhoneMouseMove}
                        onMouseLeave={handlePhoneMouseLeave}
                        animate={{
                            rotateX: phoneHovered ? phoneRotate.x + 5 : 0,
                            rotateY: phoneHovered ? phoneRotate.y - 5 : 0,
                            translateZ: phoneHovered ? -30 : 0,
                            scale: phoneHovered ? 1.02 : 1,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 130,
                            damping: 22,
                            mass: 0.9
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                        className="cursor-pointer"
                    >
                    <div className="w-[340px] sm:w-[365px] lg:w-[385px] h-[590px] sm:h-[625px] lg:h-[650px] bg-ink rounded-[46px] p-3.5 shadow-[0_28px_72px_rgba(58,46,37,0.22)] border-4 border-beige/60 relative overflow-hidden flex flex-col">
                        {/* Status bar */}
                        <div className="flex justify-between items-center px-6 pt-2 pb-3.5 z-20 text-[10px] font-semibold text-cream/70 select-none">
                            <span>9:41</span>
                            <div className="w-22 h-4 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5" />
                            <div className="flex items-center gap-1.5">
                                <span>5G</span>
                                <div className="w-4 h-2.5 bg-cream/70 rounded-xs" />
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-3 pt-2">
                            {/* Message 1: AI */}
                            {chatStep >= 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-start gap-2 max-w-[85%]"
                                >
                                    <div className="w-6.5 h-6.5 rounded-xl bg-burgundy flex items-center justify-center text-[10.5px] font-extrabold text-gold flex-shrink-0">F</div>
                                    <div className="bg-burgundy text-ivory p-3 rounded-2xl rounded-tl-xs text-[11.5px] leading-normal shadow-[0_4px_12px_rgba(107,30,43,0.12)]">
                                        Hi Aanya 👋 I noticed you have ₹18,400 sitting idle this month.
                                    </div>
                                </motion.div>
                            )}

                            {/* Message 2: User */}
                            {chatStep >= 2 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-end justify-end max-w-[85%] ml-auto"
                                >
                                    <div className="bg-beige/25 border border-beige/40 text-cream p-3 rounded-2xl rounded-tr-xs text-[11.5px] leading-normal">
                                        What should I do with it?
                                    </div>
                                </motion.div>
                            )}

                            {/* Message 3: AI */}
                            {chatStep >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-start gap-2 max-w-[85%]"
                                >
                                    <div className="w-6.5 h-6.5 rounded-xl bg-burgundy flex items-center justify-center text-[10.5px] font-extrabold text-gold flex-shrink-0">F</div>
                                    <div className="bg-burgundy text-ivory p-3 rounded-2xl rounded-tl-xs text-[11.5px] leading-normal shadow-[0_4px_12px_rgba(107,30,43,0.12)]">
                                        Based on your goals, I'd suggest: 60% into your index fund SIP, 40% into your emergency buffer.
                                    </div>
                                </motion.div>
                            )}

                            {/* Message 4: Projection Card */}
                            {chatStep >= 4 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                    className="bg-cream border border-beige/50 p-3 rounded-2xl text-ink space-y-2 max-w-[92%] mx-auto shadow-[0_8px_20px_rgba(0,0,0,0.18)]"
                                >
                                    <div className="flex justify-between items-center text-[10px] font-extrabold text-burgundy uppercase tracking-wider">
                                        <span>Projection Card</span>
                                        <span className="text-gold font-bold">8.2% Return</span>
                                    </div>
                                    <div className="text-sm font-bold tracking-tight text-ink">
                                        ₹18,400 today → ₹31,200
                                    </div>
                                    <div className="text-[9px] text-taupe font-medium">
                                        Projected value in 5 years compound
                                    </div>
                                    <div className="w-full bg-beige/35 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-burgundy h-full rounded-full" style={{ width: '65%' }} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Message 5: AI */}
                            {chatStep >= 5 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-start gap-2 max-w-[85%]"
                                >
                                    <div className="w-6.5 h-6.5 rounded-xl bg-burgundy flex items-center justify-center text-[10.5px] font-extrabold text-gold flex-shrink-0">F</div>
                                    <div className="bg-burgundy text-ivory p-3 rounded-2xl rounded-tl-xs text-[11.5px] leading-normal shadow-[0_4px_12px_rgba(107,30,43,0.12)]">
                                        Want me to set this up automatically?
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Interactive Footer */}
                        <div className="p-3 border-t border-beige/10 bg-ink/80 backdrop-blur-md flex items-center gap-2">
                            <div className="flex-1 bg-beige/10 rounded-full h-8 px-3.5 flex items-center text-xs text-cream/40">
                                Send message to Finexa...
                            </div>
                            <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-ivory shadow-md">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default memo(Hero);
