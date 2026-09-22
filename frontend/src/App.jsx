import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import GlobalMenu from './components/ui/GlobalMenu'
import './App.css'

const LandingPage = lazy(() => import('./components/LandingPage'))
const SignUp = lazy(() => import('./components/SignUp'))
const Chatbot = lazy(() => import('./components/Chatbot'))
const Dashboard = lazy(() => import('./components/Dashboard'))
const Explore = lazy(() => import('./components/Explore/Explore'))
const LearnEarn = lazy(() => import('./components/LearnEarn/LearnEarn'))
const FlowingMenuPage = lazy(() => import('./components/ui/FlowingMenuPage'))
const Calculator = lazy(() => import('./components/Calculator/Calculator'))
const BusinessIntelligence = lazy(() => import('./components/BusinessIntelligence/BusinessIntelligence'))
const GreyWolfOptimizer = lazy(() => import('./components/GWO/GreyWolfOptimizer'))
const RuleInductionClassifier = lazy(() => import('./components/RIPPER/RuleInductionClassifier'))

const PageLoader = () => (
  <div className="min-h-screen w-full bg-ivory flex flex-col items-center justify-center gap-4 dot-grid">
    <div className="w-12 h-12 rounded-2xl bg-burgundy flex items-center justify-center shadow-lg animate-pulse">
      <span className="font-serif font-extrabold text-gold text-lg">F</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full bg-burgundy animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-burgundy animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-burgundy animate-bounce" />
    </div>
  </div>
)

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Force-instant top on route change (bypasses the global
        // `scroll-behavior: smooth` so we never scrub through pinned sections).
        const html = document.documentElement;
        const previous = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        html.style.scrollBehavior = previous;
        ScrollTrigger.refresh();
    }, [pathname]);

    return null;
}

function App() {
    return (
        <Suspense fallback={<PageLoader />}>
            <ScrollToTop />
            <GlobalMenu />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/learn" element={<LearnEarn />} />
        <Route path="/menu" element={<FlowingMenuPage />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/business-intelligence" element={<BusinessIntelligence />} />
        <Route path="/gwo" element={<GreyWolfOptimizer />} />
        <Route path="/alpha-pack" element={<GreyWolfOptimizer />} />
        <Route path="/harmony" element={<RuleInductionClassifier />} />
        <Route path="/hsa" element={<RuleInductionClassifier />} />
        <Route path="/ripper" element={<RuleInductionClassifier />} />
        <Route path="/cba" element={<RuleInductionClassifier />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
