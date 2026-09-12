import {
    calculateSIP,
    calculateLumpsum,
    calculateStepUpSIP,
    calculateSWP,
    calculateGoalPlanner,
    calculateCAGR,
    calculateIRR,
    calculateInflation,
    calculateRetirement,
    calculateCapitalGains,
    calculate
} from '../calculations/index.js';

let passed = 0;
let failed = 0;

const assert = (condition, description) => {
    if (condition) {
        console.log(`  ✓ ${description}`);
        passed++;
    } else {
        console.error(`  ✗ FAIL: ${description}`);
        failed++;
    }
};

console.log('====================================================');
console.log('      FINEXA AI CALCULATOR ENGINE TEST SUITE');
console.log('====================================================\n');

// 1. SIP Calculator Tests
console.log('1. Testing SIP Engine:');
const sipNormal = calculateSIP({ monthlyInvestment: 10000, expectedReturnRate: 12, investmentHorizon: 15 });
assert(sipNormal.summary.totalInvested === 1800000, 'SIP total invested correct (₹18 Lakh)');
assert(sipNormal.summary.finalValue > 4500000 && sipNormal.summary.finalValue < 5500000, `SIP final value realistic (₹${sipNormal.summary.finalValue})`);
assert(sipNormal.projection.length === 16, 'SIP projection has 16 yearly nodes (Year 0 to 15)');

const sipZeroRate = calculateSIP({ monthlyInvestment: 5000, expectedReturnRate: 0, investmentHorizon: 10 });
assert(sipZeroRate.summary.finalValue === 600000, 'SIP 0% rate gives exact principal (₹6 Lakh)');
assert(sipZeroRate.summary.totalReturns === 0, 'SIP 0% rate gives 0 returns');

// 2. Lumpsum Calculator Tests
console.log('\n2. Testing Lumpsum Engine:');
const lumpNormal = calculateLumpsum({ lumpsumAmount: 100000, expectedReturnRate: 12, investmentHorizon: 10 });
assert(lumpNormal.summary.finalValue === 310585, `Lumpsum 10yr @ 12% matches expected FV (₹${lumpNormal.summary.finalValue})`);

const lumpZero = calculateLumpsum({ lumpsumAmount: 100000, expectedReturnRate: 0, investmentHorizon: 5 });
assert(lumpZero.summary.finalValue === 100000, 'Lumpsum 0% rate preserves exact principal');

// 3. Step-Up SIP Tests
console.log('\n3. Testing Step-Up SIP Engine:');
const stepup = calculateStepUpSIP({ initialMonthlySIP: 10000, annualStepUpPercent: 10, expectedReturnRate: 12, investmentHorizon: 10 });
assert(stepup.summary.totalInvested > 1800000, `Step-Up total invested reflects escalating contributions (₹${stepup.summary.totalInvested})`);
assert(stepup.summary.finalValue > stepup.summary.totalInvested, 'Step-Up final value > total invested');

// 4. SWP Calculator Tests
console.log('\n4. Testing SWP Engine & Depletion Detection:');
const swpSustainable = calculateSWP({ lumpsumInvestment: 1000000, monthlyWithdrawal: 5000, expectedReturnRate: 8, swpTenureYears: 10 });
assert(swpSustainable.metrics.isSustainable === true, 'SWP 6% withdrawal rate @ 8% return is sustainable');

const swpDepleted = calculateSWP({ lumpsumInvestment: 500000, monthlyWithdrawal: 20000, expectedReturnRate: 5, swpTenureYears: 10 });
assert(swpDepleted.metrics.isSustainable === false, 'SWP excessive withdrawal detects corpus depletion');
assert(swpDepleted.calculationStatus === 'warning', 'SWP depletion raises warning status');
assert(swpDepleted.warnings.some(w => w.includes('depleted')), 'SWP emits explicit depletion warning');

// 5. Goal Planner Tests
console.log('\n5. Testing Goal Planner Engine:');
const goal = calculateGoalPlanner({ targetGoalAmount: 5000000, expectedReturnRate: 12, yearsToGoal: 15 });
assert(goal.summary.monthlyRequired > 9000 && goal.summary.monthlyRequired < 11000, `Goal planner required SIP realistic (₹${goal.summary.monthlyRequired})`);
assert(goal.summary.finalValue === 5000000, 'Goal planner final value matches target');

