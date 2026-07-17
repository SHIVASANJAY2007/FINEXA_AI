import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'
import SignUp from './components/SignUp'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import './App.css'

const ProtectedRoute = ({ children }) => {
  const { isLoaded, isSignedIn } = useUser();
  if (!isLoaded) return null;
  if (!isSignedIn) return <Navigate to="/signup" replace />;
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
    </Routes>
  )
}

export default App
