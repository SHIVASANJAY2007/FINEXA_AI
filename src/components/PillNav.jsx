import React, { useEffect, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const NavButton = memo(({ item, onClick, className, children }) => {
    const isHash = item.href.startsWith('#');

    const handleClick = (e) => {
        if (isHash) {
            const id = item.href.substring(1);
            const el = document.getElementById(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth' });
                window.history.pushState(null, null, item.href);
            }
        }
        if (onClick) onClick();
    };

    if (isHash) {
        return (
            <a href={item.href} onClick={handleClick} className={className}>
                {children}
            </a>
        );
    }

    return (
        <Link to={item.href} onClick={handleClick} className={className}>
            {children}
        </Link>
    );
});

const PillNav = ({
    items = []
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isDocked = isScrolled && !isHovered;
    const navItems = items || [];

    return (
        <div className="fixed top-0 left-0 w-full z-[99999] pointer-events-none p-6 flex justify-center">
            <motion.nav
                layout
                initial={false}
                animate={{
                    left: isScrolled ? '24px' : '50%',
                    x: isScrolled ? '0%' : '-50%',
                    top: '24px',
                }}
                style={{
                    position: 'fixed'
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`
                    pointer-events-auto relative flex items-center gap-2 p-1.5 
                    bg-ivory/90 backdrop-blur-2xl border border-beige/40 
                    rounded-full shadow-[0_8px_32px_rgba(58,46,37,0.12),inset_0_1px_1px_rgba(253,246,237,0.2)]
                    overflow-hidden max-w-max
                `}
            >
                {/* Logo / Dock Icon */}
                <motion.div layout className="relative z-10 flex items-center">
                    <Link
                        to="/"
                        className="h-10 px-3.5 flex items-center justify-center bg-beige/25 rounded-full hover:bg-beige/45 transition-all active:scale-95"
                    >
                        <span className="font-serif font-bold text-sm text-ink tracking-tight">
                            Finexa
                            <sup className="text-gold font-sans font-extrabold text-[9px] ml-0.5">AI</sup>
                        </span>
                    </Link>
                </motion.div>

                {/* Links Container */}
                <motion.div
                    layout
                    initial={false}
                    animate={{
                        width: isDocked ? 0 : 'auto',
                        opacity: isDocked ? 0 : 1,
                        marginLeft: isDocked ? 0 : 4,
                        marginRight: isDocked ? 0 : 8,
                    }}
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    className="flex items-center gap-1 overflow-hidden whitespace-nowrap"
                >
                    {navItems.map((item) => {
                        const currentHash = window.location.hash;
                        const isCurrentActive = currentHash === item.href || (item.href === '/signup' && window.location.pathname === '/signup') || (item.href === '/dashboard' && window.location.pathname === '/dashboard');
                        
                        return (
                            <NavButton
                                key={item.href}
                                item={item}
                                className={`
                                    px-4 py-2 rounded-full text-[10.5px] font-semibold uppercase tracking-[1.5px]
                                    transition-all duration-300 relative group
                                    ${isCurrentActive
                                        ? 'text-ink z-10'
                                        : 'text-taupe hover:text-ink'}
                                `}
                            >
                                {isCurrentActive && (
                                    <motion.div
                                        layoutId="active-nav-pill"
                                        className="absolute inset-0 bg-ivory rounded-full -z-10 border border-beige/40 shadow-[0_2px_8px_rgba(58,46,37,0.08)]"
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}
                                <span className="relative py-1">
                                    {item.label}
                                    {!isCurrentActive && (
                                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-terracotta transition-all duration-300 group-hover:w-full" />
                                    )}
                                </span>
                            </NavButton>
                        );
                    })}
                </motion.div>

                {/* Mobile Menu Toggle */}
                <motion.button
                    layout
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform bg-beige/20 rounded-full"
                >
                    <div className="w-4 h-0.5 bg-ink rounded-full" />
                    <div className="w-4 h-0.5 bg-ink rounded-full" />
                </motion.button>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        className="absolute top-24 left-6 right-6 p-4 bg-cream/95 backdrop-blur-3xl border border-beige/35 rounded-3xl pointer-events-auto md:hidden shadow-[0_20px_50px_rgba(58,46,37,0.15)]"
                    >
                        <motion.div
                            initial="closed"
                            animate="open"
                            variants={{
                                open: { transition: { staggerChildren: 0.05 } },
                                closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } }
                            }}
                            className="flex flex-col gap-2"
                        >
                            {navItems.map((item) => (
                                <motion.div
                                    key={item.href}
                                    variants={{
                                        open: { opacity: 1, x: 0 },
                                        closed: { opacity: 0, x: -10 }
                                    }}
                                >
                                    <NavButton
                                        item={item}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-3.5 rounded-2xl bg-ivory border border-beige/25 text-ink font-semibold uppercase tracking-widest text-center hover:bg-beige/10 transition-colors block"
                                    >
                                        {item.label}
                                    </NavButton>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(PillNav);
