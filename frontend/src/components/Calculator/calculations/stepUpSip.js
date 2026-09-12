import {
    toMonthlyRate,
    createResultModel,
    roundNumber
} from './common.js';

/**
 * Step-Up SIP Calculation Engine
 * Accurately simulates month-by-month compounding with annual contribution step-ups.
 * 
 * @param {Object} params
 * @param {number} params.initialMonthlySIP - Starting monthly SIP amount (₹)
 * @param {number} params.annualStepUpPercent - Annual SIP increase percentage (%)
 * @param {number} params.expectedReturnRate - Annual expected return rate (%)
 * @param {number} params.investmentHorizon - Investment duration in years
 */
export const calculateStepUpSIP = ({
    initialMonthlySIP = 10000,
    annualStepUpPercent = 10,
    expectedReturnRate = 12,
    investmentHorizon = 15
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Compounding frequency: Monthly`,
        `SIP amount steps up by ${annualStepUpPercent}% at the start of each year`,
        `Contributions deposited at the beginning of each month`,
        `Returns are estimated projections and not guaranteed`
    ];

    const P = Math.max(0, Number(initialMonthlySIP) || 0);
    const step = Math.max(0, Number(annualStepUpPercent) || 0);
    const rate = Math.max(0, Number(expectedReturnRate) || 0);
    const years = Math.max(0, Math.min(50, Number(investmentHorizon) || 0));

    if (rate > 25) {
        warnings.push('Expected annual return rate is unusually high (>25%).');
    }
    if (step > 50) {
        warnings.push('Annual step-up percentage is very high (>50%). Verify affordability.');
    }
    if (P === 0) {
        warnings.push('Initial monthly SIP is ₹0.');
    }

    const monthlyRate = toMonthlyRate(rate);
    const stepMultiplier = 1 + (step / 100);

    const projection = [];
    let currentMonthlySIP = P;
    let totalInvested = 0;
    let currentBalance = 0;

    // Year 0 Baseline Node
    projection.push({
        period: 0,
        year: 'Year 0',
        monthlySIP: P,
        annualContribution: 0,
        contribution: 0,
        invested: 0,
        growth: 0,
        withdrawal: 0,
        balance: 0,
        value: 0,
        returns: 0
    });

    for (let y = 1; y <= years; y++) {
        let annualOutlay = 0;

        for (let m = 1; m <= 12; m++) {
            totalInvested += currentMonthlySIP;
            annualOutlay += currentMonthlySIP;
            // Beginning of period deposit + monthly interest growth
            currentBalance = (currentBalance + currentMonthlySIP) * (1 + monthlyRate);
        }

        const returns = Math.max(0, currentBalance - totalInvested);

        projection.push({
            period: y,
            year: `Year ${y}`,
            monthlySIP: Math.round(currentMonthlySIP),
            annualContribution: Math.round(annualOutlay),
            contribution: Math.round(annualOutlay),
            invested: Math.round(totalInvested),
            growth: Math.round(returns),
            withdrawal: 0,
            balance: Math.round(currentBalance),
            value: Math.round(currentBalance),
            returns: Math.round(returns)
        });

        // Step up monthly SIP for next year
        currentMonthlySIP = currentMonthlySIP * stepMultiplier;
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
            initialSIP: P,
            finalMonthlySIP: projection.length > 1 ? projection[projection.length - 1].monthlySIP : P,
            stepUpPercent: step,
            annualReturnRate: rate,
            durationYears: years,
            gainMultiplier: finalNode.invested > 0 ? roundNumber(finalNode.value / finalNode.invested, 2) : 1
        },
        projection,
        assumptions,
        warnings
    });
};
