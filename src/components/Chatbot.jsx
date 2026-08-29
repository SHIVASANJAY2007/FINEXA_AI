import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Send, Bot, Phone, ExternalLink,
    ArrowLeft, RefreshCw, Sparkles, Loader2, AlertCircle,
    Copy, Check
} from 'lucide-react';
import AnimatedIconBackground from './AnimatedIconBackground';

const N8N_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'https://prefamiliar-overliterary-princess.ngrok-free.dev/webhook/27a70dce-19d0-4858-82c0-d1126492962e';

// Helper to extract plain text string from n8n response payloads
const extractResponseText = (data) => {
    if (!data) return "Thank you. I have processed your request.";
    if (typeof data === 'string') return data;

    if (Array.isArray(data)) {
        if (data.length === 0) return "Response received with no content.";
        const first = data[0];
        if (typeof first === 'string') return first;
        if (first && typeof first === 'object') {
            return first.output || first.response || first.text || first.message || first.content || first.reply || JSON.stringify(first);
        }
    }

    if (typeof data === 'object') {
        return data.output || data.response || data.text || data.message || data.content || data.reply || (data.data && extractResponseText(data.data)) || JSON.stringify(data);
    }

    return String(data);
};

// Interactive 3D Phone Component with backward depth tilt & smooth hover physics
const Interactive3DPhone = memo(() => {
    const [rotate, setRotate] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setRotate({
            x: -(y / (rect.height / 2)) * 14,
            y: (x / (rect.width / 2)) * 14,
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setRotate({ x: 0, y: 0 });
    }, []);

    return (
        <div
            className="mb-8 -ml-6"
            style={{ perspective: '1200px' }}
        >
            <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                animate={{
                    rotateX: isHovered ? rotate.x + 8 : 0,
                    rotateY: isHovered ? rotate.y - 8 : 0,
                    translateZ: isHovered ? -50 : 0,
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{
                    type: 'spring',
                    stiffness: 140,
                    damping: 20,
                    mass: 0.8
                }}
                style={{
                    transformStyle: 'preserve-3d'
                }}
                className="w-32 h-32 xl:w-36 xl:h-36 bg-[#25D366] rounded-[34px] flex items-center justify-center shadow-[0_18px_45px_rgba(37,211,102,0.32)] cursor-pointer relative group"
            >
                <div
                    className="absolute inset-0 rounded-[34px] bg-black/20 blur-lg transition-all duration-300 pointer-events-none"
                    style={{
                        transform: isHovered ? 'translateZ(-40px) scale(0.92)' : 'translateZ(-10px) scale(1)',
                        opacity: isHovered ? 0.4 : 0.2
                    }}
                />

                <div className="absolute inset-0 rounded-[34px] bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <motion.div
                    animate={{
                        translateZ: isHovered ? 40 : 0,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 18
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <Phone size={56} className="text-white drop-shadow-lg" fill="white" />
                </motion.div>
            </motion.div>
        </div>
    );
});

const ChatMessage = memo(({ text, isBot, time, isError }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex w-full mb-5 ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div
                className={`max-w-[90%] md:max-w-[80%] relative ${isBot
                    ? isError
                        ? 'bg-red-50 text-red-900 border border-red-200 rounded-2xl rounded-tl-sm shadow-sm'
                        : 'bg-white text-ink rounded-2xl rounded-tl-sm border border-beige/40 shadow-[0_4px_16px_rgba(58,46,37,0.06)]'
                    : 'bg-burgundy text-ivory rounded-2xl rounded-tr-sm shadow-[0_4px_14px_rgba(107,30,43,0.25)]'
                    } p-5`}
            >
                {isError && (
                    <div className="flex items-center gap-2 mb-2 text-red-600 font-bold text-xs uppercase tracking-wider">
                        <AlertCircle size={14} />
                        <span>Connection Issue</span>
                    </div>
                )}

                <div className="text-xs sm:text-sm leading-relaxed font-medium whitespace-pre-wrap text-left">
                    {text}
                </div>

                <div className={`text-[8.5px] font-semibold mt-2.5 text-right ${isBot ? (isError ? 'text-red-400' : 'text-taupe/70') : 'text-ivory/70'}`}>
                    {time}
                </div>
            </div>
        </motion.div>
    );
});

const Chatbot = () => {
    const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Session ID maintained across requests
    const sessionIdRef = useRef(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

    const [messages, setMessages] = useState(() => [
        {
            id: 'init-1',
            isBot: true,
            text: "Message Here ! ☄️",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    // Dynamic Connection Status States
    const [connectionStatus, setConnectionStatus] = useState({
        status: 'checking', // 'checking' | 'connected' | 'disconnected' | 'degraded'
        latency: null,
        lastChecked: null,
        error: null
    });
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const [isCheckingManual, setIsCheckingManual] = useState(false);
    const [copied, setCopied] = useState(false);

    // Function to ping/check n8n connection
    const checkConnectionStatus = useCallback(async (isManual = false) => {
        if (isManual) setIsCheckingManual(true);
        const startTime = performance.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

            // Use GET request to query webhook status safely without triggering workflow logic
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'GET',
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                }
            });

            clearTimeout(timeoutId);
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            const contentType = response.headers.get('content-type') || '';
            const isHtml = contentType.includes('text/html');

            // If ngrok is offline, it serves HTML templates with status 502/504
            if (response.status >= 500 || (response.status === 502 && isHtml) || (response.status === 504 && isHtml)) {
                setConnectionStatus({
                    status: 'disconnected',
                    latency,
                    lastChecked: new Date().toLocaleTimeString(),
                    error: `Gateway Error: Webhook returned status ${response.status}`
                });
            } else {
                setConnectionStatus({
                    status: latency > 1800 ? 'degraded' : 'connected',
                    latency,
                    lastChecked: new Date().toLocaleTimeString(),
                    error: null
                });
            }
        } catch (err) {
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);
            const isTimeout = err.name === 'AbortError';

            setConnectionStatus({
                status: 'disconnected',
                latency: isTimeout ? 6000 : latency,
                lastChecked: new Date().toLocaleTimeString(),
                error: isTimeout ? 'Connection request timed out' : (err.message || 'Network connection failed')
            });
        } finally {
            if (isManual) setIsCheckingManual(false);
        }
    }, []);

    // Trigger connection status checking on mount and periodically
    useEffect(() => {
        checkConnectionStatus();

        const intervalId = setInterval(() => {
            checkConnectionStatus();
        }, 15000); // Check every 15 seconds

        return () => clearInterval(intervalId);
    }, [checkConnectionStatus]);

    const handleCopyEndpoint = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(N8N_WEBHOOK_URL);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setInputValue('');

        const time = nowTime();

        // Push User Message
        setMessages(prev => [...prev, {
            id: `user-${Date.now()}`,
            isBot: false,
            text: userMsg,
            time
        }]);

        setIsLoading(true);

        const messageStartTime = performance.now();
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    message: userMsg,
                    chatInput: userMsg,
                    sessionId: sessionIdRef.current,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Webhook responded with status ${response.status}`);
            }

            const messageEndTime = performance.now();
            const latency = Math.round(messageEndTime - messageStartTime);

            // Update connection status dynamically based on actual successful message exchange
            setConnectionStatus({
                status: latency > 1800 ? 'degraded' : 'connected',
                latency,
                lastChecked: new Date().toLocaleTimeString(),
                error: null
            });

            let responseData;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            const botReplyText = extractResponseText(responseData);

            setMessages(prev => [...prev, {
                id: `bot-${Date.now()}`,
                isBot: true,
                text: botReplyText,
                time: nowTime()
            }]);

        } catch (err) {
            console.error('n8n Webhook Error:', err);
            
            // Update status to disconnected
            setConnectionStatus(prev => ({
                ...prev,
                status: 'disconnected',
                lastChecked: new Date().toLocaleTimeString(),
                error: err.message || 'Connection failed during query'
            }));

            setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                isBot: true,
                text: "I encountered a problem connecting to the n8n AI agent. Please ensure the n8n webhook workflow is active and try sending your query again.",
                isError: true,
                time: nowTime()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const resetChat = () => {
        sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        setMessages([{
            id: `init-${Date.now()}`,
            isBot: true,
            text: "Chat context reset. How can Finexa AI help you today?",
            time: nowTime()
        }]);
    };

    return (
        <div className="flex flex-col h-screen w-full bg-ivory text-ink overflow-hidden font-sans dot-grid">
            {/* Top Header Navigation */}
            <header className="h-16 px-6 bg-ivory/90 backdrop-blur-md border-b border-beige/40 flex items-center justify-between z-20 shrink-0">
                <div className="flex items-center gap-3">
                    <Link
                        to="/"
                        className="p-2 rounded-full hover:bg-beige/30 transition-colors text-taupe hover:text-ink flex items-center gap-1.5 text-xs font-semibold"
                        title="Back to Home"
                    >
                        <ArrowLeft size={16} />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <div className="h-4 w-[1px] bg-beige/60 hidden sm:block" />
                    <Link
                        to="/explore"
                        className="px-3 py-1.5 rounded-full hover:bg-beige/30 transition-colors text-taupe hover:text-ink flex items-center gap-1.5 text-xs font-semibold"
                        title="Explore Market News"
                    >
                        <Sparkles size={14} />
                        <span className="hidden sm:inline">Explore</span>
                    </Link>
                    <div className="h-4 w-[1px] bg-beige/60 hidden sm:block" />
                    <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-lg text-ink tracking-tight">
                            Finexa<sup className="text-gold font-sans font-extrabold text-[10px] ml-0.5">AI</sup>
                        </span>
                        <span className="text-[9px] uppercase tracking-widest font-extrabold bg-burgundy/10 text-burgundy px-2 py-0.5 rounded-full">
                            N8N DYNAMIC
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={resetChat}
                        className="flex items-center gap-1.5 text-xs font-semibold text-taupe hover:text-burgundy px-3 py-1.5 rounded-full hover:bg-beige/30 transition-colors cursor-pointer"
                        title="Reset conversation session"
                    >
                        <RefreshCw size={14} />
                        <span className="hidden sm:inline">Reset Session</span>
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Ambient background glows */}
                <div className="absolute top-10 left-10 w-96 h-96 bg-burgundy/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />

                {/* Left Side - Chat Window */}
                <div className="w-full lg:w-[62%] flex flex-col bg-[#FDF8F3] border-r border-beige/40 z-10">
                    {/* Chat Header */}
                    <div className="p-4 sm:p-5 border-b border-beige/40 bg-white/90 flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 bg-gradient-to-br from-burgundy to-[#8B263E] rounded-xl flex items-center justify-center shadow-md border border-burgundy/20">
                                <Bot size={22} className="text-gold" />
                            </div>
                            <div>
                                <h2 className="font-serif font-extrabold text-base sm:text-lg text-ink tracking-tight uppercase">
                                    FINEXA AI AGENT
                                </h2>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className={`w-2 h-2 rounded-full ${
                                        connectionStatus.status === 'connected' ? 'bg-[#0B4F4A] animate-pulse' :
                                        connectionStatus.status === 'degraded' ? 'bg-amber-500 animate-pulse' :
                                        connectionStatus.status === 'disconnected' ? 'bg-rose-500 animate-pulse' :
                                        'bg-taupe/40 animate-pulse'
                                    }`} />
                                    <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
                                        connectionStatus.status === 'connected' ? 'text-[#0B4F4A]' :
                                        connectionStatus.status === 'degraded' ? 'text-amber-600' :
                                        connectionStatus.status === 'disconnected' ? 'text-rose-600' :
                                        'text-taupe'
                                    }`}>
                                        {connectionStatus.status === 'connected' && 'N8N LIVE AGENT'}
                                        {connectionStatus.status === 'degraded' && 'N8N SLOW AGENT'}
                                        {connectionStatus.status === 'disconnected' && 'N8N OFFLINE'}
                                        {connectionStatus.status === 'checking' && 'N8N CHECKING...'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Connection Status */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDiagnostics(prev => !prev)}
                                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none ${
                                    connectionStatus.status === 'connected'
                                        ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25'
                                        : connectionStatus.status === 'degraded'
                                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/25'
                                        : connectionStatus.status === 'disconnected'
                                        ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/25 animate-pulse'
                                        : 'bg-taupe/10 text-taupe border-taupe/20 hover:bg-taupe/25'
                                }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                    connectionStatus.status === 'connected' ? 'bg-emerald-500 animate-pulse' :
                                    connectionStatus.status === 'degraded' ? 'bg-amber-500 animate-pulse' :
                                    connectionStatus.status === 'disconnected' ? 'bg-rose-500 animate-ping' :
                                    'bg-taupe/50 animate-pulse'
                                }`} />
                                <span className="hidden sm:inline font-bold">
                                    {connectionStatus.status === 'connected' && `n8n Connected (${connectionStatus.latency}ms)`}
                                    {connectionStatus.status === 'degraded' && `n8n Degraded (${connectionStatus.latency}ms)`}
                                    {connectionStatus.status === 'disconnected' && 'n8n Offline'}
                                    {connectionStatus.status === 'checking' && 'Checking Connection...'}
                                </span>
                                <span className="sm:hidden font-bold">
                                    {connectionStatus.status === 'connected' && `${connectionStatus.latency}ms`}
                                    {connectionStatus.status === 'degraded' && `${connectionStatus.latency}ms`}
                                    {connectionStatus.status === 'disconnected' && 'Offline'}
                                    {connectionStatus.status === 'checking' && 'Checking'}
                                </span>
                            </button>

                            {/* Diagnostics Dropdown Card */}
                            <AnimatePresence>
                                {showDiagnostics && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-30" 
                                            onClick={() => setShowDiagnostics(false)} 
                                        />
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.15, ease: "easeOut" }}
                                            className="absolute right-0 mt-2.5 w-72 sm:w-80 bg-white border border-beige/40 rounded-2xl shadow-xl p-5 z-40 text-left"
                                        >
                                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-beige/25">
                                                <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-ink">
                                                    n8n Connection
                                                </h3>
                                                <span className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${
                                                    connectionStatus.status === 'connected' ? 'bg-emerald-500/10 text-emerald-600' :
                                                    connectionStatus.status === 'degraded' ? 'bg-amber-500/10 text-amber-600' :
                                                    connectionStatus.status === 'disconnected' ? 'bg-rose-500/10 text-rose-600' :
                                                    'bg-taupe/10 text-taupe'
                                                }`}>
                                                    {connectionStatus.status}
                                                </span>
                                            </div>

                                            <div className="space-y-3.5 text-xs">
                                                <div>
                                                    <span className="text-[10px] uppercase font-extrabold text-taupe block mb-1">Webhook Endpoint</span>
                                                    <div className="bg-cream/40 p-2 rounded-lg border border-beige/20 font-mono text-[9px] text-ink select-all break-all relative group flex items-center justify-between gap-1.5">
                                                        <span className="truncate pr-4">{N8N_WEBHOOK_URL}</span>
                                                        <button 
                                                            onClick={handleCopyEndpoint}
                                                            className="text-taupe hover:text-burgundy p-1 rounded hover:bg-beige/20 transition-colors cursor-pointer shrink-0"
                                                            title="Copy Webhook URL"
                                                        >
                                                            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3.5">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-extrabold text-taupe block mb-0.5">Response Latency</span>
                                                        <div className="font-serif font-extrabold text-sm text-ink">
                                                            {connectionStatus.latency !== null ? `${connectionStatus.latency} ms` : 'N/A'}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] uppercase font-extrabold text-taupe block mb-0.5">Last Checked</span>
                                                        <div className="font-serif font-extrabold text-sm text-ink">
                                                            {connectionStatus.lastChecked || 'Never'}
                                                        </div>
                                                    </div>
                                                </div>

                                                {connectionStatus.error && (
                                                    <div className="bg-rose-50 border border-rose-100 text-rose-700 p-2.5 rounded-lg text-[10px] leading-normal flex items-start gap-1.5">
                                                        <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                                        <span className="font-medium">{connectionStatus.error}</span>
                                                    </div>
                                                )}

                                                <div className="pt-2.5 border-t border-beige/25 flex gap-2">
                                                    <button
                                                        onClick={() => checkConnectionStatus(true)}
                                                        disabled={isCheckingManual}
                                                        className="flex-1 bg-ink hover:bg-burgundy text-white py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                    >
                                                        {isCheckingManual ? (
                                                            <>
                                                                <Loader2 size={12} className="animate-spin" />
                                                                <span>Testing...</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <RefreshCw size={11} />
                                                                <span>Ping Webhook</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Connection Warning Banner */}
                    <AnimatePresence>
                        {connectionStatus.status === 'disconnected' && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-rose-500/10 border-b border-rose-500/20 px-5 py-2.5 flex items-center justify-between text-xs text-rose-800 font-semibold z-15 relative shrink-0"
                            >
                                <div className="flex items-center gap-2">
                                    <AlertCircle size={14} className="text-rose-600 animate-bounce shrink-0" />
                                    <span>n8n agent connection is offline. Responses might be delayed or unavailable.</span>
                                </div>
                                <button
                                    onClick={() => checkConnectionStatus(true)}
                                    className="text-[10px] uppercase tracking-wider font-extrabold bg-rose-600 text-white px-2.5 py-1 rounded-md hover:bg-rose-700 transition-colors shrink-0"
                                >
                                    Retry
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Messages Area with Finance Animated Icons Wallpaper */}
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 no-scrollbar bg-[#FDF8F3] relative overflow-hidden">
                        <AnimatedIconBackground />

                        <div className="relative z-10">
                            <AnimatePresence>
                                {messages.map((msg) => (
                                    <ChatMessage key={msg.id} {...msg} />
                                ))}
                            </AnimatePresence>

                            {/* Animated Thinking Indicator when loading */}
                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex w-full mb-5 justify-start"
                                >
                                    <div className="bg-white text-ink rounded-2xl rounded-tl-sm border border-beige/40 p-4 shadow-sm flex items-center gap-3">
                                        <div className="w-7 h-7 bg-burgundy/10 rounded-lg flex items-center justify-center text-burgundy">
                                            <Loader2 size={16} className="animate-spin" />
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 rounded-full bg-burgundy animate-bounce [animation-delay:-0.3s]" />
                                            <span className="w-2 h-2 rounded-full bg-burgundy animate-bounce [animation-delay:-0.15s]" />
                                            <span className="w-2 h-2 rounded-full bg-burgundy animate-bounce" />
                                            <span className="text-xs font-semibold text-taupe ml-2">Finexa AI is thinking...</span>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={chatEndRef} />
                        </div>
                    </div>

                    {/* Input Bar */}
                    <form onSubmit={handleSend} className="p-4 sm:p-5 bg-white border-t border-beige/40 flex gap-3 items-center">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isLoading}
                            placeholder={isLoading ? "Finexa AI is processing..." : "Ask Finexa AI anything..."}
                            className={`flex-1 bg-cream/90 border border-beige/50 focus:border-burgundy focus:ring-1 focus:ring-burgundy rounded-full px-6 py-3.5 font-semibold text-xs sm:text-sm text-ink placeholder:text-taupe/60 outline-none transition-all ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all shrink-0 ${isLoading || !inputValue.trim()
                                ? 'bg-beige/40 text-taupe cursor-not-allowed'
                                : 'bg-ink hover:bg-burgundy text-white active:scale-95 cursor-pointer'
                                }`}
                            title="Send message"
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} className="translate-x-0.5" />}
                        </button>
                    </form>
                </div>

                {/* Right Side - WhatsApp Concierge Banner with 3D Phone Effect */}
                <div className="hidden lg:flex w-[38%] flex-col items-center justify-between p-8 xl:p-12 bg-cream/60 relative z-10 text-center">
                    <div className="my-auto max-w-sm flex flex-col items-center">
                        <Interactive3DPhone />

                        <h2 className="font-serif text-3xl xl:text-4xl font-extrabold text-ink leading-none tracking-tight mb-4 select-none">
                            TAKE IT TO <br />
                            <span className="text-[#25D366]">WHATSAPP</span>
                        </h2>

                        <p className="text-xs font-semibold text-taupe leading-relaxed mb-8 max-w-xs">
                            Ready to book? Chat with our live agents on WhatsApp for instant confirmation and exclusive mobile-only deals.
                        </p>

                        <a
                            href="https://wa.me/15551382180"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-black hover:bg-burgundy text-white py-4 px-8 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95 transition-all mb-8"
                        >
                            <span>OPEN WHATSAPP BOT</span>
                            <ExternalLink size={14} />
                        </a>
                    </div>

                    <div className="text-[9px] font-extrabold uppercase tracking-[0.35em] text-taupe/50 select-none border-t border-beige/30 pt-4 w-full">
                        FINEXA OFFICIAL MOBILE CONCIERGE
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
