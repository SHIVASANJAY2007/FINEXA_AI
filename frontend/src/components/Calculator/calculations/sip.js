import {
    toMonthlyRate,
    calculateAnnuityFV,
    createResultModel,
    roundNumber
} from './common.js';

/**
 * SIP (Systematic Investment Plan) Calculation Engine
 * 
 * @param {Object} params
 * @param {number} params.monthlyInvestment - Monthly SIP contribution amount (₹)
 * @param {number} params.expectedReturnRate - Annual expected return rate (%)
 * @param {number} params.investmentHorizon - Duration in years
 * @param {boolean} [params.isBeginning=true] - Contribution timing (true = start of month, false = end of month)
 */
export const calculateSIP = ({
    monthlyInvestment = 10000,
    expectedReturnRate = 12,
    investmentHorizon = 15,
    isBeginning = true
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Compounding frequency: Monthly`,
        `Contributions deposited at the ${isBeginning ? 'beginning' : 'end'} of each month`,
        `Returns are estimated projections and not guaranteed`
    ];

    // Input Validation
    const P = Math.max(0, Number(monthlyInvestment) || 0);
    const rate = Math.max(0, Number(expectedReturnRate) || 0);
    const years = Math.max(0, Math.min(60, Number(investmentHorizon) || 0));

    if (rate > 25) {
        warnings.push('Expected annual return rate is unusually high (>25%). Consider using realistic long-term market estimates.');
    }
    if (P === 0) {
        warnings.push('Monthly investment amount is ₹0.');
    }
    if (years === 0) {
        warnings.push('Investment horizon is 0 years.');
    }

    const monthlyRate = toMonthlyRate(rate);
    const projection = [];

    for (let y = 0; y <= years; y++) {
        const totalMonths = y * 12;
        const invested = P * totalMonths;
        const value = calculateAnnuityFV(P, monthlyRate, totalMonths, isBeginning);
        const returns = Math.max(0, value - invested);

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: y === 0 ? 0 : P * 12,
            invested: Math.round(invested),
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
            monthlyContribution: P,
            annualReturnRate: rate,
            durationYears: years,
            gainMultiplier: finalNode.invested > 0 ? roundNumber(finalNode.value / finalNode.invested, 2) : 1
        },
        projection,
        assumptions,
        warnings
    });
};
