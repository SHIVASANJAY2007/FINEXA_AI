import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Send, Bot, Phone, Video, MoreVertical, ExternalLink, ShieldCheck, Zap, Bell, Check } from 'lucide-react';

// Financial menu structure
const MENU_STRUCTURE = {
    main: {
        text: "How can I assist you today? Please select an option by typing the number:\n\n1) 📈 Analyze Investment Portfolio\n2) 🐷 Set up Auto-SIP / Savings\n3) 💼 Goal-Based Plan Builder\n4) 📜 Tax Optimization (80C)\n5) ⚡ Generate Financial Plan",
        options: {
            "1": "invest",
            "2": "savings",
            "3": "goals",
            "4": "tax",
            "5": "generate"
        }
    },
    invest: {
        text: "Portfolio Analysis options:\n\n1) 📊 Direct Mutual Fund Fee Audit\n2) 🌍 Stock Market Risk Exposure\n3) 🏦 Fixed Deposit Rate Comparison\n0) ⬅️ Back to Main Menu",
        options: {
            "1": "mfaudit",
            "2": "risk",
            "3": "fdcompare",
            "0": "main"
        }
    },
    savings: {
        text: "SIP & Savings options:\n\n1) 💰 Auto-SIP Setup\n2) 🛡️ Emergency Buffer Fund\n0) ⬅️ Back to Main Menu",
        options: {
            "1": "autosip",
            "2": "emergency",
            "0": "main"
        }
    },
    goals: {
        text: "Goal Planning options:\n\n1) 🏡 Home Purchase Planner\n2) 🎓 Child Education Fund\n3) 🌴 Early Retirement (FIRE)\n0) ⬅️ Back to Main Menu",
        options: {
            "1": "home",
            "2": "education",
            "3": "fire",
            "0": "main"
        }
    },
    tax: {
        text: "Tax Optimization options:\n\n1) 📉 ELSS Mutual Funds\n2) 🛡️ PPF & National Savings Certificates\n0) ⬅️ Back to Main Menu",
        options: {
            "1": "elss",
            "2": "ppf",
            "0": "main"
        }
    }
};

// Response content for leaf nodes
const RESPONSES = {
    mfaudit: "Direct Mutual Funds can save you up to 1.2% annually compared to Regular Mutual Funds. I can run an audit on your current portfolio holdings to estimate your exact savings. (Type '5' to generate your plan)",
    risk: "Nifty 50 is trading at a premium. I suggest allocating a larger portion to arbitrage or dynamic asset allocation funds if your risk tolerance is low. (Type '0' for main menu)",
    fdcompare: "Current highest FD rates: SBI 7.25% (400 days), HDFC 7.20% (18 months), Shriram Finance 8.80% (Senior Citizens). I can map these to your emergency buffer allocation. (Type '0' for main menu)",
    autosip: "Set up auto-deduct for your SIP. We'll automatically route your monthly savings: 60% into index equity, 40% into arbitrage mutual funds. (Type '5' to generate plan)",
    emergency: "A general rule of thumb is keeping 6 months of expenses. For your ₹18,400 monthly surplus, building an emergency buffer of ₹1.1 Lakhs is recommended. (Type '0' for main menu)",
    home: "Planning to buy a home? If you need a downpayment of ₹20 Lakhs in 5 years, you need a monthly SIP of ₹26,500 at a conservative 10% average return. (Type '0' for main menu)",
    education: "Higher education cost in India is inflating at 10% y-o-y. To fund a ₹40 Lakh goal in 12 years, we suggest a monthly SIP of ₹15,000 in equity mutual funds. (Type '0' for main menu)",
    fire: "To retire early, you need a corpus of 25x your annual expenses. Let's estimate your Target retirement amount. (Type '5' to generate plan)",
    elss: "Under Section 80C, investing up to ₹1.5 Lakhs in ELSS funds can save up to ₹46,800 in taxes annually. Lock-in is only 3 years. (Type '0' for main menu)",
    ppf: "PPF offers a guaranteed 7.1% tax-free return with a 15-year lock-in. A safe choice for conservative goal planning. (Type '0' for main menu)"
};

