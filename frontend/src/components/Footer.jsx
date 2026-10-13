import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MarqueeButton from './ui/MarqueeButton';
import { User, Activity, ShieldCheck, Cpu, Check, ExternalLink, MessageCircle, Send, Code, Terminal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

gsap.registerPlugin(ScrollTrigger);

const InstagramIcon = ({ size = 20, className = "" }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
);

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
    const [years, setYears] = useState(15);
    const [investment, setInvestment] = useState(10000);

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
                    end: "+=3400",
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

    const P = investment; // Dynamic monthly investment
    const r = 0.12;  // 12% annual return
    const i = r / 12;
    const n = years * 12;
    const fv = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
    const totalInvested = P * n;

    // Formatting helper
    const formatRupees = (val) => {
        if (val >= 10000000) {
            return `₹${(val / 10000000).toFixed(2)} Cr`;
        }
        if (val >= 100000) {
            return `₹${(val / 100000).toFixed(2)} Lakh`;
        }
        return `₹${Math.round(val).toLocaleString('en-IN')}`;
    };

    // Build dynamic points for the Recharts AreaChart
    const chartData = [];
    for (let y = 0; y <= years; y++) {
        const currentMonth = y * 12;
        const currentVal = P * ((Math.pow(1 + i, currentMonth) - 1) / i) * (1 + i);
        const currentInvested = P * currentMonth;
        chartData.push({
            year: `Year ${y}`,
            value: Math.round(currentVal),
            invested: currentInvested,
            wealth: Math.round(currentVal - currentInvested)
        });
    }

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#1c140e]/95 border border-gold/30 p-3 rounded-xl shadow-xl backdrop-blur-md text-[10px] sm:text-xs">
                    <p className="font-bold text-gold uppercase tracking-wider mb-1 font-mono">{data.year}</p>
                    <p className="text-ivory/80">Future Value: <span className="font-bold text-ivory">{formatRupees(data.value)}</span></p>
                    <p className="text-ivory/80">Invested: <span className="font-bold text-ivory">{formatRupees(data.invested)}</span></p>
                    <p className="text-ivory/85 font-semibold">Wealth Gained: <span className="font-extrabold text-gold">{formatRupees(data.wealth)}</span></p>
                </div>
            );
        }
        return null;
    };

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
                    className="absolute z-10 flex flex-col items-center text-center px-4 will-change-transform max-w-full"
                    style={{ transformOrigin: 'center center' }}
                >
                    <h1 className="text-ivory text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-serif font-bold uppercase tracking-tight leading-[0.95]">
                        Your Wealth <br /> Never <br /> Sleeps.
                    </h1>

                    {/* Floating Badges */}
                    <div
                        ref={badge1Ref}
                        className="absolute top-0 -left-4 sm:-left-10 bg-burgundy px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 text-[8.5px] sm:text-[10px] font-bold text-ivory tracking-widest rotate-[-5deg] shadow-lg border border-ivory/5 select-none"
                    >
                        <Activity size={12} /> PORTFOLIO_SYNC
                    </div>
                    <div
                        ref={badge2Ref}
                        className="absolute bottom-1/4 -right-4 sm:-right-10 bg-teal px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 text-[8.5px] sm:text-[10px] font-bold text-ivory tracking-widest rotate-[8deg] shadow-lg border border-ivory/5 select-none"
                    >
                        <ShieldCheck size={12} /> DPDP_SECURE
                    </div>
                    <div
                        ref={badge3Ref}
                        className="absolute bottom-0 left-1/4 bg-gold px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg flex items-center gap-1.5 sm:gap-2 text-[8.5px] sm:text-[10px] font-bold text-ink tracking-widest border border-beige/10 select-none"
                    >
                        <Cpu size={12} /> FINEXA_AI
                    </div>
                </div>

                {/* Subtext */}
                <p
                    ref={subtextRef}
                    className="absolute bottom-10 max-w-md text-center text-cream/40 text-[10px] sm:text-xs z-10 uppercase tracking-widest font-semibold px-4"
                >
                    Your Intelligent Financial Companion. <br /> Accessible directly through WhatsApp.
                </p>

                {/* ═══ PHASE 2: Transitional Content ═══ */}
                <div
                    ref={transitionRef}
                    className="absolute inset-0 z-[12] flex flex-col items-center justify-center text-center px-6 pointer-events-none will-change-transform"
                >
                    <span class="px-3 sm:px-4 py-1 sm:py-1.5 bg-teal-500/20 text-teal-300 sm:text-[10px] text-[9px] font-extrabold rounded-full uppercase tracking-widest mb-6 sm:mb-8 border border-teal-400/40 shadow-[0_0_12px_rgba(20,184,166,0.15)]">
                        Protocol Initialized
                    </span>
                    <h2 className="text-ivory text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-serif font-bold uppercase tracking-tight leading-[0.95]">
                        The Future Is <br />
                        <span className="text-gold">Autonomous</span>
                    </h2>
                    <p className="mt-6 sm:mt-8 text-cream/40 text-xs md:text-sm uppercase tracking-[0.25em] sm:tracking-[0.35em] font-semibold max-w-lg px-4">
                        Smarter wealth decisions. <br />
                        Powered by Agentic AI in WhatsApp.
                    </p>
                    <div className="mt-8 sm:mt-10 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                        <span className="text-[10px] font-mono text-teal-300 font-semibold uppercase tracking-widest">
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
                    className="absolute inset-0 z-30 bg-ivory flex flex-col p-3 sm:p-4 md:p-6 text-ink justify-between will-change-transform overflow-y-auto no-scrollbar lg:overflow-hidden"
                >
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 items-center max-w-[90rem] mx-auto w-full pt-5 sm:pt-8">
                        {/* Chart Card */}
                        <div className="bg-ink rounded-3xl h-auto min-h-[420px] lg:h-[460px] p-6 sm:p-9 flex flex-col justify-between overflow-hidden border border-beige/40 shadow-[0_8px_32px_rgba(58,46,37,0.06)] relative group select-none">
                            {/* Video Background */}
                            <video
                                src="/Compounded.mp4"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover z-0 opacity-35 group-hover:scale-102 transition-transform duration-1000"
                            />

                            {/* Top header */}
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <span className="px-3 py-1 bg-gold/20 text-gold text-[9.5px] sm:text-[10px] font-bold rounded uppercase tracking-wider">
                                        Growth Matrix
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ivory mt-2.5">Compounded Trajectory</h3>
                                </div>
                                <div className="text-right">
                                    <span className="text-[9.5px] sm:text-[10px] uppercase font-bold text-ivory/50 block">Future Value</span>
                                    <span className="font-serif text-2xl sm:text-3xl font-black text-gold select-all">{formatRupees(fv)}</span>
                                </div>
                            </div>

                            {/* Dynamic stats values */}
                            <div className="relative z-10 grid grid-cols-3 gap-2 bg-black/40 backdrop-blur-xs p-3 sm:p-4 rounded-2xl border border-ivory/5 text-left my-auto mt-4 sm:mt-5">
                                <div>
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-ivory/50 block">Investment</span>
                                    <span className="text-sm sm:text-base font-extrabold text-ivory">
                                        ₹{Math.round(investment).toLocaleString('en-IN')}/mo
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-ivory/50 block">Total Invested</span>
                                    <span className="text-sm sm:text-base font-extrabold text-ivory/90">{formatRupees(totalInvested)}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-ivory/50 block">Duration</span>
                                    <span className="text-sm sm:text-base font-extrabold text-gold">{years} Years</span>
                                </div>
                            </div>

                            {/* Interactive Sliders */}
                            <div className="relative z-10 mt-4 sm:mt-5 flex flex-col gap-3 sm:gap-4 text-left">
                                {/* Monthly Investment Control */}
                                <div className="flex flex-col gap-1.5">
                                    <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-ivory/50 uppercase tracking-widest">
                                        <span>Monthly Investment</span>
                                        <div className="flex items-center gap-1 bg-black/30 border border-ivory/10 px-2.5 py-1 rounded">
                                            <span className="text-gold font-extrabold text-xs">₹</span>
                                            <input
                                                type="number"
                                                min="500"
                                                max="1000000"
                                                value={investment}
                                                onChange={(e) => setInvestment(Math.max(0, Number(e.target.value)))}
                                                className="bg-transparent text-gold font-extrabold text-xs w-16 outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                            />
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="1000"
                                        max="100000"
                                        step="1000"
                                        value={investment}
                                        onChange={(e) => setInvestment(Number(e.target.value))}
                                        className="w-full accent-gold bg-ivory/10 h-1.5 rounded-lg appearance-none cursor-pointer relative z-10 transition-all hover:bg-ivory/20"
                                    />
                                </div>

                                {/* Years Control */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] sm:text-[10px] font-bold text-ivory/50 uppercase tracking-widest flex justify-between">
                                        <span>Adjust Horizon</span>
                                        <span className="text-gold font-extrabold">{years} Years</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="5"
                                        max="30"
                                        step="1"
                                        value={years}
                                        onChange={(e) => setYears(Number(e.target.value))}
                                        className="w-full accent-gold bg-ivory/10 h-1.5 rounded-lg appearance-none cursor-pointer relative z-10 transition-all hover:bg-ivory/20"
                                    />
                                </div>
                            </div>

                            {/* Dynamic Recharts AreaChart */}
                            <div className="w-full h-24 sm:h-36 relative z-10 overflow-visible mt-4 mb-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="footerChartGradDark" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C9A227" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <ChartTooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(201,162,39,0.3)', strokeWidth: 1 }} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#C9A227"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#footerChartGradDark)"
                                            dot={{ r: 3, fill: '#C9A227', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#6B1E2B', stroke: '#C9A227', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Timeline bottom */}
                            <div className="flex justify-between items-center text-[8.5px] sm:text-[9px] font-mono text-ivory/50 border-t border-ivory/10 pt-2.5 relative z-10">
                                <span>YEAR_0</span>
                                <span>YEAR_{years}</span>
                            </div>
                        </div>

                        {/* CTA Card */}
                        <div className="bg-burgundy rounded-3xl p-6 sm:p-8 lg:p-6 text-ivory flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-10 h-auto min-h-[420px] lg:h-[460px] shadow-2xl relative overflow-visible group">
                            {/* Background glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[64px] pointer-events-none z-0" />

                            {/* Human image (left) */}
                            <div className="relative z-10 flex items-center justify-center w-full sm:w-[50%] lg:w-[52%] order-1 h-[320px] sm:h-[404px] lg:h-[540px] lg:my-[-40px]">
                                <img
                                    src="/Human.png"
                                    alt=""
                                    className="h-full w-auto max-w-full object-contain select-none drop-shadow-2xl brightness-0 invert animate-human-shake"
                                />
                            </div>

                            {/* Content (right) */}
                            <div className="relative z-20 flex flex-col items-center sm:items-start justify-center gap-4 sm:gap-5 w-full sm:w-[58%] order-2 text-center sm:text-left">
                                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[0.95]">
                                    Ready to <br /> Begin?
                                </h2>
                                <p className="text-ivory/85 font-normal text-sm sm:text-base max-w-lg leading-relaxed">
                                    Join the elite network of investors steering assets with autonomous intelligence.
                                </p>

                                <MarqueeButton
                                    text="START NOW"
                                    to="/signup"
                                    className="btn-23--borderless mt-1 sm:mt-2"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Links & Comprehensive Navigation */}
                    <footer className="mt-6 sm:mt-8 border-t border-beige/60 pt-6 sm:pt-8 text-ink w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-left">
                            
                            {/* Column 1: Modules & Navigation (Landing Page Sections) */}
                            <div className="space-y-3">
                                <h4 className="font-serif font-bold text-burgundy text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles size={14} className="text-gold" />
                                    <span>Modules & Navigation</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs font-semibold text-ink/80">
                                    <a href="#features" className="hover:text-burgundy transition-colors">Features</a>
                                    <a href="#how-it-works" className="hover:text-burgundy transition-colors">How It Works</a>
                                    <a href="#why-finexa" className="hover:text-burgundy transition-colors">Why FINEXA</a>
                                    <a href="#pricing" className="hover:text-burgundy transition-colors">Pricing</a>
                                </div>
                            </div>

                            {/* Column 2: Developers & Team (Circular Profile Icons with Hover Details) */}
                            <div className="space-y-3">
                                <h4 className="font-serif font-bold text-burgundy text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                                    <Code size={14} className="text-gold" />
                                    <span>Developers</span>
                                </h4>
                                <p className="text-[11px] text-taupe font-medium">Hover profile logo to view developer details</p>
                                
                                <div className="flex items-center gap-3 pt-1">
                                    {/* Dev Profile 1 */}
                                    <div className="relative group cursor-pointer">
                                        <div className="w-11 h-11 rounded-full bg-burgundy text-ivory border-2 border-ivory shadow-md flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:border-gold transition-all">
                                            <User size={20} />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-ivory rounded-xl shadow-xl border border-gold/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 text-left">
                                            <p className="text-xs font-bold text-gold">Lead AI Architect</p>
                                            <p className="text-[10px] text-ivory/80 mt-0.5">Autonomous Reasoning & Multi-Agent Engine</p>
                                        </div>
                                    </div>

                                    {/* Dev Profile 2 */}
                                    <div className="relative group cursor-pointer">
                                        <div className="w-11 h-11 rounded-full bg-teal text-ivory border-2 border-ivory shadow-md flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:border-gold transition-all">
                                            <Terminal size={20} />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-ivory rounded-xl shadow-xl border border-teal-400/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 text-left">
                                            <p className="text-xs font-bold text-teal-300">Quant Lead</p>
                                            <p className="text-[10px] text-ivory/80 mt-0.5">GWO & Algorithmic Optimization Models</p>
                                        </div>
                                    </div>

                                    {/* Dev Profile 3 */}
                                    <div className="relative group cursor-pointer">
                                        <div className="w-11 h-11 rounded-full bg-camel text-ink border-2 border-ivory shadow-md flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:border-gold transition-all">
                                            <Code size={20} />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-ink text-ivory rounded-xl shadow-xl border border-amber-400/30 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 text-left">
                                            <p className="text-xs font-bold text-gold">Full-Stack Core</p>
                                            <p className="text-[10px] text-ivory/80 mt-0.5">WhatsApp API & Real-time Web Bridge</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Legal & Governance (Single Button) */}
                            <div className="space-y-3">
                                <h4 className="font-serif font-bold text-burgundy text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-gold" />
                                    <span>Terms & Legal</span>
                                </h4>
                                <p className="text-[11px] text-taupe font-medium">Compliance, DPDP Act & Privacy Frameworks</p>
                                <a
                                    href="https://finexa-privacy-policy.vercel.app/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-3 px-4 rounded-xl bg-burgundy hover:bg-burgundy/90 text-ivory font-bold text-xs flex items-center justify-between shadow-sm transition-all active:scale-98 group"
                                >
                                    <span className="flex items-center gap-2">
                                        <ShieldCheck size={16} className="text-gold" />
                                        <span>Terms & Privacy Policy</span>
                                    </span>
                                    <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                            </div>

                            {/* Column 4: Connect with WA, Telegram & Instagram (3 Circle Icons in Single Row) */}
                            <div className="space-y-3">
                                <h4 className="font-serif font-bold text-burgundy text-sm sm:text-base uppercase tracking-wider flex items-center gap-2">
                                    <MessageCircle size={14} className="text-gold" />
                                    <span>Connect & Community</span>
                                </h4>
                                <p className="text-[11px] text-taupe font-medium">Join our channels on WhatsApp, Telegram & Instagram</p>
                                
                                <div className="flex items-center gap-3 pt-1">
                                    {/* WhatsApp Circle Logo */}
                                    <a
                                        href="https://wa.me/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Connect on WhatsApp"
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="w-11 h-11 rounded-full bg-[#25D366] text-white border-2 border-ivory shadow-md flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:shadow-lg transition-all">
                                            <MessageCircle size={20} />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-ink text-ivory text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                                            WhatsApp
                                        </div>
                                    </a>

                                    {/* Telegram Circle Logo */}
                                    <a
                                        href="https://t.me/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Join Telegram Channel"
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="w-11 h-11 rounded-full bg-[#0088cc] text-white border-2 border-ivory shadow-md flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:shadow-lg transition-all">
                                            <Send size={18} />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-ink text-ivory text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                                            Telegram
                                        </div>
                                    </a>

                                    {/* Instagram Circle Logo */}
                                    <a
                                        href="https://instagram.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title="Follow on Instagram"
                                        className="relative group cursor-pointer"
                                    >
                                        <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white border-2 border-ivory shadow-md flex items-center justify-center font-bold text-sm group-hover:scale-110 group-hover:shadow-lg transition-all">
                                            <InstagramIcon size={20} />
                                        </div>
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-2.5 py-1 bg-ink text-ivory text-[10px] font-bold rounded-lg shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 whitespace-nowrap">
                                            Instagram
                                        </div>
                                    </a>
                                </div>
                            </div>

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
