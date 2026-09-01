import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlowingMenu from './FlowingMenu';

const GlobalMenu = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            {/* Global Floating Hamburger Menu Button - Top Right */}
            <button
                onClick={() => setIsMenuOpen(true)}
                className="fixed top-6 right-6 z-[9998] w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-ivory/90 hover:bg-ivory backdrop-blur-md border border-beige/45 rounded-full cursor-pointer pointer-events-auto shadow-md hover:shadow-lg transition-all duration-300 active:scale-95"
                aria-label="Open Menu"
            >
                <div className="w-5 h-0.5 bg-ink rounded-full" />
                <div className="w-5 h-0.5 bg-ink rounded-full" />
                <div className="w-5 h-0.5 bg-ink rounded-full" />
            </button>

            {/* Immersive Glass sliding panel */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Dim Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/35 backdrop-blur-sm z-[99998]"
                        />

                        {/* Glassmorphism Right-side Panel (50% page width on desktop) */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 220 }}
                            className="fixed top-0 right-0 h-screen w-full md:w-1/2 bg-[#FDF6ED]/70 backdrop-blur-3xl border-l border-[#3A2E25]/10 z-[99999] overflow-hidden flex flex-col justify-center shadow-2xl"
                        >
                            {/* Close button inside glass panel */}
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="absolute top-6 right-6 z-[100000] w-12 h-12 rounded-full bg-[#3A2E25]/10 text-[#3A2E25] hover:bg-[#3A2E25]/20 flex items-center justify-center font-bold uppercase tracking-widest text-xs cursor-pointer shadow-md active:scale-95 border border-[#3A2E25]/10 transition-colors"
                            >
                                ✕
                            </button>

                            {/* Render Flowing Menu inside panel with transparent bg */}
                            <div className="w-full">
                                <FlowingMenu
                                    items={[
                                        { 
                                            link: '/explore', 
                                            text: 'Explore', 
                                            image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&q=80',
                                            textColor: '#3A2E25',
                                            marqueeBgColor: '#224D4B',
                                            marqueeTextColor: '#FDF6ED'
                                        },
                                        { 
                                            link: '/learn', 
                                            text: 'Learn Earn', 
                                            image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
                                            textColor: '#3A2E25',
                                            marqueeBgColor: '#6B1E2B',
                                            marqueeTextColor: '#FDF6ED'
                                        },
                                        { 
                                            link: '/chatbot', 
                                            text: 'Chatbot', 
                                            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=600&q=80',
                                            textColor: '#3A2E25',
                                            marqueeBgColor: '#C9A227',
                                            marqueeTextColor: '#3A2E25'
                                        },
                                        { 
                                            link: '/calculator', 
                                            text: 'Calculator', 
                                            image: 'https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?w=600&q=80',
                                            textColor: '#3A2E25',
                                            marqueeBgColor: '#0B4F4A',
                                            marqueeTextColor: '#FDF6ED'
                                        }
                                    ]}
                                    bgColor="transparent"
                                    textColor="#3A2E25"
                                    marqueeBgColor="#6B1E2B"
                                    marqueeTextColor="#FDF6ED"
                                    borderColor="rgba(58,46,37,0.15)"
                                    onItemClick={() => setIsMenuOpen(false)}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default GlobalMenu;
