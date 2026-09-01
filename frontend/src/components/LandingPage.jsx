import React from 'react'
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
    { label: 'Why BIZRA', href: '#why-BIZRA' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Start Free', href: '/signup' },
];

const LandingPage = () => {
    const location = useLocation()

    return (
        <div className="relative">
            <PillNav
                items={NAV_ITEMS}
                activeHref={location.hash || location.pathname}
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