// 6. CAGR Tests
console.log('\n6. Testing CAGR Engine:');
const cagr = calculateCAGR({ initialInvestment: 100000, finalPortfolioValue: 250000, durationYears: 5 });
assert(Math.abs(cagr.summary.cagr - 20.11) < 0.1, `CAGR calculated correctly (~20.11%, got ${cagr.summary.cagr}%)`);

const cagrLoss = calculateCAGR({ initialInvestment: 100000, finalPortfolioValue: 50000, durationYears: 5 });
assert(cagrLoss.summary.cagr < 0, 'CAGR detects negative growth / capital loss');

// 7. IRR / XIRR Tests
console.log('\n7. Testing IRR & XIRR Engine:');
const irrRes = calculateIRR({ cashflows: [-100000, 20000, 25000, 30000, 35000, 40000] });
assert(irrRes.summary.irr > 10 && irrRes.summary.irr < 20, `Periodic IRR solved correctly (${irrRes.summary.irr}%)`);

const xirrRes = calculateIRR({
    datedCashflows: [
        { date: '2023-01-01', amount: -100000 },
        { date: '2024-01-01', amount: 30000 },
        { date: '2025-01-01', amount: 40000 },
        { date: '2026-01-01', amount: 50000 }
    ]
});
assert(xirrRes.summary.irr > 0, `Date-based XIRR solved correctly (${xirrRes.summary.irr}%)`);

// 8. Inflation Tests
console.log('\n8. Testing Inflation Engine:');
const inf = calculateInflation({ currentAmount: 100000, inflationRate: 6, timeHorizonYears: 15 });
assert(inf.metrics.futureCostOfGoods > 200000, `Future cost calculated correctly (₹${inf.metrics.futureCostOfGoods})`);
assert(inf.metrics.purchasingPowerInFuture < 50000, `Purchasing power erosion calculated correctly (₹${inf.metrics.purchasingPowerInFuture})`);

// 9. Retirement Tests
console.log('\n9. Testing Retirement Engine:');
const ret = calculateRetirement({
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 85,
    currentMonthlyExpenses: 50000,
    expectedInflationRate: 6,
    preRetirementReturnRate: 12,
    postRetirementReturnRate: 8
});
assert(ret.summary.corpus > 10000000, `Retirement corpus calculated correctly (₹${ret.summary.corpus})`);
assert(ret.summary.monthlySaving > 0, `Required monthly saving calculated (₹${ret.summary.monthlySaving})`);

const retZeroReal = calculateRetirement({
    currentAge: 30,
    retirementAge: 60,
    lifeExpectancy: 80,
    currentMonthlyExpenses: 50000,
    expectedInflationRate: 6,
    preRetirementReturnRate: 12,
    postRetirementReturnRate: 6 // Post return == inflation => Real return 0%
});
assert(retZeroReal.summary.corpus > 0, 'Zero real return handled without division by zero');

// 10. Capital Gains Tax Tests
console.log('\n10. Testing Capital Gains Tax Engine:');
const taxStcg = calculateCapitalGains({ purchasePrice: 100, sellingPrice: 150, quantity: 1000, holdingMonths: 6 });
assert(taxStcg.metrics.taxType === 'STCG', 'STCG correctly identified (< 12 months)');
assert(taxStcg.metrics.taxLiability === 10000, 'STCG tax @ 20% on ₹50,000 gain is ₹10,000');

const taxLtcg = calculateCapitalGains({ purchasePrice: 100, sellingPrice: 300, quantity: 1000, holdingMonths: 18 });
assert(taxLtcg.metrics.taxType === 'LTCG', 'LTCG correctly identified (>= 12 months)');
assert(taxLtcg.metrics.exemptionApplied === 125000, 'LTCG ₹1.25 Lakh exemption correctly applied');

console.log('\n====================================================');
console.log(`   TEST RESULT: ${passed} PASSED, ${failed} FAILED`);
console.log('====================================================\n');

if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
