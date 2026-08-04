import { Routes, Route, Navigate } from 'react-router-dom'
import SignUp from './components/SignUp'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import Chatbot from './components/Chatbot'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/chatbot" element={<Chatbot />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
