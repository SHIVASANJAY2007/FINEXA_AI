import {
    toMonthlyRate,
    calculateAnnuityFV,
    createResultModel,
    roundNumber,
    EPSILON
} from './common.js';

/**
 * Goal Planner Calculation Engine
 * Solves for the required monthly SIP contribution to reach a targeted wealth goal.
 * 
 * @param {Object} params
 * @param {number} params.targetGoalAmount - Target financial goal (₹)
 * @param {number} params.expectedReturnRate - Annual expected return rate (%)
 * @param {number} params.yearsToGoal - Duration to achieve goal in years
 */
export const calculateGoalPlanner = ({
    targetGoalAmount = 5000000,
    expectedReturnRate = 12,
    yearsToGoal = 15
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Compounding frequency: Monthly`,
        `Required SIP deposited at the beginning of each month`,
        `Returns are estimated projections and not guaranteed`
    ];

    const target = Math.max(0, Number(targetGoalAmount) || 0);
    const rate = Math.max(0, Number(expectedReturnRate) || 0);
    const years = Math.max(0, Math.min(50, Number(yearsToGoal) || 0));

    if (target === 0) {
        warnings.push('Target goal amount is ₹0.');
    }
    if (years === 0) {
        warnings.push('Years to achieve goal is 0 years.');
    }
    if (rate > 25) {
        warnings.push('Expected annual return rate is unusually high (>25%).');
    }

    const monthlyRate = toMonthlyRate(rate);
    const totalMonths = years * 12;

    let requiredMonthlySIP = 0;

    if (totalMonths > 0) {
        if (Math.abs(monthlyRate) < EPSILON) {
            requiredMonthlySIP = target / totalMonths;
        } else {
            // Target = SIP * [((1+i)^n - 1)/i] * (1+i)
            const fvAnnuityFactor = (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
            requiredMonthlySIP = target / fvAnnuityFactor;
        }
    }

    const totalInvested = requiredMonthlySIP * totalMonths;
    const totalReturns = Math.max(0, target - totalInvested);

    const projection = [];

    for (let y = 0; y <= years; y++) {
        const currentMonths = y * 12;
        const currentInvested = requiredMonthlySIP * currentMonths;
        const currentVal = y === 0 ? 0 : calculateAnnuityFV(requiredMonthlySIP, monthlyRate, currentMonths, true);
        const currentReturns = Math.max(0, currentVal - currentInvested);

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: y === 0 ? 0 : Math.round(requiredMonthlySIP * 12),
            invested: Math.round(currentInvested),
            growth: Math.round(currentReturns),
            withdrawal: 0,
            balance: Math.round(currentVal),
            value: Math.round(currentVal),
            returns: Math.round(currentReturns)
        });
    }

    return createResultModel({
        summary: {
            totalInvested: Math.round(totalInvested),
            finalValue: Math.round(target),
            totalReturns: Math.round(totalReturns),
            monthlyRequired: Math.round(requiredMonthlySIP),
            primaryMetric: { label: 'Required Monthly SIP', value: Math.round(requiredMonthlySIP) }
        },
        metrics: {
            targetGoalAmount: target,
            requiredMonthlySIP: Math.round(requiredMonthlySIP),
            totalOutlay: Math.round(totalInvested),
            estimatedReturns: Math.round(totalReturns),
            returnsSharePercent: target > 0 ? roundNumber((totalReturns / target) * 100, 1) : 0
        },
        projection,
        assumptions,
        warnings
    });
};
