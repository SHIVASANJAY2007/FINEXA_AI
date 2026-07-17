import { useSignIn, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { ShieldCheck, TrendingUp, Cpu } from 'lucide-react';

const SignUp = () => {
    const { isLoaded, signIn } = useSignIn();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (isLoaded && isSignedIn) {
            navigate('/dashboard');
        }
    }, [isLoaded, isSignedIn, navigate]);

    const signUpWithGoogle = async () => {
        if (!isLoaded || isLoading) return;

        setIsLoading(true);
        try {
            await signIn.authenticateWithRedirect({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/dashboard',
            });
        } catch (err) {
            if (err.errors?.[0]?.code === 'session_exists' || err.message?.includes('already signed in')) {
                navigate('/dashboard');
            } else {
                console.error('Error signing in with Google:', err);
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="flex h-screen w-full bg-ivory items-center justify-center p-4 dot-grid">
            {/* Background blooms */}
            <div className="absolute top-0 left-0 w-80 h-80 bg-burgundy/5 rounded-full blur-[96px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex w-full max-w-5xl bg-white/70 border border-beige/40 rounded-3xl overflow-hidden shadow-[0_12px_40px_rgba(58,46,37,0.08)] backdrop-blur-md z-10">
                {/* Left Column - Styled Asset Visual */}
                <div className="hidden md:flex w-1/2 p-6 items-center justify-center bg-cream border-r border-beige/40 relative group">
                    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden bg-ink flex flex-col justify-between p-8 text-left shadow-inner">
                        {/* Gold bloom */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex justify-between items-center z-10 select-none">
                            <span className="text-[10px] font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
                                <Cpu size={12} /> SECURE_NODE_V1
                            </span>
                            <span className="text-[9px] font-mono text-ivory/50">DPDP_COMPLIANT</span>
                        </div>

                        <div className="my-auto z-10 space-y-6">
                            <div className="w-14 h-14 bg-burgundy rounded-2xl flex items-center justify-center border border-burgundy/15 shadow-md">
                                <TrendingUp size={28} className="text-gold" />
                            </div>
                            <h3 className="font-serif text-3xl font-bold text-ivory leading-tight">
                                Autonomous <br /> wealth building starts here.
                            </h3>
                            <p className="text-xs text-cream/70 leading-relaxed font-normal max-w-xs">
                                FinexaAI connects your financial roadmap to smart, private, and automated portfolios.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-ivory/55 border-t border-beige/10 pt-4 z-10">
                            <ShieldCheck size={14} className="text-teal" />
                            <span>AES-256 Bank-Level Encryption</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Content */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-14 py-12 text-center md:text-left">
                    <div className="mb-10 text-left">
                        <h1 className="font-serif text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
                            Welcome to <br />
                            <span className="text-burgundy">FinexaAI</span>
                        </h1>
                        <p className="text-sm font-semibold text-taupe">
                            Securely sign in to access your private wealth concierge.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={signUpWithGoogle}
                            disabled={isLoading}
                            className={`w-full bg-white text-ink font-bold text-xs uppercase tracking-widest py-4 rounded-full border border-beige hover:border-burgundy/30 flex items-center justify-center gap-3 shadow-[0_2px_8px_rgba(58,46,37,0.04)] active:scale-98 transition-all cursor-pointer ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-ivory/40'
                            }`}
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            {isLoading ? 'Connecting...' : 'Continue with Google'}
                        </button>
                    </div>

                    <p className="text-[10px] text-taupe mt-12 text-center font-medium leading-relaxed max-w-xs mx-auto">
                        By connecting to FinexaAI you agree to our <span className="text-ink font-bold cursor-pointer hover:text-burgundy">Terms of use</span> and <span className="text-ink font-bold cursor-pointer hover:text-burgundy">Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
