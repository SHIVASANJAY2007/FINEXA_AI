import React, { useState, useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calculator as CalcIcon, Percent, Calendar, DollarSign, Sparkles, Scale, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CALCULATOR_TYPES = [
    { id: 'sip', name: 'SIP', description: 'Systematic Investment Plan' },
    { id: 'lumpsum', name: 'Lumpsum', description: 'One-time Investment' },
    { id: 'stepup', name: 'Step-Up SIP', description: 'SIP with Annual Increase' },
    { id: 'swp', name: 'SWP', description: 'Systematic Withdrawal' },
    { id: 'goal', name: 'Goal Planner', description: 'Target-Based Investment' },
    { id: 'cagr', name: 'CAGR', description: 'Annual Compound Returns' },
    { id: 'xirr', name: 'XIRR / IRR', description: 'Internal Rate of Return' },
    { id: 'inflation', name: 'Inflation', description: 'Purchasing Power Loss' },
    { id: 'retirement', name: 'Retirement', description: 'Corpus & Savings Planner' },
    { id: 'tax', name: 'Capital Gains Tax', description: 'STCG & LTCG Estimator' }
];

const formatRupees = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '₹0';
    if (val >= 10000000) {
        return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
        return `₹${(val / 100000).toFixed(2)} Lakh`;
    }
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

// IRR Solver using Newton-Raphson Method
const solveIRR = (cashflows) => {
    let r = 0.1; // Initial guess
    const maxIterations = 100;
    const precision = 1e-7;

    for (let k = 0; k < maxIterations; k++) {
        let npv = 0;
        let dNpv = 0;

        for (let t = 0; t < cashflows.length; t++) {
            const cf = cashflows[t];
            npv += cf / Math.pow(1 + r, t);
            dNpv -= t * cf / Math.pow(1 + r, t + 1);
        }

        if (Math.abs(dNpv) < 1e-12) break;

        const nextR = r - npv / dNpv;
        if (Math.abs(nextR - r) < precision) {
            return nextR * 100; // Return as percentage
        }
        r = nextR;
    }
    return r * 100;
};

const CustomTooltip = ({ active, payload, calcType }) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-[#1c140e]/95 border border-gold/30 p-4 rounded-2xl shadow-2xl backdrop-blur-md text-xs text-left">
                <p className="font-bold text-gold uppercase tracking-wider mb-2 font-mono">{data.year}</p>
                <div className="space-y-1.5 font-semibold">
                    {calcType === 'swp' ? (
                        <>
                            <p className="text-ivory/80">Remaining Balance: <span className="font-extrabold text-ivory">{formatRupees(data.value)}</span></p>
                            <p className="text-ivory/80">Total Withdrawn: <span className="font-bold text-teal">{formatRupees(data.invested)}</span></p>
                        </>
                    ) : calcType === 'inflation' ? (
                        <>
                            <p className="text-ivory/80">Future Cost: <span className="font-extrabold text-ivory">{formatRupees(data.value)}</span></p>
                            <p className="text-ivory/80">Purchasing Power: <span className="font-bold text-gold">{formatRupees(data.invested)}</span></p>
                        </>
                    ) : calcType === 'retirement' ? (
                        <>
                            <p className="text-ivory/80 font-bold">Retirement Corpus: <span className="font-extrabold text-burgundy">{formatRupees(data.value)}</span></p>
                            <p className="text-ivory/80">Total Saved: <span className="font-bold text-teal">{formatRupees(data.invested)}</span></p>
                        </>
                    ) : (
                        <>
                            <p className="text-ivory/80">Current Value: <span className="font-extrabold text-ivory">{formatRupees(data.value)}</span></p>
                            <p className="text-ivory/80">Amount Invested: <span className="font-bold text-ivory/90">{formatRupees(data.invested)}</span></p>
                            <p className="text-ivory/80">Est. Returns: <span className="font-bold text-gold">{formatRupees(data.returns)}</span></p>
                        </>
                    )}
                </div>
            </div>
        );
    }
    return null;
};

