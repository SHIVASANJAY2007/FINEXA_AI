import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EncryptedText } from './EncryptedText';
import { TrendingUp, Wallet, Target, Receipt, PiggyBank, ArrowRight, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
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

    const cards = [
        {
            title: "Profiling",
            description: "Financial DNA",
            color: "bg-burgundy text-ivory",
            icon: <UserCheck size={32} className="text-gold" />,
            shape: "rounded-full"
        },
        {
            title: "Planning",
            description: "Goal Roadmaps",
            color: "bg-teal text-ivory",
            icon: <Target size={32} className="text-camel" />,
            shape: "rounded-[40px]"
        },
        {
            title: "Markets",
            description: "Live NAVs & FDs",
            color: "bg-camel text-ivory",
            icon: <TrendingUp size={32} className="text-ink" />,
            shape: "rounded-[40px] rounded-r-[100px]"
        },
        {
            title: "Risk",
            description: "Stress Testing",
            color: "bg-gold text-ink",
            icon: <Receipt size={32} className="text-ink" />,
            shape: "rounded-[40px]"
        },
        {
            title: "Monitor",
            description: "Weekly Alerts",
            color: "bg-taupe text-ivory",
            icon: <PiggyBank size={32} className="text-ivory" />,
            shape: "rounded-full"
        }
    ];

    useEffect(() => {
        // Typing timeline simulation
        const timers = [
            setTimeout(() => setChatStep(1), 800),    // AI msg 1
            setTimeout(() => setChatStep(2), 1800),   // User msg
            setTimeout(() => setChatStep(3), 2800),   // AI msg 2
            setTimeout(() => setChatStep(4), 3600),   // Projection Card
            setTimeout(() => setChatStep(5), 5200),   // AI msg 3
        ];

        // GSAP ScrollTrigger for pinning and cards reveal
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=2000",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1
                }
            });

            // Set initial card states
            gsap.set(cardsRef.current, {
                opacity: 0,
                y: 60,
                rotate: -8,
                scale: 0.8,
                filter: "blur(12px) grayscale(1)"
            });

            // Reveal cards sequentially on scroll
            cardsRef.current.forEach((card, index) => {
                if (!card) return;
                tl.to(card, {
                    opacity: 1,
                    y: 0,
                    rotate: 0,
                    scale: 1.1,
                    filter: "blur(0px) grayscale(0) brightness(1.2)",
                    duration: 2,
                    ease: "power2.out"
                })
                    .to(card, {
                        scale: 1,
                        filter: "blur(0px) grayscale(0) brightness(1)",
                        duration: 1,
                        ease: "power2.inOut"
                    }, ">-0.5");
            });

        }, containerRef);

        return () => {
            timers.forEach(clearTimeout);
            ctx.revert();
        };
    }, []);

    const scrollToFeatures = () => {
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div ref={containerRef} className="w-full bg-ivory text-ink relative min-h-screen overflow-hidden flex flex-col justify-center py-20 md:py-28 dot-grid linen-noise">
            {/* Ambient Blooms */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-burgundy/6 blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/4 blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>

            <div ref={contentRef} className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                {/* Left Column: Headlines & CTA */}
                <div className="lg:col-span-7 flex flex-col space-y-8 text-left">
                    <h1 className="hero-title text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-ink leading-[1.1] uppercase">
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

                    <p className="text-taupe text-base md:text-lg max-w-lg font-normal leading-relaxed">
                        Your intelligent financial companion on WhatsApp. Powered by Agentic AI that reasons, plans, and remembers — delivering personalized wealth decisions without the cost of a financial advisor.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <button
                            onClick={scrollToFeatures}
                            className="bg-burgundy text-ivory px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider hover:bg-burgundy/90 transition-all active:scale-95 shadow-[0_4px_16px_rgba(107,30,43,0.25)] flex items-center justify-center gap-2 group pointer-events-auto cursor-pointer"
                        >
                            <span>Explore Features</span>
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <a
                            href="/signup"
                            className="bg-transparent border border-beige hover:border-ink text-ink px-8 py-4 rounded-full font-semibold text-sm uppercase tracking-wider transition-all text-center flex items-center justify-center pointer-events-auto"
                        >
                            Start Free
                        </a>
                    </div>

                    {/* Trust Line */}
                    <div className="flex items-center gap-2 pt-4 border-t border-beige/40 max-w-md">
                        <span className="text-[11.5px] font-medium text-taupe uppercase tracking-wider">WhatsApp-Native</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-beige"></span>
                        <span className="text-[11.5px] font-medium text-taupe uppercase tracking-wider">DPDP Compliant</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-beige"></span>
                        <span className="text-[11.5px] font-medium text-taupe uppercase tracking-wider">Agentic AI Powered</span>
                    </div>
                </div>

                {/* Right Column: Phone Mockup — interactive 3D tilt */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start lg:-ml-4" style={{ perspective: '1400px' }}>
                    <motion.div
                        onMouseEnter={() => setPhoneHovered(true)}
                        onMouseMove={handlePhoneMouseMove}
                        onMouseLeave={handlePhoneMouseLeave}
                        animate={{
                            rotateX: phoneHovered ? phoneRotate.x + 6 : 0,
                            rotateY: phoneHovered ? phoneRotate.y - 6 : 0,
                            translateZ: phoneHovered ? -60 : 0,
                            scale: phoneHovered ? 1.03 : 1,
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
                    <div className="w-[355px] h-[620px] bg-ink rounded-[48px] p-3 shadow-[0_24px_64px_rgba(58,46,37,0.18)] border-4 border-beige/60 relative overflow-hidden flex flex-col">
                        {/* Status bar */}
                        <div className="flex justify-between items-center px-6 pt-2 pb-3 z-20 text-[9px] font-semibold text-cream/70 select-none">
                            <span>9:41</span>
                            <div className="w-20 h-4 bg-black rounded-full absolute left-1/2 -translate-x-1/2 top-1.5"></div>
                            <div className="flex items-center gap-1">
                                <span>5G</span>
                                <div className="w-4 h-2 bg-cream/70 rounded-xs"></div>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-3 space-y-3 pt-2">
                            {/* Message 1: AI */}
                            {chatStep >= 1 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-start gap-1.5 max-w-[85%]"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-burgundy flex items-center justify-center text-[10px] font-extrabold text-gold flex-shrink-0">F</div>
                                    <div className="bg-burgundy text-ivory p-3 rounded-2xl rounded-tl-xs text-[11px] leading-normal shadow-[0_4px_12px_rgba(107,30,43,0.1)]">
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
                                    <div className="bg-beige/25 border border-beige/40 text-cream p-3 rounded-2xl rounded-tr-xs text-[11px] leading-normal">
                                        What should I do with it?
                                    </div>
                                </motion.div>
                            )}

                            {/* Message 3: AI */}
                            {chatStep >= 3 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-start gap-1.5 max-w-[85%]"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-burgundy flex items-center justify-center text-[10px] font-extrabold text-gold flex-shrink-0">F</div>
                                    <div className="bg-burgundy text-ivory p-3 rounded-2xl rounded-tl-xs text-[11px] leading-normal shadow-[0_4px_12px_rgba(107,30,43,0.1)]">
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
                                    className="bg-cream border border-beige/50 p-3.5 rounded-2xl text-ink space-y-2 max-w-[90%] mx-auto shadow-[0_6px_18px_rgba(0,0,0,0.15)]"
                                >
                                    <div className="flex justify-between items-center text-[10px] font-extrabold text-burgundy uppercase tracking-wider">
                                        <span>Projection Card</span>
                                        <span className="text-gold font-bold">8.2% Return</span>
                                    </div>
                                    <div className="text-[12.5px] font-bold tracking-tight text-ink">
                                        ₹18,400 today → ₹31,200
                                    </div>
                                    <div className="text-[9px] text-taupe font-medium">
                                        Projected value in 5 years compound
                                    </div>
                                    <div className="w-full bg-beige/35 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-burgundy h-full rounded-full" style={{ width: '65%' }}></div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Message 5: AI */}
                            {chatStep >= 5 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="flex items-start gap-1.5 max-w-[85%]"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-burgundy flex items-center justify-center text-[10px] font-extrabold text-gold flex-shrink-0">F</div>
                                    <div className="bg-burgundy text-ivory p-3 rounded-2xl rounded-tl-xs text-[11px] leading-normal shadow-[0_4px_12px_rgba(107,30,43,0.1)]">
                                        Want me to set this up automatically?
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Interactive Footer */}
                        <div className="p-3 border-t border-beige/10 bg-ink/80 backdrop-blur-md flex items-center gap-2">
                            <div className="flex-1 bg-beige/10 rounded-full h-8 px-3.5 flex items-center text-[10px] text-cream/40">
                                Send message to Finexa...
                            </div>
                            <div className="w-8 h-8 rounded-full bg-burgundy flex items-center justify-center text-ivory">
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                    </motion.div>
                </div>
            </div>

            {/* GSAP Scroll Pinned Cards Container */}
            <div className="w-full mt-20 md:mt-24 max-w-7xl mx-auto px-6 overflow-visible flex flex-col items-center">
                <p className="text-center text-[10.5px] font-semibold text-taupe uppercase tracking-[3px] mb-8 select-none">
                    Scroll down to reveal financial domains
                </p>
                <div className="flex flex-wrap justify-center gap-6 overflow-visible max-w-5xl">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            ref={el => cardsRef.current[index] = el}
                            className={`${card.color} ${card.shape} w-[170px] h-[170px] p-4 flex flex-col justify-center items-center text-center relative group overflow-hidden transition-all duration-300 hover:scale-110 shadow-[0_4px_24px_rgba(58,46,37,0.08)] border border-beige/10`}
                        >
                            <div className="p-3 bg-ivory/10 rounded-xl group-hover:scale-110 transition-transform duration-500 mb-3">
                                {card.icon}
                            </div>
                            <div>
                                <h3 className="text-sm font-extrabold uppercase leading-none tracking-wider mb-1.5">
                                    {card.title}
                                </h3>
                                <p className="text-[8.5px] font-bold opacity-75 uppercase tracking-[0.2em]">
                                    {card.description}
                                </p>
                            </div>
                            <div className="absolute inset-0 bg-ivory/[0.15] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Hero;
