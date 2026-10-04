import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from './Hero'
import PillNav from './PillNav'
import Features from './Features'
import HowItWorks from './HowItWorks'
import WhyFINEXA from './WhyFinexa'
import PricingSection from './PricingSection'
import Footer from './Footer'

const NAV_ITEMS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why FINEXA', href: '#why-finexa' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Start Free', href: '/signup' },
];

const LandingPage = () => {
    const location = useLocation()
    const [activeSection, setActiveSection] = useState('#hero')

    // Track active section on scroll for PillNav highlight
    useEffect(() => {
        const sectionIds = ['features', 'how-it-works', 'why-finexa', 'pricing'];
        const handleScroll = () => {
            const scrollPos = window.scrollY + 200;
            for (let i = sectionIds.length - 1; i >= 0; i--) {
                const el = document.getElementById(sectionIds[i]);
                if (el) {
                    const top = el.offsetTop;
                    if (scrollPos >= top) {
                        setActiveSection(`#${sectionIds[i]}`);
                        return;
                    }
                }
            }
            setActiveSection('#hero');
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="relative w-full max-w-full overflow-x-hidden">
            <PillNav
                items={NAV_ITEMS}
                activeHref={location.hash || activeSection}
                baseColor="#FDF6ED"
                pillColor="#3A2E25"
                logo=""
            />

            <Hero />
            <Features />
            <HowItWorks />
            <WhyFINEXA />
            <PricingSection />
            <Footer />
        </div>
    )
}

export default LandingPage

