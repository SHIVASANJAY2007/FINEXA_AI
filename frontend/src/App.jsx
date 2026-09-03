import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { SpeedInsights } from '@vercel/speed-insights/react'
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

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <SpeedInsights />
    </Suspense>
  )
}

export default App
