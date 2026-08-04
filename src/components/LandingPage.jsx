import React from 'react'
import { useLocation } from 'react-router-dom'
import Hero from './Hero'
import PillNav from './PillNav'
import Features from './Features'
import HowItWorks from './HowItWorks'
import WhyFinexa from './WhyFinexa'
import PricingSection from './PricingSection'
import Footer from './Footer'

const LandingPage = () => {
    const location = useLocation()

    const navItems = [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Why Finexa', href: '#why-finexa' },
        { label: 'Pricing', href: '#pricing' },
        { label: 'Chatbot', href: '/chatbot' },
        { label: 'Start Free', href: '/signup' },
    ]

    return (
        <>
            <PillNav
                items={navItems}
                activeHref={location.hash || location.pathname}
                baseColor="#FDF6ED"
                pillColor="#3A2E25"
                logo=""
            />

            <div className="app-content relative min-h-screen bg-ivory text-ink">
                <Hero />
                <Features />
                <HowItWorks />
                <WhyFinexa />
                <PricingSection />
                <Footer />
            </div>
        </>
    )
}

export default LandingPage
