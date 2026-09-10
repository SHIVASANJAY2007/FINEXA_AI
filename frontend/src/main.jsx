import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'

const rawKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isDummyKey = !rawKey || rawKey.includes("ZGV2ZWxvcG1lbnQta2V5") || rawKey.includes("development-key");
const isValidKey = Boolean(rawKey && !isDummyKey && (rawKey.startsWith("pk_test_") || rawKey.startsWith("pk_live_")));

if (!isValidKey) {
  console.warn("Clerk Publishable Key is not configured or is using default test placeholder. To enable Clerk auth, set VITE_CLERK_PUBLISHABLE_KEY in frontend/.env.");
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isValidKey ? (
      <ClerkProvider
        publishableKey={rawKey}
        signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
        signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
        afterSignOutUrl="/"
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )}
  </StrictMode>,
)