const ChatMessage = ({ text, sender, isBot, time, type, data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}
        >
            <div className={`max-w-[85%] relative ${
                isBot
                    ? 'bg-burgundy text-ivory rounded-2xl rounded-tl-none border border-burgundy/10 shadow-[0_4px_12px_rgba(107,30,43,0.1)]'
                    : 'bg-transparent text-ink border border-beige/40 rounded-2xl rounded-tr-none bg-beige/10'
            } p-4`}
            >
                {type === 'plan' ? (
                    <div className="space-y-4 min-w-[280px] text-left">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={15} className="text-gold" />
                            <span className="text-[9.5px] font-bold uppercase tracking-wider text-gold">Plan Generated</span>
                        </div>
                        <h3 className="font-serif text-xl font-bold text-ivory leading-tight">{data.title}</h3>
                        <div className="grid grid-cols-2 gap-2.5 mt-4">
                            <div className="bg-ivory/5 border border-ivory/10 p-3 rounded-xl">
                                <p className="text-[8px] font-bold text-ivory/60 uppercase tracking-widest">SIP Allocation</p>
                                <p className="text-xs font-bold text-ivory mt-0.5">{data.allocation}</p>
                            </div>
                            <div className="bg-ivory/5 border border-ivory/10 p-3 rounded-xl">
                                <p className="text-[8px] font-bold text-ivory/60 uppercase tracking-widest">Projected Return</p>
                                <p className="text-xs font-bold text-ivory mt-0.5">{data.rate}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-ivory/70">
                            <Check size={12} className="text-teal" />
                            DPDP Privacy-first & SOC2 Shield Enabled
                        </div>
                    </div>
                ) : type === 'whatsapp' ? (
                    <div className="space-y-4 py-2 text-left">
                        <p className="text-xs font-medium leading-relaxed italic text-ivory/80">
                            "Excellent choice. I've synced your final roadmap configuration to our deployment console."
                        </p>
                        <div className="bg-[#25D366]/10 p-4 rounded-xl border border-[#25D366]/25">
                            <h4 className="font-bold text-[10.5px] uppercase tracking-wider text-[#25D366] mb-1.5">Concierge Active</h4>
                            <p className="text-[11.5px] font-medium text-ivory/90 mb-4 leading-relaxed">
                                You need to finalize setup on WhatsApp to unlock direct mutual fund integrations.
                            </p>
                            <a
                                href="https://wa.me/15551382180"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] text-white py-3 rounded-full font-bold text-[10.5px] uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-102 active:scale-98 transition-transform shadow-[0_4px_12px_rgba(37,211,102,0.25)]"
                            >
                                <Phone size={14} fill="white" />
                                Connect Concierge
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className="text-xs leading-relaxed font-medium whitespace-pre-wrap text-left">
                        {text}
                    </div>
                )}
                <div className={`text-[8.5px] font-semibold mt-2 ${isBot ? 'text-ivory/40' : 'text-taupe/60'}`}>
                    {time}
                </div>
            </div>
        </motion.div>
    );
};

