import {
    toMonthlyRate,
    calculateAnnuityFV,
    calculateAnnuityPV,
    calculateRealRate,
    createResultModel,
    roundNumber,
    EPSILON
} from './common.js';

/**
 * Retirement Calculation Engine
 * Advanced two-phase inflation-adjusted annuity engine.
 * 
 * @param {Object} params
 * @param {number} params.currentAge - Current age of investor
 * @param {number} params.retirementAge - Planned retirement age
 * @param {number} params.lifeExpectancy - Expected life span in years
 * @param {number} params.currentMonthlyExpenses - Current monthly expenses today (₹)
 * @param {number} params.expectedInflationRate - Expected annual inflation rate (%)
 * @param {number} params.preRetirementReturnRate - Expected annual return pre-retirement (%)
 * @param {number} params.postRetirementReturnRate - Expected annual return post-retirement (%)
 */
export const calculateRetirement = ({
    currentAge = 30,
    retirementAge = 60,
    lifeExpectancy = 85,
    currentMonthlyExpenses = 50000,
    expectedInflationRate = 6,
    preRetirementReturnRate = 12,
    postRetirementReturnRate = 8
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Phase 1: Accumulation phase prior to retirement`,
        `Phase 2: Distribution phase during retirement with inflation-adjusted annuity drawdowns`,
        `Post-retirement returns are evaluated net of inflation (Real Return Rate)`
    ];

    const ageCur = Math.max(0, Number(currentAge) || 0);
    const ageRet = Math.max(0, Number(retirementAge) || 0);
    const ageLife = Math.max(0, Number(lifeExpectancy) || 0);
    const expenses = Math.max(0, Number(currentMonthlyExpenses) || 0);
    const infRate = Math.max(0, Number(expectedInflationRate) || 0);
    const preRate = Math.max(0, Number(preRetirementReturnRate) || 0);
    const postRate = Math.max(0, Number(postRetirementReturnRate) || 0);

    const yearsToRetire = ageRet - ageCur;
    const retirementYears = ageLife - ageRet;

    // Validation & Edge Cases
    if (yearsToRetire <= 0) {
        warnings.push('Retirement age must be greater than current age.');
    }
    if (retirementYears <= 0) {
        warnings.push('Life expectancy must be greater than retirement age.');
    }
    if (expenses === 0) {
        warnings.push('Current monthly expenses amount is ₹0.');
    }

    if (yearsToRetire <= 0 || retirementYears <= 0) {
        return createResultModel({
            summary: { totalInvested: 0, finalValue: 0, totalReturns: 0, corpus: 0, monthlySaving: 0 },
            metrics: { yearsToRetire: 0, retirementYears: 0 },
            projection: [],
            assumptions,
            warnings,
            status: 'error'
        });
    }

    // 1. Calculate inflated monthly expenses at retirement age
    const rInfDecimal = infRate / 100;
    const inflatedMonthlyExpense = expenses * Math.pow(1 + rInfDecimal, yearsToRetire);

    // 2. Real Rate of Return Post-Retirement
    const realRatePostAnnual = calculateRealRate(postRate, infRate);
    const realRatePostMonthly = realRatePostAnnual / 12;
    const monthsInRetirement = retirementYears * 12;

    // 3. Required Retirement Corpus (PV of Inflation-Adjusted Annuity)
    let requiredCorpus = 0;
    if (Math.abs(realRatePostMonthly) < EPSILON) {
        // 0% Real return fallback: total required is simple sum of inflated expenses
        requiredCorpus = inflatedMonthlyExpense * monthsInRetirement;
        assumptions.push('Real return post-retirement is 0% (post-retirement returns equal inflation).');
    } else {
        requiredCorpus = calculateAnnuityPV(inflatedMonthlyExpense, realRatePostMonthly, monthsInRetirement, false);
    }

    // 4. Required Monthly Pre-Retirement Savings (SIP)
    const preMonthlyRate = toMonthlyRate(preRate);
    const monthsToRetire = yearsToRetire * 12;
    let requiredMonthlySaving = 0;

    if (monthsToRetire > 0) {
        if (Math.abs(preMonthlyRate) < EPSILON) {
            requiredMonthlySaving = requiredCorpus / monthsToRetire;
        } else {
            const fvFactor = (((Math.pow(1 + preMonthlyRate, monthsToRetire) - 1) / preMonthlyRate) * (1 + preMonthlyRate));
            requiredMonthlySaving = requiredCorpus / fvFactor;
        }
    }

    const totalSavedPreRetirement = requiredMonthlySaving * monthsToRetire;
    const estimatedPreRetirementReturns = Math.max(0, requiredCorpus - totalSavedPreRetirement);

    // 5. Pre-Retirement Accumulation Projection
    const projection = [];
    for (let y = 0; y <= yearsToRetire; y++) {
        const months = y * 12;
        const currentInvested = requiredMonthlySaving * months;
        const val = y === 0 ? 0 : calculateAnnuityFV(requiredMonthlySaving, preMonthlyRate, months, true);
        const growth = Math.max(0, val - currentInvested);

        projection.push({
            period: y,
            year: `Age ${ageCur + y}`,
            contribution: y === 0 ? 0 : Math.round(requiredMonthlySaving * 12),
            invested: Math.round(currentInvested),
            growth: Math.round(growth),
            withdrawal: 0,
            balance: Math.round(val),
            value: Math.round(val),
            returns: Math.round(growth)
        });
    }

    return createResultModel({
        summary: {
            totalInvested: Math.round(totalSavedPreRetirement),
            finalValue: Math.round(requiredCorpus),
            totalReturns: Math.round(estimatedPreRetirementReturns),
            corpus: Math.round(requiredCorpus),
            monthlySaving: Math.round(requiredMonthlySaving),
            inflatedExpense: Math.round(inflatedMonthlyExpense),
            primaryMetric: { label: 'Target Corpus Needed', value: Math.round(requiredCorpus) }
        },
        metrics: {
            currentAge: ageCur,
            retirementAge: ageRet,
            lifeExpectancy: ageLife,
            yearsToRetire,
            retirementDurationYears: retirementYears,
            inflatedMonthlyExpenseAtRetire: Math.round(inflatedMonthlyExpense),
            requiredCorpus: Math.round(requiredCorpus),
            requiredMonthlySaving: Math.round(requiredMonthlySaving),
            realPostReturnPercent: roundNumber(realRatePostAnnual * 100, 2)
        },
        projection,
        assumptions,
        warnings
    });
};
