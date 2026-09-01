import React, { useEffect, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import DecryptedText from './DecryptedText';

gsap.registerPlugin(ScrollTrigger);

const SectionWipe = ({ containerRef }) => {
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 100%", "start 0%"]
    });

    // Smooth spring physics to slow down and enrich the ribbon transition
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 55,
        damping: 18,
        restDelta: 0.001
    });

    const sweepX = useTransform(smoothProgress, [0, 1], ["-130%", "130%"]);
    const sweepY = useTransform(smoothProgress, [0, 1], ["-12%", "12%"]);

    // Remapped editorial brand colors with the prominent Burgundy red ribbon
    const layers = [
        { color: '#6B1E2B' }, // Burgundy (Main Red Ribbon)
        { color: '#C9A227' }, // Gold
        { color: '#C2A56D' }, // Camel
        { color: '#F6F3EB' }, // Cream
        { color: '#FDF6ED' }, // Ivory
    ];

    return (
        <div className="absolute inset-0 pointer-events-none z-[50] overflow-hidden">
            {layers.map((layer, i) => (
                <motion.div
                    key={i}
                    style={{
                        x: sweepX,
                        y: sweepY,
                        backgroundColor: layer.color,
                        clipPath: 'polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)',
                        zIndex: 100 - i,
                        rotate: -15,
                        scaleY: 1.6,
                    }}
                    className="absolute inset-0 w-[150vw] h-[125vh] -top-[12vh] left-[-10vw]"
                />
            ))}
        </div>
    );
};

