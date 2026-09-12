import {
    createResultModel,
    roundNumber,
    EPSILON
} from './common.js';

/**
 * Solves Net Present Value (NPV) for periodic cash flows at annual rate r
 */
const calculatePeriodicNPV = (cashflows, rate) => {
    let npv = 0;
    for (let t = 0; t < cashflows.length; t++) {
        npv += cashflows[t] / Math.pow(1 + rate, t);
    }
    return npv;
};

/**
 * Derivative of NPV for periodic cash flows
 */
const calculatePeriodicdNpv = (cashflows, rate) => {
    let dNpv = 0;
    for (let t = 0; t < cashflows.length; t++) {
        dNpv -= (t * cashflows[t]) / Math.pow(1 + rate, t + 1);
    }
    return dNpv;
};

/**
 * Bisection method fallback for periodic IRR when Newton-Raphson fails or diverges
 */
const solveIRRBisection = (cashflows, minRate = -0.999, maxRate = 10.0, tolerance = 1e-7, maxIter = 200) => {
    let low = minRate;
    let high = maxRate;

    let fLow = calculatePeriodicNPV(cashflows, low);
    let fHigh = calculatePeriodicNPV(cashflows, high);

    // If signs are identical, bisection cannot guarantee root in interval
    if (fLow * fHigh > 0) {
        return null;
    }

    for (let i = 0; i < maxIter; i++) {
        const mid = (low + high) / 2;
        const fMid = calculatePeriodicNPV(cashflows, mid);

        if (Math.abs(fMid) < tolerance || (high - low) / 2 < tolerance) {
            return mid;
        }

        if (fLow * fMid < 0) {
            high = mid;
            fHigh = fMid;
        } else {
            low = mid;
            fLow = fMid;
        }
    }
    return (low + high) / 2;
};

/**
 * Hybrid Newton-Raphson + Bisection IRR Solver
 */
export const solveIRR = (cashflows) => {
    if (!Array.isArray(cashflows) || cashflows.length === 0) return 0;

    let r = 0.10; // Initial guess 10%
    const maxIterations = 100;
    const precision = 1e-7;

    let converged = false;

    for (let k = 0; k < maxIterations; k++) {
        const npv = calculatePeriodicNPV(cashflows, r);
        const dNpv = calculatePeriodicdNpv(cashflows, r);

        if (Math.abs(dNpv) < 1e-12) break; // Derivative too small, abort NR

        const nextR = r - npv / dNpv;

        // Prevent invalid negative rates below -100%
        if (nextR <= -1) {
            r = -0.5;
            continue;
        }

        if (Math.abs(nextR - r) < precision) {
            r = nextR;
            converged = true;
            break;
        }
        r = nextR;
    }

    if (converged && isFinite(r) && !isNaN(r)) {
        return r * 100;
    }

    // Bisection Fallback
    const bisectionRate = solveIRRBisection(cashflows);
    if (bisectionRate !== null && isFinite(bisectionRate)) {
        return bisectionRate * 100;
    }

    return 0;
};

/**
 * Date-based XIRR NPV Solver
 * NPV(r) = sum( CF_i / (1+r)^((Date_i - Date_0)/365) )
 */
export const calculateXIRRNPV = (cashflowsWithDates, rate) => {
    if (!cashflowsWithDates || cashflowsWithDates.length === 0) return 0;
    const t0 = new Date(cashflowsWithDates[0].date).getTime();

    let npv = 0;
    for (let i = 0; i < cashflowsWithDates.length; i++) {
        const t_i = new Date(cashflowsWithDates[i].date).getTime();
        const years = (t_i - t0) / (1000 * 60 * 60 * 24 * 365.25);
        npv += cashflowsWithDates[i].amount / Math.pow(1 + rate, years);
    }
    return npv;
};

/**
 * Hybrid Solver for True Date-Based XIRR
 */
