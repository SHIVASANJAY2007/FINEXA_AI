import React, { useEffect, useRef, memo } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserCheck, TrendingUp, Map, Heart, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const AGENTS = [
    {
        title: "Profile Agent",
        subtext: "Builds your financial DNA via chat",
        color: "#6B1E2B", // Burgundy
        shape: "circle",
        Icon: UserCheck,
        textColor: "#FDF6ED", // Ivory
        iconColor: "#C9A227"  // Gold
    },
    {
        title: "Market Intelligence",
        subtext: "Live NAVs, FDs & Nifty data",
        color: "#C2A56D", // Camel
        shape: "square-rounded",
        Icon: TrendingUp,
        textColor: "#3A2E25", // Ink
        iconColor: "#3A2E25"
    },
    {
        title: "Planner Agent",
        subtext: "Goal-based SIP roadmaps",
        color: "#C9A227", // Gold
        shape: "d-shape",
        Icon: Map,
        textColor: "#3A2E25", // Ink
        iconColor: "#6B1E2B"  // Burgundy
    },
    {
        title: "Life Event Agent",
        subtext: "Adapts to marriage, kids & more",
        color: "#9A8678", // Taupe
        shape: "square",
        Icon: Heart,
        textColor: "#FDF6ED", // Ivory
        iconColor: "#FDF6ED"
    },
    {
        title: "Portfolio Monitor",
        subtext: "Autonomous weekly alerts",
        color: "#135c56", // Lighter Teal
        shape: "circle",
        Icon: Bell,
        textColor: "#FDF6ED", // Ivory
        iconColor: "#C9A227"  // Gold
    }
];

// Pre-seeded stable particle coordinates for consistent render performance
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
    top: `${((i * 37) % 94) + 3}%`,
    left: `${((i * 59) % 94) + 3}%`
}));

const WorkflowCard = memo(({ title, subtext, color, shape, index, Icon, textColor, iconColor }) => {
    const cardRef = useRef(null);

    const getCardStyle = () => {
        let borderRadius = '24px';
        let width = 'clamp(260px, 70vw, 380px)';
        let height = 'clamp(260px, 70vw, 380px)';

        if (shape === 'circle') {
            borderRadius = '50%';
        } else if (shape === 'd-shape') {
            borderRadius = '60px 180px 180px 60px';
        } else if (shape === 'square-rounded') {
            borderRadius = '45px';
        }

        return {
            backgroundColor: color,
            borderRadius,
            width,
            height
        };
    };

    return (
        <div className="flex-shrink-0 relative group">
            <motion.div
                ref={cardRef}
                whileHover={{ scale: 1.04, rotate: index % 2 === 0 ? 2 : -2 }}
                className="flex flex-col items-center justify-center p-6 sm:p-10 md:p-12 transition-all duration-500 shadow-[0_20px_50px_rgba(11,79,74,0.3)] border border-ivory/8 relative overflow-hidden"
                style={getCardStyle()}
            >
                {/* Icon Container */}
                <div className="mb-4 sm:mb-6 flex items-center justify-center p-3 sm:p-4 bg-ivory/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 drop-shadow-md" strokeWidth={1.5} style={{ color: iconColor }} />
                </div>

                {/* Text Content */}
                <div className="text-center px-2">
                    <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold leading-none mb-2 sm:mb-3" style={{ color: textColor }}>
                        {title}
                    </h3>
                    <p className="text-[8.5px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em]" style={{ color: `${textColor}c0` }}>
                        {subtext}
                    </p>
                </div>

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-ivory/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
        </div>
    );
});

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = scrollContainerRef.current;
            if (!container) return;
            const totalWidth = container.scrollWidth - window.innerWidth;

            // Pinned timeline with extended hold
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    anticipatePin: 1,
                    start: "top top",
                    end: () => `+=${Math.max(1200, totalWidth + 1800)}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            // 1. Horizontal Scroll across all agent pipeline cards
            tl.to(container, {
                x: -Math.max(0, totalWidth),
                ease: "none",
                duration: 3,
            });

            // 2. Extended Lock/Hold
            tl.to({}, {
                duration: 1.8,
            });

            // Gentle float effect for particles
            gsap.to(".bg-sparkle", {
                y: "random(-80, 80)",
                x: "random(-80, 80)",
                duration: "random(6, 12)",
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                stagger: 0.15
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="how-it-works"
            ref={sectionRef}
            className="w-full bg-teal h-screen overflow-hidden will-change-transform relative flex flex-col justify-center py-12 sm:py-20"
        >
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {PARTICLES.map((pos, i) => (
                    <div
                        key={i}
                        className="bg-sparkle absolute w-1.5 h-1.5 bg-ivory/15 rounded-full"
                        style={{
                            top: pos.top,
                            left: pos.left
                        }}
                    />
                ))}
            </div>

            <div className="px-4 sm:px-8 md:px-16 mb-6 sm:mb-10 relative z-10 text-left">
                <h2 className="text-ivory text-[clamp(2.2rem,5vw,7rem)] font-serif font-bold uppercase tracking-tight leading-[0.9] select-none">
                    Agent <br />
                    <span className="text-cream/10 uppercase italic">Architecture</span>
                </h2>
            </div>

            <div className="relative z-10 w-full overflow-hidden flex items-center">
                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-6 sm:gap-10 md:gap-16 h-max px-4 sm:px-8 md:px-16 pr-[20vw] sm:pr-[25vw]"
                >
                    {AGENTS.map((step, index) => (
                        <WorkflowCard
                            key={index}
                            {...step}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Side Label */}
            <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 rotate-90 z-10 select-none hidden sm:block">
                <span className="text-ivory/5 font-mono text-[9px] tracking-[2em] whitespace-nowrap">AGENT_PIPELINE_ACTIVE</span>
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 opacity-25 text-ivory uppercase font-bold text-[8.5px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.5em] animate-pulse select-none whitespace-nowrap">
                Scroll to explore the pipeline
            </div>
        </section>
    );
};

export default memo(HowItWorks);
