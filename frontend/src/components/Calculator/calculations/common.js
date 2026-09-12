/**
 * Common Financial Math & Utility Library
 * Centralizes safe calculations, rate conversions, annuity formulas, and standardized result structures.
 */

// Numerical tolerance & precision constants
export const EPSILON = 1e-9;
export const MAX_SAFE_YEARS = 100;
export const MAX_SAFE_AMOUNT = 1e12; // 1 Trillion safety ceiling

/**
 * Safely rounds a number to specified decimal places (default 2)
 */
export const roundNumber = (val, decimals = 2) => {
    if (val === null || val === undefined || isNaN(val) || !isFinite(val)) return 0;
    const factor = Math.pow(10, decimals);
    return Math.round((val + Number.EPSILON) * factor) / factor;
};

/**
 * Safely divides two numbers avoiding Division by Zero
 */
export const safeDivide = (numerator, denominator, fallback = 0) => {
    if (Math.abs(denominator) < EPSILON || isNaN(denominator) || isNaN(numerator)) {
        return fallback;
    }
    return numerator / denominator;
};

/**
 * Converts an annual percentage rate (e.g. 12%) to monthly decimal rate (0.01)
 */
export const toMonthlyRate = (annualPercentageRate) => {
    const rate = (annualPercentageRate || 0) / 100;
    return rate / 12;
};

/**
 * Safe compound factor (1 + r)^n
 */
export const safeCompoundFactor = (rate, periods) => {
    if (Math.abs(rate) < EPSILON) return 1;
    if (periods <= 0) return 1;
    return Math.pow(1 + rate, periods);
};

/**
 * Future Value of an Annuity (Annuity Due: payments at beginning of period, or Ordinary Annuity)
 * Handles 0% interest rate without division by zero.
 */
export const calculateAnnuityFV = (periodicPayment, periodicRate, totalPeriods, isBeginning = true) => {
    const P = Math.max(0, periodicPayment || 0);
    const n = Math.max(0, totalPeriods || 0);
    const r = periodicRate || 0;

    if (P === 0 || n === 0) return 0;

    // 0% interest rate fallback
    if (Math.abs(r) < EPSILON) {
        return P * n;
    }

    const timingMultiplier = isBeginning ? (1 + r) : 1;
    const fv = P * ((Math.pow(1 + r, n) - 1) / r) * timingMultiplier;
    return isFinite(fv) ? fv : 0;
};

/**
 * Present Value of an Annuity (Ordinary Annuity / Annuity Due)
 * Handles 0% interest rate without division by zero.
 */
export const calculateAnnuityPV = (periodicPayment, periodicRate, totalPeriods, isBeginning = false) => {
    const PMT = Math.max(0, periodicPayment || 0);
    const n = Math.max(0, totalPeriods || 0);
    const r = periodicRate || 0;

    if (PMT === 0 || n === 0) return 0;

    if (Math.abs(r) < EPSILON) {
        return PMT * n;
    }

    const timingMultiplier = isBeginning ? (1 + r) : 1;
    const pv = PMT * ((1 - Math.pow(1 + r, -n)) / r) * timingMultiplier;
    return isFinite(pv) ? pv : 0;
};

/**
 * Real Rate of Return adjusting nominal rate for inflation:
 * (1 + nominal) / (1 + inflation) - 1
 */
export const calculateRealRate = (nominalAnnualRate, inflationAnnualRate) => {
    const rNom = (nominalAnnualRate || 0) / 100;
    const rInf = (inflationAnnualRate || 0) / 100;

    if (Math.abs(1 + rInf) < EPSILON) return rNom;

    return ((1 + rNom) / (1 + rInf)) - 1;
};

/**
 * Standard Result Model Generator
 */
export const createResultModel = ({
    summary = {},
    metrics = {},
    projection = [],
    assumptions = [],
    warnings = [],
    status = 'success'
}) => {
    const totalInvested = summary.totalInvested || 0;
    const finalValue = summary.finalValue || 0;
    const totalReturns = summary.totalReturns || 0;

    return {
        summary: {
            totalInvested: Math.round(totalInvested),
            finalValue: Math.round(finalValue),
            totalReturns: Math.round(totalReturns),
            primaryMetric: summary.primaryMetric || { label: 'Final Value', value: Math.round(finalValue) },
            ...summary
        },
        metrics: {
            growthPercentage: totalInvested > 0
                ? roundNumber((totalReturns / totalInvested) * 100, 2)
                : 0,
            ...metrics
        },
        projection: Array.isArray(projection) ? projection : [],
        assumptions: Array.isArray(assumptions) ? assumptions : [],
        warnings: Array.isArray(warnings) ? warnings : [],
        calculationStatus: warnings.length > 0 && status === 'success' ? 'warning' : status
    };
};
