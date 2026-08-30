import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
    Send, Bot, Phone, ExternalLink, 
    ArrowLeft, RefreshCw, Sparkles, Loader2, AlertCircle,
    Copy, Check
} from 'lucide-react';
import AnimatedIconBackground from './AnimatedIconBackground';
import ResponseRenderer from './ResponseRenderer';

const BACKEND_API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const WHATSAPP_API_URL = import.meta.env.VITE_WHATSAPP_API_URL || 'https://wa.me/15551382180';
const TELEGRAM_API_URL = import.meta.env.VITE_TELEGRAM_API_URL || 'https://t.me/FinexaAIBot';

const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const TelegramIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="100%" height="100%">
        <path d="M21.9 4.1L2.1 11.7c-.8.3-.8.8-.2 1l5.1 1.6 11.8-7.4c.6-.4 1.1-.2.6.2L9.9 14.8l-.4 3.7c.4 0 .5-.2.7-.3l1.8-1.7 3.7 2.7c.7.4 1.2.2 1.4-.6l2.4-11.4c.2-.9-.3-1.3-1-1z" />
    </svg>
);

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
const Interactive3DPhone = memo(({ platform }) => {
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

    const isWhatsApp = platform === 'whatsapp';

    return (
        <div
            className="mb-8"
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
                    backgroundColor: isWhatsApp ? '#25D366' : '#0088cc',
                    boxShadow: isWhatsApp
                        ? '0px 18px 45px rgba(37, 211, 102, 0.32)'
                        : '0px 18px 45px rgba(0, 136, 204, 0.32)'
                }}
                transition={{
                    type: 'spring',
                    stiffness: 140,
                    damping: 20,
                    mass: 0.8,
                    backgroundColor: { duration: 0.5, ease: 'easeInOut' },
                    boxShadow: { duration: 0.5, ease: 'easeInOut' }
                }}
                style={{
                    transformStyle: 'preserve-3d'
                }}
                className="w-32 h-32 xl:w-36 xl:h-36 rounded-[34px] flex items-center justify-center cursor-pointer relative group"
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
                        translateZ: isHovered ? 40 : 8,
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 180,
                        damping: 18
                    }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative z-10"
                >
                    {isWhatsApp ? (
                        <WhatsAppIcon className="w-14 h-14 text-white drop-shadow-lg" />
                    ) : (
                        <TelegramIcon className="w-14 h-14 text-white drop-shadow-lg" />
                    )}
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

                <div className="text-xs sm:text-sm leading-relaxed font-medium text-left w-full">
                    {isBot && !isError ? (
                        <ResponseRenderer text={text} />
                    ) : (
                        <div className="whitespace-pre-wrap">{text}</div>
                    )}
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
            text: "Welcome to Finexa AI! ☄️\n\nHow can I assist you with your travel and financial planning today?",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [activePlatform, setActivePlatform] = useState('whatsapp');
    const [chatStatus, setChatStatus] = useState('checking');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-focus input on mount and when loading finishes
    useEffect(() => {
        if (!isLoading) {
            inputRef.current?.focus();
        }
    }, [isLoading]);

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

    // Function to ping/check n8n connection status via backend proxy
    const checkConnectionStatus = useCallback(async (isManual = false) => {
        if (isManual) setIsCheckingManual(true);
        const startTime = performance.now();
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

            const response = await fetch(`${BACKEND_API_URL}/chat/status`, {
                method: 'GET',
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const endTime = performance.now();
            const latency = Math.round(endTime - startTime);

            const data = await response.json();
            const isOnline = data.online;

            if (isOnline) {
                setConnectionStatus({
                    status: latency > 1800 ? 'degraded' : 'connected',
                    latency,
                    lastChecked: new Date().toLocaleTimeString(),
                    error: null
                });
                setChatStatus('online');
            } else {
                setConnectionStatus({
                    status: 'disconnected',
                    latency,
                    lastChecked: new Date().toLocaleTimeString(),
                    error: `Service Gateway Error`
                });
                setChatStatus('offline');
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
            setChatStatus('offline');
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

    // Real-time n8n status checking via backend proxy
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await fetch(`${BACKEND_API_URL}/chat/status`);
                if (res.ok) {
                    const data = await res.json();
                    setChatStatus(data.online ? 'online' : 'offline');
                } else {
                    setChatStatus('offline');
                }
            } catch (err) {
                setChatStatus('offline');
            }
        };

        fetchStatus();
        const statusInterval = setInterval(fetchStatus, 15000);

        return () => clearInterval(statusInterval);
    }, []);

    const handleCopyEndpoint = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(`${BACKEND_API_URL}/chat/send`);
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
            const response = await fetch(`${BACKEND_API_URL}/chat/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    personId: "",
                    sessionId: sessionIdRef.current,
                    message: userMsg
                })
            });

            if (!response.ok) {
                throw new Error(`Proxy responded with status ${response.status}`);
            }

            const messageEndTime = performance.now();
            const latency = Math.round(messageEndTime - messageStartTime);

            // Update connection status dynamically based on successful message exchange
            setConnectionStatus({
                status: latency > 1800 ? 'degraded' : 'connected',
                latency,
                lastChecked: new Date().toLocaleTimeString(),
                error: null
            });
            setChatStatus('online');

            const responseData = await response.json();
            const botReplyText = responseData.output || "No response received.";

            setMessages(prev => [...prev, {
                id: `bot-${Date.now()}`,
                isBot: true,
                text: botReplyText,
                time: nowTime()
            }]);

        } catch (err) {
            console.error('Chat Proxy Error:', err);
            
            setConnectionStatus(prev => ({
                ...prev,
                status: 'disconnected',
                lastChecked: new Date().toLocaleTimeString(),
                error: err.message || 'Connection failed during query'
            }));
            setChatStatus('offline');

            setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                isBot: true,
                text: "I encountered a problem connecting to the AI agent. Please check your network and try again.",
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
        inputRef.current?.focus();
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
                                <div className="mt-0.5">
                                    {chatStatus === 'online' && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.7)]"></span>
                                            <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Agent Online</span>
                                        </div>
                                    )}
                                    {chatStatus === 'offline' && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_10px_rgba(239,68,68,0.7)]"></span>
                                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Agent Offline</span>
                                        </div>
                                    )}
                                    {chatStatus === 'checking' && (
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.7)]"></span>
                                            <span className="text-[10px] font-bold text-yellow-600 uppercase tracking-widest">Connecting...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Connection Status */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDiagnostics(prev => !prev)}
                                className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer select-none ${connectionStatus.status === 'connected'
                                    ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/25'
                                    : connectionStatus.status === 'degraded'
                                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/25'
                                        : connectionStatus.status === 'disconnected'
                                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/20 hover:bg-rose-500/25 animate-pulse'
                                            : 'bg-taupe/10 text-taupe border-taupe/20 hover:bg-taupe/25'
                                    }`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${connectionStatus.status === 'connected' ? 'bg-emerald-500 animate-pulse' :
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
                                                <span className={`text-[9px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${connectionStatus.status === 'connected' ? 'bg-emerald-500/10 text-emerald-600' :
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
                            ref={inputRef}
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

                {/* Right Side - WhatsApp & Telegram Concierge Banner with 3D Phone Effect */}
                <div className={`hidden lg:flex w-[38%] flex-col items-center justify-between p-8 xl:p-12 relative z-10 text-center transition-colors duration-700 ${activePlatform === 'whatsapp' ? 'bg-[#eefcf3]' : 'bg-[#edf6fd]'
                    }`}>
                    {/* Dynamic Background Glow Blobs */}
                    <div
                        className={`absolute top-20 right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${activePlatform === 'whatsapp' ? 'bg-[#25D366]/10' : 'bg-[#0088cc]/10'
                            }`}
                    />
                    <div
                        className={`absolute bottom-20 left-20 w-48 h-48 rounded-full blur-2xl pointer-events-none transition-colors duration-500 ${activePlatform === 'whatsapp' ? 'bg-[#25D366]/5' : 'bg-[#0088cc]/5'
                            }`}
                    />

                    {/* Platform Toggle Switcher at the Top */}
                    <div className="absolute top-8 flex items-center bg-white/70 border border-beige/40 p-2 rounded-full shadow-lg backdrop-blur-md z-20 gap-3">
                        {/* WhatsApp Option */}
                        <motion.button
                            layout
                            type="button"
                            onClick={() => setActivePlatform('whatsapp')}
                            title="Switch to WhatsApp"
                            className={`flex items-center justify-center gap-3 h-12 rounded-full cursor-pointer transition-all duration-500 relative border overflow-hidden ${activePlatform === 'whatsapp'
                                ? 'bg-[#25D366] border-[#1ebd5b] text-black w-44 shadow-lg shadow-[#25D366]/30'
                                : 'bg-[#25D366]/10 border-[#25D366]/30 text-[#25D366] hover:bg-[#25D366]/20 w-12'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        >
                            <WhatsAppIcon className={`w-5 h-5 flex-shrink-0 transition-colors duration-500 ${activePlatform === 'whatsapp' ? 'text-black' : 'text-[#25D366]'}`} />
                            {activePlatform === 'whatsapp' && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-black uppercase text-[10px] tracking-[2px] whitespace-nowrap text-black"
                                >
                                    WhatsApp
                                </motion.span>
                            )}
                        </motion.button>

                        {/* Telegram Option */}
                        <motion.button
                            layout
                            type="button"
                            onClick={() => setActivePlatform('telegram')}
                            title="Switch to Telegram"
                            className={`flex items-center justify-center gap-3 h-12 rounded-full cursor-pointer transition-all duration-500 relative border overflow-hidden ${activePlatform === 'telegram'
                                ? 'bg-[#0088cc] border-[#0077b5] text-white w-44 shadow-lg shadow-[#0088cc]/30'
                                : 'bg-[#0088cc]/10 border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/20 w-12'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 350, damping: 26 }}
                        >
                            <TelegramIcon className={`w-5 h-5 flex-shrink-0 transition-colors duration-500 ${activePlatform === 'telegram' ? 'text-white' : 'text-[#0088cc]'}`} />
                            {activePlatform === 'telegram' && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="font-black uppercase text-[10px] tracking-[2px] whitespace-nowrap text-white"
                                >
                                    Telegram
                                </motion.span>
                            )}
                        </motion.button>
                    </div>

                    <div className="my-auto max-w-sm flex flex-col items-center z-10 w-full pt-12">
                        <AnimatePresence mode="wait">
                            {activePlatform === 'whatsapp' ? (
                                <motion.div
                                    key="whatsapp"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center w-full"
                                >
                                    <Interactive3DPhone platform="whatsapp" />

                                    <h2 className="font-serif text-3xl xl:text-4xl font-extrabold text-ink leading-none tracking-tight mb-4 select-none">
                                        TAKE IT TO <br />
                                        <span className="text-[#25D366]">WHATSAPP</span>
                                    </h2>

                                    <p className="text-xs font-semibold text-taupe leading-relaxed mb-8 max-w-xs">
                                        Ready to chat? Connect with our Finexa AI bot on WhatsApp for instant financial insights and alerts on the go.
                                    </p>

                                    <a
                                        href={WHATSAPP_API_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-black hover:bg-burgundy text-white py-4 px-8 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95 transition-all mb-8"
                                    >
                                        <span>OPEN WHATSAPP BOT</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="telegram"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col items-center w-full"
                                >
                                    <Interactive3DPhone platform="telegram" />

                                    <h2 className="font-serif text-3xl xl:text-4xl font-extrabold text-ink leading-none tracking-tight mb-4 select-none">
                                        TAKE IT TO <br />
                                        <span className="text-[#0088cc]">TELEGRAM</span>
                                    </h2>

                                    <p className="text-xs font-semibold text-taupe leading-relaxed mb-8 max-w-xs">
                                        Prefer Telegram? Interact with the Finexa AI Telegram bot for seamless, private and secure wealth management answers.
                                    </p>

                                    <a
                                        href={TELEGRAM_API_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-black hover:bg-burgundy text-white py-4 px-8 rounded-full font-extrabold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.15)] active:scale-95 transition-all mb-8"
                                    >
                                        <span>OPEN TELEGRAM BOT</span>
                                        <ExternalLink size={14} />
                                    </a>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
