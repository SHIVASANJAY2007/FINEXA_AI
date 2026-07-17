import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const FloatingElements = ({ count = 8, containerRef }) => {
    const elementsRef = useRef([]);

    // 8 distinct geometric shape path definitions
    const shapes = [
        // Diamond
        <polygon points="12,2 22,12 12,22 2,12" />,
        // Circle
        <circle cx="12" cy="12" r="9" />,
        // Hexagon
        <polygon points="12,2 20.66,7 20.66,17 12,22 3.34,17 3.34,7" />,
        // Triangle
        <polygon points="12,2 22,20 2,20" />,
        // Donut / Ring
        <path d="M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M12,17c-2.8,0-5-2.2-5-5s2.2-5,5-5s5,2.2,5,5S14.8,17,12,17z" />,
        // Square
        <rect x="3" y="3" width="18" height="18" rx="2" />,
        // Pill
        <rect x="2" y="7" width="20" height="10" rx="5" />,
        // Star / Sparkle
        <path d="M12,2l2.5,6.5L21,11l-5.5,4L17,22l-5-4.5L7,22l1.5-7L3,11l6.5-2.5L12,2z" />
    ];

    const colors = [
        "rgba(253, 246, 237, 0.07)", // ivory
        "rgba(201, 162, 39, 0.09)"    // gold
    ];

    useEffect(() => {
        if (!containerRef.current) return;

        const elements = elementsRef.current;

        elements.forEach((el, i) => {
            if (!el) return;

            // Random initial positions within container bounds
            gsap.set(el, {
                x: gsap.utils.random(50, window.innerWidth - 100),
                y: gsap.utils.random(50, window.innerHeight - 100),
                opacity: gsap.utils.random(0.06, 0.16),
                scale: gsap.utils.random(0.6, 2.2),
                rotate: gsap.utils.random(0, 360)
            });

            // Gentle floating animation (independent of scroll)
            gsap.to(el, {
                x: "+=" + gsap.utils.random(-80, 80),
                y: "+=" + gsap.utils.random(-80, 80),
                rotate: "+=" + gsap.utils.random(-30, 30),
                duration: gsap.utils.random(8, 18),
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });

            // Scroll-linked parallax effect
            gsap.to(el, {
                y: "-=" + gsap.utils.random(150, 800),
                rotate: "+=" + gsap.utils.random(60, 270),
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: 1.2
                }
            });
        });
    }, [containerRef, count]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {Array.from({ length: count }).map((_, i) => (
                <svg
                    key={i}
                    ref={el => elementsRef.current[i] = el}
                    viewBox="0 0 24 24"
                    className="absolute w-20 h-20 fill-current"
                    style={{ color: colors[i % colors.length] }}
                >
                    {shapes[i % shapes.length]}
                </svg>
            ))}
        </div>
    );
};

export default FloatingElements;
