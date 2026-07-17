import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { User, Activity, ShieldCheck, Cpu, Bell, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
    const containerRef = useRef(null);
    const stickyRef = useRef(null);

    // Animation element refs
    const heroTextRef = useRef(null);
    const badge1Ref = useRef(null);
    const badge2Ref = useRef(null);
    const badge3Ref = useRef(null);
    const subtextRef = useRef(null);
    const arrow1Ref = useRef(null);
    const arrow2Ref = useRef(null);
    const arrow3Ref = useRef(null);
    const transitionRef = useRef(null);
    const finalContentRef = useRef(null);

    const [showNotification, setShowNotification] = useState(false);

    const handleSubscribe = () => {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 4000);
    };

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Set initial states
            gsap.set([arrow1Ref.current, arrow2Ref.current, arrow3Ref.current], {
                xPercent: -110
            });
            gsap.set(transitionRef.current, { opacity: 0, scale: 0.85 });
            gsap.set(finalContentRef.current, { opacity: 0, y: 80 });

            // Master timeline pinned to scroll
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=4000",
                    scrub: 1,
                    pin: stickyRef.current,
                }
            });

            // Phase 1: Hero text scales up and fades (0 → 2)
            tl.to(heroTextRef.current, {
                scale: 14,
                duration: 2,
                ease: "power2.in"
            }, 0);
            tl.to(badge1Ref.current, { y: -250, opacity: 0, duration: 1.5 }, 0);
            tl.to(badge2Ref.current, { y: 180, opacity: 0, duration: 1.5 }, 0);
            tl.to(badge3Ref.current, { y: 100, opacity: 0, duration: 1.5 }, 0);
            tl.to(heroTextRef.current, { opacity: 0, duration: 0.6 }, 1.4);
            tl.to(subtextRef.current, { opacity: 0, duration: 0.5 }, 1.2);

            // Phase 2: Transitional content appears (2 → 3.5)
            tl.to(transitionRef.current, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out"
            }, 2);
            tl.to(transitionRef.current, {
                opacity: 0,
                scale: 1.1,
                duration: 0.6,
            }, 3.2);

            // Phase 3: Arrow sweeps (staggered, 2.5 → 4.5)
            tl.to(arrow1Ref.current, { xPercent: 110, duration: 2, ease: "power2.inOut" }, 2.5);
            tl.to(arrow2Ref.current, { xPercent: 110, duration: 2, ease: "power2.inOut" }, 2.8);
            tl.to(arrow3Ref.current, { xPercent: 110, duration: 2, ease: "power2.inOut" }, 3.1);

            // Phase 4: Final content reveals (4 → 5)
            tl.to(finalContentRef.current, {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power3.out"
            }, 4);

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="relative bg-black w-full">
            {/* Sticky viewport */}
            <div
                ref={stickyRef}
                className="h-screen w-full overflow-hidden flex items-center justify-center bg-black relative"
            >
                {/* ═══ PHASE 1: Hero Text ═══ */}
                <div
                    ref={heroTextRef}
                    className="absolute z-10 flex flex-col items-center text-center px-4 will-change-transform"
                    style={{ transformOrigin: 'center center' }}
                >
                    <h1 className="text-ivory text-6xl md:text-8xl lg:text-9xl font-serif font-bold uppercase tracking-tight leading-[0.9]">
                        Your Wealth <br /> Never <br /> Sleeps.
                    </h1>

                    {/* Floating Badges */}
                    <div
                        ref={badge1Ref}
                        className="absolute top-0 -left-10 bg-burgundy px-4 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold text-ivory tracking-widest rotate-[-5deg] shadow-lg border border-ivory/5 select-none"
                    >
                        <Activity size={12} /> PORTFOLIO_SYNC
                    </div>
                    <div
                        ref={badge2Ref}
                        className="absolute bottom-1/4 -right-10 bg-teal px-4 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold text-ivory tracking-widest rotate-[8deg] shadow-lg border border-ivory/5 select-none"
                    >
                        <ShieldCheck size={12} /> DPDP_SECURE
                    </div>
                    <div
                        ref={badge3Ref}
                        className="absolute bottom-0 left-1/4 bg-gold px-4 py-1.5 rounded-lg flex items-center gap-2 text-[10px] font-bold text-ink tracking-widest border border-beige/10 select-none"
                    >
                        <Cpu size={12} /> FINEXA_AI
                    </div>
                </div>

                {/* Subtext */}
                <p
                    ref={subtextRef}
                    className="absolute bottom-10 max-w-md text-center text-cream/40 text-xs z-10 uppercase tracking-widest font-semibold"
                >
                    Your Intelligent Financial Companion. <br /> Accessible directly through WhatsApp.
                </p>

                {/* ═══ PHASE 2: Transitional Content ═══ */}
                <div
                    ref={transitionRef}
                    className="absolute inset-0 z-[12] flex flex-col items-center justify-center text-center px-6 pointer-events-none will-change-transform"
                >
                    <span className="px-4 py-1.5 bg-teal/15 text-teal text-[10px] font-bold rounded-full uppercase tracking-widest mb-8 border border-teal/20">
                        Protocol Initialized
                    </span>
                    <h2 className="text-ivory text-4xl md:text-6xl lg:text-8xl font-serif font-bold uppercase tracking-tight leading-[0.95]">
                        The Future Is <br />
                        <span className="text-gold">Autonomous</span>
                    </h2>
                    <p className="mt-8 text-cream/40 text-xs md:text-sm uppercase tracking-[0.35em] font-semibold max-w-lg">
                        Smarter wealth decisions. <br />
                        Powered by Agentic AI in WhatsApp.
                    </p>
                    <div className="mt-10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                        <span className="text-[10px] font-mono text-teal/70 uppercase tracking-widest">
                            Initializing Wealth Nodes...
                        </span>
                    </div>
                </div>

                {/* ═══ PHASE 3: Arrow Sweep Wipe ═══ */}
                <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                    <div
                        ref={arrow1Ref}
                        style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                        className="absolute top-0 left-0 h-[34%] w-[150%] bg-burgundy will-change-transform"
                    />
                    <div
                        ref={arrow2Ref}
                        style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                        className="absolute top-[33%] left-0 h-[34%] w-[150%] bg-teal will-change-transform"
                    />
                    <div
                        ref={arrow3Ref}
                        style={{ clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%)' }}
                        className="absolute top-[66%] left-0 h-[35%] w-[150%] bg-camel will-change-transform"
                    />
                </div>

                {/* ═══ PHASE 4: Final Content ═══ */}
                <div
                    ref={finalContentRef}
                    className="absolute inset-0 z-30 bg-ivory flex flex-col p-6 md:p-12 text-ink justify-between will-change-transform"
                >
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto w-full pt-16">
                        {/* Chart Card */}
                        <div className="bg-cream rounded-3xl h-[35vh] lg:h-[450px] p-8 flex flex-col justify-between overflow-hidden border border-beige/40 shadow-[0_8px_32px_rgba(58,46,37,0.06)] relative group">
                            <div>
                                <span className="px-2.5 py-0.5 bg-burgundy/10 text-burgundy text-[9px] font-bold rounded uppercase tracking-wider">
                                    Growth Matrix
                                </span>
                                <h3 className="font-serif text-2xl font-bold text-ink mt-3">Compounded Trajectory</h3>
                            </div>

                            {/* SVG Line Chart */}
                            <div className="w-full h-32 flex items-end relative overflow-visible mt-auto mb-4">
                                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="footerChartGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6B1E2B" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="#6B1E2B" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0,110 C80,105 120,80 180,75 C240,70 300,20 400,5 L400,120 L0,120 Z" fill="url(#footerChartGrad)" />
                                    <path d="M0,110 C80,105 120,80 180,75 C240,70 300,20 400,5" fill="none" stroke="#6B1E2B" strokeWidth="3.5" strokeLinecap="round" />
                                    <circle cx="400" cy="5" r="5" fill="#C9A227" className="animate-ping" />
                                    <circle cx="400" cy="5" r="4" fill="#C9A227" />
                                </svg>
                            </div>

                            <div className="flex justify-between items-center text-[10px] font-mono text-taupe border-t border-beige/40 pt-4">
                                <span>YEAR_0</span>
                                <span>YEAR_5</span>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-burgundy rounded-3xl p-8 lg:p-12 text-ivory flex flex-col justify-between h-[35vh] lg:h-[450px] shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[64px] pointer-events-none" />

                            <div>
                                <h2 className="font-serif text-4xl lg:text-6xl font-bold mb-4 tracking-tight leading-none">
                                    Ready to <br /> Begin?
                                </h2>
                                <p className="text-ivory/80 font-normal text-sm md:text-base max-w-md">
                                    Join the elite network of investors steering assets with autonomous intelligence.
                                </p>
                            </div>

                            <Link
                                to="/signup"
                                className="mt-8 bg-ink text-ivory rounded-full py-4 px-6 flex items-center justify-between font-bold text-xs uppercase tracking-widest hover:bg-teal transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.15)] group/btn"
                            >
                                <span className="flex items-center gap-3">
                                    <User className="bg-ivory/10 rounded-full p-2" size={32} />
                                    START NOW
                                </span>
                                <span className="group-hover/btn:translate-x-2 transition-transform text-lg">→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <footer className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-8 border-t border-beige/45 pt-8 text-ink w-full max-w-7xl mx-auto mb-6">
                        <div className="text-left">
                            <h4 className="font-bold text-taupe uppercase text-[9.5px] tracking-widest mb-4">Platform</h4>
                            <ul className="space-y-2 font-bold text-xs uppercase tracking-wider text-ink/80">
                                <li><a href="#features" className="hover:text-burgundy">Features</a></li>
                                <li><a href="#pricing" className="hover:text-burgundy">Pricing</a></li>
                            </ul>
                        </div>

                        <div className="text-left">
                            <h4 className="font-bold text-taupe uppercase text-[9.5px] tracking-widest mb-4">Connect with us</h4>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleSubscribe}
                                    className="bg-ink text-ivory px-5 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider hover:bg-teal transition-colors flex items-center gap-2 w-fit group cursor-pointer"
                                >
                                    <Bell size={12} className="group-hover:rotate-12 transition-transform" />
                                    Subscribe
                                </button>
                                <p className="text-[9.5px] uppercase font-bold text-taupe max-w-[170px] leading-relaxed">
                                    Get key market and protocol reports.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 flex flex-col md:items-end gap-6 justify-between text-left md:text-right">
                            <div className="flex gap-2">
                                {['LinkedIn', 'Telegram', 'X'].map(social => (
                                    <button
                                        key={social}
                                        className="px-5 py-2 border border-beige/40 rounded-full font-bold text-[9px] tracking-widest hover:bg-ink hover:text-ivory transition-all uppercase cursor-pointer"
                                    >
                                        {social}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[9.5px] font-mono text-taupe uppercase tracking-widest">© 2026 FINEXA_AI</p>
                        </div>
                    </footer>
                </div>
            </div>

            {/* Subscription Notification Toast */}
            <AnimatePresence>
                {showNotification && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-10 right-10 z-[110] bg-ivory border border-beige/65 shadow-[0_8px_32px_rgba(58,46,37,0.12)] rounded-2xl p-5 max-w-xs"
                    >
                        <div className="flex items-start gap-3 text-left">
                            <div className="bg-teal/10 p-2 rounded-full border border-teal/20 text-teal flex-shrink-0">
                                <Check size={18} />
                            </div>
                            <div>
                                <h4 className="font-serif font-bold text-ink text-base mb-1">Subscribed!</h4>
                                <p className="text-xs font-medium text-taupe leading-relaxed">
                                    You're in. We'll send you exclusive market updates and insights.
                                </p>
                            </div>
                        </div>
                        <motion.div
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: 4, ease: "linear" }}
                            className="absolute bottom-0 left-0 h-1 bg-teal"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Footer;