export const solveXIRR = (cashflowsWithDates) => {
    if (!cashflowsWithDates || cashflowsWithDates.length < 2) return 0;
    const t0 = new Date(cashflowsWithDates[0].date).getTime();

    let r = 0.10;
    const tolerance = 1e-7;

    for (let k = 0; k < 100; k++) {
        let npv = 0;
        let dNpv = 0;

        for (let i = 0; i < cashflowsWithDates.length; i++) {
            const t_i = new Date(cashflowsWithDates[i].date).getTime();
            const years = (t_i - t0) / (1000 * 60 * 60 * 24 * 365.25);

            const denom = Math.pow(1 + r, years);
            npv += cashflowsWithDates[i].amount / denom;
            dNpv -= (years * cashflowsWithDates[i].amount) / (denom * (1 + r));
        }

        if (Math.abs(dNpv) < 1e-12) break;

        const nextR = r - npv / dNpv;
        if (Math.abs(nextR - r) < tolerance) {
            return nextR * 100;
        }
        r = nextR;
    }
    return r * 100;
};

/**
 * IRR / XIRR Calculation Engine
 * 
 * @param {Object} params
 * @param {Array<number>} [params.cashflows] - Periodic annual cashflows (Year 0 is negative outflow)
 * @param {Array<{amount: number, date: string}>} [params.datedCashflows] - Optional exact-date cashflows for XIRR
 */
export const calculateIRR = ({
    cashflows = [-100000, 20000, 25000, 30000, 35000, 40000],
    datedCashflows = null
} = {}) => {
    const warnings = [];
    const assumptions = [
        `Periodic IRR assumes regular equal-interval annual cash flows`,
        `Outflows are represented by negative values and Inflows by positive values`
    ];

    let calculatedIrr = 0;
    let isXirrMode = false;

    if (datedCashflows && Array.isArray(datedCashflows) && datedCashflows.length >= 2) {
        isXirrMode = true;
        calculatedIrr = solveXIRR(datedCashflows);
        assumptions.push('Calculated using exact date-based XIRR discounting formula');
    } else {
        // Validate periodic cashflows
        const initialOutflow = cashflows[0];
        if (initialOutflow >= 0) {
            warnings.push('Year 0 cashflow must be negative (an outflow / investment).');
        }

        const hasPositiveInflow = cashflows.slice(1).some(cf => cf > 0);
        if (!hasPositiveInflow) {
            warnings.push('Cashflows must contain at least one positive return / inflow.');
        }

        calculatedIrr = solveIRR(cashflows);
    }

    if (isNaN(calculatedIrr) || !isFinite(calculatedIrr)) {
        warnings.push('Could not solve IRR for the given cash flows. Check cashflow signs and magnitude.');
        calculatedIrr = 0;
    }

    const initialOutflow = Math.abs(cashflows[0] || 0);
    const totalInflows = cashflows.slice(1).reduce((acc, c) => acc + Math.max(0, c), 0);

    const projection = [];
    let balance = initialOutflow;
    const rDecimal = calculatedIrr / 100;

    projection.push({
        period: 0,
        year: 'Year 0',
        contribution: initialOutflow,
        invested: Math.round(initialOutflow),
        growth: 0,
        withdrawal: 0,
        balance: Math.round(balance),
        value: Math.round(balance),
        returns: 0
    });

    for (let y = 1; y < cashflows.length; y++) {
        const interest = balance * rDecimal;
        balance = balance + interest + cashflows[y];

        projection.push({
            period: y,
            year: `Year ${y}`,
            contribution: cashflows[y] < 0 ? Math.abs(cashflows[y]) : 0,
            invested: Math.round(initialOutflow),
            growth: Math.round(interest),
            withdrawal: cashflows[y] > 0 ? cashflows[y] : 0,
            balance: Math.round(balance),
            value: Math.round(balance),
            returns: Math.max(0, Math.round(balance - initialOutflow))
        });
    }

    return createResultModel({
        summary: {
            totalInvested: Math.round(initialOutflow),
            finalValue: Math.round(totalInflows),
            totalReturns: Math.round(Math.max(0, totalInflows - initialOutflow)),
            irr: roundNumber(calculatedIrr, 2),
            primaryMetric: { label: isXirrMode ? 'Calculated XIRR' : 'Internal IRR', value: `${roundNumber(calculatedIrr, 2)}% p.a.` }
        },
        metrics: {
            totalOutflow: Math.round(initialOutflow),
            totalInflow: Math.round(totalInflows),
            irrPercent: roundNumber(calculatedIrr, 2),
            isXIRR: isXirrMode
        },
        projection,
        assumptions,
        warnings
    });
};
