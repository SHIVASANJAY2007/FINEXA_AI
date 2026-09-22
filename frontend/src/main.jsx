import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger);

// Re-measure GSAP ScrollTrigger positions once all media/fonts finish loading.
// Pinned sections were shifting out of place (appearing "out of nowhere")
// because images/videos load after the initial ScrollTrigger measurement.
const refreshScrollTriggers = () => ScrollTrigger.refresh();
window.addEventListener('load', () => setTimeout(refreshScrollTriggers, 0));
if (document.fonts?.ready) {
    document.fonts.ready.then(() => setTimeout(refreshScrollTriggers, 100));
}
setTimeout(refreshScrollTriggers, 1200);

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
