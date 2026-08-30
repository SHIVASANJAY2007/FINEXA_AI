import React, { useRef, useState, useEffect, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PricingCard = memo(({ title, price, billingCycle, features, buttonText, isPopular, delay, bounce }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-10%" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{
                type: "spring",
                duration: 0.6,
                bounce: bounce,
                delay: delay
            }}
            whileHover={{ y: -8 }}
            className={`relative p-8 rounded-[20px] bg-white flex flex-col h-full text-left transition-all ${
                isPopular
                    ? 'border border-burgundy/50 shadow-[0_8px_40px_rgba(107,30,43,0.15)] z-10'
                    : 'border border-burgundy/15 shadow-[0_4px_24px_rgba(58,46,37,0.10)] z-0'
            }`}
        >
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-ink px-4 py-1 rounded-full font-bold text-[9.5px] uppercase tracking-wider shadow-[0_2px_12px_rgba(201,162,39,0.2)]">
                    Recommended
                </div>
            )}
            <div className="mb-6 border-b border-beige/40 pb-5">
                <h3 className="font-serif text-2xl font-bold text-ink mb-2">{title}</h3>
                <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-ink font-sans">₹{price}</span>
                    <span className="text-taupe font-medium text-xs ml-1.5">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
            </div>
            <ul className="mb-8 flex-grow space-y-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start text-xs font-semibold text-taupe leading-relaxed">
                        <span className="mr-2 text-burgundy text-[11px]">✦</span>
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>
            <motion.a
                href="/signup"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3.5 rounded-full font-bold uppercase text-[10.5px] tracking-widest text-center transition-all cursor-pointer ${
                    isPopular
                        ? 'bg-burgundy text-ivory shadow-[0_4px_16px_rgba(107,30,43,0.25)] hover:bg-burgundy/90'
                        : 'bg-transparent border border-burgundy text-burgundy hover:bg-burgundy/5'
                }`}
            >
                {buttonText}
            </motion.a>
        </motion.div>
    );
});

const PRICING_DATA = [
    {
        title: "Free",
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            "Basic WhatsApp chat support",
            "Limited agent memory",
            "Monthly market insights",
            "Up to 2 linked bank accounts"
        ],
        buttonText: "Start Free",
        isPopular: false,
        delay: 0,
        bounce: 0.2
    },
    {
        title: "Pro",
        monthlyPrice: 499,
        yearlyPrice: 1499,
        features: [
            "Full Agentic AI workflow automation",
            "Goal-based financial planning",
            "Proactive WhatsApp alerts",
            "Unlimited account integration",
            "Unlimited conversation memory",
            "DPDP-compliant privacy dashboard"
        ],
        buttonText: "Upgrade to Pro",
        isPopular: true,
        delay: 0.15,
        bounce: 0.4
    }
];

const PricingSection = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const sectionRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Subtle Section Pinning with Release After Scroll
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "+=1200",
                pin: true,
                anticipatePin: 1,
                scrub: 0.8
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="pricing"
            ref={sectionRef}
            className="relative z-20 bg-cream min-h-screen flex flex-col justify-center items-center py-20 px-6 border-t border-beige text-ink font-sans overflow-hidden"
        >
            <div className="max-w-4xl mx-auto flex flex-col items-center w-full">
                <div className="flex flex-col items-center mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight mb-8">
                        Simple, honest <span className="text-burgundy">Pricing</span>
                    </h2>

                    {/* Billing Cycle Toggle */}
                    <div className="flex items-center gap-2 bg-ivory p-1 rounded-full border border-beige shadow-[0_4px_12px_rgba(58,46,37,0.06)]">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2.5 rounded-full font-bold uppercase text-[9.5px] tracking-wider transition-all cursor-pointer ${
                                billingCycle === 'monthly'
                                    ? 'bg-ink text-ivory'
                                    : 'text-taupe hover:text-ink'
                            }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2.5 rounded-full font-bold uppercase text-[9.5px] tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                                billingCycle === 'yearly'
                                    ? 'bg-ink text-ivory'
                                    : 'text-taupe hover:text-ink'
                            }`}
                        >
                            Yearly <span className="text-gold font-extrabold font-sans">(-30%)</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                    {PRICING_DATA.map((plan) => (
                        <PricingCard
                            key={plan.title}
                            title={plan.title}
                            price={billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                            billingCycle={billingCycle}
                            features={plan.features}
                            buttonText={plan.buttonText}
                            isPopular={plan.isPopular}
                            delay={plan.delay}
                            bounce={plan.bounce}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default memo(PricingSection);
