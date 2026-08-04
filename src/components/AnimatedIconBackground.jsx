import React from 'react';
import { motion } from 'framer-motion';

// High-quality SVG Finance-Only Icons matching the reference image exactly

const IconLineGraph = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={accent ? "#38bdf8" : "#9ca3af"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 40H42" />
        <path d="M8 40V10" />
        <polyline points="10,32 18,22 26,26 38,12" stroke={accent ? "#0284c7" : "#8b7e74"} strokeWidth="2.5" />
        <circle cx="10" cy="32" r="3" fill={accent ? "#38bdf8" : "#8b7e74"} />
        <circle cx="18" cy="22" r="3" fill={accent ? "#38bdf8" : "#8b7e74"} />
        <circle cx="26" cy="26" r="3" fill={accent ? "#38bdf8" : "#8b7e74"} />
        <circle cx="38" cy="12" r="3" fill={accent ? "#38bdf8" : "#8b7e74"} />
    </svg>
);

const IconBank = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 18L24 6L44 18V22H4V18Z" />
        <path d="M10 22V36" />
        <path d="M19 22V36" />
        <path d="M29 22V36" />
        <path d="M38 22V36" />
        <path d="M6 36H42V40H6V36Z" />
        <text x="24" y="32" fontSize="12" fontWeight="bold" textAnchor="middle" fill={accent ? "#0284c7" : "#8b7e74"} stroke="none">$</text>
    </svg>
);

const IconReportMoneyBag = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke="#8b7e74" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="6" width="28" height="38" rx="3" stroke="#8b7e74" />
        <line x1="16" y1="14" x2="32" y2="14" />
        <line x1="16" y1="20" x2="26" y2="20" />
        {/* Money bag accent */}
        <circle cx="28" cy="32" r="7" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2.2" fill={accent ? "#38bdf8" : "none"} fillOpacity="0.12" />
        <text x="28" y="35.5" fontSize="10" fontWeight="bold" textAnchor="middle" fill={accent ? "#0284c7" : "#8b7e74"} stroke="none">$</text>
    </svg>
);

const IconBarChartArrow = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="28" width="7" height="14" rx="1.5" />
        <rect x="20" y="20" width="7" height="22" rx="1.5" />
        <rect x="32" y="12" width="7" height="30" rx="1.5" />
        <path d="M10 20L22 10L32 15L42 6" stroke={accent ? "#0284c7" : "#8b7e74"} strokeWidth="2.4" />
        <polyline points="36,6 42,6 42,12" stroke={accent ? "#0284c7" : "#8b7e74"} strokeWidth="2.4" />
    </svg>
);

const IconPieChart = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="24" r="18" stroke={accent ? "#38bdf8" : "#8b7e74"} />
        <path d="M24 6V24H42" stroke={accent ? "#0284c7" : "#8b7e74"} strokeWidth="2.4" />
        <path d="M24 24L11 37" />
        <text x="17" y="22" fontSize="11" fontWeight="bold" textAnchor="middle" fill={accent ? "#38bdf8" : "#8b7e74"} stroke="none">$</text>
    </svg>
);

const IconReportPen = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke="#8b7e74" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="6" width="26" height="36" rx="3" />
        <rect x="11" y="11" width="16" height="10" rx="1.5" stroke="#8b7e74" />
        <text x="19" y="19" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#8b7e74" stroke="none">B$</text>
        <line x1="11" y1="26" x2="24" y2="26" />
        <line x1="11" y1="31" x2="20" y2="31" />
        <line x1="11" y1="36" x2="24" y2="36" />
        {/* Pen on right */}
        <path d="M36 10L42 16L32 38L26 38L26 32L36 10Z" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2" />
    </svg>
);

const IconCurvedArrowChart = () => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke="#8b7e74" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="8" y="32" width="6" height="10" rx="1" />
        <rect x="18" y="24" width="6" height="18" rx="1" />
        <rect x="28" y="16" width="6" height="26" rx="1" />
        <path d="M6 36C14 36 20 22 38 6" stroke="#38bdf8" strokeWidth="2.8" />
        <polyline points="30,6 38,6 38,14" stroke="#38bdf8" strokeWidth="2.8" />
    </svg>
);

const IconCoinStack = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="24" cy="13" rx="14" ry="6" />
        <path d="M10 13V21C10 24.3 16.3 27 24 27C31.7 27 38 24.3 38 21V13" />
        <path d="M10 21V29C10 32.3 16.3 35 24 35C31.7 35 38 32.3 38 29V21" />
        <path d="M10 29V37C10 40.3 16.3 43 24 43C31.7 43 38 40.3 38 37V29" />
        <text x="24" y="16" fontSize="9" fontWeight="bold" textAnchor="middle" fill={accent ? "#0284c7" : "#8b7e74"} stroke="none">$</text>
    </svg>
);

