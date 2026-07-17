import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { UserCheck, TrendingUp, Map, Heart, Bell } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const WorkflowCard = ({ title, subtext, color, shape, index, Icon, textColor, iconColor }) => {
    const cardRef = useRef(null);

    const getCardStyle = () => {
        let borderRadius = '32px';
        let width = '380px';
        let height = '380px';

        if (shape === 'circle') {
            borderRadius = '50%';
        } else if (shape === 'd-shape') {
            borderRadius = '80px 220px 220px 80px';
        } else if (shape === 'square-rounded') {
            borderRadius = '60px';
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
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
                className="flex flex-col items-center justify-center p-12 transition-all duration-500 shadow-[0_20px_50px_rgba(11,79,74,0.3)] border border-ivory/8 relative overflow-hidden"
                style={getCardStyle()}
            >
                {/* Icon Container */}
                <div className="mb-6 flex items-center justify-center p-4 bg-ivory/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                    <Icon size={72} strokeWidth={1.5} style={{ color: iconColor }} className="drop-shadow-md" />
                </div>

                {/* Text Content */}
                <div className="text-center">
                    <h3 className="font-serif text-3xl font-bold leading-none mb-3" style={{ color: textColor }}>
                        {title}
                    </h3>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em]" style={{ color: `${textColor}c0` }}>
                        {subtext}
                    </p>
                </div>

                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-ivory/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
        </div>
    );
};

const HowItWorks = () => {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const agents = [
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

    useEffect(() => {
        const ctx = gsap.context(() => {
            const container = scrollContainerRef.current;
            const totalWidth = container.scrollWidth - window.innerWidth;

            gsap.to(container, {
                x: -totalWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    start: "top top",
                    end: () => `+=${totalWidth + 1000}`,
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
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
            className="w-full bg-teal h-screen overflow-hidden relative flex flex-col justify-center py-20"
        >
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                {/* Visual particles for high-end feel */}
                {Array.from({ length: 30 }).map((_, i) => (
                    <div
                        key={i}
                        className="bg-sparkle absolute w-1.5 h-1.5 bg-ivory/15 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>

            <div className="px-8 md:px-16 mb-12 relative z-10 text-left">
                <h2 className="text-ivory text-[clamp(2.5rem,6vw,8rem)] font-serif font-bold uppercase tracking-tight leading-[0.9] select-none">
                    Agent <br />
                    <span className="text-cream/10 uppercase italic">Architecture</span>
                </h2>
            </div>

            <div className="relative z-10 w-full overflow-hidden flex items-center">
                <div
                    ref={scrollContainerRef}
                    className="flex items-center gap-12 md:gap-16 h-max px-8 md:px-16 pr-[40vw]"
                >
                    {agents.map((step, index) => (
                        <WorkflowCard
                            key={index}
                            {...step}
                            index={index}
                        />
                    ))}
                </div>
            </div>

            {/* Side Label */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2 rotate-90 z-10 select-none">
                <span className="text-ivory/5 font-mono text-[9px] tracking-[2em] whitespace-nowrap">AGENT_PIPELINE_ACTIVE</span>
            </div>

            {/* Interaction Hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 text-ivory uppercase font-bold text-[9px] tracking-[0.5em] animate-pulse select-none">
                Scroll to explore the pipeline
            </div>
        </section>
    );
};

export default HowItWorks;
