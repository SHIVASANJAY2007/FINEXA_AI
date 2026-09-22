import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Sparkles, TrendingUp, RefreshCw, Zap, Award,
  Info, Shield, Crown, Target, CheckCircle2, Sliders, Check, DollarSign, Activity, Wallet, CreditCard, Landmark, PiggyBank
} from 'lucide-react';
import { getApiBaseUrl } from '../../utils/api';

const PRESETS = [
  { id: 'mid_career', label: 'Mid-Career Family', income: 150000, expenses: 45000, savings: 30000, investment: 35000, emi: 20000 },
  { id: 'young_prof', label: 'Young Professional', income: 80000, expenses: 30000, savings: 15000, investment: 15000, emi: 10000 },
  { id: 'wealth_shield', label: 'Wealth Compounder', income: 250000, expenses: 60000, savings: 50000, investment: 75000, emi: 25000 },
  { id: 'high_emi', label: 'High EMI Burden', income: 90000, expenses: 35000, savings: 5000, investment: 5000, emi: 40000 }
];

const TIER_META = {
  PRIME_WEALTH_COMPOUNDER: {
    title: "Prime Wealth Compounder",
    tier: 1,
    badge: "🟢 Low Financial Risk (Prime Tier)",
    color: "#059669",
    bg: "bg-emerald-50 border-emerald-300 text-emerald-900",
    summary: "Exceptional financial stability. Low debt obligations, disciplined monthly savings, and high investment compounding velocity."
  },
  CAPITAL_PRESERVATION_SHIELD: {
    title: "Defensive Wealth Shield",
    tier: 2,
    badge: "🛡️ Low-to-Moderate Financial Risk",
    color: "#0B4F4A",
    bg: "bg-[#0B4F4A]/10 border-[#0B4F4A]/30 text-[#0B4F4A]",
    summary: "Solid financial foundation with controlled expenses and healthy monthly cashflow allocation across emergency reserves."
  },
  HIGH_GROWTH_ASPIRANT: {
    title: "High-Growth Accumulator",
    tier: 3,
    badge: "🚀 Moderate Financial Risk (Growth Tier)",
    color: "#D97706",
    bg: "bg-amber-50 border-amber-300 text-amber-900",
    summary: "Strong monthly investment velocity; requires slight optimization in liquid monthly savings buffer."
  },
  CASHFLOW_VULNERABLE: {
    title: "Cashflow Vulnerable",
    tier: 4,
    badge: "⚠️ High Financial Risk (Caution)",
    color: "#DC2626",
    bg: "bg-rose-50 border-rose-300 text-rose-900",
    summary: "Elevated EMI/loan debt burden or high fixed expense commitments relative to monthly income."
  }
};