const IconHandCoin = ({ accent }) => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke={accent ? "#38bdf8" : "#8b7e74"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 34H18L26 30L38 32C40 32.5 42 34.5 42 37C42 39.5 40 41 38 41H14" />
        <circle cx="26" cy="16" r="8" stroke={accent ? "#38bdf8" : "#8b7e74"} fill={accent ? "#38bdf8" : "none"} fillOpacity="0.1" />
        <text x="26" y="20" fontSize="10" fontWeight="bold" textAnchor="middle" fill={accent ? "#0284c7" : "#8b7e74"} stroke="none">$</text>
    </svg>
);

const IconHandshakeBadge = () => (
    <svg width="50" height="50" viewBox="0 0 48 48" fill="none" stroke="#8b7e74" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 24L16 18L24 24L20 28L14 24" />
        <path d="M40 24L32 18L24 24L28 28L34 24" />
        <path d="M16 28L24 36L32 28" />
        {/* Verification badge */}
        <circle cx="36" cy="12" r="6" stroke="#38bdf8" fill="#38bdf8" fillOpacity="0.1" />
        <polyline points="33,12 35,14 39,10" stroke="#38bdf8" />
    </svg>
);

// Pattern grid mapping matching the exact placement and distribution of the reference image
const PATTERN_ROWS = [
    // Row 1
    [
        { Component: IconLineGraph, accent: false },
        { Component: IconBank, accent: false },
        { Component: IconReportMoneyBag, accent: true },
        { Component: IconBarChartArrow, accent: false },
        { Component: IconPieChart, accent: true },
        { Component: IconReportPen, accent: false },
    ],
    // Row 2
    [
        { Component: IconCurvedArrowChart, accent: true },
        { Component: IconReportPen, accent: false },
        { Component: IconCoinStack, accent: false },
        { Component: IconHandCoin, accent: true },
        { Component: IconHandshakeBadge, accent: false },
        { Component: IconBank, accent: false },
    ],
    // Row 3
    [
        { Component: IconHandCoin, accent: false },
        { Component: IconReportMoneyBag, accent: false },
        { Component: IconLineGraph, accent: false },
        { Component: IconBank, accent: false },
        { Component: IconReportMoneyBag, accent: true },
        { Component: IconPieChart, accent: true },
    ],
    // Row 4
    [
        { Component: IconBarChartArrow, accent: true },
        { Component: IconPieChart, accent: true },
        { Component: IconCurvedArrowChart, accent: true },
        { Component: IconReportPen, accent: false },
        { Component: IconCoinStack, accent: false },
        { Component: IconHandshakeBadge, accent: false },
    ],
    // Row 5
    [
        { Component: IconLineGraph, accent: false },
        { Component: IconBank, accent: false },
        { Component: IconReportMoneyBag, accent: true },
        { Component: IconBarChartArrow, accent: false },
        { Component: IconPieChart, accent: true },
        { Component: IconHandCoin, accent: true },
    ],
    // Row 6
    [
        { Component: IconCurvedArrowChart, accent: true },
        { Component: IconReportPen, accent: false },
        { Component: IconCoinStack, accent: false },
        { Component: IconHandCoin, accent: true },
        { Component: IconHandshakeBadge, accent: false },
        { Component: IconReportMoneyBag, accent: false },
    ]
];

const AnimatedIconBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0 bg-[#FDF8F3]">
            <div className="w-full h-full flex flex-col justify-around py-4 px-2 opacity-85">
                {PATTERN_ROWS.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className={`flex items-center justify-between px-4 sm:px-8 ${
                            rowIndex % 2 === 1 ? 'translate-x-6 sm:translate-x-10' : ''
                        }`}
                    >
                        {row.map((item, colIndex) => {
                            const IconComp = item.Component;
                            const uniqueIndex = rowIndex * 6 + colIndex;

                            return (
                                <motion.div
                                    key={colIndex}
                                    initial={{ opacity: 0.85, y: 0 }}
                                    animate={{
                                        y: [0, uniqueIndex % 2 === 0 ? -6 : 6, 0],
                                        rotate: [0, uniqueIndex % 3 === 0 ? 3 : -3, 0],
                                        scale: [1, uniqueIndex % 4 === 0 ? 1.05 : 0.95, 1],
                                    }}
                                    transition={{
                                        duration: 4 + (uniqueIndex % 4) * 1.2,
                                        repeat: Infinity,
                                        repeatType: 'reverse',
                                        ease: 'easeInOut',
                                        delay: (uniqueIndex % 5) * 0.3,
                                    }}
                                    className="p-1 sm:p-2 filter-none"
                                >
                                    <IconComp accent={item.accent} />
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnimatedIconBackground;
