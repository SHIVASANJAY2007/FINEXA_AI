import {
    safeCompoundFactor,
    createResultModel,
    roundNumber
} from './common.js';

/**
 * Inflation Calculation Engine
 * Visualizes future cost of goods and loss of currency purchasing power over time.
 * 
 * Formulae:
 * 1. Future Cost = Amount * (1 + inflationRate)^Years
 * 2. Purchasing Power = Amount / (1 + inflationRate)^Years
 * 
 * @param {Object} params
 * @param {number} params.currentAmount - Base amount / cost of item today (₹)
 * @param {number} params.inflationRate - Annual inflation rate (%)
 * @param {number} params.timeHorizonYears - Horizon duration in years
 */
export const calculateInflation = ({
    currentAmount = 100000,
    inflationRate = 6,
    timeHorizonYears = 15
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Inflation compounds annually`,
        `Purchasing power measures what today's ₹${currentAmount.toLocaleString()} will buy in the future`,
        `Future cost measures how much ₹ will be required to buy today's ₹${currentAmount.toLocaleString()} basket of goods`
    ];

    const amount = Math.max(0, Number(currentAmount) || 0);
    const rate = Math.max(0, Number(inflationRate) || 0);
    const years = Math.max(0, Math.min(60, Number(timeHorizonYears) || 0));

    if (amount === 0) {
        warnings.push('Base cost amount is ₹0.');
    }
    if (years === 0) {
        warnings.push('Time horizon is 0 years.');
    }
    if (rate > 15) {
        warnings.push('Annual inflation rate is high (>15%). Hyperinflation severely impairs long-term purchasing power.');
    }

    const rDecimal = rate / 100;
    const projection = [];

    for (let y = 0; y <= years; y++) {
        const factor = safeCompoundFactor(rDecimal, y);
        const futureCost = amount * factor;
        const purchasingPower = factor > 0 ? amount / factor : 0;

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: 0,
            invested: Math.round(purchasingPower), // Stores purchasing power for tooltip rendering
            growth: Math.round(futureCost - amount),
            withdrawal: 0,
            balance: Math.round(futureCost),
            value: Math.round(futureCost), // Stores future cost
            purchasingPower: Math.round(purchasingPower),
            futureCost: Math.round(futureCost)
        });
    }

    const finalNode = projection[projection.length - 1] || { purchasingPower: amount, futureCost: amount };
    const powerLossPercent = amount > 0 ? ((amount - finalNode.purchasingPower) / amount) * 100 : 0;

    return createResultModel({
        summary: {
            totalInvested: finalNode.purchasingPower, // Purchasing power mapping for standard card
            finalValue: finalNode.futureCost,        // Future cost mapping for standard card
            totalReturns: Math.round(finalNode.futureCost - amount),
            primaryMetric: { label: 'Future Cost', value: finalNode.futureCost }
        },
        metrics: {
            originalCapital: amount,
            purchasingPowerInFuture: finalNode.purchasingPower,
            futureCostOfGoods: finalNode.futureCost,
            powerLossPercentage: roundNumber(powerLossPercent, 1),
            costMultiplier: amount > 0 ? roundNumber(finalNode.futureCost / amount, 2) : 1
        },
        projection,
        assumptions,
        warnings
    });
};