const Calculator = () => {
    const navigate = useNavigate();
    const [calcType, setCalcType] = useState('sip');

    // 1. SIP
    const [sipMonthly, setSipMonthly] = useState(10000);
    const [sipRate, setSipRate] = useState(12);
    const [sipYears, setSipYears] = useState(15);

    // 2. Lumpsum
    const [lumpAmount, setLumpAmount] = useState(100000);
    const [lumpRate, setLumpRate] = useState(12);
    const [lumpYears, setLumpYears] = useState(15);

    // 3. Step-Up SIP
    const [stepMonthly, setStepMonthly] = useState(10000);
    const [stepRate, setStepRate] = useState(12);
    const [stepYears, setStepYears] = useState(15);
    const [stepPercent, setStepPercent] = useState(10);

    // 4. SWP
    const [swpLump, setSwpLump] = useState(1000000);
    const [swpWithdrawal, setSwpWithdrawal] = useState(10000);
    const [swpRate, setSwpRate] = useState(8);
    const [swpYears, setSwpYears] = useState(15);

    // 5. Goal Planner
    const [goalTarget, setGoalTarget] = useState(5000000);
    const [goalRate, setGoalRate] = useState(12);
    const [goalYears, setGoalYears] = useState(15);

    // 6. CAGR
    const [cagrInitial, setCagrInitial] = useState(100000);
    const [cagrFinal, setCagrFinal] = useState(250000);
    const [cagrYears, setCagrYears] = useState(5);

    // 7. XIRR / IRR
    const [cf0, setCf0] = useState(-100000);
    const [cf1, setCf1] = useState(20000);
    const [cf2, setCf2] = useState(25000);
    const [cf3, setCf3] = useState(30000);
    const [cf4, setCf4] = useState(35000);
    const [cf5, setCf5] = useState(40000);

    // 8. Inflation
    const [infAmount, setInfAmount] = useState(100000);
    const [infRate, setInfRate] = useState(6);
    const [infYears, setInfYears] = useState(15);

    // 9. Retirement
    const [retAge, setRetAge] = useState(30);
    const [retRetireAge, setRetRetireAge] = useState(60);
    const [retLife, setRetLife] = useState(85);
    const [retExpenses, setRetExpenses] = useState(50000);
    const [retInflation, setRetInflation] = useState(6);
    const [retPreReturn, setRetPreReturn] = useState(12);
    const [retPostReturn, setRetPostReturn] = useState(8);

    // 10. Capital Gains Tax
    const [taxPurchase, setTaxPurchase] = useState(100);
    const [taxSale, setTaxSale] = useState(150);
    const [taxQty, setTaxQty] = useState(1000);
    const [taxMonths, setTaxMonths] = useState(18);

    // Calculation Engine
    const result = useMemo(() => {
        const chartData = [];

        switch (calcType) {
            case 'sip': {
                const P = sipMonthly;
                const i = (sipRate / 100) / 12;

                for (let y = 0; y <= sipYears; y++) {
                    const months = y * 12;
                    const val = y === 0 ? 0 : P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
                    const invested = P * months;
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(val),
                        invested,
                        returns: Math.max(0, Math.round(val - invested))
                    });
                }
                const last = chartData[chartData.length - 1];
                return { invested: last.invested, value: last.value, returns: last.returns, chartData };
            }

            case 'lumpsum': {
                const P = lumpAmount;
                const r = lumpRate / 100;
                for (let y = 0; y <= lumpYears; y++) {
                    const val = P * Math.pow(1 + r, y);
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(val),
                        invested: P,
                        returns: Math.max(0, Math.round(val - P))
                    });
                }
                const last = chartData[chartData.length - 1];
                return { invested: last.invested, value: last.value, returns: last.returns, chartData };
            }

            case 'stepup': {
                const P = stepMonthly;
                const r = stepRate / 100;
                const step = stepPercent / 100;

                let currentVal = 0;
                let totalInvested = 0;
                let currentMonthly = P;

                chartData.push({ year: 'Year 0', value: 0, invested: 0, returns: 0 });

                for (let y = 1; y <= stepYears; y++) {
                    for (let m = 1; m <= 12; m++) {
                        totalInvested += currentMonthly;
                        currentVal = (currentVal + currentMonthly) * (1 + r / 12);
                    }
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(currentVal),
                        invested: totalInvested,
                        returns: Math.max(0, Math.round(currentVal - totalInvested))
                    });
                    // Step up monthly SIP at start of next year
                    currentMonthly = currentMonthly * (1 + step);
                }
                const last = chartData[chartData.length - 1];
                return { invested: last.invested, value: last.value, returns: last.returns, chartData };
            }

            case 'swp': {
                const initial = swpLump;
                const w = swpWithdrawal;
                const r = swpRate / 100;

                let balance = initial;
                let totalWithdrawn = 0;

                chartData.push({ year: 'Year 0', value: initial, invested: 0 });

                for (let y = 1; y <= swpYears; y++) {
                    for (let m = 1; m <= 12; m++) {
                        if (balance <= 0) {
                            balance = 0;
                            break;
                        }
                        const interest = balance * (r / 12);
                        balance = balance + interest - w;
                        totalWithdrawn += w;
                    }
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(balance),
                        invested: totalWithdrawn // Using 'invested' field to display withdrawn amount in tooltip
                    });
                }
                return { invested: totalWithdrawn, value: Math.round(balance), returns: Math.max(0, Math.round(balance + totalWithdrawn - initial)), chartData };
            }

            case 'goal': {
                const target = goalTarget;
                const i = (goalRate / 100) / 12;
                const months = goalYears * 12;

                // FV = MonthlySIP * [((1 + i)^n - 1) / i] * (1 + i)
                const monthlyRequired = target / (((Math.pow(1 + i, months) - 1) / i) * (1 + i));
                const totalInvested = monthlyRequired * months;

                for (let y = 0; y <= goalYears; y++) {
                    const currentMonths = y * 12;
                    const val = y === 0 ? 0 : monthlyRequired * (((Math.pow(1 + i, currentMonths) - 1) / i) * (1 + i));
                    const currentInvested = monthlyRequired * currentMonths;
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(val),
                        invested: Math.round(currentInvested),
                        returns: Math.max(0, Math.round(val - currentInvested))
                    });
                }

                return { invested: Math.round(totalInvested), value: target, returns: Math.max(0, Math.round(target - totalInvested)), monthlyRequired: Math.round(monthlyRequired), chartData };
            }

            case 'cagr': {
                const start = cagrInitial;
                const end = cagrFinal;
                const yrs = cagrYears;

                // CAGR = (End / Start)^(1/Years) - 1
                const cagrVal = start > 0 && end > 0 ? (Math.pow(end / start, 1 / yrs) - 1) * 100 : 0;

                for (let y = 0; y <= yrs; y++) {
                    const currentVal = start * Math.pow(1 + (cagrVal / 100), y);
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(currentVal),
                        invested: start,
                        returns: Math.max(0, Math.round(currentVal - start))
                    });
                }

                return { invested: start, value: end, returns: Math.max(0, end - start), cagr: cagrVal.toFixed(2), chartData };
            }

            case 'xirr': {
                const cashflows = [cf0, cf1, cf2, cf3, cf4, cf5];
                const calculatedIrr = solveIRR(cashflows);

                let balance = -cf0;
                chartData.push({ year: 'Year 0', value: Math.round(balance), invested: -cf0, returns: 0 });

                for (let y = 1; y <= 5; y++) {
                    // Compound existing balance, and add the current year cash flow
                    const interest = balance * (calculatedIrr / 100);
                    balance = balance + interest + cashflows[y];

                    const cumOutflow = -cf0; // Cumulative investment is Year 0 outflow
                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(balance),
                        invested: cumOutflow,
                        returns: Math.max(0, Math.round(balance - cumOutflow))
                    });
                }

                const totalOut = -cf0;
                const totalIn = cf1 + cf2 + cf3 + cf4 + cf5;

                return { invested: totalOut, value: totalIn, returns: Math.max(0, totalIn - totalOut), irr: calculatedIrr.toFixed(2), chartData };
            }

            case 'inflation': {
                const amount = infAmount;
                const rate = infRate / 100;

                for (let y = 0; y <= infYears; y++) {
                    const futureCost = amount * Math.pow(1 + rate, y);
                    // Purchasing power = amount / (1+rate)^y
                    const power = amount / Math.pow(1 + rate, y);

                    chartData.push({
                        year: `Year ${y}`,
                        value: Math.round(futureCost), // Future Cost of Item
                        invested: Math.round(power) // Purchasing Power of original amount (using 'invested' to map tooltip)
                    });
                }
                const last = chartData[chartData.length - 1];
                return { invested: last.invested, value: last.value, returns: Math.max(0, last.value - amount), chartData };
            }

            case 'retirement': {
                const yearsToRetire = retRetireAge - retAge;
                const retirementYears = retLife - retRetireAge;

                if (yearsToRetire <= 0 || retirementYears <= 0) {
                    return { invested: 0, value: 0, returns: 0, corpus: 0, monthlySaving: 0, chartData: [] };
                }

                // Inflated monthly expenses at retirement
                const inflatedExpense = retExpenses * Math.pow(1 + retInflation / 100, yearsToRetire);

                // Real rate of return in retirement
                const realRate = ((1 + retPostReturn / 100) / (1 + retInflation / 100)) - 1;
                const iReal = realRate / 12;
                const monthsInRetirement = retirementYears * 12;

                // Corpus needed (present value of inflation-adjusted retirement annuity)
                const corpus = inflatedExpense * ((1 - Math.pow(1 + iReal, -monthsInRetirement)) / iReal);

                // Required Monthly Savings (SIP) prior to retirement
                const iPre = (retPreReturn / 100) / 12;
                const monthsToRetire = yearsToRetire * 12;
                const monthlySaving = corpus / (((Math.pow(1 + iPre, monthsToRetire) - 1) / iPre) * (1 + iPre));
                const totalSaved = monthlySaving * monthsToRetire;

                // Chart out pre-retirement accumulation phase
                for (let y = 0; y <= yearsToRetire; y++) {
                    const months = y * 12;
                    const val = y === 0 ? 0 : monthlySaving * (((Math.pow(1 + iPre, months) - 1) / iPre) * (1 + iPre));
                    chartData.push({
                        year: `Age ${retAge + y}`,
                        value: Math.round(val),
                        invested: Math.round(monthlySaving * months),
                        returns: Math.max(0, Math.round(val - (monthlySaving * months)))
                    });
                }

                return {
                    invested: Math.round(totalSaved),
                    value: Math.round(corpus),
                    returns: Math.max(0, Math.round(corpus - totalSaved)),
                    corpus: Math.round(corpus),
                    monthlySaving: Math.round(monthlySaving),
                    inflatedExpense: Math.round(inflatedExpense),
                    chartData
                };
            }

            case 'tax': {
                const buy = taxPurchase;
                const sell = taxSale;
                const qty = taxQty;
                const months = taxMonths;

                const invested = buy * qty;
                const saleValue = sell * qty;
                const gain = saleValue - invested;

                let tax = 0;
                let taxType = 'STCG';
                let rate = 20; // STCG is 20% on equity in India

                if (months >= 12) {
                    taxType = 'LTCG';
                    rate = 12.5; // LTCG is 12.5% on gains exceeding 1.25L
                    const taxableGain = Math.max(0, gain - 125000);
                    tax = taxableGain * 0.125;
                } else {
                    tax = Math.max(0, gain) * 0.20;
                }

                const netProfit = gain - tax;

                // Simple 2-point visual representing Buy and Sell values
                chartData.push(
                    { year: 'Purchase', value: invested, invested, returns: 0 },
                    { year: 'Sale (Pre-Tax)', value: saleValue, invested, returns: gain },
                    { year: 'Net Value (Post-Tax)', value: saleValue - tax, invested, returns: Math.max(0, netProfit) }
                );

                return { invested, value: netProfit + invested, returns: Math.max(0, netProfit), tax: Math.round(tax), taxType, rate, chartData };
            }

            default:
                return { invested: 0, value: 0, returns: 0, chartData: [] };
        }
    }, [
        calcType, sipMonthly, sipRate, sipYears, lumpAmount, lumpRate, lumpYears,
        stepMonthly, stepRate, stepYears, stepPercent, swpLump, swpWithdrawal, swpRate, swpYears,
        goalTarget, goalRate, goalYears, cagrInitial, cagrFinal, cagrYears, cf0, cf1, cf2, cf3, cf4, cf5,
        infAmount, infRate, infYears, retAge, retRetireAge, retLife, retExpenses, retInflation, retPreReturn, retPostReturn,
        taxPurchase, taxSale, taxQty, taxMonths
    ]);

    return (
        <div className="min-h-screen bg-ivory text-ink py-20 px-6 md:px-12 relative overflow-hidden dot-grid linen-noise">
            {/* Background Blobs */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-burgundy/6 blur-[120px] pointer-events-none -translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gold/4 blur-[120px] pointer-events-none translate-x-1/3 translate-y-1/3" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-14">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-taupe hover:text-ink transition-colors text-sm font-semibold uppercase tracking-wider mb-8 cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back to Home
                    </button>

                    <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight uppercase leading-[1.1]">
                        Financial <span className="text-burgundy">Calculators</span>
                    </h1>
                    <p className="mt-4 text-taupe text-lg max-w-2xl font-normal leading-relaxed">
                        Accurately project your wealth trajectory. Adjust parameters in real-time to visualize the impact of compound growth.
                    </p>
                </div>

                {/* Tab Switcher - Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-12 bg-cream/70 border border-beige/40 p-3 rounded-[24px] shadow-sm backdrop-blur-md">
                    {CALCULATOR_TYPES.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setCalcType(type.id)}
                            className={`px-4 py-3 rounded-xl font-bold text-[10.5px] uppercase tracking-wider transition-all cursor-pointer select-none text-center truncate ${calcType === type.id
                                ? 'bg-ink text-ivory shadow-md scale-[1.02]'
                                : 'text-taupe hover:text-ink hover:bg-beige/35'
                                }`}
                            title={type.description}
                        >
                            {type.name}
                        </button>
                    ))}
                </div>

                {/* Calculator Panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left Column: Parameter controls (5 cols) */}
                    <div className="lg:col-span-5 bg-cream border border-beige/40 rounded-[32px] p-8 flex flex-col justify-between shadow-[0_12px_40px_rgba(58,46,37,0.06)] text-left">
                        <div>
                            <div className="flex items-center gap-3 mb-8 border-b border-beige/35 pb-4">
                                <div className="w-10 h-10 rounded-xl bg-burgundy/10 flex items-center justify-center text-burgundy shadow-xs">
                                    <CalcIcon size={18} />
                                </div>
                                <div>
                                    <h3 className="font-serif font-extrabold text-base sm:text-lg text-ink uppercase tracking-tight">
                                        {CALCULATOR_TYPES.find(t => t.id === calcType)?.name} Parameters
                                    </h3>
                                    <span className="text-[9px] font-mono text-taupe uppercase tracking-wider">Compounding Engine Active</span>
                                </div>
                            </div>

                            {/* SIP Panel */}
                            {calcType === 'sip' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Monthly SIP Investment</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={sipMonthly} onChange={(e) => setSipMonthly(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none" />
                                            </div>
                                        </div>
                                        <input type="range" min="500" max="100000" step="500" value={sipMonthly} onChange={(e) => setSipMonthly(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Expected Return (p.a.)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" step="0.5" value={sipRate} onChange={(e) => setSipRate(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" step="0.5" value={sipRate} onChange={(e) => setSipRate(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Horizon / Duration</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="40" value={sipYears} onChange={(e) => setSipYears(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="40" value={sipYears} onChange={(e) => setSipYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* Lumpsum Panel */}
                            {calcType === 'lumpsum' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Lumpsum Amount</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={lumpAmount} onChange={(e) => setLumpAmount(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="5000" max="1000000" step="5000" value={lumpAmount} onChange={(e) => setLumpAmount(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Expected Return (p.a.)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" step="0.5" value={lumpRate} onChange={(e) => setLumpRate(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" step="0.5" value={lumpRate} onChange={(e) => setLumpRate(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Horizon / Duration</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="40" value={lumpYears} onChange={(e) => setLumpYears(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="40" value={lumpYears} onChange={(e) => setLumpYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* Step-Up SIP Panel */}
                            {calcType === 'stepup' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Initial Monthly SIP</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={stepMonthly} onChange={(e) => setStepMonthly(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="1000" max="100000" step="1000" value={stepMonthly} onChange={(e) => setStepMonthly(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Annual Step-Up (%)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="50" value={stepPercent} onChange={(e) => setStepPercent(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="50" value={stepPercent} onChange={(e) => setStepPercent(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Expected Return (p.a.)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" step="0.5" value={stepRate} onChange={(e) => setStepRate(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" step="0.5" value={stepRate} onChange={(e) => setStepRate(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Horizon / Duration</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" value={stepYears} onChange={(e) => setStepYears(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" value={stepYears} onChange={(e) => setStepYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* SWP Panel */}
                            {calcType === 'swp' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Lumpsum Investment</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={swpLump} onChange={(e) => setSwpLump(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="50000" max="10000000" step="50000" value={swpLump} onChange={(e) => setSwpLump(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Monthly Withdrawal</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={swpWithdrawal} onChange={(e) => setSwpWithdrawal(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="1000" max="100000" step="1000" value={swpWithdrawal} onChange={(e) => setSwpWithdrawal(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Expected Return (p.a.)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="2" max="20" step="0.5" value={swpRate} onChange={(e) => setSwpRate(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="2" max="20" step="0.5" value={swpRate} onChange={(e) => setSwpRate(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">SWP Tenure Period</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" value={swpYears} onChange={(e) => setSwpYears(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" value={swpYears} onChange={(e) => setSwpYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* Goal Planner Panel */}
                            {calcType === 'goal' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Target Wealth Goal</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={goalTarget} onChange={(e) => setGoalTarget(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="100000" max="100000000" step="100000" value={goalTarget} onChange={(e) => setGoalTarget(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Expected Return (p.a.)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" step="0.5" value={goalRate} onChange={(e) => setGoalRate(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" step="0.5" value={goalRate} onChange={(e) => setGoalRate(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Years to Achieve Goal</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="30" value={goalYears} onChange={(e) => setGoalYears(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="30" value={goalYears} onChange={(e) => setGoalYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* CAGR Panel */}
                            {calcType === 'cagr' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Initial Investment (PV)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={cagrInitial} onChange={(e) => setCagrInitial(Math.max(1, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="1000" max="1000000" step="1000" value={cagrInitial} onChange={(e) => setCagrInitial(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Final Portfolio Value (FV)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={cagrFinal} onChange={(e) => setCagrFinal(Math.max(1, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="2000" max="5000000" step="2000" value={cagrFinal} onChange={(e) => setCagrFinal(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Duration Period</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="25" value={cagrYears} onChange={(e) => setCagrYears(Math.max(1, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="25" value={cagrYears} onChange={(e) => setCagrYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* XIRR Panel */}
                            {calcType === 'xirr' && (
                                <div className="space-y-4">
                                    <div className="text-[10px] font-bold text-burgundy uppercase tracking-wider mb-2 flex items-center gap-1">
                                        <Info size={12} /> Cash Outflow (-) & Inflows (+)
                                    </div>
                                    <div className="grid grid-cols-2 gap-3.5">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Year 0 (Outflow)</label>
                                            <input type="number" value={cf0} onChange={(e) => setCf0(Number(e.target.value))} className="w-full bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Year 1 (Inflow)</label>
                                            <input type="number" value={cf1} onChange={(e) => setCf1(Number(e.target.value))} className="w-full bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Year 2 (Inflow)</label>
                                            <input type="number" value={cf2} onChange={(e) => setCf2(Number(e.target.value))} className="w-full bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Year 3 (Inflow)</label>
                                            <input type="number" value={cf3} onChange={(e) => setCf3(Number(e.target.value))} className="w-full bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Year 4 (Inflow)</label>
                                            <input type="number" value={cf4} onChange={(e) => setCf4(Number(e.target.value))} className="w-full bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Year 5 (Inflow)</label>
                                            <input type="number" value={cf5} onChange={(e) => setCf5(Number(e.target.value))} className="w-full bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Inflation Panel */}
                            {calcType === 'inflation' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Current Cost (Amount)</label>
                                            <div className="flex items-center gap-1.5 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={infAmount} onChange={(e) => setInfAmount(Math.max(0, Number(e.target.value)))} className="w-20 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="1000" max="1000000" step="1000" value={infAmount} onChange={(e) => setInfAmount(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Inflation Rate (p.a.)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="20" step="0.5" value={infRate} onChange={(e) => setInfRate(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">%</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="20" step="0.5" value={infRate} onChange={(e) => setInfRate(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Time Horizon (Duration)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="40" value={infYears} onChange={(e) => setInfYears(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">Yrs</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="40" value={infYears} onChange={(e) => setInfYears(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* Retirement Panel */}
                            {calcType === 'retirement' && (
                                <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 no-scrollbar">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Current Age</label>
                                            <input type="number" value={retAge} onChange={(e) => setRetAge(Math.max(0, Number(e.target.value)))} className="bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold outline-none" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Retirement Age</label>
                                            <input type="number" value={retRetireAge} onChange={(e) => setRetRetireAge(Math.max(0, Number(e.target.value)))} className="bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold outline-none" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Life Expectancy</label>
                                            <input type="number" value={retLife} onChange={(e) => setRetLife(Math.max(0, Number(e.target.value)))} className="bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold outline-none" />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Monthly Expenses</label>
                                            <input type="number" value={retExpenses} onChange={(e) => setRetExpenses(Math.max(0, Number(e.target.value)))} className="bg-white border border-beige/40 px-3 py-2 rounded-xl text-xs font-bold outline-none" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5 mt-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Expected Inflation</label>
                                            <span className="text-xs font-bold text-ink">{retInflation}%</span>
                                        </div>
                                        <input type="range" min="1" max="15" value={retInflation} onChange={(e) => setRetInflation(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Pre-Retire Return (p.a.)</label>
                                            <span className="text-xs font-bold text-ink">{retPreReturn}%</span>
                                        </div>
                                        <input type="range" min="5" max="20" value={retPreReturn} onChange={(e) => setRetPreReturn(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold text-taupe uppercase">Post-Retire Return (p.a.)</label>
                                            <span className="text-xs font-bold text-ink">{retPostReturn}%</span>
                                        </div>
                                        <input type="range" min="4" max="15" value={retPostReturn} onChange={(e) => setRetPostReturn(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                </div>
                            )}

                            {/* Capital Gains Tax Panel */}
                            {calcType === 'tax' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Purchase Price / Share</label>
                                            <div className="flex items-center gap-1.5 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={taxPurchase} onChange={(e) => setTaxPurchase(Math.max(0, Number(e.target.value)))} className="w-16 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="10" max="5000" step="10" value={taxPurchase} onChange={(e) => setTaxPurchase(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Selling Price / Share</label>
                                            <div className="flex items-center gap-1.5 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <span className="text-taupe font-bold text-xs">₹</span>
                                                <input type="number" value={taxSale} onChange={(e) => setTaxSale(Math.max(0, Number(e.target.value)))} className="w-16 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="10" max="5000" step="10" value={taxSale} onChange={(e) => setTaxSale(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Number of Shares</label>
                                            <div className="flex items-center gap-1.5 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <input type="number" value={taxQty} onChange={(e) => setTaxQty(Math.max(0, Number(e.target.value)))} className="w-16 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="10000" step="10" value={taxQty} onChange={(e) => setTaxQty(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-bold uppercase tracking-wider text-taupe">Holding Tenure (Months)</label>
                                            <div className="flex items-center gap-1 bg-white border border-beige/40 px-3 py-1.5 rounded-xl shadow-xs">
                                                <input type="number" min="1" max="60" value={taxMonths} onChange={(e) => setTaxMonths(Math.max(0, Number(e.target.value)))} className="w-12 bg-transparent text-ink font-bold text-xs outline-none text-right" />
                                                <span className="text-taupe font-bold text-xs">M</span>
                                            </div>
                                        </div>
                                        <input type="range" min="1" max="60" value={taxMonths} onChange={(e) => setTaxMonths(Number(e.target.value))} className="w-full h-1.5 bg-beige/30 rounded-lg appearance-none cursor-pointer accent-burgundy" />
                                        <span className="text-[9px] font-mono text-taupe block text-left">
                                            * Equity held &ge; 12 months is LTCG. Otherwise, STCG applies.
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stats bottom */}
                        <div className="mt-8 pt-6 border-t border-beige/35 text-[10px] font-mono text-taupe uppercase tracking-wider">
                            CALC_ENGINE: FINEXA_calculators_v2.0
                        </div>
                    </div>

                    {/* Right Column: Visualization Card & Dynamic Stats Grid (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-6 justify-between items-stretch">
                        {/* Dynamic Summary Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {calcType === 'inflation' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Original Capital</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(infAmount)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Purchasing Power</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{formatRupees(result.invested)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Future Cost</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.value)}</div>
                                    </div>
                                </>
                            ) : calcType === 'cagr' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Initial Value</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.invested)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Final Value</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.value)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Calculated CAGR</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{result.cagr}% p.a.</div>
                                    </div>
                                </>
                            ) : calcType === 'xirr' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Total Outflow</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.invested)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Total Inflow</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.value)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Internal IRR</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{result.irr}% p.a.</div>
                                    </div>
                                </>
                            ) : calcType === 'goal' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Required Monthly SIP</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{formatRupees(result.monthlyRequired)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Total Invested</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.invested)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Target Goal</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.value)}</div>
                                    </div>
                                </>
                            ) : calcType === 'swp' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Total Withdrawn</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.invested)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Final Balance</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{formatRupees(result.value)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Estimated Returns</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.returns)}</div>
                                    </div>
                                </>
                            ) : calcType === 'retirement' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Monthly Cost at Retire</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.inflatedExpense)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Target Corpus Needed</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{formatRupees(result.corpus)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Required Monthly Savings</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.monthlySaving)}</div>
                                    </div>
                                </>
                            ) : calcType === 'tax' ? (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Total Profits (Pre-Tax)</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.returns + result.tax)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">{result.taxType} Liability ({result.rate}%)</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{formatRupees(result.tax)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Net Gain (Post-Tax)</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.returns)}</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Total Invested</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-ink">{formatRupees(result.invested)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Est. Returns</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-teal">{formatRupees(result.returns)}</div>
                                    </div>
                                    <div className="bg-cream border border-beige/40 p-6 rounded-3xl text-left shadow-sm">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-taupe block mb-1">Future Value</span>
                                        <div className="text-xl sm:text-2xl font-serif font-black text-burgundy">{formatRupees(result.value)}</div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Recharts AreaChart Area */}
                        <div className="bg-ink rounded-[32px] p-8 flex flex-col justify-between flex-grow h-[350px] lg:h-[450px] shadow-[0_20px_50px_rgba(58,46,37,0.2)] relative overflow-hidden border border-beige/10">
                            {/* Ambient glows */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[96px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy/5 rounded-full blur-[96px] pointer-events-none" />

                            <div className="relative z-10 flex justify-between items-center mb-6">
                                <h4 className="font-serif font-bold text-ivory text-lg uppercase tracking-tight flex items-center gap-2">
                                    <TrendingUp size={18} className="text-gold" />
                                    Growth Trajectory Graph
                                </h4>
                                <span className="px-2.5 py-0.5 bg-gold/20 text-gold text-[9px] font-bold rounded uppercase tracking-wider font-mono">
                                    {result.chartData.length} Nodes
                                </span>
                            </div>

                            {/* Chart */}
                            <div className="w-full flex-grow relative z-10 select-none">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={result.chartData}
                                        margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(253,246,237,0.04)" />
                                        <XAxis
                                            dataKey="year"
                                            stroke="rgba(253,246,237,0.4)"
                                            fontSize={9}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis
                                            stroke="rgba(253,246,237,0.4)"
                                            fontSize={9}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(val) => val >= 10000000 ? `${(val / 10000000).toFixed(1)}Cr` : val >= 100000 ? `${(val / 100000).toFixed(0)}L` : val}
                                        />
                                        <defs>
                                            <linearGradient id="calcChartGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#C9A227" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#C9A227" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <ChartTooltip content={<CustomTooltip calcType={calcType} />} cursor={{ stroke: 'rgba(201,162,39,0.25)', strokeWidth: 1.2 }} />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#C9A227"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#calcChartGrad)"
                                            dot={{ r: 3, fill: '#C9A227', strokeWidth: 0 }}
                                            activeDot={{ r: 6, fill: '#6B1E2B', stroke: '#C9A227', strokeWidth: 2 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Calculator);
