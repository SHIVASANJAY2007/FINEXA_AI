import React from 'react';
import { Link } from 'react-router-dom';

// Number of repeated labels in the scrolling ribbon. Must be odd so that the
// middle copy sits dead-centre when the button is at rest.
const COPIES = 7;

const MarqueeButton = ({ text, to, href, onClick, className = '', type = 'button', ariaLabel }) => {
    const inner = (
        <>
            <span className="btn-23__sizer" aria-hidden="true">{text}</span>
            <span className="btn-23__marquee" aria-hidden="true">
                {Array.from({ length: COPIES }).map((_, i) => (
                    <span className="btn-23__text" key={i}>{text}</span>
                ))}
            </span>
        </>
    );

    const classes = `btn-23 ${className}`.trim();
    const label = ariaLabel || text;

    if (to) {
        return (
            <Link to={to} onClick={onClick} aria-label={label} className={classes}>
                {inner}
            </Link>
        );
    }

    if (href) {
        return (
            <a href={href} onClick={onClick} aria-label={label} className={classes}>
                {inner}
            </a>
        );
    }

    return (
        <button type={type} onClick={onClick} aria-label={label} className={classes}>
            {inner}
        </button>
    );
};

export default MarqueeButton;