export default function RuleInductionClassifier() {
  // 5 Monthly Financial Inputs (INR ₹) - Strictly Non-Negative
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(45000);
  const [monthlySavings, setMonthlySavings] = useState(30000);
  const [monthlyInvestment, setMonthlyInvestment] = useState(35000);
  const [monthlyEmi, setMonthlyEmi] = useState(20000);

  const [loading, setLoading] = useState(false);
  const [ripperData, setRipperData] = useState(null);

  // Compute local RIPPER evaluation for instant zero-latency rendering
  const computeLocalEvaluation = useCallback((incVal, expVal, savVal, invVal, emiVal) => {
    const inc = Math.max(1, Number(incVal) || 100000);
    const exp = Math.max(0, Number(expVal) || 35000);
    const sav = Math.max(0, Number(savVal) || 20000);
    const inv = Math.max(0, Number(invVal) || 20000);
    const debt = Math.max(0, Number(emiVal) || 15000);

    const emiRatio = Math.round((debt / inc) * 1000) / 1000;
    const expenseRatio = Math.round((exp / inc) * 1000) / 1000;
    const commitmentRatio = Math.round(((exp + debt) / inc) * 1000) / 1000;
    const savingsRate = Math.round((sav / inc) * 1000) / 1000;
    const investmentRate = Math.round((inv / inc) * 1000) / 1000;
    const totalOutflows = exp + debt + inv + sav;
    const surplusCashflow = Math.round((inc - totalOutflows) * 100) / 100;

    let tierKey = "CAPITAL_PRESERVATION_SHIELD";
    if (emiRatio > 0.40 || commitmentRatio > 0.75 || (savingsRate < 0.05 && investmentRate < 0.10)) {
      tierKey = "CASHFLOW_VULNERABLE";
    } else if (emiRatio <= 0.20 && commitmentRatio <= 0.50 && (savingsRate + investmentRate) >= 0.30) {
      tierKey = "PRIME_WEALTH_COMPOUNDER";
    } else if (investmentRate >= 0.25 && emiRatio <= 0.30) {
      tierKey = "HIGH_GROWTH_ASPIRANT";
    } else {
      tierKey = "CAPITAL_PRESERVATION_SHIELD";
    }

    const tierInfo = TIER_META[tierKey];

    const emiScore = Math.max(0, 100 - (emiRatio * 200));
    const expenseScore = Math.max(0, 100 - (expenseRatio * 150));
    const savingsScore = Math.min(100, (savingsRate / 0.15) * 100);
    const investmentScore = Math.min(100, (investmentRate / 0.20) * 100);

    const rawHealth = (emiScore * 0.30) + (expenseScore * 0.25) + (savingsScore * 0.25) + (investmentScore * 0.20);
    const healthScore = Math.round(Math.max(10, Math.min(99, rawHealth)));

    const advisories = [];
    if (emiRatio > 0.30) {
      const targetEmi = Math.round(inc * 0.30);
      advisories.push({
        title: "Reduce Monthly EMI & Loan Debt",
        desc: `Your monthly EMI commitments (₹${debt.toLocaleString('en-IN')}) account for ${Math.round(emiRatio * 100)}% of monthly income. Target reducing EMIs below ₹${targetEmi.toLocaleString('en-IN')}/mo (<= 30% of income).`
      });
    }
    if (savingsRate < 0.15) {
      const targetSav = Math.round(inc * 0.15);
      const deltaSav = Math.max(0, targetSav - Math.round(sav));
      advisories.push({
        title: "Boost Monthly Emergency Savings",
        desc: `Your monthly liquid savings rate is ${Math.round(savingsRate * 100)}% (₹${sav.toLocaleString('en-IN')}/mo). Increase monthly savings by ₹${deltaSav.toLocaleString('en-IN')}/mo to build a 15% liquid buffer.`
      });
    }
    if (investmentRate < 0.20) {
      const targetInv = Math.round(inc * 0.20);
      const deltaInv = Math.max(0, targetInv - Math.round(inv));
      advisories.push({
        title: "Elevate Wealth Compounding SIP",
        desc: `Your monthly investment rate is ${Math.round(investmentRate * 100)}% (₹${inv.toLocaleString('en-IN')}/mo). Increase monthly investments by ₹${deltaInv.toLocaleString('en-IN')}/mo to hit a 20% compounding velocity.`
      });
    }
    if (surplusCashflow < 0) {
      advisories.push({
        title: "Monthly Cashflow Deficit Warning",
        desc: `Your total monthly outflows (₹${totalOutflows.toLocaleString('en-IN')}) exceed monthly income by ₹${Math.abs(surplusCashflow).toLocaleString('en-IN')}. Immediately audit non-essential expenses to stay cashflow positive.`
      });
    } else if (advisories.length === 0) {
      advisories.push({
        title: "Maintain Excellent Financial Health",
        desc: "Your monthly inputs exhibit optimal allocation across living expenses, loan EMI control, liquid savings, and wealth compounding."
      });
    }

    return {
      status: "SUCCESS",
      algorithm: "RIPPER Rule Induction Engine",
      healthScore,
      classification: { tierKey, tierInfo },
      ratios: {
        monthlyIncome: inc,
        monthlyExpenses: exp,
        monthlySavings: sav,
        monthlyInvestment: inv,
        monthlyEmi: debt,
        emiRatioPct: Math.round(emiRatio * 100),
        expenseRatioPct: Math.round(expenseRatio * 100),
        savingsRatePct: Math.round(savingsRate * 100),
        investmentRatePct: Math.round(investmentRate * 100),
        surplusCashflow
      },
      advisories
    };
  }, []);

  const evaluateProfile = useCallback(async () => {
    setLoading(true);
    try {
      const payload = {
        monthlyIncome: Number(monthlyIncome),
        monthlyExpenses: Number(monthlyExpenses),
        monthlySavings: Number(monthlySavings),
        monthlyInvestment: Number(monthlyInvestment),
        monthlyEmi: Number(monthlyEmi)
      };

      const res = await fetch(`${getApiBaseUrl()}/api/ripper/evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setRipperData(data);
      } else {
        setRipperData(computeLocalEvaluation(monthlyIncome, monthlyExpenses, monthlySavings, monthlyInvestment, monthlyEmi));
      }
    } catch (err) {
      console.warn("Using local RIPPER engine fallback:", err.message);
      setRipperData(computeLocalEvaluation(monthlyIncome, monthlyExpenses, monthlySavings, monthlyInvestment, monthlyEmi));
    } finally {
      setLoading(false);
    }
  }, [monthlyIncome, monthlyExpenses, monthlySavings, monthlyInvestment, monthlyEmi, computeLocalEvaluation]);

  useEffect(() => {
    evaluateProfile();
  }, [evaluateProfile]);

  const applyPreset = (preset) => {
    setMonthlyIncome(preset.income);
    setMonthlyExpenses(preset.expenses);
    setMonthlySavings(preset.savings);
    setMonthlyInvestment(preset.investment);
    setMonthlyEmi(preset.emi);
  };

  const handleNonNegativeInput = (setter) => (e) => {
    const val = parseFloat(e.target.value);
    setter(isNaN(val) || val < 0 ? 0 : val);
  };

  return (
    <div className="min-h-screen w-full bg-[#FDF6ED] text-[#3A2E25] font-sans selection:bg-[#6B1E2B] selection:text-white pb-16 dot-grid">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#FDF6ED]/90 backdrop-blur-md border-b border-[#3A2E25]/10 px-4 lg:px-8 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/explore"
              className="flex items-center gap-2 text-xs font-semibold text-[#3A2E25] hover:text-[#6B1E2B] transition-colors bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#3A2E25]/10 shadow-xs"
            >
              <ArrowLeft size={16} />
              <span>Back to Explore</span>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-xl lg:text-2xl font-extrabold text-[#3A2E25] tracking-tight">
                  RuleSense™ Financial Health Evaluator
                </h1>
                <span className="bg-[#6B1E2B] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                  RIPPER Engine
                </span>
              </div>
              <p className="text-xs text-[#3A2E25]/70 hidden sm:block">
                Evaluates Monthly Income, Expenses, Savings, Investments, and EMI obligations
              </p>
            </div>
          </div>

          <button
            onClick={evaluateProfile}
            disabled={loading}
            className="flex items-center gap-2 bg-[#6B1E2B] text-white hover:bg-[#541722] transition-all px-4 py-2 rounded-full font-semibold text-xs shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>{loading ? "Evaluating..." : "Recalculate Diagnosis"}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-8">

        {/* Section 1: 5 Monthly Inputs Form */}
        <section className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-[#3A2E25]/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3A2E25]/10 pb-3">
            <div className="flex items-center gap-2">
              <Sliders size={18} className="text-[#6B1E2B]" />
              <h2 className="font-serif font-bold text-base text-[#3A2E25]">Enter Monthly Financial Profile (₹ INR)</h2>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-semibold text-[#3A2E25]/60 mr-1 hidden sm:inline">Presets:</span>
              {PRESETS.map(p => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className="text-[11px] font-semibold bg-[#FDF6ED] hover:bg-[#6B1E2B] hover:text-white text-[#3A2E25] px-3 py-1 rounded-lg border border-[#3A2E25]/15 transition-all cursor-pointer whitespace-nowrap"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Input Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* 1. Monthly Income */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3A2E25]/80 mb-1">
                <Wallet size={14} className="text-emerald-700" /> Monthly Income (₹)
              </label>
              <input
                type="number"
                min="0"
                value={monthlyIncome}
                onChange={handleNonNegativeInput(setMonthlyIncome)}
                className="w-full bg-[#FDF6ED] border border-[#3A2E25]/20 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#6B1E2B]"
              />
            </div>

            {/* 2. Monthly Expenses */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3A2E25]/80 mb-1">
                <Activity size={14} className="text-amber-700" /> Monthly Expenses (₹)
              </label>
              <input
                type="number"
                min="0"
                value={monthlyExpenses}
                onChange={handleNonNegativeInput(setMonthlyExpenses)}
                className="w-full bg-[#FDF6ED] border border-[#3A2E25]/20 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#6B1E2B]"
              />
            </div>

            {/* 3. Monthly Savings */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3A2E25]/80 mb-1">
                <PiggyBank size={14} className="text-blue-700" /> Monthly Savings (₹)
              </label>
              <input
                type="number"
                min="0"
                value={monthlySavings}
                onChange={handleNonNegativeInput(setMonthlySavings)}
                className="w-full bg-[#FDF6ED] border border-[#3A2E25]/20 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#0B4F4A]"
              />
            </div>

            {/* 4. Monthly Investment */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3A2E25]/80 mb-1">
                <TrendingUp size={14} className="text-purple-700" /> Monthly Investment (₹)
              </label>
              <input
                type="number"
                min="0"
                value={monthlyInvestment}
                onChange={handleNonNegativeInput(setMonthlyInvestment)}
                className="w-full bg-[#FDF6ED] border border-[#3A2E25]/20 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#0B4F4A]"
              />
            </div>

            {/* 5. Monthly EMI & Loan */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[#3A2E25]/80 mb-1">
                <CreditCard size={14} className="text-rose-700" /> Monthly EMI & Loan (₹)
              </label>
              <input
                type="number"
                min="0"
                value={monthlyEmi}
                onChange={handleNonNegativeInput(setMonthlyEmi)}
                className="w-full bg-[#FDF6ED] border border-[#3A2E25]/20 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#6B1E2B]"
              />
            </div>

          </div>
        </section>

        {/* Section 2: Financial Health Diagnosis & Metric Overview */}
        {ripperData && (
          <section className="space-y-6">
            
            {/* Top Health Score Card */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-[#3A2E25]/10 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              
              {/* Radial Health Index Meter */}
              <div className="flex flex-col items-center text-center space-y-2 border-b md:border-b-0 md:border-r border-[#3A2E25]/10 pb-6 md:pb-0 md:pr-6">
                <span className="text-xs font-bold uppercase tracking-widest text-[#3A2E25]/60">Financial Health Score</span>
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-gray-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-[#6B1E2B] transition-all duration-1000"
                      strokeDasharray={`${ripperData.healthScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-serif font-extrabold text-2xl text-[#3A2E25]">{ripperData.healthScore}</span>
                    <span className="text-[9px] font-bold text-[#3A2E25]/60">/ 100</span>
                  </div>
                </div>
              </div>

              {/* Tier Badge & Summary */}
              <div className="col-span-1 md:col-span-2 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full border ${ripperData.classification.tierInfo.bg}`}>
                    {ripperData.classification.tierInfo.badge}
                  </span>
                  <span className="text-xs font-bold text-[#3A2E25]/60 bg-[#FDF6ED] px-3 py-1 rounded-full border border-[#3A2E25]/10">
                    Tier {ripperData.classification.tierInfo.tier}
                  </span>
                </div>

                <h3 className="font-serif font-extrabold text-xl text-[#3A2E25]">
                  {ripperData.classification.tierInfo.title}
                </h3>

                <p className="text-sm text-[#3A2E25]/80 font-medium leading-relaxed">
                  {ripperData.classification.tierInfo.summary}
                </p>

                {ripperData.healthVerdict && (
                  <div className="bg-[#FDF6ED] p-3 rounded-xl border border-[#3A2E25]/15 text-xs font-semibold text-[#3A2E25]">
                    {ripperData.healthVerdict}
                  </div>
                )}
              </div>

            </div>

            {/* Derived Ratios Grid */}
            {ripperData.ratios && (
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white/90 p-5 rounded-2xl border border-[#3A2E25]/10 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-[#3A2E25]/70">EMI Debt Ratio</span>
                  <div className="font-serif font-extrabold text-xl text-[#3A2E25]">
                    {ripperData.ratios.emiRatioPct}%
                  </div>
                  <span className={`text-[11px] font-bold block ${
                    ripperData.ratios.emiRatioPct <= 30 ? 'text-emerald-700' : 'text-rose-700'
                  }`}>
                    {ripperData.ratios.emiRatioPct <= 30 ? '🟢 Safe (<= 30%)' : '⚠️ High EMI'}
                  </span>
                </div>

                <div className="bg-white/90 p-5 rounded-2xl border border-[#3A2E25]/10 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-[#3A2E25]/70">Living Expense Ratio</span>
                  <div className="font-serif font-extrabold text-xl text-[#3A2E25]">
                    {ripperData.ratios.expenseRatioPct}%
                  </div>
                  <span className="text-[11px] font-bold text-[#3A2E25]/70 block">
                    Fixed Obligations
                  </span>
                </div>

                <div className="bg-white/90 p-5 rounded-2xl border border-[#3A2E25]/10 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-[#3A2E25]/70">Monthly Savings Rate</span>
                  <div className="font-serif font-extrabold text-xl text-[#0B4F4A]">
                    {ripperData.ratios.savingsRatePct}%
                  </div>
                  <span className={`text-[11px] font-bold block ${
                    ripperData.ratios.savingsRatePct >= 15 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {ripperData.ratios.savingsRatePct >= 15 ? '🟢 Healthy Buffer' : '🟡 Low Buffer'}
                  </span>
                </div>

                <div className="bg-white/90 p-5 rounded-2xl border border-[#3A2E25]/10 shadow-xs space-y-1">
                  <span className="text-xs font-semibold text-[#3A2E25]/70">Investment Rate</span>
                  <div className="font-serif font-extrabold text-xl text-[#0B4F4A]">
                    {ripperData.ratios.investmentRatePct}%
                  </div>
                  <span className={`text-[11px] font-bold block ${
                    ripperData.ratios.investmentRatePct >= 20 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {ripperData.ratios.investmentRatePct >= 20 ? '🟢 High Compounding' : '🟡 Moderate'}
                  </span>
                </div>

                <div className="bg-white/90 p-5 rounded-2xl border border-[#3A2E25]/10 shadow-xs space-y-1 col-span-2 lg:col-span-1">
                  <span className="text-xs font-semibold text-[#3A2E25]/70">Surplus Cashflow</span>
                  <div className={`font-serif font-extrabold text-xl ${
                    ripperData.ratios.surplusCashflow >= 0 ? 'text-[#0B4F4A]' : 'text-rose-700'
                  }`}>
                    ₹{ripperData.ratios.surplusCashflow.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] font-bold text-[#3A2E25]/70 block">
                    Unallocated Monthly
                  </span>
                </div>
              </div>
            )}

            {/* Section 3: Personalized Strategic Financial Advisory */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-[#3A2E25]/10 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-[#3A2E25]/10 pb-3">
                <Target className="text-[#0B4F4A]" size={20} />
                <h3 className="font-serif font-bold text-lg text-[#3A2E25]">Tailored Actionable Advisory & Next Steps</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ripperData.advisories && ripperData.advisories.map((adv, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FDF6ED] p-5 rounded-xl border border-[#3A2E25]/15 space-y-2 flex flex-col justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-[#6B1E2B] text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#3A2E25]">{adv.title}</h4>
                    </div>

                    <p className="text-xs text-[#3A2E25]/80 leading-relaxed pt-1 font-medium">
                      {adv.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </section>
        )}

      </main>
    </div>
  );
}
