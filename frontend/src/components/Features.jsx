import React, { useEffect, useRef, useState, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { StickyScrollReveal } from './StickyScrollReveal';
import TextType from './TextType';
import FloatingElements from './FloatingElements';

gsap.registerPlugin(ScrollTrigger);

const FEATURES_CONTENT = [
    {
        title: "AI-Powered Portfolio Planning",
        description: "Craft tailor-made asset allocations driven by autonomous algorithms. Optimize risk-adjusted returns automatically without exposing your personal information.",
        content: (
            <div className="h-full w-full relative group overflow-hidden bg-ink">
                <img src="/assets/features/ai_portfolio_1784285084959.png" alt="AI Portfolio" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/95 to-ivory/60" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-between text-left">
                    <div>
                        <span className="px-3 py-1 bg-burgundy/10 text-burgundy text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Smart Allocation
                        </span>
                        <h4 className="text-xl font-serif font-bold text-ink mt-4">AI Rebalancing Engine</h4>
                    </div>

                    <div className="space-y-3.5 my-auto">
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-ink mb-1 select-none">
                                <span>Equity (Nifty 50 Index)</span>
                                <span>60%</span>
                            </div>
                            <div className="w-full bg-beige/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-burgundy h-full rounded-full transition-all duration-1000 group-hover:w-[60%] w-[10%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-ink mb-1 select-none">
                                <span>Debt / Arbitrage Funds</span>
                                <span>30%</span>
                            </div>
                            <div className="w-full bg-beige/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-teal h-full rounded-full transition-all duration-1000 group-hover:w-[30%] w-[10%]" />
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-[11px] font-bold text-ink mb-1 select-none">
                                <span>Gold ETF / Sovereign Gold</span>
                                <span>10%</span>
                            </div>
                            <div className="w-full bg-beige/30 h-2 rounded-full overflow-hidden">
                                <div className="bg-gold h-full rounded-full transition-all duration-1000 group-hover:w-[10%] w-[5%]" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-beige/40 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-taupe uppercase">Status</span>
                        <span className="text-[10.5px] font-bold text-teal flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                            REBALANCING_COMPLETE
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: "Live Market Intelligence",
        description: "Stay updated with live mutual fund NAVs, FD interest rates across major Indian banks, and Nifty index movements, all streamed into your private chat workspace.",
        content: (
            <div className="h-full w-full relative group overflow-hidden bg-ink">
                <img src="/assets/features/market_intel_1784285101555.png" alt="Market Intelligence" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/95 to-ivory/60" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-between text-left">
                    <div>
                        <span className="px-3 py-1 bg-teal/10 text-teal text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Real-Time Data
                        </span>
                        <h4 className="text-xl font-serif font-bold text-ink mt-4">Market Monitor</h4>
                    </div>

                    <div className="space-y-2.5 my-auto">
                        <div className="p-2.5 bg-cream border border-beige/30 rounded-xl flex items-center justify-between transition-all group-hover:translate-x-1 duration-300">
                            <span className="text-[11px] font-bold text-ink">SBI Max FD Rate</span>
                            <span className="text-[12px] font-extrabold text-teal">7.25% p.a.</span>
                        </div>
                        <div className="p-2.5 bg-cream border border-beige/30 rounded-xl flex items-center justify-between transition-all group-hover:translate-x-1 duration-500">
                            <span className="text-[11px] font-bold text-ink">Nifty 50 Index</span>
                            <span className="text-[12px] font-extrabold text-teal">24,450.80 (+1.45%)</span>
                        </div>
                        <div className="p-2.5 bg-cream border border-beige/30 rounded-xl flex items-center justify-between transition-all group-hover:translate-x-1 duration-700">
                            <span className="text-[11px] font-bold text-ink">PPF Interest rate</span>
                            <span className="text-[12px] font-extrabold text-ink">7.10% (Fixed)</span>
                        </div>
                    </div>

                    <div className="border-t border-beige/40 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-taupe uppercase">Tickers</span>
                        <span className="text-[9.5px] font-bold text-gold tracking-widest uppercase">
                            LIVE MF NAVs ACTIVE
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: "Goal-Based Financial Planning",
        description: "Establish specific milestones like home purchases, child education, or retirement. Let our planner build a step-by-step monthly saving and SIP roadmap.",
        content: (
            <div className="h-full w-full relative group overflow-hidden bg-ink">
                <img src="/assets/features/goal_planning_1784285113310.png" alt="Goal Planning" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/95 to-ivory/60" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-between text-left">
                    <div>
                        <span className="px-3 py-1 bg-camel/15 text-camel text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Goal Mapping
                        </span>
                        <h4 className="text-xl font-serif font-bold text-ink mt-4">Future Roadmaps</h4>
                    </div>

                    <div className="space-y-3.5 my-auto">
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-ink">
                                <span>Retirement Fund</span>
                                <span className="text-burgundy">72%</span>
                            </div>
                            <div className="text-[9px] text-taupe">Target: ₹2.5 Cr · Current: ₹1.8 Cr</div>
                            <div className="w-full bg-beige/30 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-burgundy h-full rounded-full transition-all group-hover:w-[72%] w-[20%] duration-1000" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-bold text-ink">
                                <span>Child Higher Education</span>
                                <span className="text-teal">42%</span>
                            </div>
                            <div className="text-[9px] text-taupe">Target: ₹40 Lakh · Current: ₹16.8 Lakh</div>
                            <div className="w-full bg-beige/30 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-teal h-full rounded-full transition-all group-hover:w-[42%] w-[10%] duration-1000" />
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-beige/40 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-taupe uppercase">Telemetry</span>
                        <span className="text-[10px] font-mono text-burgundy font-bold">
                            GOAL_TRACKING_ACTIVE
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
    {
        title: "DPDP-Compliant Privacy",
        description: "Your wealth is your business. We conform fully to India's DPDP Act, keeping your credentials secure and never selling your data.",
        content: (
            <div className="h-full w-full relative group overflow-hidden bg-ink">
                <img src="/assets/features/privacy_vault_1784285123899.png" alt="Privacy Vault" className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/95 to-ivory/60" />
                <div className="relative z-10 h-full p-8 flex flex-col justify-between text-left">
                    <div>
                        <span className="px-3 py-1 bg-gold/15 text-gold text-[10px] font-bold rounded-full uppercase tracking-wider">
                            Zero Data Exposure
                        </span>
                        <h4 className="text-xl font-serif font-bold text-ink mt-4">Consent Architecture</h4>
                    </div>

                    <div className="space-y-3 my-auto">
                        <div className="flex items-center justify-between p-2 bg-cream rounded-lg border border-beige/30 text-[10.5px]">
                            <span className="font-semibold text-ink">Consent Revocation Rights</span>
                            <span className="px-2 py-0.5 bg-teal/10 text-teal font-extrabold rounded-md text-[8.5px]">GRANTED</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-cream rounded-lg border border-beige/30 text-[10.5px]">
                            <span className="font-semibold text-ink">Third-Party Data Sharing</span>
                            <span className="px-2 py-0.5 bg-burgundy/10 text-burgundy font-extrabold rounded-md text-[8.5px]">DISABLED</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-cream rounded-lg border border-beige/30 text-[10.5px]">
                            <span className="font-semibold text-ink">Data Anonymization Protocol</span>
                            <span className="px-2 py-0.5 bg-gold/20 text-ink font-extrabold rounded-md text-[8.5px]">ACTIVE</span>
                        </div>
                    </div>

                    <div className="border-t border-beige/40 pt-4 flex items-center justify-between">
                        <span className="text-[10px] font-mono text-taupe uppercase">Consent Status</span>
                        <span className="text-[10px] font-mono text-teal font-bold">
                            PRIVACY_SHIELD_ACTIVE
                        </span>
                    </div>
                </div>
            </div>
        ),
    },
];

const Features = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const runnerLeftRef = useRef(null);
    const runnerRightRef = useRef(null);
    const progressRef = useRef({ top: null, right: null, bottom: null, left: null });
    const [activeCard, setActiveCard] = useState(0);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const scrollEnd = "+=2400";

            // Pin the section & update active card on scroll
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: scrollEnd,
                pin: true,
                scrub: 0.8,
                onUpdate: (self) => {
                    const index = Math.min(
                        FEATURES_CONTENT.length - 1,
                        Math.floor(self.progress * FEATURES_CONTENT.length)
                    );
                    setActiveCard(index);
                }
            });

            // 1. Elegant Title Reveal
            gsap.fromTo(titleRef.current,
                { opacity: 0, y: 30, scale: 0.95 },
                {
                    opacity: 1, y: 0, scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 40%"
                    }
                }
            );

            // 2. Dual Runner Text Parallax
            gsap.to(runnerLeftRef.current, {
                xPercent: -35,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: scrollEnd,
                    scrub: 1
                }
            });

            gsap.to(runnerRightRef.current, {
                xPercent: 35,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: scrollEnd,
                    scrub: 1
                }
            });

            // 3. Edge Progress Borders
            const progressTl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: scrollEnd,
                    scrub: 0.2
                }
            });

            progressTl
                .fromTo(progressRef.current.top, { scaleX: 0 }, { scaleX: 1, ease: "none" })
                .fromTo(progressRef.current.right, { scaleY: 0 }, { scaleY: 1, ease: "none" })
                .fromTo(progressRef.current.bottom, { scaleX: 0 }, { scaleX: 1, ease: "none" })
                .fromTo(progressRef.current.left, { scaleY: 0 }, { scaleY: 1, ease: "none" });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="features"
            ref={sectionRef}
            className="relative min-h-screen w-full bg-burgundy overflow-hidden flex flex-col items-center justify-start pt-14 pb-8 px-4 sm:px-8 md:px-12"
        >
            {/* Edge Progress Borders */}
            <div ref={el => progressRef.current.top = el} className="absolute top-0 left-0 w-full h-[12px] bg-camel z-50 origin-left" />
            <div ref={el => progressRef.current.right = el} className="absolute top-0 right-0 w-[12px] h-full bg-camel z-50 origin-top" />
            <div ref={el => progressRef.current.bottom = el} className="absolute bottom-0 left-0 w-full h-[12px] bg-camel z-50 origin-right" />
            <div ref={el => progressRef.current.left = el} className="absolute top-0 left-0 w-[12px] h-full bg-camel z-50 origin-bottom" />

            {/* Background Layers */}
            <div className="absolute inset-0 z-0">
                {/* Dual Scrolling Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none opacity-20">
                    <div ref={runnerLeftRef} className="whitespace-nowrap text-[22vw] font-extrabold uppercase tracking-tighter text-camel opacity-15">
                        INVEST GROW PROTECT PLAN SAVE
                    </div>
                    <div ref={runnerRightRef} className="whitespace-nowrap text-[18vw] font-extrabold uppercase tracking-tighter text-ivory opacity-6">
                        RETURNS FREEDOM WEALTH SECURITY
                    </div>
                </div>

                <FloatingElements count={8} containerRef={sectionRef} />
            </div>

            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 h-full flex flex-col items-center justify-start relative z-10">
                {/* Header Area */}
                <div className="text-center mb-4 md:mb-5">
                    <h2 ref={titleRef} className="text-ivory text-[clamp(2.2rem,4.5vw,5.2rem)] font-serif font-bold uppercase tracking-tight leading-[1] select-none">
                        THE NEXT <br className="hidden sm:inline" />
                        <span className="sm:ml-3 inline-block">
                            <TextType
                                text={['ERA', 'STEP', 'MOVE']}
                                className="text-gold"
                                cursorClassName="text-gold"
                                cursorCharacter=""
                                typingSpeed={110}
                                deletingSpeed={60}
                                pauseDuration={1800}
                            />
                        </span>
                    </h2>
                </div>

                {/* STICKY SCROLL AREA */}
                <div className="w-full h-[66vh] sm:h-[70vh] rounded-[32px] border border-beige/20 bg-ivory/95 shadow-[0_20px_50px_rgba(58,46,37,0.25)] overflow-hidden">
                    <StickyScrollReveal 
                        content={FEATURES_CONTENT} 
                        activeCard={activeCard}
                        onSelectCard={setActiveCard}
                    />
                </div>

                {/* SCROLL HINT */}
                <div className="mt-3 flex flex-col items-center opacity-60 animate-bounce">
                    <span className="text-ivory font-semibold text-[9px] tracking-widest uppercase">Syncing Wealth Nodes</span>
                    <span className="text-ivory text-xs mt-0.5">↓</span>
                </div>
            </div>
        </section>
    );
};

export default memo(Features);
