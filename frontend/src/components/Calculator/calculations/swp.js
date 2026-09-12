import {
    toMonthlyRate,
    createResultModel,
    roundNumber
} from './common.js';

/**
 * SWP (Systematic Withdrawal Plan) Calculation Engine
 * Simulates month-by-month investment growth and monthly withdrawals.
 * 
 * Order of simulation per month:
 * 1. Interest earned on starting balance: Interest = Balance * (annualRate / 12)
 * 2. Withdrawal made: Balance = Balance + Interest - MonthlyWithdrawal
 * 3. Checks if balance <= 0 (depletion event)
 * 
 * @param {Object} params
 * @param {number} params.lumpsumInvestment - Initial portfolio balance (₹)
 * @param {number} params.monthlyWithdrawal - Fixed monthly withdrawal amount (₹)
 * @param {number} params.expectedReturnRate - Annual expected portfolio growth rate (%)
 * @param {number} params.swpTenureYears - Requested withdrawal period in years
 */
export const calculateSWP = ({
    lumpsumInvestment = 1000000,
    monthlyWithdrawal = 10000,
    expectedReturnRate = 8,
    swpTenureYears = 15
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Compounding frequency: Monthly growth on remaining balance`,
        `Withdrawals made at the end of each month`,
        `Interest is credited before monthly withdrawal is subtracted`
    ];

    const initial = Math.max(0, Number(lumpsumInvestment) || 0);
    const W = Math.max(0, Number(monthlyWithdrawal) || 0);
    const rate = Math.max(0, Number(expectedReturnRate) || 0);
    const years = Math.max(0, Math.min(50, Number(swpTenureYears) || 0));

    if (initial === 0) {
        warnings.push('Initial investment corpus is ₹0.');
    }
    if (W === 0) {
        warnings.push('Monthly withdrawal amount is ₹0.');
    }

    const annualWithdrawal = W * 12;
    const initialWithdrawalRate = initial > 0 ? (annualWithdrawal / initial) * 100 : 0;

    if (initialWithdrawalRate > rate) {
        warnings.push(`Annual withdrawal rate (${roundNumber(initialWithdrawalRate, 1)}%) exceeds expected annual return (${rate}%). The corpus will eventually be depleted.`);
    }

    const monthlyRate = toMonthlyRate(rate);
    const projection = [];

    let balance = initial;
    let totalWithdrawn = 0;
    let totalGrowthEarned = 0;
    let depletionMonth = null;
    let depletionYear = null;

    // Year 0 Baseline
    projection.push({
        period: 0,
        year: 'Year 0',
        contribution: 0,
        invested: 0, // Using 'invested' to store cumulative withdrawals for chart tooltips
        growth: 0,
        withdrawal: 0,
        balance: Math.round(initial),
        value: Math.round(initial)
    });

    for (let y = 1; y <= years; y++) {
        let yearlyWithdrawal = 0;
        let yearlyGrowth = 0;

        for (let m = 1; m <= 12; m++) {
            if (balance <= 0) {
                balance = 0;
                if (!depletionMonth) {
                    depletionMonth = (y - 1) * 12 + m;
                    depletionYear = y;
                }
                break;
            }

            const interest = balance * monthlyRate;
            yearlyGrowth += interest;
            totalGrowthEarned += interest;

            const actualWithdrawal = Math.min(balance + interest, W);
            yearlyWithdrawal += actualWithdrawal;
            totalWithdrawn += actualWithdrawal;

            balance = balance + interest - actualWithdrawal;

            if (balance <= 0) {
                balance = 0;
                if (!depletionMonth) {
                    depletionMonth = (y - 1) * 12 + m;
                    depletionYear = y;
                }
            }
        }

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: 0,
            invested: Math.round(totalWithdrawn),
            growth: Math.round(totalGrowthEarned),
            withdrawal: Math.round(yearlyWithdrawal),
            balance: Math.round(balance),
            value: Math.round(balance)
        });
    }

    if (depletionMonth) {
        const depYears = Math.floor(depletionMonth / 12);
        const depMonths = depletionMonth % 12;
        warnings.push(`Corpus fully depleted in Year ${depYears > 0 ? depYears + ' Yr ' : ''}${depMonths} Mo. Consider lowering monthly withdrawal.`);
    }

    const estimatedReturns = Math.max(0, (balance + totalWithdrawn) - initial);

    return createResultModel({
        summary: {
            totalInvested: Math.round(totalWithdrawn), // 'totalInvested' field stores total withdrawn amount for standard UI compatibility
            finalValue: Math.round(balance),
            totalReturns: Math.round(estimatedReturns),
            primaryMetric: { label: 'Final Balance', value: Math.round(balance) }
        },
        metrics: {
            initialCorpus: initial,
            monthlyWithdrawal: W,
            totalWithdrawn: Math.round(totalWithdrawn),
            totalGrowthEarned: Math.round(totalGrowthEarned),
            isSustainable: !depletionMonth,
            depletionYear: depletionYear || 'N/A',
            depletionMonth: depletionMonth || 'N/A'
        },
        projection,
        assumptions,
        warnings,
        status: depletionMonth ? 'warning' : 'success'
    });
};
