import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ExternalLink, ShieldAlert, X, Info, CheckCircle2 } from 'lucide-react';
import { useScrollLock } from '../../hooks/useScrollLock';

const DISCLAIMER_LINK = "https://finexa-privacy-policy.vercel.app/";

const AssistiveWarningButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [hasAcknowledged, setHasAcknowledged] = useState(false);

    // Prevent scrolling when popup modal is open
    useScrollLock(isOpen);

    useEffect(() => {
        try {
            const ack = localStorage.getItem('finexa_disclaimer_ack');
            if (ack === 'true') {
                setHasAcknowledged(true);
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }, []);

    const handleAcknowledge = () => {
        setHasAcknowledged(true);
        try {
            localStorage.setItem('finexa_disclaimer_ack', 'true');
        } catch (e) {
            // Ignore localStorage errors
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* AssistiveTouch Floating Warning Button */}
            <motion.div
                className="fixed bottom-6 left-6 z-[9990] touch-none select-none"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
                drag
                dragConstraints={{ left: 10, right: window.innerWidth - 80, top: 10, bottom: window.innerHeight - 80 }}
                dragElastic={0.1}
                dragMomentum={false}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
            >
                <div className="relative group">
                    {/* Pulsing glow effect around AssistiveTouch orb */}
                    <div className="absolute -inset-1.5 rounded-full bg-gradient-to-r from-amber-500/40 via-burgundy/30 to-amber-600/40 blur-sm animate-pulse opacity-75 group-hover:opacity-100 transition-opacity" />

                    {/* Main AssistiveTouch button */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="relative w-14 h-14 rounded-full bg-ink/90 text-ivory hover:bg-ink backdrop-blur-xl border-2 border-amber-500/60 shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 group"
                        aria-label="Important Legal Warning & Risk Notice"
                        title="FINEXA AI Risk Disclaimer & Legal Warning"
                    >
                        {/* Outer ring styling like iOS AssistiveTouch */}
                        <span className="absolute inset-1 rounded-full border border-ivory/20 pointer-events-none" />

                        {/* Animated Warning Icon */}
                        <div className="relative flex items-center justify-center">
                            <AlertTriangle className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform duration-200" />
                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-ink"></span>
                            </span>
                        </div>
                    </button>

                    {/* Floating Tooltip label on desktop hover */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 5, x: 0 }}
                                animate={{ opacity: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, y: 5 }}
                                className="absolute left-16 top-2 whitespace-nowrap bg-ink/95 text-ivory text-xs px-3 py-1.5 rounded-lg shadow-xl border border-amber-500/30 backdrop-blur-md font-medium pointer-events-none flex items-center gap-1.5"
                            >
                                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                                <span>FINEXA Risk Disclaimer</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Warning Popup Modal Dialog */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                        {/* Backdrop Blur overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-ink/65 backdrop-blur-md"
                        />

                        {/* Modal Box */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl max-h-[85vh] bg-ivory border border-beige/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 linen-noise"
                        >
                            {/* Modal Header */}
                            <div className="relative px-6 py-5 bg-gradient-to-r from-burgundy/90 via-ink to-burgundy/95 text-ivory flex items-center justify-between border-b border-amber-500/20">
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                                        <AlertTriangle className="w-6 h-6 text-amber-300 animate-pulse" />
                                    </div>
                                    <div>
                                        <h2 className="font-serif font-bold text-lg sm:text-xl tracking-wide text-ivory">
                                            FINEXA AI — Disclaimer & Risk Notice
                                        </h2>
                                        <p className="text-xs text-amber-200/80 font-sans">
                                            Important Legal Information & Platform Guidance
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 rounded-full bg-ivory/10 hover:bg-ivory/20 text-ivory flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label="Close dialog"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Scrollable Body */}
                            <div className="p-6 overflow-y-auto space-y-5 text-ink text-sm leading-relaxed no-scrollbar">
                                {/* Important Core Banner */}
                                <div className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-ink/90 text-sm space-y-2">
                                    <div className="flex items-center gap-2 font-bold text-burgundy text-base">
                                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
                                        <span>Suggestion & Advisory Notice</span>
                                    </div>
                                    <p className="font-medium">
                                        All content, reports, analytics, portfolio optimizations, calculators, forecasts, and outputs provided by or in <strong>FINEXA AI</strong> are intended solely as general suggestions, educational material, and quantitative analytical tools.
                                    </p>
                                    <p className="font-semibold text-burgundy">
                                        It is NOT guaranteed that any financial loss will be prevented, and FINEXA AI and its team do NOT accept responsibility or liability for any financial decisions, losses, or outcomes incurred.
                                    </p>
                                </div>

                                {/* Key Warning Points */}
                                <div className="space-y-3">
                                    <div className="p-4 rounded-xl bg-cream/70 border border-beige/60 space-y-1.5">
                                        <h3 className="font-bold text-burgundy flex items-center gap-2 text-sm">
                                            <ShieldAlert className="w-4 h-4 text-amber-600" />
                                            Not Licensed Investment Advice
                                        </h3>
                                        <p className="text-xs text-ink/80">
                                            Finexa AI is <strong>not a SEBI-registered investment advisor</strong>, research analyst, broker, custodian, or fiduciary, and is not a certified financial planner. All AI responses, forecasts, and portfolio allocations are algorithmic simulations — not personalized recommendations or guaranteed returns.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-cream/70 border border-beige/60 space-y-1.5">
                                        <h3 className="font-bold text-burgundy flex items-center gap-2 text-sm">
                                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                                            AI Output Limitations & Verification (DYOR)
                                        </h3>
                                        <p className="text-xs text-ink/80">
                                            Large Language Models and algorithmic engines can produce errors, hallucinations, or outdated figures. Users must conduct their own due diligence (DYOR) and verify all facts, figures, and data against primary sources before committing capital.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-xl bg-cream/70 border border-beige/60 space-y-1.5">
                                        <h3 className="font-bold text-burgundy flex items-center gap-2 text-sm">
                                            <Info className="w-4 h-4 text-amber-600" />
                                            100% User Assumption of Risk
                                        </h3>
                                        <p className="text-xs text-ink/80">
                                            Trading equities, derivatives, and crypto carries a substantial risk of total capital loss. You bear 100% of the financial risk and responsibility for every investment decision you take.
                                        </p>
                                    </div>
                                </div>

                                {/* External Policy Link Box */}
                                <div className="p-4 rounded-2xl bg-gradient-to-r from-ink to-burgundy text-ivory flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-500/30 shadow-lg">
                                    <div className="space-y-1">
                                        <p className="font-serif font-bold text-amber-300 text-sm">
                                            Complete Legal Framework & Policy
                                        </p>
                                        <p className="text-xs text-ivory/80">
                                            Read the full Privacy Policy, GDPR & DPDP compliance, and detailed terms of use.
                                        </p>
                                    </div>
                                    <a
                                        href={DISCLAIMER_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-ink font-bold text-xs shadow-md transition-all active:scale-95 flex-shrink-0"
                                    >
                                        <span>View Privacy Policy</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 bg-cream/80 border-t border-beige/60 flex items-center justify-between gap-4">
                                <div className="text-xs text-ink/70 flex items-center gap-1.5">
                                    {hasAcknowledged && (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-teal" />
                                            <span>Acknowledged on this device</span>
                                        </>
                                    )}
                                </div>
                                <button
                                    onClick={handleAcknowledge}
                                    className="px-6 py-2.5 rounded-xl bg-burgundy hover:bg-burgundy/90 text-ivory font-bold text-xs tracking-wider uppercase cursor-pointer shadow-md transition-all active:scale-95 border border-amber-500/30"
                                >
                                    I Understand & Acknowledge
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AssistiveWarningButton;
