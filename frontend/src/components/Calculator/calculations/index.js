import { calculateSIP } from './sip.js';
import { calculateLumpsum } from './lumpsum.js';
import { calculateStepUpSIP } from './stepUpSip.js';
import { calculateSWP } from './swp.js';
import { calculateGoalPlanner } from './goalPlanner.js';
import { calculateCAGR } from './cagr.js';
import { calculateIRR } from './irr.js';
import { calculateInflation } from './inflation.js';
import { calculateRetirement } from './retirement.js';
import { calculateCapitalGains } from './capitalGains.js';
import { createResultModel } from './common.js';

export {
    calculateSIP,
    calculateLumpsum,
    calculateStepUpSIP,
    calculateSWP,
    calculateGoalPlanner,
    calculateCAGR,
    calculateIRR,
    calculateInflation,
    calculateRetirement,
    calculateCapitalGains
};

/**
 * Main Calculator Dispatcher Engine
 * 
 * @param {string} calcType - Calculator identifier ('sip', 'lumpsum', 'stepup', 'swp', 'goal', 'cagr', 'xirr', 'inflation', 'retirement', 'tax')
 * @param {Object} params - Input parameters for the chosen calculator
 */
export const calculate = (calcType, params = {}) => {
    switch (calcType) {
        case 'sip':
            return calculateSIP(params);
        case 'lumpsum':
            return calculateLumpsum(params);
        case 'stepup':
            return calculateStepUpSIP(params);
        case 'swp':
            return calculateSWP(params);
        case 'goal':
            return calculateGoalPlanner(params);
        case 'cagr':
            return calculateCAGR(params);
        case 'xirr':
        case 'irr':
            return calculateIRR(params);
        case 'inflation':
            return calculateInflation(params);
        case 'retirement':
            return calculateRetirement(params);
        case 'tax':
            return calculateCapitalGains(params);
        default:
            return createResultModel({
                summary: {},
                warnings: [`Unknown calculator type: "${calcType}"`],
                status: 'error'
            });
    }
};

/**
 * Scenario Analysis Helper
 * Compares Conservative, Expected, and Optimistic return scenarios for a given calculator
 */
export const calculateScenarios = (calcType, params = {}, rateKey = 'expectedReturnRate', offsets = [-2, 0, 2]) => {
    const baseRate = Number(params[rateKey]) || 10;

    return {
        conservative: calculate(calcType, { ...params, [rateKey]: Math.max(0, baseRate + offsets[0]) }),
        expected: calculate(calcType, { ...params, [rateKey]: baseRate }),
        optimistic: calculate(calcType, { ...params, [rateKey]: baseRate + offsets[2] })
    };
};
