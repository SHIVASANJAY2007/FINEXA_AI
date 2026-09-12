import {
    safeCompoundFactor,
    createResultModel,
    roundNumber
} from './common.js';

/**
 * Lumpsum Calculation Engine
 * 
 * @param {Object} params
 * @param {number} params.lumpsumAmount - One-time initial investment (₹)
 * @param {number} params.expectedReturnRate - Annual expected return rate (%)
 * @param {number} params.investmentHorizon - Duration in years
 */
export const calculateLumpsum = ({
    lumpsumAmount = 100000,
    expectedReturnRate = 12,
    investmentHorizon = 15
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Compounding frequency: Annual compounding`,
        `Single one-time deposit with no subsequent contributions or withdrawals`,
        `Returns are estimated projections and not guaranteed`
    ];

    const P = Math.max(0, Number(lumpsumAmount) || 0);
    const rate = Math.max(0, Number(expectedReturnRate) || 0);
    const years = Math.max(0, Math.min(60, Number(investmentHorizon) || 0));

    if (rate > 25) {
        warnings.push('Expected annual return rate is unusually high (>25%).');
    }
    if (P === 0) {
        warnings.push('Lumpsum investment amount is ₹0.');
    }
    if (years === 0) {
        warnings.push('Investment duration is 0 years.');
    }

    const rDecimal = rate / 100;
    const projection = [];

    for (let y = 0; y <= years; y++) {
        const factor = safeCompoundFactor(rDecimal, y);
        const value = P * factor;
        const returns = Math.max(0, value - P);

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: y === 0 ? P : 0,
            invested: Math.round(P),
            growth: Math.round(returns),
            withdrawal: 0,
            balance: Math.round(value),
            value: Math.round(value),
            returns: Math.round(returns)
        });
    }

    const finalNode = projection[projection.length - 1] || { invested: 0, value: 0, returns: 0 };

    return createResultModel({
        summary: {
            totalInvested: finalNode.invested,
            finalValue: finalNode.value,
            totalReturns: finalNode.returns,
            primaryMetric: { label: 'Final Value', value: finalNode.value }
        },
        metrics: {
            initialLumpsum: P,
            annualReturnRate: rate,
            durationYears: years,
            gainMultiplier: P > 0 ? roundNumber(finalNode.value / P, 2) : 1
        },
        projection,
        assumptions,
        warnings
    });
};