const WhyFINEXA = () => {
    const sectionRef = useRef(null);
    const contentRef = useRef(null);
    const counterRef = useRef(null);
    const progressRef = useRef(null);

    // References for individual count-up stats
    const stat1Ref = useRef(null);
    const stat2Ref = useRef(null);
    const stat3Ref = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const pinDuration = "+=1300";

            // 1. Subtle Section Pin Lock with Release After Scroll
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: pinDuration,
                pin: true,
                anticipatePin: 1,
                scrub: 0.8
            });

            // 2. Content Reveal inside the pinned section
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                    }
                }
            );

            // 3. Counting Effect for Progress Card
            const countObj = { val: 0 };
            gsap.to(countObj, {
                val: 94,
                duration: 1.5,
                delay: 0.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 50%",
                },
                onStart: () => {
                    gsap.to(".status-text", { opacity: 0.5, repeat: 4, yoyo: true, duration: 0.15 });
                },
                onUpdate: () => {
                    if (counterRef.current) {
                        counterRef.current.innerText = Math.floor(countObj.val) + "%";
                    }
                    if (progressRef.current) {
                        progressRef.current.style.width = countObj.val + "%";
                    }
                },
                onComplete: () => {
                    gsap.to(".status-text", { opacity: 1, duration: 0.4 });
                }
            });

            // 4. Count Up Stats triggers
            const stat1Val = { val: 0 };
            gsap.to(stat1Val, {
                val: 2.4,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 40%",
                },
                onUpdate: () => {
                    if (stat1Ref.current) {
                        stat1Ref.current.innerText = "₹" + stat1Val.val.toFixed(1) + "Cr+";
                    }
                }
            });

            const stat2Val = { val: 0 };
            gsap.to(stat2Val, {
                val: 94,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 40%",
                },
                onUpdate: () => {
                    if (stat2Ref.current) {
                        stat2Ref.current.innerText = Math.floor(stat2Val.val) + "%";
                    }
                }
            });

            const stat3Val = { val: 0 };
            gsap.to(stat3Val, {
                val: 11,
                duration: 1.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 40%",
                },
                onUpdate: () => {
                    if (stat3Ref.current) {
                        stat3Ref.current.innerText = Math.floor(stat3Val.val) + " sec";
                    }
                }
            });

            // 5. Subtle Entrance for Stats Cards
            gsap.fromTo(".stats-cards-container",
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 50%",
                    }
                }
            );

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="why-BIZRA"
            ref={sectionRef}
            className="w-full min-h-screen bg-teal relative overflow-hidden flex flex-col justify-center py-16 px-6 md:px-12 lg:px-20"
        >
            {/* The Slowed & Smoothed Diagonal Ribbon Wipe Transition */}
            <SectionWipe containerRef={sectionRef} />

            {/* Subtle background graphics */}
            <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 1440 800" fill="none" preserveAspectRatio="none">
                    <path d="M1440 800V0C1300 120 1100 40 900 160C700 280 500 200 300 320C100 440 0 360 0 480V800H1440Z" fill="#135c56" />
                </svg>
            </div>

            <div ref={contentRef} className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-7xl mx-auto w-full">
                {/* Left Column (Span 7) */}
                <div className="lg:col-span-7 flex flex-col items-start text-left space-y-8">
                    <span className="text-ivory/60 font-semibold uppercase tracking-[0.4em] text-[10.5px]">
                        Your Advisor
                    </span>

                    <h2 className="text-ivory text-4xl md:text-5xl lg:text-6xl font-serif font-bold uppercase tracking-tight leading-[1.1] select-none">
                        <DecryptedText text="Expert financial advice" animateOn="view" revealDirection="start" speed={40} className="text-ivory" encryptedClassName="text-ivory/30" /> <br />
                        <span className="text-ink bg-ivory px-3 py-1 inline-block my-1.5 rounded-lg border border-beige/40">
                            <DecryptedText text="now on WhatsApp." animateOn="view" revealDirection="start" speed={40} delay={0.4} className="text-ink" encryptedClassName="text-ink/30" />
                        </span> <br />
                        <DecryptedText text="Powered by Agentic AI." animateOn="view" revealDirection="start" speed={40} delay={0.8} className="text-ivory" encryptedClassName="text-ivory/30" />
                    </h2>

                    <div className="w-full max-w-md">
                        <div className="bg-camel border border-beige/30 p-6 rounded-2xl shadow-[0_12px_40px_rgba(58,46,37,0.1)]">
                            <div className="flex justify-between items-end mb-4">
                                <span ref={counterRef} className="text-ink font-sans font-extrabold text-5xl">0%</span>
                                <span className="status-text text-ink/75 font-semibold text-[9.5px] uppercase tracking-wider text-right leading-relaxed select-none">
                                    Save <br />your goals...
                                </span>
                            </div>
                            <div className="w-full h-3 bg-ink/10 rounded-full overflow-hidden border border-ink/20">
                                <div ref={progressRef} className="h-full bg-ink w-[0%]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stat Cards Container (Span 5) */}
                <div className="lg:col-span-5 relative flex items-center justify-center pointer-events-auto w-full">
                    <div className="stats-cards-container flex flex-col gap-4 py-2 w-full max-w-sm">
                        {/* Stat Card 1: Assets Advised */}
                        <div className="bg-ivory/8 border border-ivory/15 p-5 sm:p-6 rounded-2xl shadow-[0_8px_32px_rgba(11,79,74,0.25)] hover:border-gold/45 transition-colors group">
                            <span ref={stat1Ref} className="block font-sans font-extrabold text-3xl sm:text-4xl text-gold group-hover:scale-102 transition-transform duration-300">
                                ₹0.0Cr+
                            </span>
                            <span className="block text-[11.5px] sm:text-[12.5px] font-medium text-cream/80 uppercase tracking-widest mt-1.5">
                                Assets Advised
                            </span>
                        </div>

                        {/* Stat Card 2: Goal Completion Rate */}
                        <div className="bg-ivory/8 border border-ivory/15 p-5 sm:p-6 rounded-2xl shadow-[0_8px_32px_rgba(11,79,74,0.25)] hover:border-gold/45 transition-colors group">
                            <span ref={stat2Ref} className="block font-sans font-extrabold text-3xl sm:text-4xl text-gold group-hover:scale-102 transition-transform duration-300">
                                0%
                            </span>
                            <span className="block text-[11.5px] sm:text-[12.5px] font-medium text-cream/80 uppercase tracking-widest mt-1.5">
                                Goal Completion Rate
                            </span>
                        </div>

                        {/* Stat Card 3: Average Query Speed */}
                        <div className="bg-ivory/8 border border-ivory/15 p-5 sm:p-6 rounded-2xl shadow-[0_8px_32px_rgba(11,79,74,0.25)] hover:border-gold/45 transition-colors group">
                            <span ref={stat3Ref} className="block font-sans font-extrabold text-3xl sm:text-4xl text-gold group-hover:scale-102 transition-transform duration-300">
                                0 sec
                            </span>
                            <span className="block text-[11.5px] sm:text-[12.5px] font-medium text-cream/80 uppercase tracking-widest mt-1.5">
                                Average Query Speed
                            </span>
                        </div>

                        {/* Pull Quote Card */}
                        <div className="bg-cream border border-beige/40 p-5 sm:p-6 rounded-2xl shadow-[0_12px_40px_rgba(58,46,37,0.12)] text-left relative">
                            <span className="absolute top-2 right-4 text-burgundy/15 font-serif font-black text-5xl select-none leading-none">“</span>
                            <p className="text-[11.5px] sm:text-[12px] font-sans font-medium text-ink italic leading-relaxed pr-5">
                                "BIZRAAI feels like having a wealth manager in my WhatsApp. It analyzed my profile and built a goal-based SIP roadmap in minutes."
                            </p>
                            <span className="block text-[9.5px] sm:text-[10px] font-bold text-burgundy uppercase tracking-widest mt-3">
                                — Rohan M., Bangalore
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(WhyFINEXA);
