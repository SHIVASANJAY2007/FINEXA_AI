import {
    createResultModel,
    roundNumber,
    EPSILON
} from './common.js';

/**
 * CAGR (Compound Annual Growth Rate) Calculation Engine
 * 
 * Formula: CAGR = (FinalValue / InitialValue)^(1 / Years) - 1
 * 
 * @param {Object} params
 * @param {number} params.initialInvestment - Initial portfolio value (PV)
 * @param {number} params.finalPortfolioValue - Ending portfolio value (FV)
 * @param {number} params.durationYears - Holding period in years
 */
export const calculateCAGR = ({
    initialInvestment = 100000,
    finalPortfolioValue = 250000,
    durationYears = 5
} = {}) => {
    const warnings = [];
    const assumptions = [
        `CAGR assumes a smooth annual geometric compounding rate`,
        `Does not reflect year-to-year portfolio volatility`
    ];

    const PV = Math.max(0, Number(initialInvestment) || 0);
    const FV = Math.max(0, Number(finalPortfolioValue) || 0);
    const years = Math.max(0, Math.min(50, Number(durationYears) || 0));

    if (PV <= 0) {
        warnings.push('Initial investment value must be greater than 0.');
    }
    if (FV <= 0) {
        warnings.push('Final portfolio value must be greater than 0.');
    }
    if (years <= 0) {
        warnings.push('Duration period must be greater than 0 years.');
    }

    let cagrVal = 0;

    if (PV > 0 && FV > 0 && years > 0) {
        cagrVal = (Math.pow(FV / PV, 1 / years) - 1) * 100;
    }

    if (FV < PV) {
        warnings.push('Final value is lower than initial investment (Negative CAGR/Capital Loss).');
    }

    const projection = [];
    const rDecimal = cagrVal / 100;

    for (let y = 0; y <= years; y++) {
        const val = PV > 0 ? PV * Math.pow(1 + rDecimal, y) : 0;
        const returns = val - PV;

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: y === 0 ? PV : 0,
            invested: Math.round(PV),
            growth: Math.round(returns),
            withdrawal: 0,
            balance: Math.round(val),
            value: Math.round(val),
            returns: Math.round(returns)
        });
    }

    const netProfit = FV - PV;

    return createResultModel({
        summary: {
            totalInvested: Math.round(PV),
            finalValue: Math.round(FV),
            totalReturns: Math.round(netProfit),
            cagr: roundNumber(cagrVal, 2),
            primaryMetric: { label: 'Calculated CAGR', value: `${roundNumber(cagrVal, 2)}%` }
        },
        metrics: {
            initialInvestment: PV,
            finalPortfolioValue: FV,
            cagrPercent: roundNumber(cagrVal, 2),
            netAbsoluteGain: Math.round(netProfit),
            totalGainPercent: PV > 0 ? roundNumber((netProfit / PV) * 100, 2) : 0
        },
        projection,
        assumptions,
        warnings,
        status: (PV <= 0 || years <= 0) ? 'error' : warnings.length > 0 ? 'warning' : 'success'
    });
};