const Dashboard = () => {
    const { isLoaded, user } = useUser();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([
        {
            text: "Welcome to FinexaAI Concierge! 📈\n\nI'm your dedicated autonomous intelligence agent. " + MENU_STRUCTURE.main.text,
            isBot: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [currentMenu, setCurrentMenu] = useState('main');
    const [isPlanCreated, setIsPlanCreated] = useState(false);
    const chatEndRef = useRef(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    if (!isLoaded) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-ivory">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-beige border-t-burgundy rounded-full animate-spin"></div>
                    <p className="font-semibold uppercase tracking-widest text-[10px] text-taupe">Syncing secure connection...</p>
                </div>
            </div>
        );
    }

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsg = inputValue.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false, time: now }]);
        setInputValue('');

        setTimeout(() => {
            const menu = MENU_STRUCTURE[currentMenu];

            // Check if user input is a valid number in current menu
            if (menu && menu.options[userMsg]) {
                const nextKey = menu.options[userMsg];

                if (nextKey === 'generate') {
                    triggerPlan(now);
                } else if (MENU_STRUCTURE[nextKey]) {
                    // Navigate to sub-menu
                    setCurrentMenu(nextKey);
                    setMessages(prev => [...prev, {
                        text: MENU_STRUCTURE[nextKey].text,
                        isBot: true,
                        time: now
                    }]);
                } else if (RESPONSES[nextKey]) {
                    // Show final response
                    setMessages(prev => [...prev, {
                        text: RESPONSES[nextKey],
                        isBot: true,
                        time: now
                    }]);
                }
            } else if (userMsg === '0' && currentMenu !== 'main') {
                setCurrentMenu('main');
                setMessages(prev => [...prev, {
                    text: MENU_STRUCTURE.main.text,
                    isBot: true,
                    time: now
                }]);
            } else {
                setMessages(prev => [...prev, {
                    text: "I'm sorry, I didn't recognize that option. Please type a number from the list above, or type '0' to return to the Main Menu.",
                    isBot: true,
                    time: now
                }]);
            }
        }, 800);
    };

    const triggerPlan = (time) => {
        setMessages(prev => [...prev,
        {
            type: 'plan',
            data: {
                title: "The Finexa Elite Plan",
                allocation: "60% Equity / 40% Debt",
                rate: "10.4% p.a. average"
            },
            isBot: true,
            time: time
        }
        ]);

        setTimeout(() => {
            setMessages(prev => [...prev, {
                type: 'whatsapp',
                isBot: true,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);

        setIsPlanCreated(true);
    };

    return (
        <div className="flex h-screen bg-ivory overflow-hidden">
            {/* Left Side - AI Chatbot */}
            <div className="w-full lg:w-[60%] flex flex-col bg-white border-r border-beige/40">
                {/* Header */}
                <div className="p-6 border-b border-beige/40 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 bg-burgundy rounded-xl flex items-center justify-center border border-burgundy/10 shadow-sm">
                            <Bot size={22} className="text-gold" />
                        </div>
                        <div className="text-left">
                            <h2 className="font-serif text-lg font-bold text-ink">FinexaAI Agent</h2>
                            <div className="flex items-center gap-2 mt-0.5">
                                <span className="w-1.5 h-1.5 bg-teal rounded-full animate-pulse"></span>
                                <span className="text-[9px] font-bold text-taupe uppercase tracking-widest">Available</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 no-scrollbar bg-ivory">
                    <AnimatePresence>
                        {messages.map((msg, idx) => (
                            <ChatMessage key={idx} {...msg} />
                        ))}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </div>

                {/* Input Bar */}
                <form onSubmit={handleSend} className="p-6 bg-white border-t border-beige/40 flex gap-4">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type a number to select..."
                        className="flex-1 bg-cream border border-beige/45 focus:border-burgundy rounded-full px-6 py-4 font-bold text-xs text-ink outline-none transition-all placeholder:text-taupe/60"
                    />
                    <button
                        type="submit"
                        disabled={isPlanCreated}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isPlanCreated 
                                ? 'bg-beige/30 text-taupe/40 cursor-not-allowed' 
                                : 'bg-burgundy text-ivory hover:bg-burgundy/90 hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(107,30,43,0.2)]'
                        }`}
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>

            {/* Right Side - WhatsApp Redirect */}
            <div className="hidden lg:flex flex-col flex-1 items-center justify-center p-12 bg-cream relative">
                {/* Ambient blooms */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-burgundy/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-48 h-48 bg-gold/5 rounded-full blur-2xl" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xs text-center z-10"
                >
                    <div className="w-20 h-20 bg-[#25D366] rounded-[32%] flex items-center justify-center mx-auto mb-6 shadow-[0_8px_24px_rgba(37,211,102,0.2)]">
                        <Phone size={36} className="text-white" />
                    </div>

                    <h2 className="text-4xl font-serif font-bold text-ink leading-tight mb-4 select-none">
                        Take it to <br /> <span className="text-[#25D366]">WhatsApp</span>
                    </h2>

                    <p className="text-xs font-semibold text-taupe mb-8 leading-relaxed">
                        Ready to deploy your plan? Connect with our personal wealth concierge on WhatsApp to finalize your portfolio execution.
                    </p>

                    <a
                        href="https://wa.me/15551382180"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-flex items-center gap-3.5 bg-ink text-ivory px-8 py-4.5 rounded-full font-bold uppercase tracking-wider text-[10.5px] shadow-[0_8px_24px_rgba(58,46,37,0.15)] hover:bg-burgundy hover:scale-102 active:scale-98 transition-all"
                    >
                        <span>Open WhatsApp Concierge</span>
                        <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </motion.div>

                <div className="absolute bottom-10 text-[9px] font-bold uppercase tracking-[0.4em] opacity-30 text-taupe select-none">
                    Finexa Official Wealth Concierge
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
